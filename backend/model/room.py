from config.dbconfig import pg_config
import psycopg2
import json

class RoomDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'],
                          pg_config['user'], pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def getAllRooms(self):
        cursor = self.conn.cursor()
        query = "select rid, rname, rcapacity, rbuildname, rpermission from public.room;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getRoomById(self, rid):
        cursor = self.conn.cursor()
        query = "select rid, rname, rcapacity, rbuildname, rpermission from public.room where rid = %s;"
        cursor.execute(query, (rid,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def insertRoom(self, rname, rcapacity, rbuildname, rpermission):
        cursor = self.conn.cursor()
        query = "insert into public.room(rname, rcapacity, rbuildname, rpermission) values(%s,%s,%s,%s) returning rid;"
        cursor.execute(query, (rname, rcapacity, rbuildname, rpermission))
        rid = cursor.fetchone()[0]
        self.conn.commit()
        cursor.close()
        return rid

    def updateRoom(self, rid, rname, rcapacity, rbuildname, rpermission):
        cursor = self.conn.cursor()
        query = "update public.room set rname = %s, rcapacity = %s, rbuildname = %s, rpermission = %s where rid = %s;"
        cursor.execute(query, (rname, rcapacity, rbuildname, rpermission, rid))
        self.conn.commit()
        cursor.close()
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
        cursor.close()
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
        cursor.close()
        return result

    def getRoomOccupiedTimeSlots(self, rid, rsday):
        cursor = self.conn.cursor()
        query = "select tid from room_schedule where rid = %s and rsday = %s"
        cursor.execute(query, (rid, rsday))
        result = []
        for row in cursor:
            result.append(row[0])
        cursor.close()
        return result

    def findRoomAtTime(self, tid, date):
        cursor = self.conn.cursor()
        query = "select * from room where not exists (select * from room_schedule where rid = room.rid and tid =%s and \
                 rsday = %s)"
        cursor.execute(query, (tid, date))
        result = []
        for row in cursor:
            dict = {}
            dict['rid'] = row[0]
            dict['rname'] = row[1]
            dict['rcapacity'] = row[2]
            dict['rbuildname'] = row[3]
            dict['rpermission'] = row[4]
            result.append(dict)
        cursor.close()
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
        cursor.close()
        return result

    def findRoomReservationsForUser(self, rid, uid):
        cursor = self.conn.cursor()
        query = "select * from reservation natural inner join room where rid = %s and uid = %s"
        cursor.execute(query, (rid, uid))
        result = []
        for row in cursor:
            dict = {}
            dict['resid'] = row[1]
            dict['resname'] = row[2]
            dict['resday'] = row[3]
            dict['rname'] = row[5]
            result.append(dict)
        cursor.close()
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
        cursor.close()
        return result

    def getRoomPermission(self, rid):
        cursor = self.conn.cursor()
        query = "select rpermission from room where rid = %s"
        cursor.execute(query, (rid,))
        result = cursor.fetchone()[0]
        cursor.close()
        return result

    def getRoomCapacity(self, rid):
        cursor = self.conn.cursor()
        query = "select rcapacity from room where rid = %s"
        cursor.execute(query, (rid,))
        result = cursor.fetchone()[0]
        cursor.close()
        return result

    def getAllRoomUses(self, rid):
        cursor = self.conn.cursor()
        query = "select * from reservation where rid = %s"
        cursor.execute(query, (rid,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getAllOccupiedRoomSchedule(self, rid):
        cursor = self.conn.cursor()
        query = "with involved_reservations as ( select resid from (select rid, resid from reservation where rid = %s) as temp),\
        time_slots_to_meet as (select tid, resday, rid from reservation_schedule natural inner join reservation where resid in (select resid from involved_reservations))\
        select tid, rsday from room_schedule where ROW(tid, rsday) not in (select tid, resday as usday from time_slots_to_meet) and rid = %s;"
        cursor.execute(query, (rid, rid))

        result = {}
        for row in cursor:
            if str(row[1]) not in result:
                result[str(row[1])] = [row[0]]
            else:
                result[str(row[1])].append(row[0])
        cursor.close()
        return result

    def __del__(self):
        self.conn.close()
