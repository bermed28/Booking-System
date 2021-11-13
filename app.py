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

#Every route that has /StackOverflowersStudios is part of the API

"""""""""""""MAIN ENTITY HANDLERS"""""""""""""""

@app.route('/StackOverflowersStudios/users', methods=['GET', 'POST'])
def handleUsers():
    if request.method == 'POST': #ADD
        return BaseUser().addNewUser(request.json)
    else:
        return BaseUser().getAllUsers() #Get list of all users

@app.route('/StackOverflowersStudios/users/<int:uid>', methods=['GET', 'PUT', 'DELETE'])
def handleUsersbyId(uid):
    if request.method == 'GET':
        return BaseUser().getUserById(uid)
    elif request.method == 'PUT':
        return BaseUser().updateUser(request.json)
    elif request.method == 'DELETE':
        return BaseUser().deleteUser(uid)

@app.route('/StackOverflowersStudios/rooms', methods=['GET', 'POST'])
def handleRooms():
    if request.method == 'POST':
        return BaseRoom().addNewRoom(request.json)
    else:
        return BaseRoom().getAllRooms()

@app.route('/StackOverflowersStudios/rooms/<int:rid>', methods=['GET', 'PUT', 'DELETE'])
def handleRoomsbyId(rid):
    if request.method == 'GET':
        return BaseRoom().getRoomById(rid)
    elif request.method == 'PUT':
        return BaseRoom().updateRoom(rid, request.json)
    elif request.method == 'DELETE':
        return BaseRoom().deleteRoom(rid)

@app.route('/StackOverflowersStudios/reservations', methods=['GET', 'POST'])
def handleReservations():
    if request.method == 'POST':
        return BaseReservation().addNewReservation(request.json)
    else:
        return BaseReservation().getAllReservations()

@app.route('/StackOverflowersStudios/reservations/<int:resid>', methods=['GET', 'PUT', 'DELETE'])
def handleReservationbyId(resid):
    if request.method == 'GET':
        return BaseReservation().getReservationById(resid)
    elif request.method == 'PUT':
        return BaseReservation().updateReservation(request.json)
    elif request.method == 'DELETE':
        return BaseReservation().deleteReservation(resid)

# Global Statistics
@app.route('/StackOverflowersStudios/reservation/busiest-hours/<int:num>', methods=['GET'])
def handleHourStat(num):
    return BaseReservation().getBusiestHours(num)

@app.route('/StackOverflowersStudios/reservation/most-used/<int:num>', methods=['GET'])
def handleRoomStat(num):
    return BaseReservation().getMostUsedRooms(num)

@app.route('/StackOverflowersStudios/reservation/most-booked/<int:num>', methods=['GET'])
def handleUserStat(num):
    return BaseReservation().getMostBookedUsers(num)

@app.route('/StackOverflowersStudios/user-schedule', methods=['GET', 'POST'])
def handleUserSchedules():
    if request.method == 'POST':
        return BaseUserSchedule().addNewUserSchedule(request.json)
    else:
        return BaseUserSchedule().getAllUserSchedules()

@app.route('/StackOverflowersStudios/user-schedule/<int:usid>', methods=['GET', 'PUT', 'DELETE'])
def handleUserSchedulebyId(usid):
    if request.method == 'GET':
        return BaseUserSchedule().getUserScheduleById(usid)
    elif request.method == 'PUT':
        return BaseUserSchedule().updateUserSchedule(usid, request.json)
    elif request.method == 'DELETE':
        return BaseUserSchedule().deleteUserSchedule(usid)


@app.route('/StackOverflowersStudios/room-schedule', methods=['GET', 'POST'])
def handleRoomSchedules():
    if request.method == 'POST':
        return BaseRoomSchedule().addNewRoomSchedule(request.json)
    else:
        return BaseRoomSchedule().getAllRoomSchedules()

@app.route('/StackOverflowersStudios/room-schedule/<int:rsid>', methods=['GET', 'PUT', 'DELETE'])
def handleRoomSchedulebyId(rsid):
    if request.method == 'GET':
        return BaseRoomSchedule().getRoomScheduleById(rsid)
    elif request.method == 'PUT':
        return BaseRoomSchedule().updateRoomSchedule(rsid, request.json)
    elif request.method == 'DELETE':
        return BaseRoomSchedule().deleteRoomSchedule(rsid, request.json)

@app.route('/StackOverflowersStudios/timeslots', methods=['GET'])
def handleTimeSlots():
    return BaseTimeSlot().getAllTimeSlots()

@app.route('/StackOverflowersStudios/timeslots/<int:tid>', methods=['GET'])
def handleTimeSlotbyId(tid):
    return BaseTimeSlot().getTimeSlotByTimeSlotId(tid)

"""""""""""""""""ALL DAY SCHEDULES"""""""""""""""
@app.route('/StackOverflowersStudios/user/mostusedroom/<int:uid>', methods=['GET'])
def handleMostUsedRoombyUser(uid):
    return BaseUser().getMostUsedRoombyUser(uid)

@app.route('/StackOverflowersStudios/user/mostbookedusers/<int:uid>/<int:num>', methods=['GET'])
def handleMostBookedInvitees(uid, num):
    return BaseUser().getMostBookedWith(uid, num)

@app.route('/StackOverflowersStudios/user/alldayschedule/<int:uid>', methods=['GET'])
def handleAllDayUserSchedule(uid):
    return BaseUser().getAllDayUserSchedule(uid)

@app.route('/StackOverflowersStudios/room/alldayschedule/<int:rid>', methods=['GET'])
def handleAllDayRoomSchedule(rid):
    return BaseRoom().getAllDayRoomSchedule(rid)

@app.route('/StackOverflowersStudios/reservation/whoAppointed/<int:rid>/<int:tid>', methods=['GET'])
def handlegetWhoAppointedRoomAtTime(rid, tid):
    return BaseReservation().getWhoAppointedRoomAtTime(rid, tid)

@app.route('/StackOverflowersStudios/room/findRoomAtTime/<int:tid>', methods=['GET'])
def handleFindRoomAtTime(tid):
    return BaseRoom().findRoomAtTime(tid)

@app.route('/StackOverflowersStudios/room/roomAppointmentInfo/<int:rid>/<int:uid>', methods=['GET'])
def handleRoomAppointmentInfo(rid, uid):
    return BaseRoom().findRoomAppointmentInfo(rid, uid)

@app.route('/StackOverflowersStudios/reservation/getFreeTime', methods=['GET'])
def handlegetFreeTime():
    return BaseReservation().getFreeTime(request.json)

if __name__ == '__main__':
    app.run(debug=True, port=8080, host="0.0.0.0")
