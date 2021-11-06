from config.dbconfig import pg_config
import psycopg2

class RoomDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'], pg_config['user'],
                                                                  pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def getAllRooms(self):
        cursor = self.conn.cursor()
        query = "select rid, rname, rcapacity, rbuildname, rpermission from public.room;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getRoomById(self, rid):
        cursor = self.conn.cursor()
        query = "select rid, rname, rcapacity, rbuildname, rpermission from public.room where rid = %s;"
        cursor.execute(query, (rid,))
        result = cursor.fetchone()
        return result

    def insertRoom(self, rname, rcapacity, rbuildname, rpermission):
        cursor = self.conn.cursor()
        query = "insert into public.room(rname, rcapacity, rbuildname, rpermission) values(%s,%s,%s,%s) returning rid;"
        cursor.execute(query, (rname, rcapacity, rbuildname, rpermission))
        rid = cursor.fetchone()[0]
        self.conn.commit()
        return rid

    def updateRoom(self, rid, rname, rcapacity, rbuildname, rpermission):
        cursor = self.conn.cursor()
        query = "update public.room set rname = %s, rcapacity = %s, rbuildname = %s, rpermission = %s where rid = %s;"
        cursor.execute(query, (rname, rcapacity, rbuildname, rpermission, rid))
        self.conn.commit()
        return True

    def deleteRoom(self, rid):
        cursor = self.conn.cursor()
        query = "delete from public.room where rid=%s;"
        cursor.execute(query, (rid,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        return affected_rows != 0