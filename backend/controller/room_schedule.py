from flask import jsonify
from model.room_schedule import RoomScheduleDAO
from model.user import UserDAO
from model.time_slot import TimeSlotDAO


class BaseRoomSchedule:

    def build_map_dict(self, row):
        result = {}
        result['rsid'] = row[0]
        result['rid'] = row[1]
        result['tid'] = row[2]
        result['rsday'] = row[3]
        return result

    def build_attr_dict(self, rsid, rid, tid, rsday):
        result = {}
        result['rsid'] = rsid
        result['rid'] = rid
        result['tid'] = tid
        result['rsday'] = rsday
        return result

    def getAllRoomSchedules(self):
        dao = RoomScheduleDAO()
        room_schedule_list = dao.getAllRoomSchedules()
        result_list = []
        for row in room_schedule_list:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getRoomScheduleById(self, rsid):
        dao = RoomScheduleDAO()
        room_schedule_tuple = dao.getRoomScheduleById(rsid)
        if not room_schedule_tuple:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(room_schedule_tuple)
            return jsonify(result), 200

    def getUnavailableTimeSlots(self, rid):
        dao = RoomScheduleDAO()
        tsDAO = TimeSlotDAO()
        timeSlots = dao.getUnavailableTimeSlots(rid)
        for day, tids in timeSlots.items():
            for i in range(len(tids)):
                time = tsDAO.getTimeSlotByTimeSlotId(tids[i])
                tids[i] = {"start": time[1], "end": time[2]}

        return jsonify(timeSlots), 200

    def addNewRoomSchedule(self, json):
        rid = json['rid']
        tid = json['tid']
        rsday = json['rsday']
        uid = json['uid']
        dao = RoomScheduleDAO()
        userdao = UserDAO()
        permission = userdao.checkPermission(uid)
        if dao.checkForConflicts(rid, rsday, [tid]):
            return jsonify("This room is already unavailable at this particular time."), 409
        if permission == 'Professor' or permission == 'Department Staff':
            rsid = dao.insertRoomSchedule(rid, tid, rsday)
            result = self.build_attr_dict(rsid, rid, tid, rsday)
            return jsonify(result), 201
        else:
            return jsonify("This user does not have permission"), 403

    def updateRoomSchedule(self, rsid, json):
        rid = json['rid']
        tid = json['tid']
        rsday = json['rsday']
        dao = RoomScheduleDAO()
        if dao.checkForConflicts(rid, rsday, [tid]):
            return jsonify("This room is already unavailable at this particular time."), 409
        updated_room_schedule = dao.updateRoomSchedule(rsid, rid, tid, rsday)
        result = self.build_attr_dict(rsid, rid, tid, rsday)
        return jsonify(result), 200

    def deleteRoomSchedule(self, rsid, json):
        dao = RoomScheduleDAO()
        userdao = UserDAO()
        uid = json['uid']
        permission = userdao.checkPermission(uid)
        if permission == 'Professor' or permission == 'Department Staff':
            result = dao.deleteRoomSchedule(rsid)
            if result:
                return jsonify("DELETED"), 200
            else:
                return jsonify("NOT FOUND"), 404
        else:
            return jsonify("This user does not have permission"), 403
