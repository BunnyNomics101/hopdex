import React from 'react';
import { Dropdown, Menu } from 'antd';
import { useWallet } from '../utils/wallet';
import styled from "styled-components";
import LinkAddress from './LinkAddress';

const StyledDropdownButton = styled(Dropdown.Button)`
  width: 150px; height: 40px;
  align-items: stretch ;

  &>.ant-btn {
    height: 100%
  }
  &>.ant-btn:first-of-type {
    flex:1
  }
  @media(max-width: 450px){
    width: 120px;
  }
`

export default function WalletConnect() {
  const { 
    connected, 
    wallet, 
    select, 
    connect, 
    disconnect 
  } = useWallet();
  const publicKey = (connected && wallet?.publicKey?.toBase58()) || '';

  const menu = (
    <Menu>
      {connected && <LinkAddress shorten={true} address={publicKey} />}
      <Menu.Item key="3" onClick={select}>
        Change Wallet
      </Menu.Item>
    </Menu>
  );

  return (
    <StyledDropdownButton onClick={connected ? disconnect : connect} 
      overlay={menu}
    >
      {connected ? 'Disconnect' : 'Connect'}
    </StyledDropdownButton>
  );
}
