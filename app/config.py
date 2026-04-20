import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    def __init__(self):
        self.api_key = os.getenv("FMP_API_KEY")
        self.base_url = os.getenv("FMP_BASE_URL")

def get_settings():
    return Settings()