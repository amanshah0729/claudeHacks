import anthropic
from dotenv import load_dotenv
import os

# Load environment variables from .env-local
load_dotenv(".env-local")

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1000,
    temperature=1,
    system="You are a helpful coding tutor that gives hint to people that are trying to learn how to code. You are going to be looking at the user's code. \
    You should break code down into easy to understand natural language, and give hints that leads the user (learner) to the correct solution.",
    messages=[{"role": "user", "content": [{"type": "text", "text": "hi"}]}],
)
print(message.content)
