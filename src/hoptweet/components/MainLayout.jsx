import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SessionContext } from '../hooks/SessionProvider';
import { Home } from '../pages/Home';
import { PageNotFound } from '../pages/PageNotFound';
import { Profile } from '../pages/Profile';
import { Topics } from '../pages/Topics';
import { TweetPage } from '../pages/TweetPage';
import { Users } from '../pages/Users';

export function MainLayout() {
  //let location = useLocation();
  const { sessions } = useContext(SessionContext);
  const currentSession = sessions[sessions.length - 1];
  switch (currentSession.type) {
    case 'home':
      return <Home />;
    case 'topics':
      return <Topics session={currentSession} />;
    case 'users':
      return <Users session={currentSession} />;
    case 'tweet':
      return <TweetPage session={currentSession} />;
    case 'profile':
      return <Profile session={currentSession} />;

    default:
      return <Home />;
  }
  return (
    <>
      {/* <header className="flex space-x-6 items-center justify-between px-8 py-4 border-b">
        <div className="text-xl font-bold">{location.pathname}</div>
      </header> */}

      {/* <Routes>
        <Route path="" element={<Home />}></Route>
        <Route path="topics" element={<Topics />}>
          <Route path=":topicSlug" element={<Topics />}></Route>
        </Route>
        <Route path="profile" element={<Profile />}></Route>

        <Route path="users" element={<Users />}>
          <Route path=":authorSlug" element={<Users />}></Route>
        </Route>

        <Route path="tweet" element={<TweetPage />}>
          <Route path=":tweetSlug" element={<TweetPage />}></Route>
        </Route>
        <Route exact path="*" element={<PageNotFound />}></Route>
      </Routes> */}
    </>
  );
}
