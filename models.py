import os
import openai
import json

from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')


def connect_db(app):
    """Connect this database to provided Flask app.

    You should call this in your Flask app.
    """

    app.app_context().push()
    db.app = app
    db.init_app(app)

class Thought:
    """
    A class representing a user-submitted negative thought as well as the
    AI-powered distortions and suggestions for reframing.
    """

    def __init__(self, thought):

        self.thought = thought

    def fetch_distortions(self):
        attempts = 0

        while attempts < 2:
            attempts += 1

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system",
                    "content": os.getenv('SYSTEM_PROMPT')},
                    {"role": "user",
                    "content": os.getenv('DISTORTIONS_PROMPT') + self.thought}
                ]
            )

            response_string = response['choices'][0]['message']['content']

            try:
                self.distortions = json.loads(response_string)
                break
            except ValueError:
                # Re-run the API request only once if ValueError
                if attempts == 2:
                    raise ValueError('Failed to parse JSON response after two attempts.')

        return self.distortions

    # def fetch_strategies(self):

    #     response = openai.ChatCompletion.create(
    #         model="gpt-3.5-turbo",
    #         messages=[
    #             {"role": "system",
    #              "content": os.getenv('SYSTEM_PROMPT')},
    #             {"role": "user",
    #              "content": f"""Please come up with a strategy for reframing my
    #                      thinking around each of these distortions:
    #                      {self.distortions}. Please keep in mind my original
    #                      thought: {self.thought}.

    #                      Please write your response using Format #2."""}
    #         ]
    #     )

    #     self.strategies = response['choices'][0]['message']['content']

    #     return self.strategies

    # def fetch_reframed_thoughts(self):

    #     response = openai.ChatCompletion.create(
    #         model="gpt-3.5-turbo",
    #         messages=[
    #             {"role": "system",
    #              "content": os.getenv('SYSTEM_PROMPT')},
    #             {"role": "user",
    #              "content": f"""Given the original thought and the identified
    #                     distortions and strategies, please provide three
    #                     examples of reframed thoughts that do not have
    #                     distortions.

    #                     Original Thought: {self.thought}
    #                     Distortions: {self.distortions}
    #                     Strategies: {self.strategies}

    #                     Please write your response using Format #3."""}
    #         ]
    #     )

    #     self.reframed_thoughts = response['choices'][0]['message']['content']

    #     return self.reframed_thoughts

