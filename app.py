import os
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash

app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index-template.html")


@app.route('/confirmation', methods=['GET', 'POST'])
def confirmation():
    data = {
        "name": "test"
    }
    print("from /confirmation, data.name = " + data["name"])
    return render_template("simple-registration-confirmation.html", data=data)


@app.route('/register', methods=['GET', 'POST'])
def register():
    print("/register reached by " + request.method)
    if request.method == 'POST':
        data = request.form
        for key in data:
            print(data[key])

        return redirect(url_for('confirmation'))
    else:
        return render_template("simple-registration-form.html")


@app.route('/registration-report')
def report():
    return "stuff from DB..."


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
