import React from 'react';
import styled from 'styled-components';

const SidebarItemContainer = styled.div`
  width: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const SidebarIcon = styled.div`
  margin-right: 10px;
`;

const SidebarLabel = styled.div`
  font-size: 16px;
`;

const SidebarItem = ({ icon, label }) => {
  return (
    <SidebarItemContainer>
      <SidebarIcon>{icon}</SidebarIcon>
      <SidebarLabel>{label}</SidebarLabel>
    </SidebarItemContainer>
  );
};

export default SidebarItem;
