from typing import List
from uuid import UUID
import pandas as pd
from botocore.exceptions import NoCredentialsError
from cruising.models import Barcode
from cruising.schemas import SaveLHCBarcodeItemSchema
from utils.decorators import timing_decorator
from utils.storage import get_s3_client
import io, asyncio
from tortoise.transactions import in_transaction


async def get_file_key(file_url: str) -> str:
    key = file_url.split("amazonaws.com/")[1]
    return key


async def get_upload_barcodes_from_file(file_url: str) -> list:
    client = await get_s3_client()
    key = await get_file_key(file_url)

    async with client as s3:
        response = await s3.get_object(Bucket="mypuhh", Key=key)
        if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
            # Membaca body ke dalam memory
            body = await response["Body"].read()

            # Menggunakan Pandas untuk membaca data dari memory
            data = io.BytesIO(body)
            df = pd.read_csv(data, usecols=[0], header=None)
            barcodes = df.iloc[:, 0].tolist()
            return barcodes
        else:
            return None


# TODO: Implementasi fungsi get_upload_pohon_from_file
async def get_upload_pohon_from_file(file_url: str) -> list:
    client = await get_s3_client()
    key = await get_file_key(file_url)

    async with client as s3:
        response = await s3.get_object(Bucket="mypuhh", Key=key)
        if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
            # Membaca body ke dalam memory
            body = await response["Body"].read()

            # Menggunakan Pandas untuk membaca data dari memory
            data = io.BytesIO(body)
            df = pd.read_csv(data)
            pohon_list = df.to_dict(orient="records")
            return pohon_list
        else:
            return None


BATCH_SIZE = 1000


@timing_decorator
async def save_lhc_barcode_to_db(
    data: List[SaveLHCBarcodeItemSchema], perusahaan: UUID, lhc_id: UUID
):
    async with in_transaction() as connection:
        errors = []
        to_update = []
        to_create = []

        # Ambil semua barcode yang sudah ada di database dalam satu query dengan filter perusahaan
        barcodes_set = set(item.barcode for item in data)
        ids_set = set(item.id for item in data if item.id)

        # Gunakan asyncio.gather untuk menjalankan query secara paralel
        existing_barcodes, existing_ids = await asyncio.gather(
            Barcode.filter(barcode__in=barcodes_set, perusahaan_id=perusahaan)
            .using_db(connection)
            .all(),
            Barcode.filter(id__in=ids_set, perusahaan_id=perusahaan)
            .using_db(connection)
            .all(),
        )

        existing_barcodes_dict = {
            barcode.barcode: barcode for barcode in existing_barcodes
        }
        existing_ids_dict = {str(barcode.id): barcode for barcode in existing_ids}

        for item in data:
            if item.id and str(item.id) in existing_ids_dict:
                # Update jika item memiliki id dan sudah ada di database
                existing_item = existing_ids_dict[str(item.id)]
                existing_item.barcode = item.barcode
                to_update.append(existing_item)
            elif item.barcode not in existing_barcodes_dict:
                # Create jika barcode tidak ditemukan di database
                new_barcode = Barcode(
                    barcode=item.barcode, lhc_id=lhc_id, perusahaan_id=perusahaan
                )
                to_create.append(new_barcode)
            else:
                errors.append(
                    {
                        "status": "error",
                        "message": f"{item.barcode} sudah ada di database",
                    }
                )

        # Fungsi untuk melakukan batch processing
        async def process_batches(batch: List):
            if batch:
                await asyncio.gather(
                    Barcode.bulk_update(batch, ["barcode"], using_db=connection)
                )

        # Batch processing untuk to_update
        tasks = []
        for i in range(0, len(to_update), BATCH_SIZE):
            batch = to_update[i : i + BATCH_SIZE]
            tasks.append(process_batches(batch))

        # Batch processing untuk to_create
        if to_create:
            tasks.append(Barcode.bulk_create(to_create, using_db=connection))

        # Tunggu semua operasi batch selesai
        if tasks:
            await asyncio.gather(*tasks)

        if not errors:
            return False  # Return False to indicate success with no errors
        else:
            return errors  # Return list of errors if any
