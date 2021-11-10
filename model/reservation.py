from config.dbconfig import pg_config
import psycopg2

class ReservationDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'], pg_config['user'],
                                                                  pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def getAllReservations(self):
        cursor = self.conn.cursor()
        query = "select resid, resname, resday, rid, uid from public.reservation;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getReservationById(self, resid):
        cursor = self.conn.cursor()
        query = "select resid, resname, resday, rid, uid from public.reservation where resid = %s;"
        cursor.execute(query, (resid,))
        result = cursor.fetchone()
        return result

    def insertReservation(self, resname, resday, rid, uid):
        cursor = self.conn.cursor()
        query = "insert into public.reservation(resname, resday, rid, uid) values(%s,%s,%s,%s) returning resid;"
        cursor.execute(query, (resname, resday, rid, uid))
        rid = cursor.fetchone()[0]
        self.conn.commit()
        return rid

    def updateReservation(self, resid, resname, resday, rid, uid):
        cursor = self.conn.cursor()
        query = "update public.reservation set resname = %s, resday = %s, rid = %s, uid = %s where resid = %s;"
        cursor.execute(query, (resname, resday, rid, uid, resid))
        self.conn.commit()
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
        return affected_rows != 0

    def getMostUsedRooms(self, num):
        cursor = self.conn.cursor()
        query = "select rid, frequency, rname from (select rid, count(*) as frequency from reservation group by rid)as temp1 natural inner join public.room order by frequency desc limit %s"
        cursor.execute(query, (num,))
        result = []
        for row in cursor:
            dict = {}
            dict["rid"] = row[0]
            dict["rname"] = row[2]
            result.append(dict)
        return result

    def getMostBookedUsers(self, num):
        cursor = self.conn.cursor()
        query = "select uid, frequency, ufirstname from (select uid, count(*) as frequency from reservation group by uid) as temp1 natural inner join public.user order by frequency desc limit %s"
        cursor.execute(query, (num,))
        result = []
        for row in cursor:
            dict = {}
            dict["uid"] = row[0]
            dict["ufirstname"] = row[2]
            result.append(dict)
        return result