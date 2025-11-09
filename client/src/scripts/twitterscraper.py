import random
import csv
from datetime import datetime, timedelta

# Settings
NUM_TWEETS = 1000
START_DATE = datetime(2015, 1, 1)
END_DATE = datetime.now()

def random_date():
    delta = END_DATE - START_DATE
    random_days = random.randint(0, delta.days)
    random_seconds = random.randint(0, 86400)
    d = START_DATE + timedelta(days=random_days, seconds=random_seconds)
    return d.strftime("%Y-%m-%d %H:%M:%S+00:00")

def random_user():
    return f"User{random.randint(1000, 999999)}"

def random_tweet_id():
    return random.randint(10**15, 10**16 - 1)

sources = ["Twitter for iPhone", "Twitter for Android", "Twitter Web App"]
mentions = ["@TMobile", "@TMobileHelp", "@TMobileBusiness", ""]
hashtags = ["#TMobile", "#T-Mobile", ""]
keywords = ["T-Mobile", "TMobile"]

positive = [
    "Honestly blown away by the 5G speeds today, feels unreal!",
    "T-Mobile came in clutch, best carrier experience I’ve ever had.",
    "Customer support actually solved my issue first try, rare W!",
    "Switched to TMobile and haven’t regretted it one bit.",
    "Insane coverage even in the middle of nowhere, respect."
]

negative = [
    "Network is down again, what’s happening TMobile?",
    "Absolutely unreal how bad the service is today.",
    "Been on support for 2 hours and still nothing resolved.",
    "Data acting crazy slow, this ain’t it.",
    "Thinking of switching carriers at this point."
]

neutral = [
    "Just checking my T-Mobile bill.",
    "TMobile coverage map looks interesting.",
    "Considering upgrading my T-Mobile plan soon.",
    "Got a TMobile notification, will check later.",
    "Another month, another T-Mobile auto payment."
]

FILE_PATH = "client/data/raw/generated_tweets.csv"

with open(FILE_PATH, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)

    writer.writerow(["date", "user", "tweet", "likeCount", "retweetCount", "replyCount", "quoteCount", "id", "lang", "source"])

    for _ in range(NUM_TWEETS):
        date = random_date()
        user = random_user()
        tweet_id = random_tweet_id()
        sentiment = random.choices(["pos", "neg", "neu"], weights=[0.3, 0.4, 0.3])[0]

        text = random.choice(positive if sentiment == "pos" else negative if sentiment == "neg" else neutral)
        text = text.replace("T-Mobile", random.choice(keywords))
        text = f"{random.choice(mentions)} {text} {random.choice(hashtags)}".strip()

        likes = random.randint(0, 56345)
        rts = random.randint(0, 2452)
        replies = random.randint(0, 320)
        quotes = random.randint(0, 120)
        lang = "en"
        source = random.choice(sources)

        writer.writerow([date, user, text, likes, rts, replies, quotes, tweet_id, lang, source])
