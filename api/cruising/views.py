from calendar import c
from attr import has

from parameter.models import Petak
from umum.models import Jenis, KelasDiameter, Sortimen, StatusPohon
from .models import LHC, Barcode, RencanaTebang, Pohon
from fastapi import APIRouter, status, Depends, HTTPException
from typing import List, Union
from utils.tokens import get_perusahaan
from . import schemas
from umum.schemas import ErrorResponse, ResponseSchema as Response
from account.schemas import PerusahaanSchema as Perusahaan
from uuid import UUID
from .functions import (
    BATCH_SIZE,
    get_upload_barcodes_from_file,
    get_upload_pohon_from_file,
    save_lhc_barcode_to_db,
)
import time
from tortoise.transactions import in_transaction
from utils.decorators import timing_decorator
from tortoise.exceptions import IntegrityError
from fastapi_pagination import Page, Params
from fastapi_pagination.ext.tortoise import paginate
import asyncio
from utils.pagination import CustomPage
from tortoise.expressions import Q

BATCH_SIZE = 1000

router = APIRouter(tags=["Cruising"], prefix="/api/Cruising")


@router.post("/LHC", response_model=schemas.LHCSchema)
async def create_lhc(
    lhc: schemas.LHCInSchema, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    data = lhc.model_dump()
    data["perusahaan_id"] = perusahaan
    try:
        lhc_created = await LHC.create(**data)
        await lhc_created.fetch_related("tahun")
        return lhc_created
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/LHC/GetAll", response_model=List[schemas.LHCSchema])
async def get_all_lhc(perusahaan: Perusahaan = Depends(get_perusahaan)):
    lhc = await LHC.filter(perusahaan=perusahaan).prefetch_related("tahun")
    return lhc


@router.get("/LHC/{id}", response_model=schemas.LHCSchema)
async def get_lhc(id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)):
    start_time = time.time()
    lhc = await LHC.get_or_none(id=id, perusahaan=perusahaan).prefetch_related("tahun")
    if not lhc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="LHC not found"
        )
    end_time = time.time()  # Waktu selesai proses
    duration = end_time - start_time  # Durasi proses
    print(f"Duration to process : {duration:.2f} seconds.")
    return lhc


@router.put("/LHC/{id}", response_model=Response)
async def update_lhc(
    id: UUID,
    data: schemas.LHCInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    try:
        await LHC(**data.model_dump()).validate_unique(id)

        updated_count = await LHC.filter(id=id, perusahaan=perusahaan).update(
            **data.model_dump(exclude_unset=True)
        )
        if updated_count == 0:
            raise HTTPException(status_code=404, detail="Blok not found")
        return Response(message="Data berhasil diupdate")
    except IntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.delete("/LHC/{id}", response_model=Response)
async def delete_lhc(id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)):
    lhc = await LHC.get_or_none(id=id, perusahaan=perusahaan)
    if not lhc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="LHC not found"
        )
    await lhc.delete()
    return Response(message="LHC deleted")


