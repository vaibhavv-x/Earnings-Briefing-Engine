import React, { useState } from 'react';
import { Layout, Input, Space, Button } from 'antd';
import { Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const { Header: AntHeader } = Layout;

export const Header = ({ onSearch, isSearching }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  return (
    <AntHeader style={{ 
      background: 'transparent', 
      padding: '16px 24px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      height: 'auto',
      lineHeight: 'normal'
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>
          Overview
        </h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
          Financial Analytics Engine
        </p>
      </div>

      <Space size="large">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Input 
            placeholder="Search Ticker (e.g. AAPL)" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<Search size={16} color="var(--text-secondary)" style={{ marginRight: 8 }} />}
            style={{ 
              borderRadius: '16px', 
              width: '240px',
              padding: '6px 14px',
              background: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow)'
            }}
          />
          <Button 
            type="primary" 
            shape="round" 
            onClick={handleSearch}
            loading={isSearching}
            style={{ 
                background: 'var(--gradient-main)', 
                border: 'none',
                height: '34px',
                padding: '0 20px',
                fontWeight: 500
            }}
          >
            Search
          </Button>
        </div>
        <ThemeToggle />
      </Space>
    </AntHeader>
  );
};
