from flask import jsonify
from model.user_adheres_to import UserAdheresToDAO

class BaseUserAdherence:

    def build_map_dict(self, row):
        result = {}
        result['uid'] = row[0]
        result['usid'] = row[1]
        return result

    def build_attr_dict(self, uid, usid):
        result = {}
        result['uid'] = uid
        result['usid'] = usid
        return result

    def getAllUserAdherences(self):
        dao = UserAdheresToDAO()
        user_adherence_list = dao.getAllUserAdherences()
        result_list = []
        for row in user_adherence_list:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getUserAdherenceById(self, usid):
        dao = UserAdheresToDAO()
        user_adherence_tuple = dao.getUserAdherenceByUserScheduleId(usid)
        if not user_adherence_tuple:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(user_adherence_tuple)
            return jsonify(result), 200

    def addNewUserAdherence(self, json):
        uid = json['uid']
        usid = json['usid']
        dao = UserAdheresToDAO()
        usid = dao.insertUserAdherence(uid, usid)
        result = self.build_attr_dict(uid, usid)
        return jsonify(result), 201

    def updateUserAdherence(self, json):
        uid = json['uid']
        usid = json['usid']
        dao = UserAdheresToDAO()
        updated_user_schedule = dao.updateUserAdherence(uid, usid)
        result = self.build_attr_dict(uid, usid)
        return jsonify(result), 200

    def deleteUserAdherence(self, usid):
        dao = UserAdheresToDAO()
        result = dao.deleteUserAdherence(usid)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404