from aiobotocore.session import get_session

from dotenv import load_dotenv
import os
from botocore.exceptions import ClientError
from fastapi import HTTPException
from datetime import datetime

from .functions import generate_unique_filename

load_dotenv()

AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")


async def get_s3_client():
    session = get_session()
    async with session.create_client(
        "s3",
        region_name=os.getenv("AWS_REGION"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    ) as client:
        return client


async def parse_presigned_post_url(base_url, fields):
    query_params = "&".join([f"{key}={value}" for key, value in fields.items()])
    complete_url = f"{base_url}?{query_params}"
    return complete_url


async def create_presigned_url(object_name, content_type, expiration=2000):
    print("Creating presigned URL", content_type)
    client = await get_s3_client()
    try:
        response = await client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": AWS_STORAGE_BUCKET_NAME,
                "Key": "test/" + generate_unique_filename(object_name),
                "ContentType": content_type,
            },
            ExpiresIn=expiration,
        )
    except Exception as e:
        print(e)
        return None
    return response


async def get_presigned_url(url: str, expiration=2500):
    client = await get_s3_client()
    try:
        response = await client.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": AWS_STORAGE_BUCKET_NAME,
                "Key": "test/" + url.split("/")[-1],
            },
            ExpiresIn=expiration,
        )
    except Exception as e:
        print(e)
        return None
    return response
