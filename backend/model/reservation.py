from config.dbconfig import pg_config
import psycopg2
import json

class ReservationDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'],
                          pg_config['user'], pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def __del__(self):
        self.conn.close()

    def getAllReservations(self):
        cursor = self.conn.cursor()
        query = "select resid, resname, resday, rid, uid from public.reservation;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getReservationById(self, resid):
        cursor = self.conn.cursor()
        query = "select resid, resname, resday, rid, uid from public.reservation where resid = %s;"
        cursor.execute(query, (resid,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def getReservationByUserId(self, uid):
        cursor = self.conn.cursor()
        query = "with involved_reservations as (select resid from " \
                "((select uid, resid from reservation where uid = %s) " \
                "union (select uid, resid from members where uid = %s)) as temp) " \
                "select resid, resname, resday, reservation.uid, rid from reservation natural inner join reservation_schedule " \
                "where resid in (select resid from involved_reservations);"
        cursor.execute(query, (uid, uid))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def insertReservation(self, resname, resday, rid, uid):
        cursor = self.conn.cursor()
        query = "insert into public.reservation(resname, resday, rid, uid) values(%s,%s,%s,%s) returning resid;"
        cursor.execute(query, (resname, resday, rid, uid))
        resid = cursor.fetchone()[0]
        self.conn.commit()
        cursor.close()
        return resid

    def updateReservation(self, resid, resname, resday, rid):
        cursor = self.conn.cursor()
        query = "update public.reservation set resname = %s, resday = %s, rid = %s where resid = %s;"
        cursor.execute(query, (resname, resday, rid, resid))
        self.conn.commit()
        cursor.close()
        return True

    def deleteReservation(self, resid):
        cursor = self.conn.cursor()
        query = "delete from public.reservation where resid=%s;"
        cursor.execute(query, (resid,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def getMostUsedRooms(self):
        cursor = self.conn.cursor()
        query = "select rid, rname, rcapacity, rbuildname, rpermission, times_used from (select rid, count(*) \
                 as times_used from reservation group by rid)as temp1 natural inner join public.room \
                 order by times_used desc limit 10"
        cursor.execute(query)
        result = []
        for row in cursor:
            dict = {}
            dict['rid'] = row[0]
            dict['rname'] = row[1]
            dict['rcapacity'] = row[2]
            dict['rbuildname'] = row[3]
            dict['rpermission'] = row[4]
            dict['times_used'] = row[5]
            result.append(dict)
        cursor.close()
        return result

    def getBusiestHours(self):
        cursor = self.conn.cursor()
        query = "with busiest_hours as (select tid, count(tid) as times_booked from reservation_schedule \
                 group by tid) select * from time_slot natural inner join busiest_hours order by times_booked \
                 desc limit 5"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(json.loads(json.dumps(row, indent=4, default=str)))
        cursor.close()
        return result

    def getWhoAppointedRoomAtTime(self, rid, tid, date):
        cursor = self.conn.cursor()
        query = "select uid, username, uemail, upassword, ufirstname, ulastname, upermission from reservation \
        natural inner join reservation_schedule natural inner join public.user where tid = %s and rid = %s and reservation.resday = %s"
        cursor.execute(query, (tid, rid, date))
        if cursor.rowcount <= 0:
            return "No one is using this room at this time."
        result = {}

        temp = cursor.fetchone()
        result['uid'] = temp[0]
        result['username'] = temp[1]
        result['uemail'] = temp[2]
        result['upassword'] = temp[3]
        result['ufirstname'] = temp[4]
        result['ulastname'] = temp[5]
        result['upermission'] = temp[6]
        cursor.close()
        return result

    def getMostBookedUsers(self):
        cursor = self.conn.cursor()
        query = "with booking_table as (select uid, count(*) as times_booked from ((select uid, resid from reservation)\
        union (select uid, resid from members)) as temp natural inner join public.user group by uid order by times_booked desc) \
        select uid, username, uemail, upassword, ufirstname, ulastname, upermission, times_booked from public.user natural  inner join \
        booking_table order by times_booked desc limit 10;"
        cursor.execute(query)
        result = []
        for row in cursor:
            dict = {}
            dict['uid'] = row[0]
            dict['username'] = row[1]
            dict['uemail'] = row[2]
            dict['upassword'] = row[3]
            dict['ufirstname'] = row[4]
            dict['ulastname'] = row[5]
            dict['upermission'] = row[6]
            dict['times_booked'] = row[7]
            result.append(dict)
        cursor.close()
        return result

    def checkForConflicts(self, rid, resday, time_slots):
        boolean = False
        cursor = self.conn.cursor()
        query = "select * from reservation natural inner join reservation_schedule where rid = %s and resday = %s and tid = %s"
        for time_slot in time_slots:
            cursor.execute(query, (rid, resday, time_slot))
            if cursor.rowcount > 0:
                boolean = True
                break
        cursor.close()
        return boolean

    def getInUseTids(self, resid):
        cursor = self.conn.cursor()
        query = "select tid from public.reservation_schedule where resid = %s;"
        cursor.execute(query, (resid,))
        result = []
        for row in cursor:
            result.append(row[0])
        cursor.close()
        return result

    def changeResName(self, resid, newResName):
        cursor = self.conn.cursor()
        query = "update public.reservation set resname = %s where resid = %s;"
        cursor.execute(query, (newResName, resid))
        if cursor.rowcount <= 0:
            return False
        self.conn.commit()
        cursor.close()
        return True

    def removeUserByUsername(self, username, resid):
        cursor = self.conn.cursor()
        query = "with id_from_username as (select uid from public.user where username = %s) \
        delete from public.members where resid=%s and uid in (select uid from id_from_username);"
        cursor.execute(query, (username, resid))
        affected_rows = cursor.rowcount
        self.conn.commit()
        cursor.close()
        return affected_rows != 0
