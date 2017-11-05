import os
import json
import sqlite3
from collections import OrderedDict
from custom_modules import verify_helper as v
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index-template.html")


@app.route("/verifying", methods=["POST"])
def verifying():
    # print("/verifying reached by " + request.method)
    data = request.form
    v.run_verify_helper(data)
    fname = data["fname"]
    lname = data["lname"]
    addr1 = data["addr1"]
    addr2 = data["addr2"]
    city = data["city"]
    state = data["state"]
    zipcode = data["zipcode"]
    country = data["country"]
    return json.dumps(OrderedDict(
        status="OK",
        fname=fname,
        lname=lname,
        addr1=addr1,
        addr2=addr2,
        city=city,
        state=state,
        zipcode=zipcode,
        country=country
    ))


@app.route("/register")
def register():
    return render_template("simple-registration-form.html")


@app.route("/confirmation")
def confirmation():
    return render_template("simple-registration-confirmation.html")


@app.route("/registration-report")
def report():
    return "stuff from DB..."


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
