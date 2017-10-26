import os
from flask import Flask, request

app = Flask(__name__) #create an instance of the Flask library

@app.route('/')
def index():
	return """
		<h1>Simple Registration Webapp</h1>
		"""

@app.route('/hello') #whenever this webserver is called with <hostname:port>/hello then this section is called
def hello(): #The subroutine name that handles the call
	output = 'Hello World'
	return output #Whatever is returned from this subroutine is what is returned to the requester and is shown on the browser page

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
	port = int(os.environ.get('PORT', 5000)) #The port to be listening to — hence, the URL must be <hostname>:<port>/ inorder to send the request to this program
	app.run(host='0.0.0.0', port=port)  #Start listening
