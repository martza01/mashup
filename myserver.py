from flask import Flask, request, json
import requests as req 

app = Flask(__name__)

@app.route('/api/getpuppy')
def proxy_puppy_request():
	args = request.url.split('?')[1]
	r = req.get('http://www.recipepuppy.com/api/?{}'.format(args))

	return r.text

@app.route('/api/getimages')
def proxy_request():
	args = request.url.split('?')[1]
	header = {"Ocp-Apim-Subscription-Key" : "5f66dee5d5b245ba9261ead22c06af82"}
	r = req.get('https://api.cognitive.microsoft.com/bing/v5.0/images/search?{}'.format(args), headers = header)
	#r = req.get('https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=cats&count=10', headers = header)
	return r.text

@app.route('/proxy/all/<string:host>/<path:uri>')
def general_proxy(host, uri):
	args = request.url.split('?')[1]
	from_api = req.get("http://{}/{}?{}".format(host, uri, args))
	r = Response(from_api.text)
	r.headers['Content-type'] = 'application/json'

	return r


app.run(debug=True)