import yfinance as yf
ticker = yf.Ticker("AAPL")
print(ticker.quarterly_income_stmt.head())
print("-" * 50)
print(ticker.info.keys())
