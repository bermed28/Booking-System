from flask import Flask, request
from flask_cors import CORS
from backend.controller.user import BaseUser
from backend.controller.user_schedule import BaseUserSchedule
from backend.controller.room import BaseRoom
from backend.controller.reservation import BaseReservation
from backend.controller.room_schedule import BaseRoomSchedule
from backend.controller.time_slot import BaseTimeSlot
from backend.controller.members import BaseMembers
import json

app = Flask(__name__)
#apply CORS
CORS(app)
cors = CORS(app, resources={
    r"/*": {"origins": "*"}
})



@app.route('/')
def hello_world():  # put application's code here
    return '<h1>Hello World!<h1/>'

#Every route that has /StackOverflowersStudios is part of the API
"""""""""""""MAIN ENTITY HANDLERS (CRUD Operations)"""""""""""""""

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
        return BaseUser().updateUser(uid, request.json)
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
        return BaseReservation().updateReservation(resid, request.json)
    elif request.method == 'DELETE':
        return BaseReservation().deleteReservation(resid, request.json)

@app.route('/StackOverflowersStudios/members', methods=['GET', 'POST'])
def handleMembers():
    if request.method == 'POST':
        return BaseMembers().addNewMember(request.json)
    else:
        return BaseMembers().getAllMembers()

@app.route('/StackOverflowersStudios/members/<int:uid>', methods=['GET', 'DELETE'])
def handleMembersbyId(uid):
    if request.method == 'GET':
        return BaseMembers().getMembersByUserId(uid)
    elif request.method == 'DELETE':
        return BaseMembers().deleteMember(uid, request.json)

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

"""""""""""""GLOBAL STATISTICS"""""""""""""""

@app.route('/StackOverflowersStudios/reservation/busiest-hours', methods=['GET'])
def handleHourStat():
    return BaseReservation().getBusiestHours()

@app.route('/StackOverflowersStudios/reservation/most-used', methods=['GET'])
def handleRoomStat():
    return BaseReservation().getMostUsedRooms()

@app.route('/StackOverflowersStudios/reservation/most-booked', methods=['GET'])
def handleUserStat():
    return BaseReservation().getMostBookedUsers()

"""""""""""""""""USER STATISTICS"""""""""""""""
@app.route('/StackOverflowersStudios/user/mostusedroom/<int:uid>', methods=['GET'])
def handleMostUsedRoombyUser(uid):
    return BaseUser().getMostUsedRoombyUser(uid)

@app.route('/StackOverflowersStudios/user/mostbookedwith/<int:uid>', methods=['GET'])
def handleMostBookedWith(uid):
    return BaseUser().getMostBookedWith(uid)

"""""""""""""""""ALL DAY SCHEDULES"""""""""""""""
@app.route('/StackOverflowersStudios/user/alldayschedule', methods=['GET'])
def handleAllDayUserSchedule():
    return BaseUser().getAllDayUserSchedule(request.json)

@app.route('/StackOverflowersStudios/room/alldayschedule', methods=['GET'])
def handleAllDayRoomSchedule():
    return BaseRoom().getAllDayRoomSchedule(request.json)

"""""""""""""""""MISCELLANEOUS OPERATIONS"""""""""""""""
@app.route('/StackOverflowersStudios/reservation/whoAppointed', methods=['GET'])
def handlegetWhoAppointedRoomAtTime():
    return BaseReservation().getWhoAppointedRoomAtTime(request.json)

@app.route('/StackOverflowersStudios/room/findRoomAtTime', methods=['GET'])
def handleFindRoomAtTime():
    return BaseRoom().findRoomAtTime(request.json)

@app.route('/StackOverflowersStudios/room/roomAppointmentInfo/<int:rid>/<int:uid>', methods=['GET'])
def handleRoomAppointmentInfo(rid, uid):
    return BaseRoom().findRoomAppointmentInfo(rid, uid)

@app.route('/StackOverflowersStudios/reservation/getFreeTime', methods=['GET'])
def handlegetFreeTime():
    return BaseReservation().getFreeTime(request.json)

@app.route('/StackOverflowersStudios/user-schedule/markunavailable', methods=['POST'])
def handlemarkUserUnavailable():
    return BaseUserSchedule().addNewUserSchedule(request.json)

@app.route('/StackOverflowersStudios/room-schedule/markunavailable', methods=['POST'])
def handlemarkRoomUnavailable():
    return BaseRoomSchedule().addNewRoomSchedule(request.json)

@app.route('/StackOverflowersStudios/room-schedule/markavailable/<int:rsid>', methods=['DELETE'])
def handlemarkRoomAvailable(rsid):
    return BaseRoomSchedule().deleteRoomSchedule(rsid, request.json)

@app.route('/StackOverflowersStudios/login', methods=['POST'])
def handleSignInInformation():
    return BaseUser().getUserByLoginInfo(request.json)

"""""""""""""""""MAIN FUNCTION"""""""""""""""
if __name__ == '__main__':
    app.run(debug=True, port=8080, host="0.0.0.0")
