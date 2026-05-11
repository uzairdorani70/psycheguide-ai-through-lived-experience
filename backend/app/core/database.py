from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connect_to_mongo():
    """Connect to MongoDB when the app starts."""
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    print("Connected to MongoDB!")

async def close_mongo_connection():
    """Close connection when the app stops."""
    if db.client:
        db.client.close()
        print("MongoDB Connection Closed.")

def get_database():
    """Return the database instance."""
    return db.client[settings.DB_NAME]