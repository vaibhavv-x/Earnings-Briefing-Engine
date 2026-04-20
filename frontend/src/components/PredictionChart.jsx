import React, { useState } from 'react';
import { Skeleton, Select } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';

export const PredictionChart = ({ predictions, loading }) => {
  const [metric, setMetric] = useState('Revenue');

  if (loading) {
    return (
      <div className="premium-card animate-fade-in" style={{ height: '100%', minHeight: 400 }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600 }}>Quarterly Earnings Forecast</h3>
        <Skeleton.Node active style={{ width: '100%', height: 300, borderRadius: 16 }} />
      </div>
    );
  }

  if (!predictions || !predictions.metrics || !predictions.metrics.Revenue) {
    return (
      <div className="premium-card animate-fade-in" style={{ height: '100%', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>No prediction data available.</div>
      </div>
    );
  }

  const metricData = predictions.metrics[metric];
  const historical = metricData.historical;
  const forecast = metricData.forecast;

  if (!historical || historical.length === 0) {
    return (
      <div className="premium-card animate-fade-in" style={{ height: '100%', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Insufficient trading history or invalid ticker to compute forecasting metrics.</div>
      </div>
    );
  }

  const combinedData = [...historical, ...forecast].map((item, index) => {
    return {
      period: item.period,
      historicalValue: index < historical.length ? item.value : (index === historical.length ? item.value : null),
      forecastValue: index >= historical.length - 1 ? item.value : null 
    };
  });

  const forecastVals = forecast.map(d => d.value);
  const minVal = Math.min(...forecastVals);
  const maxVal = Math.max(...forecastVals);
  const avgVal = forecastVals.reduce((a, b) => a + b, 0) / forecastVals.length;

  const startHist = historical[historical.length - 1].value;
  const endFore = forecast[forecast.length - 1].value;
  const isUp = endFore >= startHist;
  const growthPercent = (((endFore - startHist) / startHist) * 100).toFixed(1);
  const trendColor = isUp ? "#05CD99" : "#EE5D50";

  return (
    <div className="premium-card animate-fade-in" style={{ height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Quarterly Earnings Forecast</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Based on last 8 quarters financial data</div>
            </div>
            <Select 
              value={metric} 
              onChange={setMetric} 
              options={[
                { value: 'Revenue', label: 'Revenue' },
                { value: 'Profit', label: 'Profit' },
                { value: 'EBITDA', label: 'EBITDA' },
                { value: 'FCF', label: 'Free Cash Flow' },
                { value: 'Operating Margin', label: 'Operating Margin' },
                { value: 'EPS', label: 'Basic EPS' },
                { value: 'PE Ratio', label: 'P/E Ratio' }
              ]}
              style={{ width: 140, filter: 'drop-shadow(var(--shadow))' }}
              dropdownStyle={{ background: 'var(--card-bg)', color: 'var(--text-main)' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: trendColor, fontWeight: 600 }}>
            {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{isUp ? 'Upward Trend' : 'Downward Trend'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, textAlign: 'right' }}>
           <div>
             <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Min Forecast</div>
             <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-main)' }}>{metric === 'EPS' ? '' : '$'}{minVal.toFixed(2)}{metric === 'EPS' ? '' : 'B'}</div>
           </div>
           <div>
             <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Avg Forecast</div>
             <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-main)' }}>{metric === 'EPS' ? '' : '$'}{avgVal.toFixed(2)}{metric === 'EPS' ? '' : 'B'}</div>
           </div>
           <div>
             <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Max Forecast</div>
             <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-main)' }}>{metric === 'EPS' ? '' : '$'}{maxVal.toFixed(2)}{metric === 'EPS' ? '' : 'B'}</div>
           </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 280, marginTop: 10, flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderRadius: 12, color: 'var(--text-main)' }} 
              itemStyle={{ color: 'var(--text-main)', fontWeight: 600 }} 
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              content={(props) => {
                const { payload } = props;
                return (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 24, fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {payload.slice().reverse().map((entry, index) => {
                      const isHollow = entry.value === "Forecast";
                      return (
                        <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            display: 'inline-block',
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: isHollow ? 'var(--card-bg)' : entry.color,
                            border: `2px solid ${entry.color}`
                          }}></span>
                          {entry.value}
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            <Line type="monotone" name="Historical" dataKey="historicalValue" stroke={trendColor} strokeWidth={3} dot={{r: 4, strokeWidth: 0, fill: trendColor }} activeDot={{r: 6}} />
            <Line 
              type="monotone" 
              name="Forecast" 
              dataKey="forecastValue" 
              stroke={trendColor} 
              strokeWidth={3} 
              strokeDasharray="5 5" 
              dot={(props) => {
                  if (props.cx === undefined || props.cy === undefined) return null;
                  return <circle key={`dot-${props.key || props.index}`} cx={props.cx} cy={props.cy} r={4} stroke={trendColor} strokeWidth={2.5} style={{ fill: 'var(--card-bg)' }} />;
              }} 
              activeDot={{r: 6}}
            />
            <ReferenceLine x={historical[historical.length - 1].period} stroke="var(--text-secondary)" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'right', marginTop: '4px' }}>
        Data Source: Financial Modeling Prep API
      </div>

      <div style={{ 
        marginTop: '24px', 
        padding: '16px', 
        borderRadius: '12px', 
        background: 'rgba(67, 24, 255, 0.05)', 
        border: '1px solid rgba(67, 24, 255, 0.1)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <div style={{ color: 'var(--accent-color)', marginTop: 2 }}>
            <Lightbulb size={20} />
        </div>
        <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>AI Insight ({metric})</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {metric} is projected to {isUp ? 'grow' : 'contract'} by {Math.abs(growthPercent)}% over the next 4 quarters. 
                {isUp ? ' This indicates strong financial momentum and structural resilience in near-term performance.' : ' This signals potential headwinds and structural easing over the forecasted duration.'}
            </div>
        </div>
      </div>
    </div>
  );
};
