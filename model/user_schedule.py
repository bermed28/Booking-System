from config.dbconfig import pg_config
import psycopg2

class UserScheduleDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'], pg_config['user'],
                                                                  pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def getAllUserSchedules(self):
        cursor = self.conn.cursor()
        query = "select usid, uavailability, uid, tid, usday from public.user_schedule;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getUserScheduleById(self, usid):
        cursor = self.conn.cursor()
        query = "select usid, uavailability, uid, tid, usday from public.user_schedule where usid = %s;"
        cursor.execute(query, (usid,))
        result = cursor.fetchone()
        return result

    def insertUserSchedule(self, uavailability, uid, tid, usday):
        cursor = self.conn.cursor()
        query = "insert into public.user_schedule(uavailability, uid, tid, usday) values(%s,%s,%s,%s) returning usid;"
        cursor.execute(query, (uavailability, uid, tid, usday))
        rid = cursor.fetchone()[0]
        self.conn.commit()
        return rid

    def updateUserSchedule(self, usid, uavailability, uid, tid):
        cursor = self.conn.cursor()
        query = "update public.user_schedule set uavailability = %s, uid = %s, tid = %s where usid = %s;"
        cursor.execute(query, (uavailability, uid, tid, usid))
        self.conn.commit()
        return True

    def deleteUserSchedule(self, usid):
        cursor = self.conn.cursor()
        query = "delete from public.user_schedule where usid=%s;"
        cursor.execute(query, (usid,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        return affected_rows != 0