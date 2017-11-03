import os
from flask import Flask, request

app = Flask(__name__)


@app.route('/')
def index():
    return """<h1>Simple Registration Webapp</h1>"""


@app.route('/hello')
def hello():
    output = 'Hello World'
    return output


@app.route('/register')
def register():
    form = """
    <form id=simple-registration action="/cgi-bin/validate-form.py">
    <label>First Name: <input type="text" name="fname"/></label>
    </form>"""
    return form


@app.route('/registration-report')
def report():
    return "stuff from DB..."


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
