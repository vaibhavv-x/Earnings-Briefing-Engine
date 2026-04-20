import React from 'react';
import { Card, Result, Typography, Divider } from 'antd';
import { Lightbulb, TrendingUp, TrendingDown, Target } from 'lucide-react';

const { Paragraph, Title, Text } = Typography;

export const InsightsView = ({ predictions, companyInfo, loading }) => {
  if (loading) {
    return <div className="premium-card animate-fade-in" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Insight Data...</div>;
  }

  if (!predictions || !predictions.metrics || !predictions.metrics.Revenue.historical || predictions.metrics.Revenue.historical.length === 0) {
    return <div className="premium-card animate-fade-in" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Insufficient historical data to conduct Machine Learning assessments.</div>;
  }

  const generateGrowth = (metricData) => {
      const hist = metricData.historical;
      const fore = metricData.forecast;
      const start = hist[hist.length - 1]?.value || 0;
      const end = fore[fore.length - 1]?.value || 0;
      const perc = start !== 0 ? (((end - start) / start) * 100).toFixed(1) : 0;
      return { start, end, perc, isUp: end >= start };
  };

  const rev = generateGrowth(predictions.metrics.Revenue);
  const prof = generateGrowth(predictions.metrics.Profit);
  const eps = generateGrowth(predictions.metrics.EPS);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="premium-card">
            <Title level={3} style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Lightbulb color="#05CD99" /> Applied Data Science Assessment
            </Title>
            <Paragraph style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
                Based on the predictive linear regression algorithms applied to {companyInfo?.company || 'the queried company'}, the model has generated a forward-looking trajectory mapping out the following four quarters.
            </Paragraph>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div className="premium-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                    {rev.isUp ? <TrendingUp color="#05CD99" /> : <TrendingDown color="#EE5D50" />}
                    <Title level={4} style={{ margin: 0 }}>Revenue Projection</Title>
                </div>
                <Paragraph style={{ color: 'var(--text-secondary)' }}>The model anticipates a core trajectory of <Text strong type={rev.isUp ? 'success' : 'danger'}>{Math.abs(rev.perc)}% {rev.isUp ? "growth" : "contraction"}</Text> across the next fiscal year.</Paragraph>
                <div style={{ background: 'var(--bg-color)', padding: 12, borderRadius: 8, color: 'var(--text-secondary)' }}>
                    Forward target: <Text strong style={{ color: 'var(--text-main)' }}>${rev.end} Billion</Text>
                </div>
            </div>

            <div className="premium-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                    {prof.isUp ? <TrendingUp color="#05CD99" /> : <TrendingDown color="#EE5D50" />}
                    <Title level={4} style={{ margin: 0 }}>Net Income Output</Title>
                </div>
                <Paragraph style={{ color: 'var(--text-secondary)' }}>Translating gross margins directly, Net Profit is modeled to {prof.isUp ? 'expand' : 'decay'} by <Text strong type={prof.isUp ? 'success' : 'danger'}>{Math.abs(prof.perc)}%</Text>.</Paragraph>
                <div style={{ background: 'var(--bg-color)', padding: 12, borderRadius: 8, color: 'var(--text-secondary)' }}>
                    Forward target: <Text strong style={{ color: 'var(--text-main)' }}>${prof.end} Billion</Text>
                </div>
            </div>

            <div className="premium-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                    <Target color="var(--accent-color)" />
                    <Title level={4} style={{ margin: 0 }}>EPS Outlook</Title>
                </div>
                <Paragraph style={{ color: 'var(--text-secondary)' }}>Shareholder value per slice is estimated to map a <Text strong>{Math.abs(eps.perc)}%</Text> relative {eps.isUp ? "appreciation" : "depreciation"} margin.</Paragraph>
                <div style={{ background: 'var(--bg-color)', padding: 12, borderRadius: 8, color: 'var(--text-secondary)' }}>
                    Forward target: <Text strong style={{ color: 'var(--text-main)' }}>${eps.end}</Text>
                </div>
            </div>
        </div>
    </div>
  );
};
