from flask import Flask, request, jsonify
from flask_cors import CORS
from controller.user import BaseUser
from controller.room import BaseRoom
from controller.reservation import BaseReservation

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

@app.route('/UserApp/rooms', methods=['GET', 'POST'])
def handleRooms():
    if request.method == 'POST':
        return BaseRoom().addNewRoom(request.json)
    else:
        return BaseRoom().getAllRooms()

@app.route('/UserApp/rooms/<int:rid>', methods=['GET', 'PUT', 'DELETE'])
def handleRoomsbyId(rid):
    if request.method == 'GET':
        return BaseRoom().getRoomById(rid)
    elif request.method == 'PUT':
        return BaseRoom().updateRoom(request.json)
    elif request.method == 'DELETE':
        return BaseRoom().deleteRoom(rid)

@app.route('/UserApp/reservations', methods=['GET', 'POST'])
def handleReservation():
    if request.method == 'POST':
        return BaseReservation().addNewReservation(request.json)
    else:
        return BaseReservation().getAllReservations()

@app.route('/UserApp/reservations/<int:resid>', methods=['GET', 'PUT', 'DELETE'])
def handleReservationbyId(resid):
    if request.method == 'GET':
        return BaseReservation().getReservationById(resid)
    elif request.method == 'PUT':
        return BaseReservation().updateReservation(request.json)
    elif request.method == 'DELETE':
        return BaseReservation().deleteReservation(resid)


if __name__ == '__main__':
    app.run(debug=True)
