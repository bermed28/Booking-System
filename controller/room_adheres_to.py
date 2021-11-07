from flask import jsonify
from model.room_adheres_to import RoomAdheresToDAO

class BaseRoomAdherance:

    def build_map_dict(self, row):
        result = {}
        result['rid'] = row[0]
        result['rsid'] = row[1]
        return result

    def build_attr_dict(self, rid, rsid):
        result = {}
        result['rid'] = rid
        result['rsid'] = rsid
        return result

    def getAllRoomAdherences(self):
        dao = RoomAdheresToDAO()
        room_adherence_list = dao.getAllRoomAdherences()
        result_list = []
        for row in room_adherence_list:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getRoomAdherenceById(self, rsid):
        dao = RoomAdheresToDAO()
        room_adherence_tuple = dao.getRoomAdherenceByRoomScheduleId(rsid)
        if not room_adherence_tuple:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(room_adherence_tuple)
            return jsonify(result), 200

    def addNewRoomAdherence(self, json):
        rid = json['rid']
        rsid = json['rsid']
        dao = RoomAdheresToDAO()
        usid = dao.insertRoomAdherence(rid, rsid)
        result = self.build_attr_dict(rid, rsid)
        return jsonify(result), 201

    def updateRoomAdherence(self, json):
        rid = json['rid']
        rsid = json['rsid']
        dao = RoomAdheresToDAO()
        updated_user_schedule = dao.updateRoomAdherence(rid, rsid)
        result = self.build_attr_dict(rid, rsid)
        return jsonify(result), 200

    def deleteRoomAdherence(self, rsid):
        dao = RoomAdheresToDAO()
        result = dao.deleteRoomAdherence(rsid)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404