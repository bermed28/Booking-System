from config.dbconfig import pg_config
import psycopg2
import json

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

    def getRoomOccupiedTimeSlots(self, rid, rsday):
        cursor = self.conn.cursor()
        query = "select tid from room_schedule where rid = %s and rsday = %s"
        cursor.execute(query, (rid, rsday))
        result = []
        for row in cursor:
            result.append(row[0])
        return result

    def findRoomAtTime(self, tid):
        cursor = self.conn.cursor()
        query = "select rid from room where not exists (select * from room_schedule where rid = room.rid and tid =%s) limit 10"
        cursor.execute(query, (tid,))
        result = []
        for row in cursor:
            result.append(row)
        return result

    def findRoomReservations(self, rid):
        cursor = self.conn.cursor()
        query = "select * from reservation natural inner join room where rid = %s"
        cursor.execute(query, (rid,))
        result = []
        for row in cursor:
            dict = {}
            dict['resid'] = row[1]
            dict['resname'] = row[2]
            dict['resday'] = row[3]
            dict['rname'] = row[5]

            result.append(dict)
        return result

    def findReservationsTid(self, rid):
        cursor = self.conn.cursor()
        query = "select * from reservation natural inner join room where rid = %s"
        cursor.execute(query, (rid,))
        result = []
        for row in cursor:
            dict = {}
            dict['resid'] = row[1]
            dict['resname'] = row[2]
            dict['resday'] = row[3]
            dict['rname'] = row[5]

            result.append(dict)
        return result

