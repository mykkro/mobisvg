from flask import Flask
from flask import send_from_directory

staticdir = 'www'

app = Flask(__name__, static_folder=staticdir, static_url_path='')

@app.route('/api')
def hello():
    return 'Hello from Docker! I have been seen {} times.\n'.format(666)

@app.route('/')
def serve_page():
    return send_from_directory(staticdir, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
