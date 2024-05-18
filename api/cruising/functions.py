from typing import List
from uuid import UUID
import pandas as pd
from botocore.exceptions import NoCredentialsError
from cruising.models import Barcode, Pohon
from cruising.schemas import PohonInSchema, SaveLHCBarcodeItemSchema
from utils.decorators import timing_decorator
from utils.storage import get_s3_client
import io, asyncio
from tortoise.transactions import in_transaction
import time

BATCH_SIZE = 1000


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


@timing_decorator
async def save_lhc_pohon_to_db(data: List[PohonInSchema], lhc_id, perusahaan):
    async with in_transaction() as connection:
        print("Start saving pohon to database")
        BATCH_SIZE = 500
        errors = []

        # Mengumpulkan semua barcode dan ID dari data yang diberikan
        all_barcodes = {item.barcode for item in data if item.barcode}
        all_ids = {item.id for item in data if item.id}

        # Gunakan asyncio.gather untuk menjalankan query secara paralel
        existing_barcodes, existing_pohons = await asyncio.gather(
            Barcode.filter(barcode__in=all_barcodes, perusahaan_id=perusahaan)
            .using_db(connection)
            .all(),
            Pohon.filter(id__in=all_ids, perusahaan_id=perusahaan)
            .using_db(connection)
            .all(),
        )

        existing_barcodes_dict = {
            barcode.barcode: barcode for barcode in existing_barcodes
        }
        existing_pohons_dict = {pohon.id: pohon for pohon in existing_pohons}

        to_create, to_update = [], []

        # Siapkan data untuk batch processing
        for item in data:
            barcode_instance = (
                existing_barcodes_dict.get(item.barcode) if item.barcode else None
            )
            existing_pohon = existing_pohons_dict.get(item.id)

            if existing_pohon:
                # Update existing Pohon
                existing_pohon.update_from_dict(item.model_dump())
                existing_pohon.barcode_id = (
                    barcode_instance.id if barcode_instance else None
                )
                to_update.append(existing_pohon)
            else:
                # Create new Pohon if not found
                model_dump = item.model_dump(exclude_none=True, exclude_unset=True)
                new_pohon = Pohon(
                    **model_dump,
                    lhc_id=lhc_id,
                    perusahaan_id=perusahaan,
                    barcode_id=barcode_instance.id if barcode_instance else None,
                )
                to_create.append(new_pohon)

        # Fungsi untuk melakukan batch processing
        async def process_batches(batch: List, operation_type: str):
            if operation_type == "create":
                await Pohon.bulk_create(batch, using_db=connection)
            elif operation_type == "update":
                for pohon in batch:
                    await pohon.save(using_db=connection)  # Save the updated instances

        # Membagi to_update dan to_create ke dalam batch dan menambahkan ke tasks
        tasks = [
            process_batches(to_create[i : i + BATCH_SIZE], "create")
            for i in range(0, len(to_create), BATCH_SIZE)
        ] + [
            process_batches(to_update[i : i + BATCH_SIZE], "update")
            for i in range(0, len(to_update), BATCH_SIZE)
        ]

        # Tunggu semua operasi batch selesai
        if tasks:
            await asyncio.gather(*tasks)

        if not errors:
            return False  # Return False to indicate success with no errors
        else:
            return errors  # Return list of errors if any
