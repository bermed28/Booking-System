from config.dbconfig import pg_config
import psycopg2

class MembersDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'],
                          pg_config['user'], pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def getAllMembers(self):
        cursor = self.conn.cursor()
        query = "select uid, resid from public.members;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getMemberByUserId(self, uid):
        cursor = self.conn.cursor()
        query = "select uid, resid from public.members where uid = %s;"
        cursor.execute(query, (uid,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getMembersByReservationId(self, resid):
        cursor = self.conn.cursor()
        query = "select uid, resid from public.members where resid = %s;"
        cursor.execute(query, (resid,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def insertMember(self, uid, resid):
        cursor = self.conn.cursor()
        query = "insert into public.members(uid, resid) values(%s,%s)"
        cursor.execute(query, (uid, resid))
        self.conn.commit()
        cursor.close()
        return True

    def updateMember(self, oldUid, newUid, resid):
        cursor = self.conn.cursor()
        query = "update public.members set uid = %s, resid = %s where uid = %s;"
        cursor.execute(query, (newUid, resid, oldUid))
        self.conn.commit()
        cursor.close()
        return True

    def deleteReservationMembers(self, resid):
        cursor = self.conn.cursor()
        query = "delete from public.members where resid=%s;"
        cursor.execute(query, (resid,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def deleteMemberbyReservationID(self, uid, resid):
        cursor = self.conn.cursor()
        query = "delete from public.members where uid=%s and resid=%s;"
        cursor.execute(query, (uid,resid))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def getUsersInReservation(self, resid):
        cursor = self.conn.cursor()
        query = "select username from public.user natural inner join members where resid = %s;"
        cursor.execute(query, (resid,))
        result = []
        for user in cursor:
            result.append(user[0])
        return result

    def __del__(self):
        self.conn.close()
