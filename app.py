from flask import Flask, request, jsonify
from flask_cors import CORS
from controller.user import BaseUser

app = Flask(__name__)
#apply CORS
CORS(app)

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'

@app.route('/UserApp/users', methods=['GET', 'POST'])
def handleParts():
    if request.method == 'POST':
        return BaseUser().addNewUser(request.json)
    else:
        return BaseUser().getAllUsers()

if __name__ == '__main__':
    app.run(debug=True)
