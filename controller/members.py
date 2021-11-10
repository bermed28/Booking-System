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

    def getMembersByUserId(self, uid):
        dao = MembersDAO()
        member = dao.getMemberByUserId(uid)
        if not member:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(member)
            return jsonify(result), 200

    def addNewMember(self, json):
        uid = json['uid']
        resid = json['resid']
        dao = MembersDAO()
        uid = dao.insertMember(uid, resid)
        result = self.build_attr_dict(uid, resid)
        return jsonify(result), 201

    def updateMember(self, json):
        #EDIT THIS METHOD
        uid = json['uid']
        resid = json['resid']
        dao = MembersDAO()
        updated_member = dao.updateMember(uid, resid, 0)
        result = self.build_attr_dict(uid, resid)
        return jsonify(result), 200

    def deleteMember(self, uid):
        dao = MembersDAO()
        result = dao.deleteMember(uid)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404