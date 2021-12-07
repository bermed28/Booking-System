from flask import jsonify
from model.room import RoomDAO
from model.reservation_schedule import ReservationScheduleDAO
from model.members import MembersDAO
from model.user import UserDAO
from model.time_slot import TimeSlotDAO
from model.reservation import ReservationDAO

class BaseRoom:

    def build_map_dict(self, row):
        result = {}
        result['rid'] = row[0]
        result['rname'] = row[1]
        result['rcapacity'] = row[2]
        result['rbuildname'] = row[3]
        result['rpermission'] = row[4]
        return result

    def build_attr_dict(self, rid, rname, rcapacity, rbuildname, rpermission):
        result = {}
        result['rid'] = rid
        result['rname'] = rname
        result['rcapacity'] = rcapacity
        result['rbuildname'] = rbuildname
        result['rpermission'] = rpermission
        return result

    def getAllRooms(self):
        dao = RoomDAO()
        room_list = dao.getAllRooms()
        result_list = []
        for row in room_list:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getRoomById(self, rid):
        dao = RoomDAO()
        room_tuple = dao.getRoomById(rid)
        if not room_tuple:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(room_tuple)
            return jsonify(result), 200

    def addNewRoom(self, json):
        rname = json['rname']
        rcapacity = json['rcapacity']
        rbuildname = json['rbuildname']
        rpermission = json['rpermission']
        dao = RoomDAO()
        rid = dao.insertRoom(rname, rcapacity, rbuildname, rpermission)
        result = self.build_attr_dict(rid, rname, rcapacity, rbuildname, rpermission)
        return jsonify(result), 201

    def updateRoom(self, rid, json):
        rname = json['rname']
        rcapacity = json['rcapacity']
        rbuildname = json['rbuildname']
        rpermission = json['rpermission']
        dao = RoomDAO()
        updated_room = dao.updateRoom(rid, rname, rcapacity, rbuildname, rpermission)
        result = self.build_attr_dict(rid, rname, rcapacity, rbuildname, rpermission)
        return jsonify(result), 200

    def deleteRoom(self, rid):
        dao = RoomDAO()
        if dao.getAllRoomUses(rid):
            return jsonify("You cannot delete this room because there are reservations made for it."), 400
        result = dao.deleteRoom(rid)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def getAllDayRoomSchedule(self, json):
        rid = json['rid']
        rsday = json['rsday']
        dao = RoomDAO()
        reserDao = ReservationDAO()
        timeslot = dao.getTimeSlot()
        occupiedTid = dao.getRoomOccupiedTimeSlots(rid, rsday)

        for time in timeslot:
            if time['tid'] in occupiedTid:
                time['available'] = False
                time['user'] = reserDao.getWhoAppointedRoomAtTime(rid, time['tid'], rsday)['username']

            if 'available' not in time:
                time['available'] = True
                time['user'] = "N/A"

        return jsonify(timeslot)

    def findRoomAtTime(self, json):
        tid = json['tid']
        date = json['date']
        dao = RoomDAO()
        result = dao.findRoomAtTime(tid, date)
        return jsonify(result)

    def findRoomsAtTimes(self, json):
        tids = json['tids']
        date = json['date']
        dao = RoomDAO()
        result = dao.findRoomAtTime(tids[0], date)
        for i in range(1, len(tids)):
            tempRes = dao.findRoomAtTime(tids[i], date)
            for room in result:
                if room in tempRes:
                    continue
                else:
                    result.remove(room)
        return jsonify(result)

    def getAllOccupiedRoomSchedule(self, rid):
        dao, tsDAO = RoomDAO(), TimeSlotDAO()
        occupiedTidDict = dao.getAllOccupiedRoomSchedule(rid)
        for day, tids in occupiedTidDict.items():
            for i in range(len(tids)):
                time = tsDAO.getTimeSlotByTimeSlotId(tids[i])
                tids[i] = {"start": time[1], "end": time[2]}

        return jsonify(occupiedTidDict)

    def findRoomAppointmentInfo(self, rid, uid):
        roomdao = RoomDAO()
        reservations = roomdao.findRoomReservations(rid)
        rpermission = roomdao.getRoomPermission(rid)
        rscheduledao = ReservationScheduleDAO()
        membersdao = MembersDAO()
        userdao = UserDAO()
        upermission = userdao.checkPermission(uid)
        if upermission == rpermission or upermission == 'Department Staff' or upermission == 'Professor':
            for res in reservations:
                tidInReser = rscheduledao.getReservationScheduleByReservationId(res['resid'])
                res['time slots'] = []
                tsdao = TimeSlotDAO()
                for tid in tidInReser:
                    time_slot = tsdao.getTimeSlotByTimeSlotId(tid[1])
                    res['time slots'].append(time_slot[1] + " to " + time_slot[2])
                members = membersdao.getMembersByReservationId(res['resid'])
                res['members'] =[]
                for member in members:
                    res['members'].append(userdao.getUserById(member[0])[1])
            return jsonify(reservations)
        else:
            reservations = roomdao.findRoomReservationsForUser(rid, uid)
            if not reservations:
                return jsonify("You do not have permission to view this information nor do you have any \
                                information to view."), 403
            else:
                for res in reservations:
                    tidInReser = rscheduledao.getReservationScheduleByReservationId(res['resid'])
                    res['time slots'] = []
                    tsdao = TimeSlotDAO()
                    for tid in tidInReser:
                        time_slot = tsdao.getTimeSlotByTimeSlotId(tid[1])
                        res['time slots'].append(time_slot[1] + " to " + time_slot[2])
                    members = membersdao.getMembersByReservationId(res['resid'])
                    res['members'] = []
                    for member in members:
                        res['members'].append(userdao.getUserById(member[0])[1])
                return jsonify(reservations)
