from flask import jsonify
from model.room import RoomDAO
from model.reservation_schedule import ReservationScheduleDAO
from model.members import MembersDAO
from model.user import UserDAO

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

    def updateRoom(self, json):
        rname = json['rname']
        rcapacity = json['rcapacity']
        rbuildname = json['rbuildname']
        rpermission = json['rpermission']
        rid = json['rid']
        dao = RoomDAO()
        updated_room = dao.updateRoom(rid, rname, rcapacity, rbuildname, rpermission)
        result = self.build_attr_dict(rid, rname, rcapacity, rbuildname, rpermission)
        return jsonify(result), 200

    def deleteRoom(self, rid):
        dao = RoomDAO()
        result = dao.deleteRoom(rid)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def getAllDayRoomSchedule(self, rid):
        dao = RoomDAO()
        timeslot = dao.getTimeSlot()
        occupiedTid = dao.getRoomOccupiedTimeSlots(rid)

        for time in timeslot:
            for tid in occupiedTid:
                if tid[3] == time['tid']:
                    time['available'] = False

            if 'available' not in time:
                time['available'] = True

        return jsonify(timeslot)

    def findRoomAtTime(self, tid):
        dao = RoomDAO()
        result = dao.findRoomAtTime(tid)
        return jsonify(result)

    def findRoomAppointmentInfo(self, rid, uid):
        roomdao = RoomDAO()
        reservations = roomdao.findRoomReservations(rid)
        rscheduledao = ReservationScheduleDAO()
        membersdao = MembersDAO()
        userdao = UserDAO()
        permission = userdao.checkPermission(uid)
        if permission == 'Professor' or permission == 'Department Staff':
            for res in reservations:
                tidInReser = rscheduledao.getReservationScheduleByReservationId(res['resid'])
                res['tid'] =[]
                for tid in tidInReser:
                    res['tid'].append(tid[1])

                members = membersdao.getMembersByReservationId(res['resid'])
                res['members'] =[]
                for member in members:
                    res['members'].append(member[0])
            return jsonify(reservations)
        else:
            return jsonify("You do not have permission to view this information.")
