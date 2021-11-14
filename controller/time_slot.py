from flask import jsonify
from model.time_slot import TimeSlotDAO

class BaseTimeSlot:

    def build_map_dict(self, row):
        result = {}
        result['tid'] = row[0]
        result['tstarttime'] = row[1]
        result['tendtime'] = row[2]
        return result

    def build_attr_dict(self, tid, tstarttime, tendttime):
        result = {}
        result['tid'] = tid
        result['tstarttime'] = tstarttime
        result['tendttime'] = tendttime
        return result

    def getAllTimeSlots(self):
        dao = TimeSlotDAO()
        members = dao.getAllTimeSlots()
        result_list = []
        for row in members:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getTimeSlotByTimeSlotId(self, tid):
        dao = TimeSlotDAO()
        member = dao.getTimeSlotByTimeSlotId(tid)
        if not member:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(member)
            return jsonify(result), 200

    # def addNewTimeSlot(self, json):
    #     tid = json['tid']
    #     tstarttime = json['tstarttime']
    #     tendtime = json['tendtime']
    # 
    #     dao = TimeSlotDAO()
    #     tid = dao.insertTimeSlot(tstarttime, tendtime)
    #     result = self.build_attr_dict(tid, tstarttime, tendtime)
    #     return jsonify(result), 201
    # 
    # def updateTimeSlot(self, json):
    #     tid = json['tid']
    #     tstarttime = json['tstarttime']
    #     tendtime = json['tendtime']
    # 
    #     dao = TimeSlotDAO()
    #     updated_time_slot = dao.updateTimeSlot(tid, tstarttime, tendtime)
    #     result = self.build_attr_dict(tid, tstarttime, tendtime)
    #     return jsonify(result), 200
    # 
    # def deleteTimeSlot(self, tid):
    #     dao = TimeSlotDAO()
    #     result = dao.deleteTimeSlot(tid)
    #     if result:
    #         return jsonify("DELETED"), 200
    #     else:
    #         return jsonify("NOT FOUND"), 404