import React from 'react';
import { Skeleton, Row, Col } from 'antd';
import { Building, Tag, DollarSign } from 'lucide-react';

export const CompanyCard = ({ companyInfo, predictions, loading }) => {
  const renderBadge = (rec) => {
      let color = 'var(--text-secondary)';
      let bg = 'rgba(0,0,0,0.05)';
      
      if (rec === "Strong Buy") { color = '#05CD99'; bg = 'rgba(5, 205, 153, 0.15)'; }
      else if (rec === "Buy") { color = '#05CD99'; bg = 'rgba(5, 205, 153, 0.05)'; }
      else if (rec === "Hold") { color = '#FFB547'; bg = 'rgba(255, 181, 71, 0.1)'; }
      else if (rec === "Sell") { color = '#EE5D50'; bg = 'rgba(238, 93, 80, 0.05)'; }
      else if (rec === "Strong Sell") { color = '#EE5D50'; bg = 'rgba(238, 93, 80, 0.15)'; }

      return (
          <span style={{ 
              color, 
              background: bg,
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '15px',
              fontWeight: 800,
              border: `1px solid ${color}40`,
              display: 'inline-block',
              letterSpacing: '0.5px'
          }}>
              {rec}
          </span>
      );
  };

  return (
    <div className="premium-card animate-fade-in">
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600 }}>Company Overview</h3>
      
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : companyInfo ? (
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: 10, borderRadius: 12, background: 'rgba(67, 24, 255, 0.1)', color: 'var(--accent-color)' }}>
                <Building size={24} />
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13 }}>Name</p>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>{companyInfo.company}</div>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: 10, borderRadius: 12, background: 'rgba(67, 24, 255, 0.1)', color: 'var(--accent-color)' }}>
                <Tag size={20} />
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13 }}>Industry</p>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)' }}>{companyInfo.industry}</div>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: 10, borderRadius: 12, background: 'rgba(5, 205, 153, 0.1)', color: '#05CD99' }}>
                <DollarSign size={20} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13 }}>Market Cap</p>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)' }}>{companyInfo.market_cap}</div>
              </div>
            </div>
          </Col>
          
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', marginTop: 4 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Consensus</span>
                {renderBadge(predictions?.recommendation || 'Pending')}
            </div>
          </Col>
        </Row>
      ) : (
        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>
          No data available. Please search a ticker.
        </div>
      )}
    </div>
  );
};
