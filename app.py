import os
import json
import http.client
import hashlib
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.parse
import traceback
import pprint
import os
from collections import OrderedDict
from custom_modules import verify_helper as v
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash

app = Flask(__name__)

urllib.parse.uses_netloc.append("postgres")
url = urllib.parse.urlparse(os.environ["DATABASE_URL"])
dbConn = psycopg2.connect( database=url.path[1:], user=url.username, password=url.password, host=url.hostname, port=url.port)
dbCur = dbConn.cursor(cursor_factory=RealDictCursor)


def get_data():
    print("Attempting to fetch records from db...")
    rows = []
    try:
        dbCur.execute("select * from userdb order by date desc ")
        rows = dbCur.fetchall()
        print("Success!")
    except:
        print("error during select: " + str(traceback.format_exc()))
    return rows


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
    rows = get_data()
    print(rows)
    return render_template("simple-registration-report.html", rows=rows)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
