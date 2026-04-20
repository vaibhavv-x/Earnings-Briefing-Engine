import pandas as pd
import matplotlib.pyplot as plt


def plot_metrics():

    try:
        df = pd.read_csv("output/metrics.csv")

        df = df.dropna()

        if df.empty:
            print("No data to plot.")
            return

        symbols = df["Symbol"]

        plt.figure()

        plt.plot(symbols, df["RevenueGrowth"], marker='o', label="Revenue Growth (%)")
        plt.plot(symbols, df["NetMargin"], marker='o', label="Net Margin (%)")
        plt.plot(symbols, df["PERatio"], marker='o', label="P/E Ratio")

        plt.xlabel("Companies")
        plt.ylabel("Values")
        plt.title("Dynamic Company Metrics Comparison")

        plt.legend()
        plt.grid(True)

        plt.tight_layout()
        plt.show()

    except Exception as e:
        print("Plot error:", e)