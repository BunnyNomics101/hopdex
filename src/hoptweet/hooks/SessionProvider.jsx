import React from 'react';
import { createContext } from 'react';

export const SessionContext = createContext();

export function SessionProvider(props) {
  const defaultSessions = [
    {
      type: 'home',
    },
  ];
  const [sessions, setSessions] = React.useState(defaultSessions);

  const goBack = () => {
    if (sessions.length > 1) {
      const newSessions = [...sessions];
      newSessions.pop();
      setSessions(newSessions);
    }
  };

  const addSession = (session) => {
    const newSessions = [...sessions];
    newSessions.push(session);
    setSessions(newSessions);
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        goBack,
        addSession,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
}
