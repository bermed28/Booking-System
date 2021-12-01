from flask import jsonify
from model.members import MembersDAO

class BaseMembers:

    def build_map_dict(self, row):
        result = {}
        result['uid'] = row[0]
        result['resid'] = row[1]
        return result

    def build_attr_dict(self, uid, resid):
        result = {}
        result['uid'] = uid
        result['resid'] = resid
        return result

    def getAllMembers(self):
        dao = MembersDAO()
        members = dao.getAllMembers()
        result_list = []
        for row in members:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    #This function basically gets all the reservations a user has been invited to
    def getMembersByUserId(self, uid):
        dao = MembersDAO()
        members = dao.getMemberByUserId(uid)
        if not members:
            return jsonify("Not Found"), 404
        else:
            result_list = []
            for row in members:
                obj = self.build_map_dict(row)
                result_list.append(obj)
            return jsonify(result_list), 200

    def addNewMember(self, json):
        uid = json['uid']
        resid = json['resid']
        dao = MembersDAO()
        uid = dao.insertMember(uid, resid)
        result = self.build_attr_dict(uid, resid)
        return jsonify(result), 201

    def deleteMember(self, uid, json):
        dao = MembersDAO()
        result = dao.deleteMemberbyReservationID(uid, json['resid'])
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def getUsersInReservation(self, resid):
        dao = MembersDAO()
        member_list = dao.getUsersInReservation(resid)
        result = {"members": member_list}
        return jsonify(result), 200
