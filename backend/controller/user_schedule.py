from flask import jsonify
from model.user_schedule import UserScheduleDAO

class BaseUserSchedule:

    def build_map_dict(self, row):
        result = {}
        result['usid'] = row[0]
        result['uid'] = row[1]
        result['tid'] = row[2]
        result['usday'] = row[3]
        return result

    def build_attr_dict(self, usid, uid, tid, usday):
        result = {}
        result['usid'] = usid
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
        user_schedule = dao.getUserScheduleById(usid)
        if not user_schedule:
            return jsonify("Not Found"), 404
        else:
            obj = self.build_map_dict(user_schedule)
            return jsonify(obj), 200

    def addNewUserSchedule(self, json):
        uid = json['uid']
        tid = json['tid']
        usday = json['usday']
        dao = UserScheduleDAO()
        usid = dao.insertUserSchedule(uid, tid, usday)
        result = self.build_attr_dict(usid, uid, tid, usday)
        return jsonify(result), 201

    def updateUserSchedule(self, usid, json):
        uid = json['uid']
        tid = json['tid']
        usday = json['usday']
        dao = UserScheduleDAO()
        #Check if it usid exist
        if not dao.getUserScheduleById(usid):
            return "User Schedule id does not exist, no update can be done"
        updated_user_schedule = dao.updateUserSchedule(usid, uid, tid, usday)
        result = self.build_attr_dict(usid, uid, tid, usday)
        return jsonify(result), 200

    def deleteUserSchedule(self, usid):
        dao = UserScheduleDAO()
        result = dao.deleteUserSchedule(usid)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def markAvailable(self, json):
        uid = json['uid']
        tid = json['tid']
        usday = json['usday']
        dao = UserScheduleDAO()
        result = dao.deleteUserSchedulebyTimeIDAndDay(uid, tid, usday)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

