from collections import defaultdict
from typing import List
from uuid import UUID
from fastapi import HTTPException
import pandas as pd
from botocore.exceptions import NoCredentialsError
from parameter.models import TahunKegiatan
from cruising.models import LHC, Barcode, Pohon, RencanaTebang
from cruising.schemas import PohonInSchema, SaveLHCBarcodeItemSchema
from utils.decorators import timing_decorator
from utils.storage import get_s3_client
import io, asyncio
from tortoise.transactions import in_transaction
import time
from tortoise.functions import Sum, Count
from utils.exceptions import ResponseError


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

        # print("all barcodes :", all_barcodes)

        # Gunakan asyncio.gather untuk menjalankan query secara paralel
        existing_barcodes, existing_pohons = await asyncio.gather(
            Barcode.filter(barcode__in=all_barcodes, perusahaan_id=perusahaan)
            .using_db(connection)
            .all(),
            Pohon.filter(id__in=all_ids, perusahaan_id=perusahaan)
            .using_db(connection)
            .all(),
        )

        # print("existing barcodes :", existing_barcodes)

        existing_barcodes_dict = {
            barcode.barcode: barcode for barcode in existing_barcodes
        }

        # print("existing barcodes dict :", existing_barcodes_dict)

        existing_pohons_dict = {pohon.id: pohon for pohon in existing_pohons}

        to_create, to_update = [], []

        # Siapkan data untuk batch processing
        for item in data:
            barcode_instance = (
                existing_barcodes_dict.get(item.barcode) if item.barcode else None
            )

            # print("barcode instance : ", barcode_instance)

            existing_pohon = existing_pohons_dict.get(item.id)

            # Menyiapkan data model untuk update
            model_dump = item.model_dump(exclude_none=True, exclude_unset=True)

            # Mengganti 'barcode' dengan 'barcode_id' yang valid jika ada barcode_instance
            if barcode_instance:
                model_dump["barcode_id"] = barcode_instance.id
                model_dump.pop("barcode", None)
            else:
                # Menghapus key 'barcode' jika tidak ada barcode valid
                model_dump.pop("barcode", None)

            # print("model dump : ", model_dump)

            try:
                if existing_pohon:
                    # print("Updating existing pohon")

                    # Update pohon dengan model dump yang sudah dimodifikasi
                    existing_pohon.update_from_dict(model_dump)
                    to_update.append(existing_pohon)
                else:
                    # print("Creating new pohon")

                    new_pohon = Pohon(
                        **model_dump, lhc_id=lhc_id, perusahaan_id=perusahaan
                    )
                    to_create.append(new_pohon)
            except Exception as e:
                raise HTTPException(
                    status_code=400, detail=f"Error: {str(e)} on {item}"
                )

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


async def get_rekapitulasi_lhc(lhc_id: UUID, perusahaan: UUID):
    rekap_data = (
        await Pohon.filter(lhc=lhc_id, perusahaan=perusahaan)
        .prefetch_related("jenis", "status_pohon", "kelas_diameter")
        .annotate(jumlah_pohon=Count("id"), total_volume=Sum("volume"))
        .group_by("jenis__nama", "status_pohon__nama", "kelas_diameter__nama")
        .values(
            "jenis__nama",
            "status_pohon__nama",
            "kelas_diameter__nama",
            "jumlah_pohon",
            "total_volume",
        )
    )

    if rekap_data:
        # Mengorganisir data berdasarkan status pohon dan kelas diameter
        organized_data = defaultdict(lambda: defaultdict(list))
        for item in rekap_data:
            status_key = item["status_pohon__nama"].replace(" ", "_").upper()
            diameter_key = item["kelas_diameter__nama"].replace(" - ", "_")
            organized_data[status_key][diameter_key].append(
                {
                    "jenis__nama": item["jenis__nama"],
                    "jumlah_pohon": item["jumlah_pohon"],
                    "total_volume": item["total_volume"],
                }
            )

        return {"data": rekap_data, "organized_data": organized_data}


async def save_barcode_rencana_tebang_to_db(
    rencana_tebang_id: UUID, barcodes: List[str]
):
    async with in_transaction() as connection:
        errors = []
        to_create = []

        print("Start saving barcode rencana tebang to database")
        print("barcodes : ", barcodes)

        return False


# ---------------------------------------------------------------------------------------------
# otomatisasi mengambil target rencana tebang
# ---------------------------------------------------------------------------------------------


async def set_target_pohon_rencana_tebang(rencana_tebang: RencanaTebang, perusahaan):
    obyek = rencana_tebang.obyek
    bloks = await rencana_tebang.blok.all()

    print(rencana_tebang.tahun_id)
    print(obyek)

    if not bloks:
        raise ResponseError(status_code=400, detail="Blok belum ditentukan")

    blok_ids = [blok.id for blok in bloks]
    print("blok ids : ", blok_ids)

    all_lhc = await LHC.filter(
        obyek=obyek, perusahaan=perusahaan, blok_id__in=blok_ids
    ).all()
    print("all lhc : ", all_lhc)

    all_pohon = await Pohon.filter(
        lhc_id__in=[lhc.id for lhc in all_lhc], barcode_id__isnull=False
    ).all()
    print("all pohon : ", len(all_pohon))

    # Reset semua barcode yang terkait dengan pohon yang diambil
    barcode_ids_to_reset = [pohon.barcode_id for pohon in all_pohon if pohon.barcode_id]
    if barcode_ids_to_reset:
        await Barcode.filter(id__in=barcode_ids_to_reset).update(rencana_tebang_id=None)
        print(f"Reset {len(barcode_ids_to_reset)} barcodes.")

    if obyek == 1:
        # Mendapatkan semua ID barcode yang valid
        barcode_ids = [pohon.barcode_id for pohon in all_pohon if pohon.barcode_id]
        # Update batch untuk semua barcode yang terkait
        if barcode_ids:
            await Barcode.filter(id__in=barcode_ids).update(
                rencana_tebang_id=rencana_tebang.id
            )
            print(f"Updated {len(barcode_ids)} barcodes.")

    elif obyek == 0:

        # filter pohon yang yg sesuai dengan jenis target rencana tebang
        all_jenis = await rencana_tebang.jenis.all()
        if not all_jenis:
            raise ResponseError(status_code=400, detail="Jenis target belum ditentukan")
        print("jenis ids : ", all_jenis)

        # filter pohon yang sesuai dengan jenis target rencana tebang dan status pohon adalah 2 ( pohon tebang )
        jenis_ids = [jenis.id for jenis in all_jenis]
        all_pohon_target = [
            pohon
            for pohon in all_pohon
            if pohon.jenis_id in jenis_ids and pohon.status_pohon_id == 2
        ]
        print("all pohon target : ", len(all_pohon_target))

        barcode_ids = [
            pohon.barcode_id for pohon in all_pohon_target if pohon.barcode_id
        ]
        # Update batch untuk semua barcode yang terkait
        if barcode_ids:
            print(f"Total barcode IDs to update: {len(barcode_ids)}")
            unique_barcode_ids = set(barcode_ids)
            print(f"Unique barcode IDs to update: {len(unique_barcode_ids)}")

            await Barcode.filter(id__in=barcode_ids).update(
                rencana_tebang_id=rencana_tebang.id
            )
            print(f"Updated {len(barcode_ids)} barcodes.")

    return False
