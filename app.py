from flask import Flask, request, jsonify
from flask_cors import CORS
from controller.user import BaseUser
from controller.user_schedule import BaseUserSchedule
from controller.room import BaseRoom
from controller.reservation import BaseReservation
from controller.room_schedule import BaseRoomSchedule
from controller.time_slot import BaseTimeSlot

app = Flask(__name__)
#apply CORS
CORS(app)

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return '<h1>Hello World!<h1/>'

#Every route that has /UserApp is part of my API
@app.route('/UserApp/users', methods=['GET', 'POST'])
def handleUsers():
    if request.method == 'POST': #ADD
        return BaseUser().addNewUser(request.json)
    else:
        return BaseUser().getAllUsers() #Get list of all users

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
def handleReservations():
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

@app.route('/UserApp/reservation/most-used/<int:num>', methods=['GET'])
def handleMisc(num):
    return BaseReservation().getMostUsedRooms(num)

@app.route('/UserApp/user-schedule', methods=['GET', 'POST'])
def handleUserSchedules():
    if request.method == 'POST':
        return BaseUserSchedule().addNewUserSchedule(request.json)
    else:
        return BaseUserSchedule().getAllUserSchedules()

@app.route('/UserApp/user-schedule/<int:usid>', methods=['GET', 'PUT', 'DELETE'])
def handleUserSchedulebyId(usid):
    if request.method == 'GET':
        return BaseUserSchedule().getUserScheduleById(usid)
    elif request.method == 'PUT':
        return BaseUserSchedule().updateUserSchedule(request.json)
    elif request.method == 'DELETE':
        return BaseUserSchedule().deleteUserSchedule(usid)


@app.route('/UserApp/room-schedule', methods=['GET', 'POST'])
def handleRoomSchedules():
    if request.method == 'POST':
        return BaseRoomSchedule().addNewRoomSchedule(request.json)
    else:
        return BaseRoomSchedule().getAllRoomSchedules()

@app.route('/UserApp/room-schedule/<int:rsid>', methods=['GET', 'PUT', 'DELETE'])
def handleRoomSchedulebyId(rsid):
    if request.method == 'GET':
        return BaseRoomSchedule().getRoomScheduleById(rsid)
    elif request.method == 'PUT':
        return BaseRoomSchedule().updateRoomSchedule(request.json)
    elif request.method == 'DELETE':
        return BaseRoomSchedule().deleteRoomSchedule(rsid)

@app.route('/UserApp/timeslots', methods=['GET', 'POST'])
def handleTimeSlots():
    if request.method == 'POST':
        return BaseTimeSlot().addNewTimeSlot(request.json)
    else:
        return BaseTimeSlot().getAllTimeSlots()

@app.route('/UserApp/timeslots/<int:tid>', methods=['GET', 'PUT', 'DELETE'])
def handleTimeSlotbyId(tid):
    if request.method == 'GET':
        return BaseTimeSlot().getTimeSlotByTimeSlotId(tid)
    elif request.method == 'PUT':
        return BaseTimeSlot().updateTimeSlot(request.json)
    elif request.method == 'DELETE':
        return BaseTimeSlot().deleteTimeSlot(tid)


#Get User Statistic
@app.route('/UserApp/user/mostusedroom/<int:uid>', methods=['GET'])
def handleMostUsedRoombyUser(uid):
    return BaseUser().getMostRoombyUser(uid)

@app.route('/UserApp/user/alldayschedule/<int:uid>', methods=['GET'])
def handleAllDayUserSchedule(uid):
    return BaseUser().getAllDayUserSchedule(uid)

@app.route('/UserApp/room/alldayschedule/<int:rid>', methods=['GET'])
def handleAllDayRoomSchedule(rid):
    return BaseRoom().getAllDayRoomSchedule(rid)

@app.route('/UserApp/reservation/whoAppointed/<int:rid>/<int:tid>', methods=['GET'])
def handlegetWhoAppointedRoomAtTime(rid, tid):
    return BaseReservation().getWhoAppointedRoomAtTime(rid, tid)

@app.route('/UserApp/room/findRoomAtTime/<int:tid>', methods=['GET'])
def handleFindRoomAtTime(tid):
    return BaseRoom().findRoomAtTime(tid)



if __name__ == '__main__':
    app.run(debug=True, port=8080, host="0.0.0.0")