@router.get(
    "/LHC/{lhc_id}/GetBarcode/All",
    response_model=List[
        schemas.BarcodeSchema
    ],  # Mengembalikan halaman yang berisi string barcode
    description="Get all barcode list by LHC ID",
)
@timing_decorator
async def get_all_barcode_list_by_lhc_id(
    lhc_id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    barcodes = await Barcode.filter(lhc_id=lhc_id, perusahaan=perusahaan).order_by(
        "barcode"
    )
    return barcodes


@router.get(
    "/LHC/{lhc_id}/GetBarcode",
    response_model=CustomPage[str],  # Mengembalikan halaman yang berisi string barcode
    description="Get barcode list by LHC ID",
)
@timing_decorator
async def get_barcode_list_by_lhc_id(
    lhc_id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    # Memulai query dengan model Barcode
    barcode_query = Barcode.filter(lhc_id=lhc_id, perusahaan=perusahaan)

    async def transform(item):
        return item.barcode

    async def transform_all(items):
        return await asyncio.gather(*(transform(item) for item in items))

    barcodes_page = await paginate(barcode_query, transformer=transform_all)
    return barcodes_page


@router.post(
    "/UploadBarcode",
    response_model=Response,
    tags=["Cruising", "Upload"],
    description="""Endpoint untuk upload barcode, 
    file yang diupload harus berupa file csv yang berisi list barcode, 
    dan request yg dikirimkan menyertakan url file csv yang diupload""",
)
async def upload_barcode(
    data: schemas.UploadBarcodeInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    start_time = time.time()
    data = data.model_dump()
    try:
        barcodes = await get_upload_barcodes_from_file(data["file_url"])

        # Membuat instance Barcode dalam jumlah besar
        barcode_instances = [
            Barcode(barcode=barcode, perusahaan_id=perusahaan, lhc_id=data["lhc_id"])
            for barcode in barcodes
        ]

        # Melakukan bulk insert
        async with in_transaction():
            await Barcode.bulk_create(barcode_instances)

        end_time = time.time()  # Waktu selesai proses
        duration = end_time - start_time  # Durasi proses
        print(f"Duration to process {len(barcodes)} barcodes: {duration:.2f} seconds.")
        return Response(message="Barcode berhasil diupload")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/Barcode/GetAll", response_model=List[schemas.BarcodeSchema])
@timing_decorator
async def get_all_barcode(perusahaan: Perusahaan = Depends(get_perusahaan)):
    barcode = await Barcode.filter(perusahaan=perusahaan)
    return barcode


# CRUD Rencana Tebang
@router.post("/RencanaTebang", response_model=schemas.RencanaTebangSchema)
async def create_rencana_tebang(
    rencana_tebang: schemas.RencanaTebangInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    data = rencana_tebang.model_dump()
    data["perusahaan_id"] = perusahaan
    try:
        rencana_tebang_created = await RencanaTebang.create(**data)
        await rencana_tebang_created.fetch_related("tahun")
        return rencana_tebang_created
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/RencanaTebang/GetAll", response_model=List[schemas.RencanaTebangSchema])
async def get_all_rencana_tebang(perusahaan: Perusahaan = Depends(get_perusahaan)):
    rencana_tebang = await RencanaTebang.filter(perusahaan=perusahaan).prefetch_related(
        "tahun"
    )
    return rencana_tebang


@router.get("/RencanaTebang/{id}", response_model=schemas.RencanaTebangSchema)
async def get_rencana_tebang(
    id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    rencana_tebang = await RencanaTebang.get_or_none(
        id=id, perusahaan=perusahaan
    ).prefetch_related("tahun")

    if not rencana_tebang:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rencana Tebang not found"
        )
    return rencana_tebang


@router.put("/RencanaTebang/{id}", response_model=Response)
async def update_rencana_tebang(
    id: UUID,
    data: schemas.RencanaTebangInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    updated_count = await RencanaTebang.filter(id=id, perusahaan=perusahaan).update(
        **data.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="Rencana Tebang not found")
    return Response(message="Data berhasil diupdate")


@router.delete("/RencanaTebang/{id}", response_model=Response)
async def delete_rencana_tebang(
    id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    rencana_tebang = await RencanaTebang.get_or_none(id=id, perusahaan=perusahaan)
    if not rencana_tebang:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rencana Tebang not found"
        )
    await rencana_tebang.delete()
    return Response(message="Rencana Tebang deleted")


# CRUD Pohon
@router.post(
    "/UploadPohon",
    response_model=schemas.PohonSchema,
    tags=["Cruising", "Upload"],
    description="## Endpoint untuk menambahkan data pohon\n\nfile yang diupload harus berupa file csv yang berisi list pohon, dan request yg dikirimkan menyertakan _file url_ .csv yang diupload.\n\n**template file** : [Download](https://mypuhh.s3.ap-southeast-1.amazonaws.com/uploads/template_upload_pohon.csv)",
)
async def upload_pohon(
    data: schemas.UploadPohonInSchema, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    start_time = time.time()
    data = data.model_dump()
    try:
        pohon_list = await get_upload_pohon_from_file(data["file_url"])
        pohon_instances = [
            Pohon(perusahaan_id=perusahaan, **pohon) for pohon in pohon_list
        ]

        # Melakukan bulk insert
        async with in_transaction():
            await Pohon.bulk_create(pohon_instances)

        end_time = time.time()  # Waktu selesai proses
        duration = end_time - start_time  # Durasi proses
        print(f"Duration to process {len(pohon_list)} pohon: {duration:.2f} seconds.")
        return Response(message="Data pohon berhasil diupload")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# get pohon by id
@router.get("/Pohon/{id}", response_model=schemas.PohonSchema)
async def get_pohon(id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)):
    pohon = await Pohon.get_or_none(id=id, perusahaan=perusahaan)
    if not pohon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pohon not found"
        )
    return pohon


# update pohon
@router.put("/Pohon/{id}", response_model=Response)
async def update_pohon(
    id: UUID,
    data: schemas.PohonInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    updated_count = await Pohon.filter(id=id, perusahaan=perusahaan).update(
        **data.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="Pohon not found")
    return Response(message="Data berhasil diupdate")


# delete pohon
@router.delete("/Pohon/{id}", response_model=Response)
async def delete_pohon(id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)):
    pohon = await Pohon.get_or_none(id=id, perusahaan=perusahaan)
    if not pohon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pohon not found"
        )
    await pohon.delete()
    return Response(message="Pohon deleted")


@router.put(
    "/LHC/{lhc_id}/SaveBarcode",
    response_model=Union[Response, ErrorResponse],
)
async def save_lhc_barcode(
    lhc_id: UUID,
    data: schemas.SaveLHCBarcodeSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    try:
        lhc = await LHC.get_or_none(id=lhc_id, perusahaan=perusahaan)
        errors = await save_lhc_barcode_to_db(data.barcodes, perusahaan, lhc_id)
        if errors:
            return ErrorResponse(errors=errors)
        return Response(message="Barcode berhasil disimpan")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# get all pohon by LHC ID
@router.get(
    "/LHC/{lhc_id}/Pohon/GetAll",
    response_model=List[schemas.PohonSchema],
    description="## Get all pohon by LHC ID",
)
async def get_all_pohon(lhc_id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)):
    pohon = (
        await Pohon.filter(Q(lhc=lhc_id) & Q(perusahaan=perusahaan))
        .order_by("nomor")
        .prefetch_related(
            "jenis",
            "kelas_diameter",
            "sortimen",
            "status_pohon",
            "petak",
            "barcode",
            "jenis__kelompok_jenis",
        )
    )
    return pohon


@router.put(
    "/LHC/{lhc_id}/Pohon/Save",
    response_model=Union[Response, ErrorResponse],
)
@timing_decorator
async def save_pohon(
    lhc_id: UUID,
    data: List[schemas.PohonInSchema],
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    try:
        lhc = await LHC.get_or_none(id=lhc_id, perusahaan=perusahaan)
        if not lhc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="LHC not found"
            )

        errors = await save_lhc_pohon_to_db(data, lhc_id, perusahaan)
        if errors:
            return ErrorResponse(errors=errors)
        return Response(message="Pohon berhasil disimpan")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@timing_decorator
async def save_lhc_pohon_to_db(data: List[schemas.PohonInSchema], lhc_id, perusahaan):
    async with in_transaction() as connection:
        errors = []
        BATCH_SIZE = 1000  # Tentukan ukuran batch

        # Mendefinisikan pemetaan model dan atribut terkait
        model_mapping = {
            "barcode": (Barcode, "barcode"),
            "jenis": (Jenis, "nama"),
            "kelas_diameter": (KelasDiameter, "nama"),
            "sortimen": (Sortimen, "nama"),
            "status_pohon": (StatusPohon, "nama"),
            "petak": (Petak, "nama"),
        }

        # Batch mengambil model instance
        all_attributes = {
            key: set(getattr(item, key) for item in data if getattr(item, key))
            for key in model_mapping
        }
        model_instances = {}
        for key, (model, attr) in model_mapping.items():
            if key == "petak":
                model_instances[key] = {
                    instance.nama: instance
                    for instance in await model.filter(
                        **{
                            attr + "__in": list(all_attributes[key]),
                            "perusahaan": perusahaan,
                        }
                    ).all()
                }
            else:
                model_instances[key] = {
                    instance.nama: instance
                    for instance in await model.filter(
                        **{attr + "__in": list(all_attributes[key])}
                    ).all()
                }

        to_create = []
        to_update = []

        # Siapkan data untuk batch processing
        for item in data:
            pohon_data = item.model_dump(exclude_none=True, exclude_unset=True)
            pohon_data.update(
                {
                    "barcode_id": (
                        model_instances["barcode"].get(item.barcode).id
                        if item.barcode in model_instances["barcode"]
                        else None
                    ),
                    "jenis_id": (
                        model_instances["jenis"].get(item.jenis).id
                        if item.jenis in model_instances["jenis"]
                        else None
                    ),
                    "kelas_diameter_id": (
                        model_instances["kelas_diameter"].get(item.kelas_diameter).id
                        if item.kelas_diameter in model_instances["kelas_diameter"]
                        else None
                    ),
                    "sortimen_id": (
                        model_instances["sortimen"].get(item.sortimen).id
                        if item.sortimen in model_instances["sortimen"]
                        else None
                    ),
                    "status_pohon_id": (
                        model_instances["status_pohon"].get(item.status_pohon).id
                        if item.status_pohon in model_instances["status_pohon"]
                        else None
                    ),
                    "petak_id": (
                        model_instances["petak"].get(item.petak).id
                        if item.petak in model_instances["petak"]
                        else None
                    ),
                    "lhc_id": lhc_id,
                    "perusahaan_id": perusahaan,
                }
            )

            # Membersihkan data yang tidak dibutuhkan
            for field in model_mapping:
                pohon_data.pop(field, None)

            if pohon_data.get("id"):
                to_update.append(Pohon(**pohon_data))
            else:
                to_create.append(Pohon(**pohon_data))

        # Fungsi untuk melakukan batch processing
        async def process_batches(batch: List, operation_type: str):
            if operation_type == "create":
                await Pohon.bulk_create(batch, using_db=connection)
            elif operation_type == "update":
                await Pohon.bulk_update(
                    batch,
                    fields=[field for field in pohon_data.keys() if field != "id"],
                    using_db=connection,
                )

        # Membagi to_update dan to_create ke dalam batch dan menambahkan ke tasks
        tasks = [
            process_batches(to_create[i : i + BATCH_SIZE], "create")
            for i in range(0, len(to_create), BATCH_SIZE)
        ]
        tasks.extend(
            [
                process_batches(to_update[i : i + BATCH_SIZE], "update")
                for i in range(0, len(to_update), BATCH_SIZE)
            ]
        )

        # Tunggu semua operasi batch selesai
        if tasks:
            await asyncio.gather(*tasks)

        if errors:
            return errors  # Return list of errors if any
        return False  # Return False to indicate success with no errors


# @timing_decorator
# async def save_lhc_pohon_to_db(data: List[schemas.PohonInSchema], lhc_id, perusahaan):
#     async with in_transaction() as connection:
#         errors = []

#         # Pengambilan data model secara batch
#         all_barcodes = {item.barcode for item in data if item.barcode}
#         all_jenis = {item.jenis for item in data if item.jenis}
#         all_kelas_diameter = {
#             item.kelas_diameter for item in data if item.kelas_diameter
#         }
#         all_sortimen = {item.sortimen for item in data if item.sortimen}
#         all_status_pohon = {item.status_pohon for item in data if item.status_pohon}
#         all_petak = {item.petak for item in data if item.petak}

#         barcodes = await Barcode.filter(barcode__in=all_barcodes).all()
#         jenis = await Jenis.filter(nama__in=all_jenis).all()
#         kelas_diameter = await KelasDiameter.filter(nama__in=all_kelas_diameter).all()
#         sortimen = await Sortimen.filter(nama__in=all_sortimen).all()
#         status_pohon = await StatusPohon.filter(nama__in=all_status_pohon).all()
#         petak = await Petak.filter(nama__in=all_petak, perusahaan=perusahaan).all()

#         # Dictionary untuk lookup cepat
#         barcode_dict = {b.barcode: b.id for b in barcodes}
#         jenis_dict = {j.nama: j.id for j in jenis}
#         kelas_diameter_dict = {k.nama: k.id for k in kelas_diameter}
#         sortimen_dict = {s.nama: s.id for s in sortimen}
#         status_pohon_dict = {s.nama: s.id for s in status_pohon}
#         petak_dict = {p.nama: p.id for p in petak}

#         to_create = []
#         to_update = []

#         for item in data:
#             pohon_data = item.model_dump(exclude_none=True, exclude_unset=True)
#             pohon_data.update(
#                 {
#                     "barcode_id": barcode_dict.get(item.barcode),
#                     "jenis_id": jenis_dict.get(item.jenis),
#                     "kelas_diameter_id": kelas_diameter_dict.get(item.kelas_diameter),
#                     "sortimen_id": sortimen_dict.get(item.sortimen),
#                     "status_pohon_id": status_pohon_dict.get(item.status_pohon),
#                     "petak_id": petak_dict.get(item.petak),
#                     "lhc_id": lhc_id,
#                     "perusahaan_id": perusahaan,
#                 }
#             )

#             # Membersihkan data yang tidak dibutuhkan
#             for field in [
#                 "barcode",
#                 "jenis",
#                 "kelas_diameter",
#                 "sortimen",
#                 "status_pohon",
#                 "petak",
#             ]:
#                 pohon_data.pop(field, None)

#             if pohon_data.get("id"):
#                 to_update.append(pohon_data)
#             else:
#                 to_create.append(pohon_data)

#         if to_create:
#             await Pohon.bulk_create(
#                 [Pohon(**data) for data in to_create], using_db=connection
#             )
#         if to_update:
#             await Pohon.bulk_update(
#                 [Pohon(**data) for data in to_update],
#                 fields=[field for field in pohon_data.keys() if field != "id"],
#                 using_db=connection,
#             )

#         return False


# @timing_decorator
# async def save_lhc_pohon_to_db(data: List[schemas.PohonInSchema], lhc_id, perusahaan):
#     async with in_transaction() as connection:
#         errors = []
#         pohon_checks = []
#         for item in data:
#             try:

#                 pohon_data = item.model_dump(exclude_none=True, exclude_unset=True)

#                 barcode = await Barcode.get_or_none(barcode=item.barcode)
#                 jenis = await Jenis.get_or_none(nama=item.jenis)
#                 print(item.kelas_diameter)
#                 kelas_diameter = await KelasDiameter.get_or_none(
#                     nama=item.kelas_diameter
#                 )
#                 print(kelas_diameter)
#                 sortimen = await Sortimen.get_or_none(nama=item.sortimen)
#                 status_pohon = await StatusPohon.get_or_none(nama=item.status_pohon)

#                 petak = await Petak.get_or_none(nama=item.petak, perusahaan=perusahaan)

#                 pohon_data["barcode_id"] = barcode.id if barcode else None
#                 pohon_data.pop("barcode", None)

#                 pohon_data["jenis_id"] = jenis.id if jenis else None
#                 pohon_data.pop("jenis", None)

#                 pohon_data["kelas_diameter_id"] = (
#                     kelas_diameter.id if kelas_diameter else None
#                 )
#                 pohon_data.pop("kelas_diameter", None)

#                 pohon_data["sortimen_id"] = sortimen.id if sortimen else None
#                 pohon_data.pop("sortimen", None)

#                 pohon_data["status_pohon_id"] = (
#                     status_pohon.id if status_pohon else None
#                 )
#                 pohon_data.pop("status_pohon", None)

#                 pohon_data["petak_id"] = petak.id if petak else None
#                 pohon_data.pop("petak", None)

#                 pohon_data["lhc_id"] = lhc_id
#                 pohon_data["perusahaan_id"] = perusahaan

#                 # Membuat dan menyimpan objek Pohon
#                 # Cek apakah pohon dengan ID yang diberikan sudah ada
#                 pohon_id = pohon_data.get("id")
#                 if pohon_id:
#                     # Update pohon yang sudah ada
#                     existing_pohon = await Pohon.get(id=pohon_id)
#                     for key, value in pohon_data.items():
#                         setattr(existing_pohon, key, value)
#                     await existing_pohon.save(using_db=connection)
#                 else:
#                     # Create pohon baru jika tidak ada ID yang diberikan
#                     new_pohon = await Pohon.create(**pohon_data, using_db=connection)
#                 pohon_checks.append(pohon_data)  # Menyimpan untuk verifikasi
#             except IntegrityError as e:
#                 errors.append({"status": "error", "message": str(e), "item": item})
#                 raise HTTPException(status_code=400, detail=str(e))
#             except Exception as e:
#                 errors.append({"status": "error", "message": str(e), "item": item})
#                 raise HTTPException(status_code=400, detail=str(e))

#         if errors:
#             raise HTTPException(status_code=400, detail=errors)

#         # Tampilkan atau log data yang telah dicek
#         for check in pohon_checks:
#             print(check)

#         return False


# Nantinya Anda bisa memanggil fungsi ini:
# await check_lhc_pohon_data(data, lhc_id, perusahaan)
