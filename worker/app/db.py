import os
from dataclasses import dataclass

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()


@dataclass(frozen=True)
class MongoConfig:
    uri: str
    database_name: str


def get_mongo_config() -> MongoConfig:
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise RuntimeError("MONGO_URI is required")

    if "/" in mongo_uri.rsplit("/", 1)[-1]:
        database_name = mongo_uri.rsplit("/", 1)[-1].split("?", 1)[0] or "tasks"
    else:
        database_name = os.getenv("MONGO_DB", "tasks")

    return MongoConfig(uri=mongo_uri, database_name=database_name)


class MongoStore:
    def __init__(self) -> None:
        config = get_mongo_config()
        self.client = MongoClient(config.uri)
        self.db = self.client[config.database_name]
        self.tasks = self.db["tasks"]

    def close(self) -> None:
        self.client.close()
