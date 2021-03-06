from config.dbconfig import pg_config
import psycopg2
import json

class UserDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'],
                          pg_config['user'], pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def __del__(self):
        self.conn.close()

    def getAllUsers(self):
        cursor = self.conn.cursor()
        query = "select uid, username, uemail, upassword, ufirstname, ulastname, upermission from public.user;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getUserById(self, uid):
        cursor = self.conn.cursor()
        query = "select uid, username, uemail, upassword, ufirstname, ulastname, upermission from public.user where uid = %s;"
        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def getUserByLoginInfo(self, email, password):
        cursor = self.conn.cursor()
        query = "select uid, username, uemail, upassword, ufirstname, ulastname, upermission from public.user where uemail=%s and upassword=%s"
        cursor.execute(query, (email, password))
        result = cursor.fetchone()
        cursor.close()
        return result

    def insertUser(self, username, uemail, upassword, ufirstname, ulastname, upermission):
        cursor = self.conn.cursor()
        query = "insert into public.user(username, uemail, upassword, ufirstname, ulastname, upermission) \
                 values(%s,%s,%s,%s,%s,%s) returning uid;"
        cursor.execute(query, (username, uemail, upassword, ufirstname, ulastname, upermission))
        uid = cursor.fetchone()[0]
        self.conn.commit()
        cursor.close()
        return uid

    def updateUser(self, uid, username, uemail, upassword, ufirstname, ulastname, upermission):
        cursor = self.conn.cursor()
        query = "update public.user set username = %s, uemail = %s, upassword = %s, ufirstname = %s, ulastname = %s, \
                 upermission = %s where uid = %s;"
        cursor.execute(query, (username, uemail, upassword, ufirstname, ulastname, upermission, uid))
        self.conn.commit()
        cursor.close()
        return True

    def deleteUser(self, uid):
        cursor = self.conn.cursor()
        query = "delete from public.user where uid=%s;"
        cursor.execute(query, (uid,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows !=0

    def getMostUsedRoombyUser(self, uid):
        cursor = self.conn.cursor()
        query = "with involved_reservations as (select resid from ((select uid, resid from reservation where uid = %s)\
         union (select uid, resid from members where uid = %s)) as temp), room_uses as (select rid, count(*) as uses\
         from reservation natural inner join room where resid in (select resid from involved_reservations)\
         group by rid) select * from room natural inner join room_uses order by uses desc"
        cursor.execute(query, (uid, uid))
        result = []
        if cursor.rowcount <= 0:
            return "User has not used any rooms"

        row = cursor.fetchone()
        result = {}
        result['rid'] = row[0]
        result['rname'] = row[1]
        result['rcapacity'] = row[2]
        result['rbuildname'] = row[3]
        result['rpermission'] = row[4]
        result['uses'] = row[5]
        cursor.close()
        return result

    def getTimeSlot(self):
        cursor = self.conn.cursor()
        query = "select * from time_slot;"
        cursor.execute(query)
        result = []
        for row in cursor:
            dict = {}
            dict['tid'] = row[0]
            dict['tstarttime'] = row[1]
            dict['tendtime'] = row[2] #Causes TypeError: Object of type time is not JSON serializable
            #Turning time to string with a json dumps avoids the type casting problem
            result.append(json.loads(json.dumps(dict, indent=4, default=str)))
        cursor.close()
        return result

    def getUserOccupiedTimeSlots(self, uid, rsday):
        cursor = self.conn.cursor()
        query = "select tid from user_schedule where uid = %s and usday = %s"
        cursor.execute(query, (uid, rsday))
        result = []
        for row in cursor:
            result.append(row[0])
        cursor.close()
        return result

    def getAllOccupiedUserSchedule(self, uid):
        cursor = self.conn.cursor()
        # query = "select tid, usday from user_schedule where uid = %s"
        query = "with involved_reservations as (select resid from ((select uid, resid from reservation where uid = %s) \
        union (select uid, resid from members where uid = %s)) as temp), \
        time_slots_to_meet as (select tid, resday from reservation_schedule natural inner join reservation where resid in (select resid from involved_reservations)) \
        select tid, usday from user_schedule where ROW(tid, usday) not in (select tid, resday as usday from time_slots_to_meet) and uid=%s;"

        cursor.execute(query, (uid, uid, uid))
        result = {}
        for row in cursor:
            if str(row[1]) not in result:
                result[str(row[1])] = [row[0]]
            else:
                result[str(row[1])].append(row[0])
        cursor.close()
        return result

    def checkPermission(self, uid):
        cursor = self.conn.cursor()
        query = "select upermission from public.user where uid = %s"
        cursor.execute(query, (uid,))
        result = cursor.fetchone()[0]
        cursor.close()
        return result

    def getMostBookedWith(self, uid):
        cursor = self.conn.cursor()
        query = "with involved_reservations as (select resid from ((select uid, resid from reservation where uid = %s) \
        union (select uid, resid from members where uid = %s)) as temp), involvements_per_user as ( \
        select uid, count(*) as involvements from ((select uid, resid from reservation) union (select \
        uid, resid from members)) as temp2 where resid in(select resid from involved_reservations) and uid <> %s \
        group by uid) select * from public.user natural inner join involvements_per_user order by involvements desc;"
        cursor.execute(query, (uid, uid, uid))
        if cursor.rowcount <= 0:
            return "User has not been booked with anyone"
        row = cursor.fetchone()
        result = {}
        result['uid'] = row[0]
        result['username'] = row[1]
        result['uemail'] = row[2]
        result['upassword'] = row[3]
        result['ufirstname'] = row[4]
        result['ulastname'] = row[5]
        result['upermission'] = row[6]
        result['times'] = row[7]
        cursor.close()
        return result

    def getAllUserInvolvements(self, uid):
        cursor = self.conn.cursor()
        query = "select resid from ((select uid, resid from reservation where uid = %s) union \
                 (select uid, resid from members where uid = %s)) as temp"
        cursor.execute(query, (uid, uid))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getUidbyUsername(self, username):
        cursor = self.conn.cursor()
        query = "select uid from public.user where username = %s;"
        cursor.execute(query, (username,))
        if cursor.rowcount <= 0:
            return -1
        result = cursor.fetchone()[0]
        cursor.close()
        return result
