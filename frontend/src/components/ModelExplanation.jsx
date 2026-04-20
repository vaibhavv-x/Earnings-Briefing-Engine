import React from 'react';
import { Typography } from 'antd';
import { Activity } from 'lucide-react';

const { Paragraph } = Typography;

export const ModelExplanation = () => {
  return (
    <div className="premium-card animate-fade-in" style={{ marginTop: 24 }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Activity size={20} color="var(--accent-color)" />
        Model Overview
      </h3>
      <Paragraph style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
        The Earnings Briefing engine forecasts fundamental quarterly performance (Revenue, Profit, EPS) utilizing rigorous time-series algorithms that weigh historical momentum.
      </Paragraph>
      <Paragraph style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: 0 }}>
        By isolating trailing four-quarter moving averages and adjusting for inherent seasonality and sector volatility, our model provides reliable near-term financial trajectories. This allows investors to analyze growth fundamentals and align long-term strategies.
      </Paragraph>
    </div>
  );
};
