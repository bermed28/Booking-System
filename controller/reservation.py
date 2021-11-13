from flask import jsonify
from model.reservation import ReservationDAO
from model.members import MembersDAO
from model.user_schedule import UserScheduleDAO
from model.room_schedule import RoomScheduleDAO
from model.time_slot import TimeSlotDAO
from controller.time_slot import BaseTimeSlot
from model.reservation_schedule import ReservationScheduleDAO


class BaseReservation:

    def build_map_dict(self, row):
        result = {}
        result['resid'] = row[0]
        result['resname'] = row[1]
        result['resday'] = row[2]
        result['rid'] = row[3]
        result['uid'] = row[4]
        return result

    def build_attr_dict(self, resid, resname, resday, rid, uid):
        result = {}
        result['resid'] = resid
        result['resname'] = resname
        result['resday'] = resday
        result['rid'] = rid
        result['uid'] = uid
        return result

    def getAllReservations(self):
        dao = ReservationDAO()
        reservation_list = dao.getAllReservations()
        result_list = []
        for row in reservation_list:
            obj = self.build_map_dict(row)
            rsdao = ReservationScheduleDAO()
            rs = rsdao.getReservationScheduleByReservationId(obj['resid'])
            times = []
            for t in rs:
                times.append(t[1])
            obj['tids'] = times
            result_list.append(obj)
        return jsonify(result_list)

    def getReservationById(self, resid):
        dao = ReservationDAO()
        reservation_tuple = dao.getReservationById(resid)
        if not reservation_tuple:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(reservation_tuple)
            rsdao = ReservationScheduleDAO()
            rs = rsdao.getReservationScheduleByReservationId(resid)
            times = []
            for t in rs:
                times.append(t[1])
            result['tids'] = times
            return jsonify(result), 200

    def addNewReservation(self, json):
        resname = json['resname']
        resday = json['resday']
        rid = json['rid']
        uid = json['uid']
        members = json['members']
        time_slots = json['time_slots']
        members.append(uid)
        dao = ReservationDAO()
        if dao.checkForConflicts(rid, resday, time_slots):
            return jsonify("This reservation cannot be made at this time due to a conflict.")
        resid = dao.insertReservation(resname, resday, rid, uid)
        result = self.build_attr_dict(resid, resname, resday, rid, uid)
        members_dao = MembersDAO()
        us_dao = UserScheduleDAO()
        rs_dao = RoomScheduleDAO()
        reserv_dao = ReservationScheduleDAO()
        for member in json['members']:
            if member != uid:
                members_dao.insertMember(member, resid)
            for time_slot in time_slots:
                us_dao.insertUserSchedule(member, time_slot, resday)
        for time_slot in time_slots:
            rs_dao.insertRoomSchedule(rid, time_slot, resday)
            reserv_dao.insertReservationSchedule(resid, time_slot)

        return jsonify(result), 201

    def updateReservation(self, resid, json):
        resname = json['resname']
        resday = json['resday']
        rid = json['rid']
        uid = json['uid']
        time_slots = json['tids']
        new_time_slots = []
        dao = ReservationDAO()
        reserv_dao = ReservationScheduleDAO()
        used_tids = dao.getInUseTids(resid)
        for tid in time_slots:
            if tid not in used_tids:
                new_time_slots.append(tid)
        if dao.checkForConflicts(rid, resday, new_time_slots):
            return jsonify("This reservation cannot be made at this time due to a conflict.")
        updated_reservation = dao.updateReservation(resid, resname, resday, rid, uid)
        reserv_dao.deleteReseravtionSchedule(resid)
        for tid in time_slots:
            reserv_dao.insertReservationSchedule(resid, tid)
        result = self.build_attr_dict(resid, resname, resday, rid, uid)
        result["tids"] = time_slots
        return jsonify(result), 200

    def deleteReservation(self, resid):
        dao = ReservationDAO()
        result = dao.deleteReservation(resid)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def getMostUsedRooms(self, num):
        dao = ReservationDAO()
        result = dao.getMostUsedRooms(num)
        return jsonify(result)

    def getBusiestHours(self, num):
        dao = ReservationDAO()
        result = dao.getBusiestHours(num)
        return jsonify(result)

    def getWhoAppointedRoomAtTime(self, rid, tid):
        dao = ReservationDAO()
        result = dao.getWhoAppointedRoomAtTime(rid, tid)
        return jsonify(result)
      
    def getMostBookedUsers(self, num):
        dao = ReservationDAO()
        result = dao.getMostBookedUsers(num)
        return jsonify(result)

    def getFreeTime(self, json):
        uids = json['uids']
        usday = json['usday']
        uschedao = UserScheduleDAO()
        tsdao = TimeSlotDAO()
        result = []
        allOccupiedTid = []
        for uid in uids:
            #finds occupied tid of a specific user on a certain day
            occupiedTids = uschedao.getOccupiedTid(uid, usday)
            for tid in occupiedTids:
                if tid not in allOccupiedTid:
                    allOccupiedTid.append(tid)

        timeslots = tsdao.getAllTimeSlots()
        #loops through all the time slots and only keeps the ones that are not occupied for a user
        for time in timeslots:
            if int(time[0]) not in allOccupiedTid:
                result.append(BaseTimeSlot().build_map_dict(time))

        return jsonify(result)




