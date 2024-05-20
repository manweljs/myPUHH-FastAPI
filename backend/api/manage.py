import sys
import asyncio
import subprocess
from api.utils.functions import init_app


async def makemigrations():
    subprocess.run(["aerich", "migrate"], check=True)


async def migrate():
    subprocess.run(["aerich", "upgrade"], check=True)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        if command == "makemigrations":
            asyncio.run(makemigrations())
        elif command == "migrate":
            asyncio.run(migrate())
        elif command == "initapp":
            asyncio.run(init_app())
        else:
            print("Unknown command")
    else:
        print("Available commands: makemigrations, migrate")
