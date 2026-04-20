import os
from dotenv import load_dotenv
import requests

load_dotenv()
api_key = os.environ.get("FMP_API_KEY")

url = f"https://financialmodelingprep.com/stable/income-statement/AAPL?period=quarter&limit=8&apikey={api_key}"
print("URL:", url[:60])
res = requests.get(url)
print("STATUS:", res.status_code)
print("BODY:", res.text[:200])
