import React from 'react';
import { Layout, Menu } from 'antd';
import { LineChart, LayoutDashboard, Lightbulb } from 'lucide-react';

const { Sider } = Layout;

export const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <Sider width={260} breakpoint="lg" collapsedWidth="0" className="animate-fade-in" style={{ height: '100vh', position: 'sticky', top: 0, overflow: 'auto' }}>
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LineChart color="#fff" size={20} />
        </div>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
          Earnings Briefing
        </h2>
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[activeTab || '1']}
        onSelect={({ key }) => setActiveTab && setActiveTab(key)}
        style={{ marginTop: 20 }}
        items={[
          {
            key: '1',
            icon: <LayoutDashboard size={18} />,
            label: 'Dashboard',
            style: { fontWeight: 500, margin: '8px 16px', borderRadius: '12px' }
          },
          {
            key: '2',
            icon: <LineChart size={18} />,
            label: 'Financials',
            style: { fontWeight: 500, margin: '8px 16px', borderRadius: '12px' }
          },
          {
            key: '3',
            icon: <Lightbulb size={18} />,
            label: 'Insights',
            style: { fontWeight: 500, margin: '8px 16px', borderRadius: '12px' }
          },
          {
            key: '4',
            icon: <LayoutDashboard size={18} />, // Reusing icon or better use Layers (need to import)
            label: 'Aggregate View',
            style: { fontWeight: 500, margin: '8px 16px', borderRadius: '12px' }
          },
        ]}
      />
    </Sider>
  );
};
