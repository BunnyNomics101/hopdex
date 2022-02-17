import React from 'react';
import { Button } from 'antd';
import { useWallet } from '../utils/wallet';


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
    <Button onClick={connected ? disconnect : connect} style={{
      width: '150px', height: '40px'
    }}>
      {connected ? 'Disconnect' : 'Connect'}
    </Button>
  );
}
