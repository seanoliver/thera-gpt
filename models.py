import os
import openai
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
             "content": """You are a therapist trained in cognitive behavioral
                        therapy. Your role is to help people by interpreting
                        their negative, self-defeating thoughts, identifying
                        and explaining potential cognitive distortions in those
                        thoughts, and providing some suggestions for strategies
                        to reframe their thinking."""},
            {"role": "user",
             "content": f"""Please list and briefly explain each of the
                         cognitive distortions you that you can find in this
                         thought: {self.thought}"""}
            ]
        )

        return response['choices'][0]['message']['content']