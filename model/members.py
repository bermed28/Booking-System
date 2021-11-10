from config.dbconfig import pg_config
import psycopg2

class MembersDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'], pg_config['user'],
                                                                  pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def getAllMembers(self):
        cursor = self.conn.cursor()
        query = "select uid, resid from public.members;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getMemberByUserId(self, uid):
        cursor = self.conn.cursor()
        query = "select uid, resid from public.members where uid = %s;"
        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        return result

    def getMembersByReservationId(self, resid):
        cursor = self.conn.cursor()
        query = "select uid, resid from public.members where resid = %s;"
        cursor.execute(query, (resid,))
        result = []
        for row in cursor:
            result.append(row)
        return result

    def insertMember(self, uid, resid):
        cursor = self.conn.cursor()
        query = "insert into public.members(uid, resid) values(%s,%s)"
        cursor.execute(query, (uid, resid))
        self.conn.commit()
        # row = cursor.fetchone()
        # print(row)
        # uid, resid = row[0], row[1]
        # self.conn.commit()
        return True

    def updateMember(self, oldUid, newUid, resid):
        cursor = self.conn.cursor()
        query = "update public.members set uid = %s, resid = %s where uid = %s;"
        cursor.execute(query, (newUid, resid, oldUid))
        self.conn.commit()
        return True

    def deleteMember(self, uid):
        cursor = self.conn.cursor()
        query = "delete from public.members where uid=%s;"
        cursor.execute(query, (uid,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        return affected_rows != 0