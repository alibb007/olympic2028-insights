import React, { useState } from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  ConsoleSqlOutlined
} from '@ant-design/icons';
import { Button, Menu } from 'antd';

type MenuItem = Required<Menu['items'][number]>;

// Define sidebar menu items
const items: MenuItem[] = [
  { key: '1', icon: <PieChartOutlined />, label: 'Globe Dashboard' },
  { key: '2', icon: <DesktopOutlined />, label: 'Map Dashboard' },
  { key: '3', icon: <ConsoleSqlOutlined />, label: 'Facts' },
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: collapsed ? '80px' : '250px', height: '100vh', zIndex: 9999 }}>
      <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        style={{ fontSize: '20px' }} 
      />
    </div>
  );
};

export default App;
