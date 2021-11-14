from flask import jsonify
from model.user import UserDAO

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

    def checkPermission(self, uid):
        dao = UserDAO()
        return jsonify(dao.checkPermission(uid))

    def getMostBookedWith(self, uid):
        dao = UserDAO()
        user = dao.getMostBookedWith(uid)
        userInfo = dao.getUserById(user['uid'])
        user['uname'] = userInfo[4] + " " + userInfo[5]
        return jsonify(user)
