import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { fetchTweets } from '../api/fetch-tweets';
// import Sidebar from '../components/Sidebar';
import TweetForm from '../components/TweetForm';
import TweetList from '../components/TweetList';
import { WorkspaceContext } from '../hooks/WorkspaceProvider';
import { Row } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  margin: 0 10px;
  padding: 5px 10px;
  &:hover {
    background-color: #2bbdd2;
  }
  &:disabled {
    color: grey;
    &:hover {
      background-color: transparent;
    }
  }
  &.current {
    background-color: #2bbdd2;
  }
`;

export const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [selectedPage, setSelectedPage] = useState(0);
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
        tweets={tweets[selectedPage]}
        loading={loading}
      ></TweetList>

      {/* page selector */}
      <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
        <StyledButton
          onClick={() => {
            setSelectedPage((prev) => (prev - 1) % tweets.length);
          }}
          disabled={selectedPage === 0}
        >
          <LeftOutlined></LeftOutlined>
          <span>Back</span>
        </StyledButton>
        <Row>
          {tweets.map((_, index) => (
            <StyledButton
              key={index}
              style={{
                width: '30px',
                height: '30px',
              }}
              className={selectedPage === index ? 'current' : ''}
              onClick={() => {
                setSelectedPage(index);
              }}
            >
              <span> {index} </span>
            </StyledButton>
          ))}
        </Row>
        <StyledButton
          onClick={() => {
            setSelectedPage((prev) => (prev + 1) % tweets.length);
          }}
          disabled={selectedPage === tweets.length - 1}
        >
          <span>Next</span>
          <RightOutlined></RightOutlined>
        </StyledButton>
      </Row>
    </div>
  );
};
