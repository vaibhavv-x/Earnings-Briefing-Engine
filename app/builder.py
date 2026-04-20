from app.data_fetcher import (
    fetch_profile,
    fetch_income_statement,
    fetch_key_metrics
)

def build_bundle(client, symbol):
    try:
        profile = fetch_profile(client, symbol)
        income = fetch_income_statement(client, symbol)
        key_metrics = fetch_key_metrics(client, symbol)

        # SAFETY CHECKS
        if not income:
            raise ValueError("Income data not available")

        if not isinstance(income, list):
            raise ValueError("Income data invalid")

        bundle = {
            "symbol": symbol,
            "profile": profile or {},
            "income": income,
            "key_metrics": key_metrics or []
        }

        return bundle

    except Exception as e:
        print("BUILDER ERROR:", e)
        return None