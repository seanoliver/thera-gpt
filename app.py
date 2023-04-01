import os
from dotenv import load_dotenv

from flask import Flask, render_template, jsonify
from flask_debugtoolbar import DebugToolbarExtension

from forms import NewThoughtForm
from models import Thought

load_dotenv()

app = Flask(__name__, static_folder='static')

# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
# app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
toolbar = DebugToolbarExtension(app)

# connect_db(app)


@app.get('/')
def homepage():
    """
    Render the homepage.
    """

    form = NewThoughtForm()

    return render_template('home.html', form=form)


@app.route('/results', methods=["POST"])
def results_page():

    form = NewThoughtForm()

    if form.validate_on_submit():

        thought = Thought(thought=form.thought.data)
        thought.fetch_distortions()
        return jsonify(thought.distortions)

