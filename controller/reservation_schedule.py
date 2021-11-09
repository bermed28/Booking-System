from flask import jsonify
from model.reservation_schedule import ReservationScheduleDAO

class BaseReservationSchedule:

    def build_map_dict(self, row):
        result = {}
        result['resid'] = row[0]
        result['tid'] = row[1]
        return result

    def build_attr_dict(self, resid, tid):
        result = {}
        result['resid'] = resid
        result['tid'] = tid

        return result

    def getAllMembers(self):
        dao = ReservationScheduleDAO()
        members = dao.getAllReservationSchedules()
        result_list = []
        for row in members:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getReservationScheduleByReservationId(self, resid):
        dao = ReservationScheduleDAO()
        reservation_sched = dao.getReservationScheduleByReservationId(resid)
        if not reservation_sched:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(reservation_sched)
            return jsonify(result), 200

    def addNewReservationSchedule(self, json):
        tid = json['tid']
        resid = json['resid']

        dao = ReservationScheduleDAO()
        tid = dao.insertReservationSchedule(resid, tid)
        result = self.build_attr_dict(resid, tid)
        return jsonify(result), 201

    def updateReservationSchedule(self, json):
        #EDIT THIS METHOD
        tid = json['tid']
        resid = json['resid']

        dao = ReservationScheduleDAO()
        updated_schedule = dao.updateReservationShedule(resid, tid, 0)
        result = self.build_attr_dict(resid, tid)
        return jsonify(result), 200

    def deleteReservationSchedule(self, resid):
        dao = ReservationScheduleDAO()
        result = dao.deleteReseravtionSchedule(resid)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404