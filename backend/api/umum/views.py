from api.utils.decorators import timing_decorator
from api.utils.storage import (
    AWS_STORAGE_BUCKET_NAME,
    create_presigned_url,
    get_s3_client,
)
from .models import (
    KelasDiameter,
    Propinsi,
    Kabupaten,
    RencanaTebangType,
    KualifikasiGanis,
    JabatanGanis,
    KelompokJenis,
    Jenis,
    Sortimen,
    Tarif,
)
from fastapi import APIRouter, UploadFile, status
from typing import List
from . import schemas
from .serializers import (
    JabatanGanisSerializer,
    JenisSerializer,
    KabupatenSerializer,
    PropinsiSerializer,
)


router = APIRouter(tags=["Umum"], prefix="/api/Umum")


@router.get(
    "/Propinsi",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.PropinsiSchema],
)
async def get_all_propinsi():
    propinsi = await Propinsi.all()
    serializer = PropinsiSerializer(propinsi, many=True)
    return await serializer.serialize()


@router.get(
    "/Kabupaten",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.KabupatenSchema],
)
async def get_all_kabupaten():
    kabupaten = await Kabupaten.all().prefetch_related("propinsi")
    serializer = KabupatenSerializer(kabupaten, many=True)
    return await serializer.serialize()


@router.get(
    "/RencanaTebangType",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.RencanaTebangTypeSchema],
)
async def get_all_rencana_tebang_type():
    rencana_tebang_type = await RencanaTebangType.all()
    return rencana_tebang_type


@router.get(
    "/KualifikasiGanis",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.KualifikasiGanisSchema],
)
async def get_all_kualifikasi_ganis():
    kualifikasi_ganis = await KualifikasiGanis.all()
    return kualifikasi_ganis


@router.get(
    "/JabatanGanis",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.JabatanGanisSchema],
)
async def get_all_jabatan_ganis():
    jabatan_ganis = await JabatanGanis.all().prefetch_related("kualifikasi")
    serializer = JabatanGanisSerializer(jabatan_ganis, many=True)
    return await serializer.serialize()


@router.get(
    "/KelompokJenis",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.KelompokJenisSchema],
)
async def get_all_kelompok_jenis():
    kelompok_jenis = await KelompokJenis.all()
    return kelompok_jenis


@router.get(
    "/Jenis",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.JenisSchema],
)
@timing_decorator
async def get_all_jenis():
    jenis = await Jenis.all().prefetch_related("kelompok_jenis")
    return jenis


@router.get(
    "/KelasDiameter",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.KelasDiameterSchema],
)
async def get_all_kelas_diameter():
    kelas_diameter = await KelasDiameter.all()
    return kelas_diameter


@router.get(
    "/Sortimen",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.SortimenSchema],
)
async def get_all_sortimen():
    sortimen = await Sortimen.all()
    return sortimen


@router.get(
    "/Tarif",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.TarifSchema],
)
async def get_all_tarif():
    tarif = await Tarif.all().prefetch_related("kelompok_jenis", "sortimen")
    return tarif


@router.get(
    "/GetPresignedUrl",
    status_code=status.HTTP_200_OK,
)
async def get_presigned_url_for_upload(file_name: str, content_type: str):
    print("Get presigned url", content_type)
    url = await create_presigned_url(file_name, content_type)
    return {"presigned": url}


@router.post(
    "/UploadFile",
    status_code=status.HTTP_200_OK,
    tags=["Upload"],
)
async def upload_file(file: UploadFile):
    client = await get_s3_client()
    data = await file.read()
    response = await client.put_object(
        Bucket=AWS_STORAGE_BUCKET_NAME, Key=f"test/{file.filename}", Body=data
    )
    await client.close()
    return {"message": "File uploaded successfully", "response": response}
