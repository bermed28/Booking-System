from config.dbconfig import pg_config
import psycopg2

class UserAdheresToDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'], pg_config['user'],
                                                                  pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def getAllUserAdherences(self):
        cursor = self.conn.cursor()
        query = "select uid, usid from public.user_adheres_to;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getUserAdherenceByUserId(self, uid):
        cursor = self.conn.cursor()
        query = "select uid, usid from public.user_adheres_to where uid = %s;"
        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        return result

    def getUserAdherenceByUserScheduleId(self, usid):
        cursor = self.conn.cursor()
        query = "select uid, usid from public.user_adheres_to where usid = %s;"
        cursor.execute(query, (usid,))
        result = cursor.fetchone()
        return result

    def insertUserAdherence(self, uid, usid):
        cursor = self.conn.cursor()
        query = "insert into public.user_adheres_to(uid, usid) values(%s,%s) returning (uid, usid);"
        cursor.execute(query, (uid, usid))
        uid = cursor.fetchone()[0]
        self.conn.commit()
        return uid

    def updateUserAdherence(self, uid, usid):
        cursor = self.conn.cursor()
        query = "update public.user_adheres_to set uid = %s, usid = %s where usid = %s;"
        cursor.execute(query, (uid, usid, usid))
        self.conn.commit()
        return True

    def deleteUserAdherence(self, usid):
        cursor = self.conn.cursor()
        query = "delete from public.user_adheres_to where usid=%s;"
        cursor.execute(query, (usid,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        return affected_rows != 0