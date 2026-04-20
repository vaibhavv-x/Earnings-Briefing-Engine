import React from 'react';
import { Table, Tag } from 'antd';

export const FinancialsTable = ({ predictions, loading }) => {
  if (loading) {
    return <div className="premium-card animate-fade-in" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Data...</div>;
  }

  if (!predictions || !predictions.metrics) {
    return <div className="premium-card animate-fade-in" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No financial data available.</div>;
  }

  const { Revenue, Profit, EPS, EBITDA, FCF, 'Operating Margin': OpMargin, 'PE Ratio': PERatio } = predictions.metrics;
  const dataMap = new Map();

  // Helper sequence to loop any metric dynamically
  const mapMetric = (metricNode, key, isForecast) => {
      if(!metricNode) return;
      const targetArr = isForecast ? metricNode.forecast : metricNode.historical;
      if(!targetArr) return;
      targetArr.forEach(item => {
          if (!dataMap.has(item.period)) {
              dataMap.set(item.period, { key: item.period, period: item.period, isForecast });
          }
          dataMap.get(item.period)[key] = item.value;
          dataMap.get(item.period).isForecast = dataMap.get(item.period).isForecast || isForecast;
      });
  };

  mapMetric(Revenue, 'revenue', false); mapMetric(Revenue, 'revenue', true);
  mapMetric(Profit, 'profit', false); mapMetric(Profit, 'profit', true);
  mapMetric(EPS, 'eps', false); mapMetric(EPS, 'eps', true);
  mapMetric(EBITDA, 'ebitda', false); mapMetric(EBITDA, 'ebitda', true);
  mapMetric(FCF, 'fcf', false); mapMetric(FCF, 'fcf', true);
  mapMetric(OpMargin, 'op_margin', false); mapMetric(OpMargin, 'op_margin', true);
  mapMetric(PERatio, 'pe_ratio', false); mapMetric(PERatio, 'pe_ratio', true);

  // Force sequential re-rendering loop timeline sorting
  const tableData = Array.from(dataMap.values()).sort((a,b) => a.period.localeCompare(b.period));

  const columns = [
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      render: (text, record) => (
        <span style={{ fontWeight: 600 }}>
          {text} {record.isForecast && <Tag color="blue" style={{ marginLeft: 8 }}>Forecast</Tag>}
        </span>
      ),
    },
    { title: 'Gross Revenue', dataIndex: 'revenue', key: 'revenue', render: val => `$${val?.toFixed(2) || '0.00'}B` },
    { title: 'EBITDA', dataIndex: 'ebitda', key: 'ebitda', render: val => `$${val?.toFixed(2) || '0.00'}B` },
    { title: 'Net Profit', dataIndex: 'profit', key: 'profit', render: val => `$${val?.toFixed(2) || '0.00'}B` },
    { title: 'Free Cash Flow', dataIndex: 'fcf', key: 'fcf', render: val => `$${val?.toFixed(2) || '0.00'}B` },
    { title: 'Operating Margin', dataIndex: 'op_margin', key: 'op_margin', render: val => `${val?.toFixed(1) || '0.0'}%` },
    { title: 'Basic EPS', dataIndex: 'eps', key: 'eps', render: val => `$${val?.toFixed(2) || '0.00'}` },
    { title: 'P/E Ratio', dataIndex: 'pe_ratio', key: 'pe_ratio', render: val => `${val?.toFixed(1) || '0.0'}x` },
  ];

  return (
    <div className="premium-card animate-fade-in">
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600 }}>Financial Tabulation Model</h3>
      <Table 
        dataSource={tableData} 
        columns={columns} 
        pagination={false}
        rowClassName={(record) => record.isForecast ? 'forecast-row' : ''}
      />
    </div>
  );
};
