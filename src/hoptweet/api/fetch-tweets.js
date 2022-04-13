import bs58 from 'bs58';
import { Tweet } from '../models/Tweet';

export const fetchTweets = async ({ program }, filters = []) => {
  const tweets = await program.account.tweet.all(filters);

  // sorting table
  let sorted = [];
  for (let i = 0; i < tweets.length; i++) {
    sorted.push(new Tweet(tweets[i].publicKey, tweets[i].account));
  }
  sorted = sorted.sort((a, b) => b.timestamp - a.timestamp);

  //puttin in tables of 3
  const toReturn = [];
  const oneSize = 3;
  let j = 0;
  for (let i = 0; i < tweets.length; i++) {
    // if j is null push a new table with the tweet
    if (j === 0) {
      toReturn.push([sorted[i]]);
    }
    //else push it inside last table
    else {
      toReturn[toReturn.length - 1].push(sorted[i]);
    }

    //increment j module oneSize
    j = (j + 1) % oneSize;
  }

  return toReturn;
  // return tweets.map((tweet) => new Tweet(tweet.publicKey, tweet.account));
};

export const authorFilter = (authorBase58PublicKey) => ({
  memcmp: {
    offset: 8, // Discriminator.
    bytes: authorBase58PublicKey,
  },
});

export const topicFilter = (topic) => ({
  memcmp: {
    offset:
      8 + // Discriminator.
      32 + // Author public key.
      8 + // Timestamp.
      4, // Topic string prefix.
    bytes: bs58.encode(Buffer.from(topic)),
  },
});
