from config.dbconfig import pg_config
import psycopg2

class UserDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='ec2-18-233-27-224.compute-1.amazonaws.com'" %(pg_config['dbname'], pg_config['user'],
                                                                  pg_config['password'], pg_config['dbport'])
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def getAllUsers(self):
        cursor = self.conn.cursor()
        query = "select uid, username, uemail, upassword, ufirstname, ulastname, upermission from public.user;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getUserById(self, uid):
        cursor = self.conn.cursor()
        query = "select uid, username, uemail, upassword, ufirstname, ulastname, upermission from public.user where uid = %s;"
        cursor.execute(query, (uid))
        result = cursor.fetchone()
        return result

    def insertUser(self, username, uemail, upassword, ufirstname, ulastname, upermission):
        cursor = self.conn.cursor()
        query = "insert into public.user(username, uemail, upassword, ufirstname, ulastname, upermission) values(%s,%s,%s,%s,%s,%s) returning uid;"
        cursor.execute(query, (username, uemail, upassword, ufirstname, ulastname, upermission))
        uid = cursor.fetchone()[0]
        self.conn.commit()
        return uid

    def updateUser(self, uid, username, uemail, upassword, ufirstname, ulastname, upermission):
        cursor = self.conn.cursor()
        query = "update public.user set username=%s, uemail=%s, upassword=%s, ufirstname=%s, ulastname=%s, upermission=%s where uid=%s;"
        cursor.execute(query, (username, uemail, upassword, ufirstname, ulastname, upermission, uid))
        self.conn.commit()
        return True

    def deleteUser(self, uid):
        cursor = self.conn.cursor()
        query = "delete from public.user where uid=%s;"
        cursor.execute(query, (uid))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        return affected_rows !=0