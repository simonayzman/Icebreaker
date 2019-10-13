import flask
import os

app = flask.Flask("__main__")

@app.route("/")
def index():
    return flask.render_template("index.html", token="Hello flask")

app.run(debug=True, host='0.0.0.0', port=os.environ.get('PORT', 5000))
