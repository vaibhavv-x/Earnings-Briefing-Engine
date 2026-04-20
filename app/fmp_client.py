import requests

class FmpClient:

    def __init__(self, api_key, base_url):
        self.api_key = api_key
        self.base_url = base_url

    def get(self, endpoint, params=None):
        if params is None:
            params = {}

        params["apikey"] = self.api_key
        url = f"{self.base_url}/{endpoint}"

        try:
            # Added a 5 second timeout. If FMP load balancer hangs, it triggers an Exception instantly rescuing the UI.
            response = requests.get(url, params=params, timeout=5)
            
            print("URL:", response.url)   # 🔥 DEBUG
            print("STATUS:", response.status_code)
            print("RESPONSE:", response.text[:200])

            response.raise_for_status()
            return response.json()

        except requests.exceptions.HTTPError as e:
            print("HTTP ERROR:", e)
            raise e
        except requests.exceptions.Timeout as e:
            print("TIMEOUT ERROR: FMP server did not respond!")
            raise e