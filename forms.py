from flask_wtf import FlaskForm
from wtforms import TextAreaField
from wtforms.validators import DataRequired


class NewThoughtForm(FlaskForm):
    """Form for adding users."""

    thought = TextAreaField(
        'Thought',
        validators=[DataRequired()],
    )
