from config.dbconfig import pg_config
import psycopg2

class RoomAdheresToDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'], pg_config['user'],
                                                                  pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def getAllRoomAdherences(self):
        cursor = self.conn.cursor()
        query = "select rid, rsid from public.room_adheres_to;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getRoomAdherenceByRoomId(self, rid):
        cursor = self.conn.cursor()
        query = "select rid, rsid from public.room_adheres_to where rid = %s;"
        cursor.execute(query, (rid,))
        result = cursor.fetchone()
        return result

    def getRoomAdherenceByRoomScheduleId(self, rsid):
        cursor = self.conn.cursor()
        query = "select rid, rsid from public.room_adheres_to where rsid = %s;"
        cursor.execute(query, (rsid,))
        result = cursor.fetchone()
        return result

    def insertRoomAdherence(self, rid, rsid):
        cursor = self.conn.cursor()
        query = "insert into public.room_adheres_to(rid, rsid) values(%s,%s) returning (rid, rsid);"
        cursor.execute(query, (rid, rsid))
        rid = cursor.fetchone()[0]
        self.conn.commit()
        return rid

    def updateRoomAdherence(self, rid, rsid):
        cursor = self.conn.cursor()
        query = "update public.room_adheres_to set rid = %s, rsid = %s where rsid = %s;"
        cursor.execute(query, (rid, rsid, rsid))
        self.conn.commit()
        return True

    def deleteRoomAdherence(self, rsid):
        cursor = self.conn.cursor()
        query = "delete from public.room_adheres_to where rsid=%s;"
        cursor.execute(query, (rsid,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        return affected_rows != 0