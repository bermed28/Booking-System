from flask import jsonify
from model.user import UserDAO
from model.time_slot import TimeSlotDAO

class BaseUser:

    def build_map_dict(self, row):
        result = {}
        result['uid'] = row[0]
        result['username'] = row[1]
        result['uemail'] = row[2]
        result['upassword'] = row[3]
        result['ufirstname'] = row[4]
        result['ulastname'] = row[5]
        result['upermission'] = row[6]
        return result

    def build_attr_dict(self, uid, username, uemail, upassword, ufirstname, ulastname, upermission):
        result = {}
        result['uid'] = uid
        result['username'] = username
        result['uemail'] = uemail
        result['upassword'] = upassword
        result['ufirstname'] = ufirstname
        result['ulastname'] = ulastname
        result['upermission'] = upermission
        return result

    def getAllUsers(self):
        dao = UserDAO()
        user_list = dao.getAllUsers()
        result_list = []
        for row in user_list:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getUserById(self, uid):
        dao = UserDAO()
        user_tuple = dao.getUserById(uid)
        if not user_tuple:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(user_tuple)
            return jsonify(result), 200

    def getUserByLoginInfo(self, json):
        dao = UserDAO()
        email = json['email']
        password = json['password']
        user = self.build_map_dict(dao.getUserByLoginInfo(email, password))
        return jsonify(user), 200

    def addNewUser(self, json):
        username = json['username']
        uemail = json['uemail']
        upassword = json['upassword']
        ufirstname = json['ufirstname']
        ulastname = json['ulastname']
        upermission = json['upermission']
        dao = UserDAO()
        uid = dao.insertUser(username, uemail, upassword, ufirstname, ulastname, upermission)
        result = self.build_attr_dict(uid, username, uemail, upassword, ufirstname, ulastname, upermission)
        return jsonify(result), 201

    def updateUser(self, uid, json):
        username = json['username']
        uemail = json['uemail']
        upassword = json['upassword']
        ufirstname = json['ufirstname']
        ulastname = json['ulastname']
        upermission = json['upermission']
        dao = UserDAO()
        updated_user = dao.updateUser(uid, username, uemail, upassword, ufirstname, ulastname, upermission)
        result = self.build_attr_dict(uid, username, uemail, upassword, ufirstname, ulastname, upermission)
        return jsonify(result), 200

    def deleteUser(self, uid):
        dao = UserDAO()
        if dao.getAllUserInvolvements(uid):
            return jsonify("You can't erase your account because you have pending reservations."), 400
        result = dao.deleteUser(uid)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def getMostUsedRoombyUser(self, uid):
        dao = UserDAO()
        result = dao.getMostUsedRoombyUser(uid)
        return jsonify(result)

    def getAllDayUserSchedule(self, json):
        uid = json['uid']
        usday = json['usday']
        dao = UserDAO()
        timeslots = dao.getTimeSlot()
        occupiedTid = dao.getUserOccupiedTimeSlots(uid, usday)

        for time in timeslots:
            if time['tid'] in occupiedTid:
                time['available'] = False

            if 'available' not in time:
                time['available'] = True

        return jsonify(timeslots)

    def getAllOccupiedUserSchedule(self, uid):
        dao, tsDAO = UserDAO(), TimeSlotDAO()
        occupiedTidDict = dao.getAllOccupiedUserSchedule(uid)
        for day, tids in occupiedTidDict.items():

            timeBlocks = self.getTimeBlocks(tids)

            for i in range(len(timeBlocks)):
                startTime = tsDAO.getTimeSlotByTimeSlotId(timeBlocks[i][0])
                endTime = tsDAO.getTimeSlotByTimeSlotId(timeBlocks[i][-1])
                timeBlocks[i] = [startTime[1], endTime[2]]

            occupiedTidDict[day] = timeBlocks

        return jsonify(occupiedTidDict)

    def checkPermission(self, uid):
        dao = UserDAO()
        return jsonify(dao.checkPermission(uid))

    def getMostBookedWith(self, uid):
        dao = UserDAO()
        user = dao.getMostBookedWith(uid)
        return jsonify(user)

    def getRequestedIds(self, json):
        dao = UserDAO()
        usernames = json['memberNames']
        uids = []
        for username in usernames:
            uid = dao.getUidbyUsername(username)
            if uid != -1:
                uids.append(uid)
        result = {"memberIds": uids}
        return jsonify(result)

    def getTimeBlocks(self, tids):
        tids.sort()
        timeBlocks, i, j = [], 0, 0

        while j < len(tids):
            if j == len(tids) - 1:
                timeBlocks.append(tids[i:j+1])
                break
            else:
                if tids[j + 1] - tids[j] > 1:
                    timeBlocks.append(tids[i:j+1])
                    j += 1
                    i = j
                else:
                    j += 1

        return timeBlocks
