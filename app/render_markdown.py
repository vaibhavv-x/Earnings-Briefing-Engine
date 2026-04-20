def format_number(value):
    if value is None:
        return "N/A"

    try:
        value = float(value)

        if value >= 1_000_000_000:
            return f"{value/1_000_000_000:.2f}B"
        elif value >= 1_000_000:
            return f"{value/1_000_000:.2f}M"
        elif value >= 1_000:
            return f"{value:,.0f}"
        else:
            return str(value)
    except:
        return str(value)


def render_markdown(bundle):

    profile = bundle.get("profile", {})
    income = bundle.get("income", [])

    company = profile.get("companyName", "N/A")
    symbol = bundle.get("symbol", "N/A")
    sector = profile.get("sector", "N/A")
    price = format_number(profile.get("price"))
    market_cap = format_number(profile.get("marketCap"))

    revenue = "N/A"
    net_income = "N/A"

    if income:
        revenue = format_number(income[0].get("revenue"))
        net_income = format_number(income[0].get("netIncome"))

    # 🔥 Core Metrics
    pe_ratio = "N/A"
    net_margin = "N/A"

    if income:
        revenue_val = income[0].get("revenue")
        net_income_val = income[0].get("netIncome")
        market_cap_val = profile.get("marketCap")

        if revenue_val and net_income_val:
            try:
                net_margin = f"{(net_income_val / revenue_val) * 100:.2f}%"
            except:
                pass

        if market_cap_val and net_income_val:
            try:
                pe_ratio = f"{market_cap_val / net_income_val:.2f}"
            except:
                pass

    # 🔥 Additional Metrics
    revenue_growth = "N/A"
    profit_growth = "N/A"
    earnings_yield = "N/A"
    rev_per_employee = "N/A"
    mc_to_revenue = "N/A"

    if len(income) > 1:
        try:
            current_rev = income[0].get("revenue")
            prev_rev = income[1].get("revenue")

            if current_rev and prev_rev:
                revenue_growth = f"{((current_rev - prev_rev)/prev_rev)*100:.2f}%"
        except:
            pass

        try:
            current_profit = income[0].get("netIncome")
            prev_profit = income[1].get("netIncome")

            if current_profit and prev_profit:
                profit_growth = f"{((current_profit - prev_profit)/prev_profit)*100:.2f}%"
        except:
            pass

    try:
        net_income_val = income[0].get("netIncome")
        market_cap_val = profile.get("marketCap")

        if net_income_val and market_cap_val:
            earnings_yield = f"{(net_income_val / market_cap_val)*100:.2f}%"
    except:
        pass

    try:
        employees = profile.get("fullTimeEmployees")
        revenue_val = income[0].get("revenue")

        if employees and revenue_val:
            rev_per_employee = format_number(revenue_val / employees)
    except:
        pass

    try:
        revenue_val = income[0].get("revenue")
        market_cap_val = profile.get("marketCap")

        if revenue_val and market_cap_val:
            mc_to_revenue = f"{market_cap_val / revenue_val:.2f}"
    except:
        pass

    # 🔥 Insight Engine
    insight_lines = []
    score = 0

    try:
        if revenue_growth != "N/A":
            growth = float(revenue_growth.replace("%", ""))

            if growth > 15:
                insight_lines.append("Strong revenue growth indicates high demand.")
                score += 2
            elif growth > 5:
                insight_lines.append("Moderate revenue growth suggests stable performance.")
                score += 1
            else:
                insight_lines.append("Low revenue growth may indicate slowing demand.")

        if profit_growth != "N/A":
            pg = float(profit_growth.replace("%", ""))

            if pg > 10:
                insight_lines.append("Profit growth is healthy, improving profitability.")
                score += 2
            elif pg > 0:
                insight_lines.append("Profit growth is positive but limited.")
                score += 1
            else:
                insight_lines.append("Declining profits may be a concern.")

        if net_margin != "N/A":
            nm = float(net_margin.replace("%", ""))

            if nm > 20:
                insight_lines.append("High margins indicate strong operational efficiency.")
                score += 2
            elif nm > 10:
                insight_lines.append("Moderate margins suggest decent efficiency.")
                score += 1
            else:
                insight_lines.append("Low margins indicate tight profitability.")

        if pe_ratio != "N/A":
            pe = float(pe_ratio)

            if pe > 40:
                insight_lines.append("High P/E suggests the stock may be overvalued.")
                score -= 1
            elif pe < 20:
                insight_lines.append("Low P/E may indicate undervaluation.")
                score += 1

    except:
        pass

    # Final Recommendation
    if score >= 4:
        recommendation = "Overall Outlook: Positive (Good investment potential)"
    elif score >= 2:
        recommendation = "Overall Outlook: Moderately Positive"
    elif score >= 0:
        recommendation = "Overall Outlook: Neutral"
    else:
        recommendation = "Overall Outlook: Cautious / Risky"

    # 📝 Markdown Output
    markdown = f"""
# Earnings Briefing: {company} ({symbol})

## Snapshot
- Sector: {sector}
- Price: {price}
- Market Cap: {market_cap}

## Financials
- Revenue: {revenue}
- Net Income: {net_income}
- Revenue Growth: {revenue_growth}
- Profit Growth: {profit_growth}

## Key Metrics
- P/E Ratio (Computed): {pe_ratio}
- Net Margin: {net_margin}
- Earnings Yield: {earnings_yield}
- Revenue per Employee: {rev_per_employee}
- Market Cap / Revenue: {mc_to_revenue}

## Investment Insight
{" ".join(insight_lines)}

- {recommendation}
"""

    return markdown