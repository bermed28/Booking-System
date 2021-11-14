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
        query = "select rid, rname, frequency from \
            (select rid, count(*) as frequency from\
            (select * from reservation inner join members on reservation.resid = members.resid \
            where members.uid = %s or reservation.uid = %s) as temp9 group by rid)as temp1\
            natural inner join room order by frequency desc limit 1;"
        cursor.execute(query, (uid, uid))
        result = []
        if cursor.rowcount <= 0:
            return "User has not used any rooms"

        row = cursor.fetchone()
        dict = {}
        dict['rid'] = row[0]
        dict['rname'] = row[1]
        dict['frequency'] = row[2]
        result.append(dict)
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

    def checkPermission(self, uid):
        cursor = self.conn.cursor()
        query = "select upermission from public.user where uid = %s"
        cursor.execute(query, (uid,))
        result = cursor.fetchone()[0]
        cursor.close()
        return result

    def getMostBookedWith(self, uid):
        cursor = self.conn.cursor()
        #Get all the members that are have been in the same reservation as the uid
        query = "with todoResid as (select reservation.resid from\
                reservation inner join members on reservation.resid = members.resid\
                where reservation.uid = %s or members.uid = %s)\
                select uid, count(*) from (select * from members natural inner join todoResid where uid <> %s)\
                as temp2 group by uid"
        cursor.execute(query, (uid, uid, uid))
        result = {}
        for row in cursor:
            result[row[0]] = row[1]
        # Get all the users that have created a reservation and invited the uid
        query2 = "with todoResid as (select reservation.resid from \
                reservation inner join members on reservation.resid = members.resid where\
                reservation.uid = %s or members.uid = %s)\
                select uid, count(*) from (select * from \
                reservation natural inner join todoResid where uid <> %s)as temp2 group by uid"
        cursor.execute(query2, (uid, uid, uid))
        for row in cursor:
            if row[0] in result:
                result[row[0]] += row[1]

        cursor.close()
        v = list(result.values())
        maxVal = max(result.values())
        k = list(result.keys())
        resuid = k[v.index(maxVal)]
        return {"uid": resuid, "count": maxVal}
