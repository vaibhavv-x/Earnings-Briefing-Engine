import React, { useState, useEffect } from 'react';
import { Skeleton, Select, Input, Button, Tag, notification } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { getPredictions } from '../services/api';
import { Search, X } from 'lucide-react';

const COLOR_PALETTE = ['#4318FF', '#05CD99', '#EE5D50', '#FFB547', '#00B5D8', '#9F7AEA', '#ED64A6', '#ECC94B', '#4299E1'];

export const AggregateChart = ({ predictions, loading }) => {
  const [metric, setMetric] = useState('Revenue');
  const [companyDataMap, setCompanyDataMap] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Auto-load the parent globally searched company into the Aggregate Benchmark map natively.
  useEffect(() => {
    if (predictions && predictions.symbol && predictions.metrics) {
      setCompanyDataMap(prev => ({
        ...prev,
        [predictions.symbol]: predictions.metrics
      }));
    }
  }, [predictions]);

  const handleAddCompany = async () => {
    const sym = searchValue.trim().toUpperCase();
    if (!sym) return;
    if (companyDataMap[sym]) {
      notification.info({ message: 'Ticker already mapped.', placement: 'topRight' });
      setSearchValue('');
      return;
    }
    
    setIsFetching(true);
    try {
      const data = await getPredictions(sym);
      if (data && data.metrics) {
        setCompanyDataMap(prev => ({ ...prev, [sym]: data.metrics }));
      } else {
        notification.error({ message: `Failed to synthesize metrics for ${sym}`, placement: 'bottomRight' });
      }
    } catch (err) {
      notification.error({ message: `API Error finding ${sym}`, placement: 'bottomRight' });
    } finally {
      setIsFetching(false);
      setSearchValue('');
    }
  };

  const removeCompany = (symToRemove) => {
    setCompanyDataMap(prev => {
        const clone = { ...prev };
        delete clone[symToRemove];
        return clone;
    });
  };

  const tickerList = Object.keys(companyDataMap);

  if (loading && tickerList.length === 0) {
    return (
      <div className="premium-card animate-fade-in" style={{ height: '100%', minHeight: 600 }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600 }}>Multi-Company Benchmark</h3>
        <Skeleton.Node active style={{ width: '100%', height: 450, borderRadius: 16 }} />
      </div>
    );
  }

  if (tickerList.length === 0) {
    return (
      <div className="premium-card animate-fade-in" style={{ height: '100%', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>No prediction data available. Please add a ticker.</div>
      </div>
    );
  }

  // Generate Master Timeline based on the first loaded company
  const baseCompany = tickerList[0];
  const baseMetrics = companyDataMap[baseCompany][metric];
  
  const revHist = baseMetrics ? baseMetrics.historical : [];
  const revFore = baseMetrics ? baseMetrics.forecast : [];
  
  if (!revHist || revHist.length === 0) {
    return (
      <div className="premium-card animate-fade-in" style={{ height: '100%', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Insufficient historical data footprint for Base Asset.</div>
      </div>
    );
  }

  const masterTimeline = [...revHist, ...revFore].map(item => item.period);

  const combinedData = masterTimeline.map((period) => {
      let dataPoint = { period };
      
      tickerList.forEach(sym => {
          const symMetrics = companyDataMap[sym][metric];
          if (symMetrics) {
             const hArr = symMetrics.historical;
             const fArr = symMetrics.forecast;
             
             const hItem = hArr.find(item => item.period === period);
             const fItem = fArr.find(item => item.period === period);
             
             if (hItem) {
                 dataPoint[`${sym}_Historical`] = hItem.value;
                 // If this is the absolute final historical marker for this specific competitor, plant the mathematical bridge coordinate!
                 if (hArr.length > 0 && hArr[hArr.length - 1].period === period) {
                     dataPoint[`${sym}_Forecast`] = hItem.value;
                 }
             } else if (fItem) {
                 dataPoint[`${sym}_Forecast`] = fItem.value;
             }
          }
      });
      return dataPoint;
  });

  return (
    <div className="premium-card animate-fade-in" style={{ height: '100%', minHeight: 600, display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 20 }}>
        <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Multi-Company Benchmark Aggregator</h3>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '16px' }}>
            Overlay cross-market machine learning projections against competitors dynamically.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {tickerList.map((sym, i) => (
                    <Tag 
                        key={sym} 
                        color={COLOR_PALETTE[i % COLOR_PALETTE.length]} 
                        closable 
                        onClose={() => removeCompany(sym)}
                        style={{ borderRadius: 12, padding: '4px 12px', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        {sym}
                    </Tag>
                ))}
            </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <Select 
                value={metric} 
                onChange={setMetric} 
                options={[
                { value: 'Revenue', label: 'Revenue' },
                { value: 'Profit', label: 'Profit' },
                { value: 'EBITDA', label: 'EBITDA' },
                { value: 'FCF', label: 'Free Cash Flow' },
                { value: 'Operating Margin', label: 'Operating Margin / Ratio' },
                { value: 'EPS', label: 'Basic EPS' },
                { value: 'PE Ratio', label: 'P/E Ratio' }
                ]}
                style={{ width: 140, filter: 'drop-shadow(var(--shadow))' }}
                dropdownStyle={{ background: 'var(--card-bg)', color: 'var(--text-main)' }}
            />
            <div style={{ display: 'flex', gap: 0 }}>
                <Input 
                    placeholder="Add Ticker..." 
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onPressEnter={handleAddCompany}
                    disabled={isFetching}
                    style={{ 
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        borderTopLeftRadius: 16,
                        borderBottomLeftRadius: 16,
                        width: 140,
                        background: 'transparent',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-main)'
                    }}
                />
                <Button 
                    type="primary"
                    onClick={handleAddCompany}
                    loading={isFetching}
                    icon={<Search size={14} />}
                    style={{ 
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderTopRightRadius: 16,
                        borderBottomRightRadius: 16,
                        background: 'var(--gradient-main)',
                        border: 'none',
                        boxShadow: 'none'
                    }}
                />
            </div>
        </div>
      </div>

      <div style={{ width: '100%', flex: 1, minHeight: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderRadius: 12, color: 'var(--text-main)' }} 
              itemStyle={{ color: 'var(--text-main)', fontWeight: 600 }} 
            />
            <ReferenceLine x={revHist[revHist.length - 1].period} stroke="var(--text-secondary)" strokeDasharray="3 3" />
            
            {tickerList.map((sym, i) => {
                const col = COLOR_PALETTE[i % COLOR_PALETTE.length];
                return (
                    <React.Fragment key={sym}>
                        {/* Historical Solid Line */}
                        <Line 
                            type="monotone" 
                            name={`${sym} (Hist)`} 
                            dataKey={`${sym}_Historical`} 
                            stroke={col} 
                            strokeWidth={3} 
                            dot={{r: 3, strokeWidth: 0, fill: col }} 
                            activeDot={{r: 5}} 
                            isAnimationActive={false}
                            connectNulls={true}
                        />
                        {/* Forecast Dashed Line */}
                        <Line 
                            type="monotone" 
                            name={`${sym} (Proj)`} 
                            dataKey={`${sym}_Forecast`} 
                            stroke={col} 
                            strokeWidth={3} 
                            strokeDasharray="5 5" 
                            dot={(props) => {
                                if (props.cx === undefined || props.cy === undefined) return null;
                                return <circle key={`dot-${props.key || props.index}`} cx={props.cx} cy={props.cy} r={4} stroke={col} strokeWidth={2.5} style={{ fill: 'var(--card-bg)' }} />;
                            }}
                            activeDot={{r: 6}}
                            isAnimationActive={false}
                            connectNulls={true}
                        />
                    </React.Fragment>
                )
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
