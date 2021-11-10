from config.dbconfig import pg_config
import psycopg2
import json

class UserDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'], pg_config['user'],
                                                                  pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def getAllUsers(self):
        cursor = self.conn.cursor()
        query = "select uid, username, uemail, upassword, ufirstname, ulastname, upermission from public.user;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getUserById(self, uid):
        cursor = self.conn.cursor()
        query = "select uid, username, uemail, upassword, ufirstname, ulastname, upermission from public.user where uid = %s;"
        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        return result

    def insertUser(self, username, uemail, upassword, ufirstname, ulastname, upermission):
        cursor = self.conn.cursor()
        query = "insert into public.user(username, uemail, upassword, ufirstname, ulastname, upermission) values(%s,%s,%s,%s,%s,%s) returning uid;"
        cursor.execute(query, (username, uemail, upassword, ufirstname, ulastname, upermission))
        uid = cursor.fetchone()[0]
        self.conn.commit()
        return uid

    def updateUser(self, uid, username, uemail, upassword, ufirstname, ulastname, upermission):
        cursor = self.conn.cursor()
        query = "update public.user set username = %s, uemail = %s, upassword = %s, ufirstname = %s, ulastname = %s, upermission = %s where uid = %s;"
        cursor.execute(query, (username, uemail, upassword, ufirstname, ulastname, upermission, uid))
        self.conn.commit()
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
        return affected_rows !=0

    def getMostUsedRoombyUser(self, uid):
        cursor = self.conn.cursor()
        query = "select rid, rname from (select rid, count(*) as frequency from (select * from reservation where uid = %s) as temp9 group by rid)as temp1  natural inner join room order by frequency desc limit 1;"
        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        dict = {}
        dict['rid'] = result[0]
        dict['rname'] = result[1]
        return [dict]

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
        return result

    def getUserOccupiedTimeSlots(self, uid):
        cursor = self.conn.cursor()
        query = "select * from user_schedule where uid = %s"
        cursor.execute(query, (uid,))
        result = []
        for row in cursor:
            result.append(row)
        return result

    def checkPermission(self, uid):
        cursor = self.conn.cursor()
        query = "select upermission from public.user where uid = %s"
        cursor.execute(query, (uid,))
        result = cursor.fetchone()[0]
        return result

    def getMostBookedWith(self, uid, num):
        cursor = self.conn.cursor()
        query = "select public.members.uid as invitee, count(*) as frequency from public.reservation inner join public.members \
                 using(resid) where reservation.uid = %s group by members.uid order by frequency desc limit %s;"
        cursor.execute(query, (uid, num))
        result = []
        for row in cursor:
            dict = {}
            dict['uid'] = row[0]
            dict['frequency'] = row[1]
            result.append(dict)
        return result
