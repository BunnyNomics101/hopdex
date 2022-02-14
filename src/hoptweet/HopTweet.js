import React from 'react';
import {
  getPhantomWallet,
  getSolflareWallet,
} from '@solana/wallet-adapter-wallets';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WorkspaceProvider } from './hooks/WorkspaceProvider';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

// Day.js
import dayjs from 'dayjs';
import { MainLayout } from './components/MainLayout';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

function HopTweet() {
  const wallets = [getPhantomWallet(), getSolflareWallet()];

  return (
    // <Router>
    <WalletProvider wallets={wallets} autoConnect={true}>
      <WorkspaceProvider>
        {/* <div className="w-full max-w-3xl lg:max-w-4xl mx-auto">
            <div className="fixed w-20 md:w-64 py-4 md:py-8 md:pl-4 md:pr-8">
              <Sidebar />
            </div> */}
        <main>
          <MainLayout />
        </main>
        {/* </div> */}
      </WorkspaceProvider>
    </WalletProvider>
    // </Router>
  );
}

export default HopTweet;
