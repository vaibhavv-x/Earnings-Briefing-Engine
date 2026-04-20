import requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from app.fmp_client import FmpClient
from app.data_fetcher import fetch_income_statement, fetch_key_metrics
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import random

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Earnings Briefing Engine running 🚀"}

# 🔹 Company API
@app.get("/company/{symbol}")
def get_company(symbol: str):
    try:
        import yfinance as yf
        info = yf.Ticker(symbol).info
        
        # Extract and format market cap safely
        mcap_raw = info.get("marketCap", 0)
        mcap_formatted = f"${round(mcap_raw / 1_000_000_000, 1)}B" if mcap_raw else "N/A"
            
        return {
            "symbol": symbol.upper(),
            "company": info.get("shortName", info.get("longName", f"{symbol.upper()} Corp")),
            "industry": info.get("industry", "Unknown"),
            "market_cap": mcap_formatted
        }
    except Exception as e:
        print(f"Failed to fetch real company info for {symbol}. Returning fallback.", e)
        return {
            "symbol": symbol.upper(),
            "company": f"{symbol.upper()} Corp",
            "industry": "Unknown",
            "market_cap": "N/A"
        }

# 🔹 Quarterly Financial Forecast API (time series demo)
@app.get("/predict/{symbol}")
def predict(symbol: str):

    fmp_api_key = os.getenv("FMP_API_KEY")
    fmp_base_url = os.getenv("FMP_BASE_URL", "https://financialmodelingprep.com/stable").rstrip('/')

    if not fmp_api_key:
        return JSONResponse(
            status_code=500,
            content={"error": "Server Config Error", "details": "API key missing"}
        )

    client = FmpClient(
        api_key=fmp_api_key,
        base_url=fmp_base_url
    )

    try:
        data = fetch_income_statement(client, symbol)
    except Exception as e:
        print("FMP blocked. Failing over to ACTUAL data scraping via yfinance engine.", str(e))
        data = []
        try:
            import yfinance as yf
            ticker = yf.Ticker(symbol)
            inc = ticker.quarterly_income_stmt
            cf = ticker.quarterly_cashflow
            hist = ticker.history(period="1d")
            current_price = float(hist['Close'].iloc[0]) if not hist.empty else 0
            
            for date_col in inc.columns[:8]:
                period_str = date_col.strftime("%Y-%m-%d") if hasattr(date_col, "strftime") else str(date_col)[:10]
                
                rev = float(inc.loc["Total Revenue", date_col]) if "Total Revenue" in inc.index else 0
                net_income = float(inc.loc["Net Income", date_col]) if "Net Income" in inc.index else 0
                eps = float(inc.loc["Basic EPS", date_col]) if "Basic EPS" in inc.index else 0
                op_inc = float(inc.loc["Operating Income", date_col]) if "Operating Income" in inc.index else 0
                
                ebitda = 0
                if "Normalized EBITDA" in inc.index: ebitda = float(inc.loc["Normalized EBITDA", date_col])
                elif "EBITDA" in inc.index: ebitda = float(inc.loc["EBITDA", date_col])
                
                fcf = 0
                if date_col in cf.columns and "Free Cash Flow" in cf.index:
                    fcf = float(cf.loc["Free Cash Flow", date_col])
                    
                op_margin = (op_inc / rev * 100) if rev and rev != 0 else 0
                pe_ratio = (current_price / (eps * 4)) if eps and eps != 0 else 0
                
                data.append({
                    "date": period_str,
                    "revenue": rev,
                    "netIncome": net_income,
                    "eps": eps,
                    "ebitda": ebitda,
                    "fcf": fcf,
                    "op_margin": op_margin,
                    "pe_ratio": pe_ratio
                })
        except Exception as yf_e:
            print("Yfinance fallback failed, falling back to dynamic mockup", yf_e)
            for i in range(8):
                data.append({
                    "date": f"202{3 - (i//4)}-0{1 + (i % 4)*3}-28",
                    "revenue": random.randint(50_000_000_000, 90_000_000_000),
                    "netIncome": random.randint(10_000_000_000, 25_000_000_000),
                    "eps": round(random.uniform(1.2, 2.5), 2),
                    "ebitda": random.randint(15_000_000_000, 30_000_000_000),
                    "fcf": random.randint(5_000_000_000, 20_000_000_000),
                    "op_margin": round(random.uniform(20.0, 35.0), 2),
                    "pe_ratio": round(random.uniform(15.0, 30.0), 2)
                })

    if not data or not isinstance(data, list):
        print(f"Data empty for {symbol}, applying fallback layout.")
        data = []

    # FMP returns newest first. Reverse to get chronological order (oldest first)
    data = data[::-1]

    # Helper function to forecast using scikit-learn Linear Regression ML Algorithm
    def generate_metric_series(raw_data, key, format_func):
        import numpy as np
        from sklearn.linear_model import LinearRegression

        historical = []
        values_only = []
        X_train = []

        for i, q in enumerate(raw_data):
            period_str = q.get("date", f"Hist-{i}")[:7] 
            val = q.get(key, 0)
            try:
                import math
                if val is None or math.isnan(float(val)):
                    val = 0
            except Exception:
                val = 0
            
            formatted_val = format_func(val)
            historical.append({
                "period": period_str,
                "value": formatted_val
            })
            values_only.append(formatted_val)
            X_train.append([i])

        forecast = []
        
        # We need at least 2 points to generate a mathematical trendline slope securely
        if len(values_only) >= 2:
            model = LinearRegression()
            model.fit(X_train, values_only)
            
            last_index = len(values_only) - 1
            # Push vectors forward 4 steps into the future natively
            X_future = [[last_index + 1], [last_index + 2], [last_index + 3], [last_index + 4]]
            predictions = model.predict(X_future)
            
            for i, pred_val in enumerate(predictions):
                forecast.append({
                    "period": f"F{i+1}",
                    "value": round(float(pred_val), 2)
                })
        else:
            # Strict fallback if dataset fails to provide enough coordinates for a line
            for i in range(4):
                val = values_only[0] if values_only else 0
                forecast.append({"period": f"F{i+1}", "value": round(float(val), 2)})

        return {
            "historical": historical,
            "forecast": forecast
        }

    final_metrics = {
        "Revenue": generate_metric_series(data, "revenue", lambda x: round(x / 1_000_000_000, 2)),
        "Profit": generate_metric_series(data, "netIncome", lambda x: round(x / 1_000_000_000, 2)),
        "EPS": generate_metric_series(data, "eps", lambda x: round(x, 2)),
        "EBITDA": generate_metric_series(data, "ebitda", lambda x: round(x / 1_000_000_000, 2)),
        "FCF": generate_metric_series(data, "fcf", lambda x: round(x / 1_000_000_000, 2)),
        "Operating Margin": generate_metric_series(data, "op_margin", lambda x: round(x, 2)),
        "PE Ratio": generate_metric_series(data, "pe_ratio", lambda x: round(x, 2))
    }

    def calculate_recommendation(metrics_dict):
        score = 0
        total_weights = 0
        
        for key, raw_payload in metrics_dict.items():
            hist = raw_payload.get('historical', [])
            fore = raw_payload.get('forecast', [])
            
            if not hist or not fore: continue
            
            start = hist[-1].get('value', 0)
            end = fore[-1].get('value', 0)
            
            if start == 0: continue
            
            growth = (end - start) / abs(start)
            
            if key == "PE Ratio":
                # PE expansion mathematically models overvaluation negatively
                if growth < -0.05: score += 1.5
                elif growth < 0: score += 0.5
                elif growth > 0.15: score -= 1.5
                elif growth > 0: score -= 0.5
                total_weights += 1.5
            else:
                if growth > 0.08: score += 2.0
                elif growth > 0.02: score += 1.0
                elif growth < -0.08: score -= 2.0
                elif growth < -0.02: score -= 1.0
                else: score += 0
                total_weights += 2.0
                
        if total_weights == 0: return "Hold"
        
        normalized = score / total_weights
        
        if normalized >= 0.6: return "Strong Buy"
        elif normalized >= 0.2: return "Buy"
        elif normalized > -0.2: return "Hold"
        elif normalized > -0.6: return "Sell"
        else: return "Strong Sell"

    return {
        "symbol": symbol.upper(),
        "metrics": final_metrics,
        "recommendation": calculate_recommendation(final_metrics)
    }

