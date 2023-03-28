import os
import openai
import json
from dotenv import load_dotenv


load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')


class Thought:
    """
    A class representing a user-submitted negative thought as well as the
    AI-powered distortions and suggestions for reframing.
    """

    def __init__(self, thought):

        self.thought = thought

    def fetch_distortions(self):

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": os.getenv('SYSTEM_PROMPT')},
                {"role": "user",
                 "content": f"""Please list and briefly explain each of the
                         cognitive distortions you that you can find in this
                         thought: {self.thought}"""}
            ]
        )

        response_string = response['choices'][0]['message']['content']

        self.distortions = json.loads(response_string)

        return self.distortions

    def fetch_strategies(self):

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": os.getenv('SYSTEM_PROMPT')},
                {"role": "user",
                 "content": f"""Please come up with a strategy for reframing my
                         thinking around each of these distortions:
                         {self.distortions}. Please keep in mind my original
                         thought: {self.thought}."""}
            ]
        )

        self.strategies = response['choices'][0]['message']['content']

        return self.strategies
