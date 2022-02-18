import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { fetchTweets } from '../api/fetch-tweets';
import Sidebar from '../components/Sidebar';
import TweetForm from '../components/TweetForm';
import TweetList from '../components/TweetList';
import { WorkspaceContext } from '../hooks/WorkspaceProvider';

export const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const addTweet = (tweet) => setTweets([...tweets, tweet]);
  const removeTweet = (tweet) =>
    setTweets(tweets.filter((t) => t.timestamp !== tweet.timestamp));
  const workspace = useContext(WorkspaceContext);

  useEffect(() => {
    fetchTweets(workspace)
      .then((fetchedTweets) => setTweets(fetchedTweets))
      .finally(() => setLoading(false));
  }, [workspace]);

  return (
    <div>
      <TweetForm added={addTweet}></TweetForm>
      <TweetList
        remove={removeTweet}
        tweets={tweets}
        loading={loading}
      ></TweetList>
    </div>
  );
};
