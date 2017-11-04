import os
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash

app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index-template.html")


@app.route('/hello')
def hello():
    output = 'Hello World'
    return output


@app.route('/register')
def register():
    return render_template("simple-registration-form.html")


@app.route('/registration-report')
def report():
    return "stuff from DB..."


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
