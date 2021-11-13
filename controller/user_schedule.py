from flask import jsonify
from model.user_schedule import UserScheduleDAO

class BaseUserSchedule:

    def build_map_dict(self, row):
        result = {}
        result['usid'] = row[0]
        result['uavailability'] = row[1]
        result['uid'] = row[2]
        result['tid'] = row[3]
        result['usday'] = row[4]
        return result

    def build_attr_dict(self, usid, uavailability, uid, tid, usday):
        result = {}
        result['usid'] = usid
        result['uavailability'] = uavailability
        result['uid'] = uid
        result['tid'] = tid
        result['usday'] = usday
        return result

    def getAllUserSchedules(self):
        dao = UserScheduleDAO()
        user_schedule_list = dao.getAllUserSchedules()
        result_list = []
        for row in user_schedule_list:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getUserScheduleById(self, usid):
        dao = UserScheduleDAO()
        user_schedule_tuple = dao.getUserScheduleById(usid)
        if not user_schedule_tuple:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(user_schedule_tuple)
            return jsonify(result), 200

    def addNewUserSchedule(self, json):
        uavailability = json['uavailability']
        uid = json['uid']
        tid = json['tid']
        usday = json['usday']
        dao = UserScheduleDAO()
        usid = dao.insertUserSchedule(uavailability, uid, tid, usday)
        result = self.build_attr_dict(usid, uavailability, uid, tid, usday)
        return jsonify(result), 201

    def updateUserSchedule(self, json):
        uavailability = json['uavailability']
        uid = json['uid']
        tid = json['tid']
        usid = json['usid']
        usday = json['usday']
        dao = UserScheduleDAO()
        updated_user_schedule = dao.updateUserSchedule(usid, uavailability, uid, tid, usday)
        result = self.build_attr_dict(usid, uavailability, uid, tid, usday)
        return jsonify(result), 200

    def deleteUserSchedule(self, usid):
        dao = UserScheduleDAO()
        result = dao.deleteUserSchedule(usid)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404