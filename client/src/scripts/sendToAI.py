import pandas as pd
import json

df = pd.read_csv("data/raw/tmobile_tweets.csv")
dataset = []

for _, row in df.iterrows():
    dataset.append({
        "text": row["text"],
        "location": row["location"] or "Unknown",
        "likes": row["likes"],
        "retweets": row["retweets"],
        "sentiment": "unlabeled",
        "category": "unlabeled"
    })

with open("data/processed/tmobile_train.json", "w") as f:
    json.dump(dataset, f, indent=2)

print("Send to fine-tuning")
