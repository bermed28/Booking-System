from flask import Flask, request, jsonify
from flask_cors import CORS
from controller.user import BaseUser

app = Flask(__name__)
#apply CORS
CORS(app)

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return '<h1>Hello World!<h1/>'

@app.route('/UserApp/users', methods=['GET', 'POST'])
def handleUsers():
    if request.method == 'POST':
        return BaseUser().addNewUser(request.json)
    else:
        return BaseUser().getAllUsers()

@app.route('/UserApp/users/<int:uid>', methods=['GET', 'PUT', 'DELETE'])
def handleUsersbyId(uid):
    if request.method == 'GET':
        return BaseUser().getUserById(uid)
    elif request.method == 'PUT':
        return BaseUser().updateUser(request.json)
    elif request.method == 'DELETE':
        return BaseUser().deleteUser(uid)

if __name__ == '__main__':
    app.run(debug=True)
