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
    "Insane coverage even in the middle of nowhere, respect.",
    "Download speeds just hit 700mbps... T-Mobile cooking fr.",
    "I don't tweet much but T-Mobile deserves the praise, this service is crazy good.",
    "Finally a carrier that actually improves instead of getting worse over time 🙌",
    "Shoutout to the T-Mobile tech who fixed my network in legit 3 minutes. Legend.",
    "My phone service used to stress me out… now it just works. Thank you TMobile.",
    "Went on a road trip through 3 states and never lost reception once. Impressive.",
    "The 5G UC icon might be the most beautiful thing I've ever seen on my phone.",
    "Why is T-Mobile faster in the woods than my home WiFi 😭",
    "Officially a T-Mobile fan account now, idc.",
    "Can we talk about how fast T-Mobile improved? Night and day difference.",
    "No dropped calls, no buffering, no drama. Just service. Finally.",
    "Had an issue, tweeted at support, got a fix in minutes. 10/10 experience.",
    "I just said 'wow' out loud at a speed test result. TMobile exceeding expectations.",
    "My bill went down and my speeds went up… what kind of magic is this?",
    "I livestreamed an entire concert on T-Mobile data, not a single lag spike.",
    "Switching to T-Mobile might be my smartest adult decision so far.",
    "Coverage? ✅ Speed? ✅ Price? ✅ Customer care? ✅ We love balance.",
    "T-Mobile really said 'let’s actually take care of our customers' and meant it.",
    "From signal dead zones to 5G everywhere… the glow up is real.",
    "The real test was live streaming on the highway. T-Mobile passed with flying colors.",
    "Airport WiFi is officially useless to me now. T-Mobile is faster.",
    "I fear I'm becoming a T-Mobile evangelist because wow, this is GOOD good.",
    "T-Mobile understood the assignment and did the extra credit.",
    "Hotspot carried my entire work day with zero issues. Zero.",
    "Customer support being kind AND helpful? We love to see it.",
    "Not to be dramatic but T-Mobile 5G kind of changed my life.",
    "Switched my family plan and everyone noticed the difference instantly.",
    "I used to ration data… now I stream in 4K on cellular like a menace.",
    "T-Mobile in my city is unbeatable right now, others gotta catch up.",
    "My data loading faster than my brain at this point.",
    "Had doubts before switching, now I'm wondering why I waited so long.",
    "T-Mobile fixing problems I didn’t even know I had.",
    "Service so good I thought I was on WiFi 😭",
    "T-Mobile deserves credit where it’s due — network game STRONG.",
    "Finally watching YouTube without 4 buffering pauses per minute.",
    "I can make calls in places I didn't even know were *allowed* to have signal.",
    "The future is 5G and T-Mobile brought it early.",
    "T-Mobile store employee walked me through everything, elite customer care.",
    "Never thought I’d say this but… my mobile carrier makes me happy???",
    "Switch was seamless, pricing fair, service elite. Big win.",
    "There’s fast, and then there’s T-Mobile 5G fast.",
    "Watching TikToks instantly load is my new personality trait.",
    "Left another carrier and immediately leveled up. No regrets.",
    "T-Mobile service in rural areas is actually insane, major props.",
    "I can call my mom without robot voice cutting in, praise!",
    "Big 'paid less, got more' energy from T-Mobile and I love that for me.",
    "Data so good I forgot WiFi passwords even exist.",
    "T-Mobile support answered faster than my friends do.",
    "5G so strong it should pay rent on my phone."
]


