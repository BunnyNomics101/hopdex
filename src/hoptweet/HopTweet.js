import React from 'react';
import { WorkspaceProvider } from './hooks/WorkspaceProvider';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

// Day.js
import dayjs from 'dayjs';
import { MainLayout } from './components/MainLayout';
import Sidebar from './components/Sidebar';
import { SessionProvider } from './hooks/SessionProvider';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

function HopTweet() {
  return (
    <WorkspaceProvider>
      <SessionProvider>
        {/* <div className="w-full max-w-3xl lg:max-w-4xl mx-auto">
            <div className="fixed w-20 md:w-64 py-4 md:py-8 md:pl-4 md:pr-8">
              <Sidebar />
            </div> */}
        <main>
          <Sidebar />
          <MainLayout />
        </main>
        {/* </div> */}
      </SessionProvider>
    </WorkspaceProvider>
  );
}

export default HopTweet;
