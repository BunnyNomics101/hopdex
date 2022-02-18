import React, { useContext } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { SessionContext } from '../hooks/SessionProvider';

const SideButton = ({ activeIcon, inactiveIcon, text, to }) => {
  const { sessions, addSession } = useContext(SessionContext);
  let isActive = false;
  const currentSession = sessions[sessions.length - 1];
  if (currentSession.type === to) {
    isActive = true;
  }

  return (
    <button onClick={() => addSession({ type: to })}>
      {isActive && (
        <div className="rounded-full hover:bg-gray-500 p-3 md:w-full inline-flex items-center space-x-4">
          {activeIcon}
          <div className="text-xl hidden md:block font-bold">{text}</div>
        </div>
      )}
      {!isActive && (
        <div className="rounded-full hover:bg-gray-500 p-3 md:w-full inline-flex items-center space-x-4">
          {inactiveIcon}
          <div className="text-xl hidden md:block">{text}</div>
        </div>
      )}
    </button>
  );
};

const Sidebar = () => {
  const { connected } = useWallet();
  const { goBack } = useContext(SessionContext);

  return (
    <div className="flex flex-row items-center md:items-stretch space-y-2 mb-2">
      <button
        onClick={() => {
          goBack();
        }}
        className="rounded-full hover:bg-gray-500 p-3 md:self-start items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 md:h-10 w-8 md:w-10 text-gray-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M19.231 9.231H2.627L10.542 1.312a0.769 0.769 0 0 0 0 -1.085 0.769 0.769 0 0 0 -1.085 0l-9.231 9.231a0.688 0.688 0 0 0 -0.096 0.119A0.458 0.458 0 0 0 0.096 9.615c0 0.027 -0.027 0.05 -0.038 0.077l-0.023 0.077a0.323 0.323 0 0 0 0 0.065 0.769 0.769 0 0 0 0 0.3 0.323 0.323 0 0 0 0 0.065l0.023 0.077c0 0.027 0.027 0.05 0.038 0.077a0.458 0.458 0 0 0 0.035 0.058 0.688 0.688 0 0 0 0.096 0.119l9.231 9.231a0.769 0.769 0 1 0 1.085 -1.085L2.627 10.769H19.231a0.769 0.769 0 0 0 0 -1.538Z" />{' '}
        </svg>
      </button>
      <SideButton
        to="home"
        activeIcon={
          <svg
            v-if="isActive"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-700"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        }
        inactiveIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        }
        text="Home"
      />

      <SideButton
        to="topics"
        activeIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-700"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        }
        inactiveIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
        }
        text="Topics"
      />

      <SideButton
        to="users"
        activeIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-700"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        }
        inactiveIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
        text="Users"
      />

      {/* Check if connected wallet. */}
      {connected && (
        <SideButton
          to="profile"
          activeIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          }
          inactiveIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
          text="Profile"
        />
      )}
    </div>
  );
};

export default Sidebar;
