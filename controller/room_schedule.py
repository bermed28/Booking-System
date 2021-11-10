from flask import jsonify
from model.room_schedule import RoomScheduleDAO

class BaseRoomSchedule:

    def build_map_dict(self, row):
        result = {}
        result['rsid'] = row[0]
        result['rsavailability'] = row[1]
        result['rid'] = row[2]
        result['tid'] = row[3]
        result['rsday'] = row[4]
        return result

    def build_attr_dict(self, rsid, rsavailability, rid, tid, rsday):
        result = {}
        result['rsid'] = rsid
        result['rsavailability'] = rsavailability
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

    def getRoomScheduleById(self, usid):
        dao = RoomScheduleDAO()
        room_schedule_tuple = dao.getRoomScheduleById(usid)
        if not room_schedule_tuple:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(room_schedule_tuple)
            return jsonify(result), 200

    def addNewRoomSchedule(self, json):
        rsavailability = json['rsavailability']
        rid = json['rid']
        tid = json['tid']
        rsday = json['rsday']
        dao = RoomScheduleDAO()
        rsid = dao.insertRoomSchedule(rsavailability, rid, tid, rsday)
        result = self.build_attr_dict(rsid, rsavailability, rid, tid, rsday)
        return jsonify(result), 201

    def updateRoomSchedule(self, json):
        rsavailability = json['rsavailability']
        rid = json['rid']
        tid = json['tid']
        rsid = json['rsid']
        rsday = json['rsday']
        dao = RoomScheduleDAO()
        updated_room_schedule = dao.updateRoomSchedule(rsid, rsavailability, rid, tid, rsday)
        result = self.build_attr_dict(rsid, rsavailability, rid, tid, rsday)
        return jsonify(result), 200

    def deleteRoomSchedule(self, rsid):
        dao = RoomScheduleDAO()
        result = dao.deleteRoomSchedule(rsid)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404