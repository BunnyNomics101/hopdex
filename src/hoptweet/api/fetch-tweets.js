import bs58 from 'bs58';
import { Tweet } from '../models/Tweet';

export const fetchTweets = async ({ program }, filters = []) => {
  const tweets = await program.account.tweet.all(filters);
  console.log(program.account.tweet);

  const toReturn = [];

  for (let i = 0; i < Math.min(tweets.length, 10); i++) {
    toReturn.push(new Tweet(tweets[i].publicKey, tweets[i].account));
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
