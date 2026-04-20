from typing import List, Dict, Any


def fetch_profile(client, symbol: str) -> Dict[str, Any]:
    data = client.get("profile", {"symbol": symbol})
    return data[0] if data else {}


def fetch_earnings_calendar(client, start_date: str, end_date: str) -> List[Dict[str, Any]]:
    return client.get(
        "earnings-calendar",
        {"from": start_date, "to": end_date}
    )


def fetch_analyst_estimates(client, symbol: str):
    return client.get(
        "analyst-estimates",
        {
            "symbol": symbol,
            "period": "quarter",
            "limit": 5,
            "page": 0
        }
    )


def fetch_income_statement(client, symbol: str) -> List[Dict[str, Any]]:
    return client.get(
        f"income-statement/{symbol}",
        {"period": "quarter", "limit": 8}
    )


def fetch_key_metrics(client, symbol: str) -> List[Dict[str, Any]]:
    return client.get(
        "key-metrics",
        {"symbol": symbol, "limit": 5}
    )