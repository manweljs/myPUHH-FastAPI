import sys
import asyncio
import subprocess


async def makemigrations():
    subprocess.run(["aerich", "migrate"], check=True)


async def migrate():
    subprocess.run(["aerich", "upgrade"], check=True)


async def init():
    subprocess.run(["aerich", "init", "-t", "config.db.tortoise_config"], check=True)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        if command == "makemigrations":
            asyncio.run(makemigrations())
        elif command == "migrate":
            asyncio.run(migrate())
        elif command == "init":
            asyncio.run(init())
        elif command == "runserver":
            subprocess.run(["python", "main.py"])
        else:
            print("Unknown command")
    else:
        print("Available commands: makemigrations, migrate")