negative = [
    "5G shouldn’t be this slow in 2025… what is happening T-Mobile?",
    "At this point my phone signal is more imaginary than real.",
    "Buffering a 10 second video shouldn’t take 2 minutes 😐",
    "I have full bars but nothing loads… make it make sense T-Mobile.",
    "Support transfer #6 and I still have no answers.",
    "T-Mobile telling me to restart my phone like I didn't try that 12 times already.",
    "If disappointment had a mascot it would be my signal strength right now.",
    "I miss when dropping calls was rare, not a lifestyle.",
    "T-Mobile why my 5G acting like 2G with confidence?",
    "This network is playing hide and seek and I’m losing.",
    "I’m starting to think I pay my bill out of charity at this point.",
    "My connection speed is basically Morse code.",
    "Outages more common than my sleep schedule.",
    "Streaming on T-Mobile data is a game of chance.",
    "One day I’ll have stable internet. Today is not that day.",
    "Can we normalize functioning cell towers please?",
    "My data plans have trust issues after this week.",
    "5 bars, 0 function. A tragic story in 4 words.",
    "At this point carrier pigeons send data faster.",
    "The lack of coverage is personal now.",
    "I refreshed Twitter 10 times just to post this complaint 😭",
    "Nothing humbles you like trying to load Google Maps and getting dial-up flashbacks.",
    "Dropped calls build character, apparently.",
    "Customer service hold music is the only reliable thing about my network.",
    "My signal got stage fright and never showed up.",
    "T-Mobile went from 5G to 'why me?' real quick.",
    "My phone has hope, but the network doesn't.",
    "If loading screens were a personality trait.",
    "Coverage said ‘not today bestie.’",
    "T-Mobile really testing my emotional resilience.",
    "Packet loss is my new cardio.",
    "My network speed is in creative mode, not survival mode.",
    "Data transferring slower than generational trauma.",
    "The buffering circle is my sleep paralysis demon.",
    "I pay for 5G but receive thoughts and prayers instead.",
    "My network speed built like a school group project.",
    "Connectivity on a spiritual level only.",
    "Speed test more disappointing than my screen time reports.",
    "I have 5 bars but they’re decorative apparently.",
    "T-Mobile loading slower than movie theater nachos.",
    "Network so unstable it's giving dramatic plot twists.",
    "Call drops more frequent than my motivation.",
    "Data speeds slower than plot development in a Netflix filler episode.",
    "Customer support giving me side quest energy.",
    "If slow internet was a sport I’d be undefeated.",
    "At this point my signal needs therapy.",
    "T-Mobile data refusing to participate in society.",
    "I don’t need 5G Ultra, I need 5G that works.",
    "Loading icon gonna be on my tombstone at this rate.",
    "Not sure if it's congestion or emotional damage at this point."
    "Why won't your network stay connected? And why can I roam on the super strong ATT network while your network is down?  I'm pretty sure I was promised unlimited domestic roaming when I signed up."
]


neutral = [
    "Thinking about upgrading but still comparing plans.",
    "T-Mobile bill just hit, looks normal.",
    "Coverage map says 5G here but I’ll test later.",
    "Got a T-Mobile notification, reading it later.",
    "Wondering if roaming is still free internationally.",
    "Might switch plans, still deciding.",
    "T-Mobile or WiFi calling today? Undecided.",
    "New phone, same carrier. Life moves on.",
    "Looking at my data usage like ‘interesting.’",
    "Curious how the new plans compare this year.",
    "Waiting for a reason to upgrade honestly.",
    "Phone works. Bill paid. No drama. Nice.",
    "Monthly payment ✅ Service exists ✅ That’s all I check.",
    "No complaints, no praise, just vibes.",
    "T-Mobile behaving today, appreciate that.",
    "Considering the Magenta plan but still thinking.",
    "Data usage lower than expected this month.",
    "Bill paid automatically, love that for me.",
    "Another month of phone service achieved.",
    "Coverage is coverage, nothing wild to report.",
    "No news is good news with phone service.",
    "Phone bill paid, life continues.",
    "Shoutout to auto-pay for doing the heavy lifting.",
    "T-Mobile app opened. I saw numbers. I moved on.",
    "Speed test later maybe, no urgency.",
    "Curious if 5G actually drains more battery.",
    "T-Mobile reminder text received, mentally noted.",
    "Not switching, not hyping. Just existing.",
    "Service is service. Carry on.",
    "Mentally compiling plan comparison charts.",
    "Considering international add-on for upcoming travel.",
    "Not judging, just observing coverage bars.",
    "Another autopay survived.",
    "Phone service functioning as intended today.",
    "Debating if 5G UC really matters.",
    "Might call support later, might not.",
    "No major updates from T-Mobile today.",
    "Average carrier experience so far.",
    "Considering family plan math."
]


FILE_PATH = "client/data/raw/tmobile_reviews_full.json"

seen_messages = set()

with open(FILE_PATH, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["date", "likeCount", "retweetCount", "replyCount", "source"])

    count = 0
    while count < NUM_TWEETS:
        total = 1
        positiveWeight = random.uniform(0,total)
        neutralWeight = random.uniform(0, total - positiveWeight)
        negativeWeight = total - (positiveWeight + neutralWeight)
        sentiment = random.choices(["pos", "neg", "neu"], weights=[positiveWeight, neutralWeight, negativeWeight])[0]
        text = random.choice(positive if sentiment == "pos" else negative if sentiment == "neg" else neutral)
        text = text.replace("T-Mobile", random.choice(keywords))
        text = f"{random.choice(mentions)} {text} {random.choice(hashtags)}".strip()

        if text.lower() in seen_messages:
            continue

        seen_messages.add(text.lower())

        date = random_date()
        likes = random.randint(0, 56345)
        rts = random.randint(0, 2452)
        replies = random.randint(0, 320)
        source = random.choice(sources)

        writer.writerow([date, text, likes, rts, replies, source])
        count += 1

print(f" Generated {count} UNIQUE tweets")
