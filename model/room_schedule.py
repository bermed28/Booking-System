from config.dbconfig import pg_config
import psycopg2

class RoomScheduleDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'], pg_config['user'],
                                                                  pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def getAllRoomSchedules(self):
        cursor = self.conn.cursor()
        query = "select rsid, uavailability, rid, tid from public.room_schedule;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getRoomScheduleById(self, rsid):
        cursor = self.conn.cursor()
        query = "select rsid, uavailability, rid, tid from public.room_schedule where rsid = %s;"
        cursor.execute(query, (rsid,))
        result = cursor.fetchone()
        return result

    def insertRoomSchedule(self, rsavailability, rid, tid, rsday):
        cursor = self.conn.cursor()
        query = "insert into public.room_schedule(rsavailability, rid, tid, rsday) values(%s,%s,%s,%s) returning rsid;"
        cursor.execute(query, (rsavailability, rid, tid, rsday))
        rid = cursor.fetchone()[0]
        self.conn.commit()
        return rid

    def updateRoomSchedule(self, rsid, uavailability, rid, tid):
        cursor = self.conn.cursor()
        query = "update public.room_schedule set uavailability = %s, rid = %s, tid = %s where rsid = %s;"
        cursor.execute(query, (uavailability, rid, tid, rsid))
        self.conn.commit()
        return True

    def deleteRoomSchedule(self, rsid):
        cursor = self.conn.cursor()
        query = "delete from public.room_schedule where rsid=%s;"
        cursor.execute(query, (rsid,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        return affected_rows != 0