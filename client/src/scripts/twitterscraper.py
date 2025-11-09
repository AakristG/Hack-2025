import tweepy
import pandas as pd
import os
import time
from dotenv import load_dotenv
from tweepy.errors import TooManyRequests

load_dotenv()

client = tweepy.Client(
    bearer_token=os.getenv("X_BEARER_TOKEN"),
    consumer_key=os.getenv("X_API_KEY"),
    consumer_secret=os.getenv("X_KEY_SECRET"),
    access_token=os.getenv("X_ACCESS_TOKEN"),
    access_token_secret=os.getenv("X_ACCESS_SECRET"),
)

# Excludes arena results
query = '(TMobile OR "T-Mobile" OR #TMobile) -"Arena" -is:retweet lang:en'

os.makedirs("../../data/raw", exist_ok=True)
save_path = "../../data/raw/tmobile_tweets.csv"

def scrape_tweets():
    try:
        tweets = client.search_recent_tweets(
            query=query,
            max_results=100,
            tweet_fields=["created_at", "public_metrics"]
        )

        batch = []
        if tweets.data:
            for t in tweets.data:
                batch.append([
                    t.created_at,
                    t.text,
                    t.public_metrics["like_count"],
                    t.public_metrics["retweet_count"]
                ])

        df = pd.DataFrame(batch, columns=["date", "text", "likes", "retweets"])

        # Append instead of overwrite
        if os.path.exists(save_path):
            df.to_csv(save_path, mode="a", header=False, index=False)
        else:
            df.to_csv(save_path, index=False)

        print(f"✅ Added {len(df)} tweets!")

    except TooManyRequests:
        print("⏳ Rate limit hit — waiting 15 seconds...")
        time.sleep(15)
        scrape_tweets()

# Run 15 batches (≈1500 tweets)
for i in range(15):
    print(f"\n🔁 Batch {i+1}/15")
    scrape_tweets()
    time.sleep(12)
