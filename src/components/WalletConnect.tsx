import React from 'react';
import { Button } from 'antd';
import { useWallet } from '../utils/wallet';
import styled from "styled-components";

const StyledButton = styled(Button)`
  width: 150px; height: 40px;
  @media(max-width: 450px){
    width: 120px;
  }
`

export default function WalletConnect() {
  const { 
    connected, 
    // wallet, 
    // select, 
    connect, 
    disconnect 
  } = useWallet();
  // const publicKey = (connected && wallet?.publicKey?.toBase58()) || '';

  // const menu = (
  //   <Menu>
  //     {connected && <LinkAddress shorten={true} address={publicKey} />}
  //     <Menu.Item key="3" onClick={select}>
  //       Change Wallet
  //     </Menu.Item>
  //   </Menu>
  // );

  return (
    <StyledButton onClick={connected ? disconnect : connect} style={{
      
    }}>
      {connected ? 'Disconnect' : 'Connect'}
    </StyledButton>
  );
}
