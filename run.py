from pathlib import Path
import pandas as pd

from app.config import get_settings
from app.fmp_client import FmpClient
from app.builder import build_bundle
from app.render_markdown import render_markdown
from app.plotter import plot_metrics


# Save / Update metrics dynamically
def save_metrics(symbol, bundle):

    profile = bundle.get("profile", {})
    income = bundle.get("income", [])

    if not income:
        return

    revenue_growth = None
    net_margin = None
    pe_ratio = None

    try:
        # Revenue Growth
        if len(income) > 1:
            curr = income[0].get("revenue")
            prev = income[1].get("revenue")

            if curr and prev:
                revenue_growth = ((curr - prev) / prev) * 100

        # Net Margin
        revenue = income[0].get("revenue")
        profit = income[0].get("netIncome")

        if revenue and profit:
            net_margin = (profit / revenue) * 100

        # P/E Ratio
        market_cap = profile.get("marketCap")

        if market_cap and profit:
            pe_ratio = market_cap / profit

    except:
        pass

    file_path = Path("output/metrics.csv")

    # Load existing data
    if file_path.exists():
        df = pd.read_csv(file_path)
    else:
        df = pd.DataFrame(columns=["Symbol", "RevenueGrowth", "NetMargin", "PERatio"])

    # Update or insert
    if symbol in df["Symbol"].values:
        df.loc[df["Symbol"] == symbol, ["RevenueGrowth", "NetMargin", "PERatio"]] = [
            revenue_growth, net_margin, pe_ratio
        ]
    else:
        new_row = {
            "Symbol": symbol,
            "RevenueGrowth": revenue_growth,
            "NetMargin": net_margin,
            "PERatio": pe_ratio
        }
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)

    # Save file
    df.to_csv(file_path, index=False)


def main():

    settings = get_settings()

    client = FmpClient(
        api_key=settings.api_key,
        base_url=settings.base_url
    )

    # Master list of sector-leading companies
    default_tickers = "AAPL,MSFT,GOOGL,META,NVDA,AMD,INTC,TSLA,F,GM,JPM,V,GS,NFLX,DIS,SPOT"
    print(f"Executing batch generation for the master index: {default_tickers}")
    
    symbols = [s.strip().upper() for s in default_tickers.split(",")]

    output_dir = Path("output/briefings")
    output_dir.mkdir(parents=True, exist_ok=True)

    for symbol in symbols:

        print(f"\nGenerating report for {symbol}...")

        try:
            bundle = build_bundle(client, symbol)

            # Invalid ticker check
            if not bundle["profile"]:
                print(f" Invalid ticker: {symbol}")
                continue

            # Generate report
            report = render_markdown(bundle)

            file_path = output_dir / f"{symbol}.md"
            file_path.write_text(report, encoding="utf-8")

            print(f" Saved: {file_path}")

            #  Save metrics for graph
            save_metrics(symbol, bundle)

        except Exception as e:
            print(f" Error processing {symbol}: {e}")

    # Plot after all companies processed
    plot_metrics()


if __name__ == "__main__":
    main()