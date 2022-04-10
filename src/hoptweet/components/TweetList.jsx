import React from 'react';
import TweetCard from './TweetCard';

const TweetList = (props) => {
  const { tweets, loading, remove } = props;
  console.log(tweets);
  if (loading) {
    return <div className="p-8 text-gray-500 text-center">Loading...</div>;
  }

  return (
    <div className="divide-y" style={{ minHeight: '500px' }}>
      {tweets.map((tweet) => (
        <TweetCard remove={remove} key={tweet.key} tweet={tweet}></TweetCard>
      ))}
    </div>
  );
};

export default TweetList;
