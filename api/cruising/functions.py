import httpx
import pandas as pd
import boto3
from botocore.exceptions import NoCredentialsError
from utils.storage import get_s3_client
import io

file = "https://mypuhh.s3.ap-southeast-1.amazonaws.com/uploads/test_upload_barcode.csv"


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
