import React, { useState } from 'react';
import { Layout, Row, Col, Alert } from 'antd';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { CompanyCard } from '../components/CompanyCard';
import { PredictionChart } from '../components/PredictionChart';
import { ModelExplanation } from '../components/ModelExplanation';
import { FinancialsTable } from '../components/FinancialsTable';
import { InsightsView } from '../components/InsightsView';
import { AggregateChart } from '../components/AggregateChart';
import { useStockData } from '../hooks/useStockData';

const { Content } = Layout;

export const Dashboard = () => {
  const { symbol, companyInfo, predictions, loading, error, fetchStockData } = useStockData();
  const [activeTab, setActiveTab] = useState('1');

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Layout style={{ background: 'transparent' }}>
        <Header onSearch={fetchStockData} isSearching={loading} />
        
        <Content style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          {error && (
            <Alert 
              message="Data Sync Error" 
              description={error} 
              type="error" 
              showIcon 
              style={{ marginBottom: 24, borderRadius: 12, border: 'none', boxShadow: 'var(--shadow)', background: 'var(--card-bg)' }} 
            />
          )}

          {activeTab === '1' && (
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8} style={{ display: 'flex', flexDirection: 'column' }}>
                <CompanyCard companyInfo={companyInfo} predictions={predictions} loading={loading} />
                <ModelExplanation />
              </Col>
              
              <Col xs={24} lg={16}>
                <PredictionChart predictions={predictions} loading={loading} />
              </Col>
            </Row>
          )}
          {activeTab === '2' && (
            <FinancialsTable predictions={predictions} loading={loading} />
          )}

          {activeTab === '3' && (
            <InsightsView predictions={predictions} companyInfo={companyInfo} loading={loading} />
          )}
          {activeTab === '4' && (
            <AggregateChart predictions={predictions} loading={loading} />
          )}

        </Content>
      </Layout>
    </Layout>
  );
};
