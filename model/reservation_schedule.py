from config.dbconfig import pg_config
import psycopg2

class ReservationScheduleDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'], pg_config['user'],
                                                                  pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def __del__(self):
        self.conn.close()

    def getAllReservationSchedules(self):
        cursor = self.conn.cursor()
        query = "select resid, tid from public.reservation_schedule;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getTimeSlotsByReservationId(self, resid):
        cursor = self.conn.cursor()
        query = "select tid from public.reservation_schedule where resid = %s;"
        cursor.execute(query, (resid,))
        result = []
        for row in cursor:
            result.append(row[0])
        cursor.close()
        return result

    def getReservationScheduleByReservationId(self, resid):
        cursor = self.conn.cursor()
        query = "select resid, tid from public.reservation_schedule where resid = %s;"
        cursor.execute(query, (resid,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def insertReservationSchedule(self, resid, tid):
        cursor = self.conn.cursor()
        query = "insert into public.reservation_schedule(resid, tid) values(%s,%s);"
        cursor.execute(query, (resid, tid))
        self.conn.commit()
        cursor.close()
        return [resid, tid]

    def updateReservationShedule(self, oldResid, newResid, tid):
        cursor = self.conn.cursor()
        query = "update public.reservation_schedule set resid = %s, tid = %s where resid = %s;"
        cursor.execute(query, (newResid, tid, oldResid))
        self.conn.commit()
        cursor.close()
        return True

    def deleteReservationSchedule(self, resid):
        cursor = self.conn.cursor()
        query = "delete from public.reservation_schedule where resid=%s;"
        cursor.execute(query, (resid,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        cursor.close()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        return affected_rows != 0