from flask import jsonify
from model.reservation import ReservationDAO
from model.members import MembersDAO
from model.user_schedule import UserScheduleDAO
from model.room_schedule import RoomScheduleDAO
from model.time_slot import TimeSlotDAO
from controller.time_slot import BaseTimeSlot
from model.reservation_schedule import ReservationScheduleDAO
from model.room import RoomDAO


class BaseReservation:

    def build_map_dict(self, row):
        result = {}
        result['resid'] = row[0]
        result['resname'] = row[1]
        result['resday'] = row[2]
        result['rid'] = row[3]
        result['uid'] = row[4]
        return result

    #This function is used to create a dictionary that can be properly jsonified because
    #the time datatype causes errors in flask when trying to jsonify it directly. It´s only
    #used in the getMostBookedTimeSlots function
    def build_most_booked_dict(self, row):
        result = {}
        result['tid'] = row[0]
        result['tstarttime'] = row[1]
        result['tendtime'] = row[2]
        result['times_booked'] = row[3]
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
            used_time_slots = rsdao.getReservationScheduleByReservationId(obj['resid'])
            times = []
            for time_slot in used_time_slots:
                times.append(time_slot[1])
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
            used_time_slots = rsdao.getReservationScheduleByReservationId(resid)
            times = []
            for time_slot in used_time_slots:
                times.append(time_slot[1])
            result['tids'] = times
            return jsonify(result), 200

    #Adding a reservation implies adding rows to the members, user schedule, reservation schedule and room schedule
    #tables as well
    def addNewReservation(self, json):
        resname = json['resname']
        resday = json['resday']
        rid = json['rid']
        uid = json['uid']
        members = json['members']
        time_slots = json['time_slots']
        room_dao = RoomDAO()
        if len(members) > room_dao.getRoomCapacity(rid):
            return jsonify("This reservation cannot be made because there are too many people for this room."), 400
        members.append(uid)
        dao = ReservationDAO()
        rs_dao = RoomScheduleDAO()
        if dao.checkForConflicts(rid, resday, time_slots) or rs_dao.checkForConflicts(rid, resday, time_slots):
            return jsonify("This reservation cannot be made at this time due to a conflict."), 409
        resid = dao.insertReservation(resname, resday, rid, uid)
        result = self.build_attr_dict(resid, resname, resday, rid, uid)
        members_dao = MembersDAO()
        us_dao = UserScheduleDAO()
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
        members = json['members']
        time_slots = json['tids']
        new_time_slots = []
        dao = ReservationDAO()
        resSchedDAO = ReservationScheduleDAO()
        used_tids = dao.getInUseTids(resid)
        for tid in time_slots:
            if tid not in used_tids:
                new_time_slots.append(tid)

        roomSchedDAO = RoomScheduleDAO()
        if dao.checkForConflicts(rid, resday, new_time_slots) or roomSchedDAO.checkForConflicts(rid, resday, time_slots):
            return jsonify("This reservation cannot be made at this time due to a conflict."), 409

        #Get old info before deleting
        reservationdDAO = ReservationDAO()
        membersDAO = MembersDAO()
        userSchedDAO = UserScheduleDAO()

        OldReservationInfo = reservationdDAO.getReservationById(resid)
        oldMembers = membersDAO.getMembersByReservationId(resid)
        oldate = OldReservationInfo[2]
        oldrid = OldReservationInfo[3]
        uid = OldReservationInfo[4]
        oldMembers.append((uid, resid))

        #Delete old members
        membersDAO.deleteReservationMembers(resid)
        #Insert update members
        for mem in members:
            membersDAO.insertMember(mem, resid)

        #Go throught old members and delete from their US the reservation
        for mem in oldMembers:
            for time in used_tids:
                userSchedDAO.deleteUserSchedulebyTimeIDAndDay(mem[0], time, oldate)


        for time in used_tids:
            roomSchedDAO.deleteRoomScheduleByTimeAndDay(oldrid, time, oldate)

        updated_reservation = dao.updateReservation(resid, resname, resday, rid)
        resSchedDAO.deleteReservationSchedule(resid) #Delete old tids
        for tid in time_slots: #Add new tid
            resSchedDAO.insertReservationSchedule(resid, tid)

        #Add new time of reservation to user schedule
        members.append(uid)
        for mem in members:
            for time in time_slots:
                userSchedDAO.insertUserSchedule(mem, time, resday)

        roomSchedDAO = RoomScheduleDAO()
        # Add new time of reservation to room schedule
        for time in time_slots:
            roomSchedDAO.insertRoomSchedule(rid, time, resday)

        result = self.build_attr_dict(resid, resname, resday, rid, uid)
        result["tids"] = time_slots
        return jsonify(result), 200

    def deleteReservation(self, resid):
        """
        Delete from Reservation, Reservation/User/Room Schedule, Members
        """
        reservationdDAO, membersDAO = ReservationDAO(), MembersDAO()
        roomSchedDAO, userSchedDAO, resSchedDAO = RoomScheduleDAO(), UserScheduleDAO(), ReservationScheduleDAO()

        reservationInfo = reservationdDAO.getReservationById(resid)
        memberList = membersDAO.getMembersByReservationId(resid)
        memberList.append((reservationInfo[4], resid))
        timeSlotList = resSchedDAO.getTimeSlotsByReservationId(resid)
        day, room = reservationInfo[2], reservationInfo[3]

        delUserSched, delRoomSched = True, True

        for member in memberList:
            for time in timeSlotList:
                if not userSchedDAO.deleteUserSchedulebyTimeIDAndDay(member[0], time, day):
                    delUserSched = False

        for time in timeSlotList:
            if not roomSchedDAO.deleteRoomScheduleByTimeAndDay(room, time, day):
                delRoomSched = False

        delMembers = membersDAO.deleteReservationMembers(resid)
        delResSched = resSchedDAO.deleteReservationSchedule(resid)

        delRes = reservationdDAO.deleteReservation(resid)


        if delRes and delMembers and delUserSched and delRoomSched and delRes:
            return jsonify("DELETED"), 200
        else:
            return jsonify("COULD NOT DELETE RESERVATION CORRECTLY"), 500


    def getMostUsedRooms(self):
        dao = ReservationDAO()
        result = dao.getMostUsedRooms()
        return jsonify(result)

    def getBusiestHours(self):
        dao = ReservationDAO()
        temp = dao.getBusiestHours()
        result_list = []
        for row in temp:
            obj = self.build_most_booked_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getWhoAppointedRoomAtTime(self, json):
        dao = ReservationDAO()
        rid = json['rid']
        tid = json['tid']
        date = json['date']
        result = dao.getWhoAppointedRoomAtTime(rid, tid, date)
        return jsonify(result)
      
    def getMostBookedUsers(self):
        dao = ReservationDAO()
        result = dao.getMostBookedUsers()
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




