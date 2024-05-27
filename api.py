from datetime import datetime
from flask import request
from flask import json, Flask, Response
from flask_mysqldb import MySQL
from userInfo import host, user, password, database

app = Flask(__name__)
mysql = MySQL(app)

app.config['MYSQL_HOST'] = host
app.config['MYSQL_USER'] = user
app.config['MYSQL_PASSWORD'] = password
app.config['MYSQL_DB'] = database
app.config['JSON_AS_ASCII'] = False

class CreateApi():
    @app.route('/gazi/menu/<date>', methods=['GET'])
    def FindMenu(date):
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM gazi WHERE date = %s", (date,))
        data = cursor.fetchall()
        cursor.close()
        
        menu_list = []
        menu_list = CreateApi().create_list(data)
        
        json_string = json.dumps(menu_list, ensure_ascii=False)
        response = Response(json_string, content_type="application/json; charset=utf-8")
        return response
    
    @app.route('/gazi/menu/all', methods=['GET'])
    def FindMenuAll():
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM gazi")
        data = cursor.fetchall()
        cursor.close()
        
        menu_list = []
        menu_list = CreateApi().create_list(data)
        
        json_string = json.dumps(menu_list, ensure_ascii=False)
        response = Response(json_string, content_type="application/json; charset=utf-8")
        return response

    @app.route('/gazi/menu/month/<month>', methods=['GET'])
    def FindMenuByMonth(month):
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM gazi WHERE date LIKE %s", ('%' + month + '%',))
        data = cursor.fetchall()
        cursor.close()
        
        menu_list = []
        menu_list = CreateApi().create_list(data)
        
        json_string = json.dumps(menu_list, ensure_ascii=False)
        response = Response(json_string, content_type="application/json; charset=utf-8")
        return response
    
    @app.route('/gazi/menu/comments/', methods=['POST'])
    def AddComment():
        try:
            # İstekten gelen verileri alma
            data = request.json
            
            # Veritabanına veri ekleme
            cursor = mysql.connection.cursor()
            cursor.execute("INSERT INTO comments (content, created_at) VALUES (%s, %s)", (data['content'], data['created_at']))
            mysql.connection.commit()
            cursor.close()
            
            return Response(json.dumps({"message": "Comment added successfully"}), status=201, content_type="application/json; charset=utf-8")
        
        except Exception as e:
            return Response(json.dumps({"message": str(e)}), status=500, content_type="application/json; charset=utf-8")
        
    @app.route('/gazi/menu/<comment_type>/', methods=['GET'])
    def ShowAllComments(comment_type):
        try:
            cursor = mysql.connection.cursor()
            cursor.execute(f"SELECT * FROM {comment_type}")
            data = cursor.fetchall()
            cursor.close()

            if comment_type == "comment_replies":
                isReply = True
            else:
                isReply = False
            
            menu_list = []
            menu_list = CreateApi().create_comment_list(data, isReply)
            
            json_string = json.dumps(menu_list, ensure_ascii=False)
            response = Response(json_string, content_type="application/json; charset=utf-8")
            return response
            
        except Exception as e:
            return Response(json.dumps({"message": str(e)}), status=500, content_type="application/json; charset=utf-8")
        
    @app.route('/gazi/menu/<comment_type>/<date>', methods=['GET'])
    def ShowCommentsByDate(date, comment_type):
        try:
            # Gelen tarihi doğru formata dönüştürme
            try:
                query_date = datetime.strptime(date, '%d.%m.%Y').strftime('%Y-%m-%d')
            except ValueError:
                return Response(json.dumps({"message": "Invalid date format. Please use dd.mm.yyyy format."}), status=400, content_type="application/json; charset=utf-8")
            
            cursor = mysql.connection.cursor()
            cursor.execute(f"SELECT * FROM {comment_type}")
            data = cursor.fetchall()
            cursor.close()
            
            if comment_type == "comment_replies":
                isReply = True
            else:
                isReply = False

            menu_list = []
            menu_list = CreateApi().create_date_list(data, isReply)
            
            # Tarihi gelen tarihle kıyasla ve eşleşenleri filtrele
            filtered_menu_list = [item for item in menu_list if item["created_at"] == query_date]
            
            json_string = json.dumps(filtered_menu_list, ensure_ascii=False)
            response = Response(json_string, content_type="application/json; charset=utf-8")
            return response
            
        except Exception as e:
            return Response(json.dumps({"message": str(e)}), status=500, content_type="application/json; charset=utf-8")
        
    @app.route('/gazi/menu/comment_replies/<comment_id>', methods=['GET'])
    def ShowReplyByID(comment_id):
        try:
            cursor = mysql.connection.cursor()
            cursor.execute("SELECT * FROM comment_replies WHERE comment_id = %s", (comment_id,))
            data = cursor.fetchall()
            cursor.close()
            
            isReply = True

            menu_list = []
            menu_list = CreateApi().create_comment_list(data, isReply)
            
            json_string = json.dumps(menu_list, ensure_ascii=False)
            response = Response(json_string, content_type="application/json; charset=utf-8")
            return response
            
        except Exception as e:
            return Response(json.dumps({"message": str(e)}), status=500, content_type="application/json; charset=utf-8")

    @app.route('/gazi/menu/comment_replies/', methods=['POST'])
    def AddCommentReply():
        try:
            # İstekten gelen verileri alma
            data = request.json
            
            # Veritabanına veri ekleme
            cursor = mysql.connection.cursor()
            cursor.execute("INSERT INTO comment_replies (comment_id, content, created_at) VALUES (%s, %s, %s)", (data['comment_id'], data['content'], data['created_at']))
            mysql.connection.commit()
            cursor.close()
            
            return Response(json.dumps({"message": "Comment added successfully"}), status=201, content_type="application/json; charset=utf-8")
        
        except Exception as e:
            return Response(json.dumps({"message": str(e)}), status=500, content_type="application/json; charset=utf-8")

    @app.route('/gazi/menu/<comment_type>/<comment_id>', methods=['PUT'])
    def EditCommentReply(comment_type, comment_id):
        try:
            # İstekten gelen verileri alma
            data = request.json

            # Veritabanında veriyi güncelleme
            cursor = mysql.connection.cursor()
            cursor.execute(f"UPDATE {comment_type} SET content = %s, created_at = %s WHERE ID = %s", (data['content'], data['created_at'], comment_id))
            mysql.connection.commit()
            cursor.close()

            return Response(json.dumps({"message": "Comment reply updated successfully"}), status=200, content_type="application/json; charset=utf-8")

        except Exception as e:
            return Response(json.dumps({"message": str(e)}), status=500, content_type="application/json; charset=utf-8")
        
    @app.route('/gazi/menu/<comment_type>/<comment_id>', methods=['DELETE'])
    def DeleteCommentReply(comment_type, comment_id):
        try:
            # Veritabanında belirli bir comment_id'ye sahip yorumu silme
            cursor = mysql.connection.cursor()
            cursor.execute(f"DELETE FROM {comment_type} WHERE ID = %s", (comment_id,))
            mysql.connection.commit()
            cursor.close()

            return Response(json.dumps({"message": "Comment reply deleted successfully"}), status=200, content_type="application/json; charset=utf-8")

        except Exception as e:
            return Response(json.dumps({"message": str(e)}), status=500, content_type="application/json; charset=utf-8")


    def create_list(self, data):
        menu_list = []
        for menu_item in data:
            menu_dict = {
                "ID": menu_item[0],
                "date": menu_item[1],
                "soup": menu_item[2],
                "dish": menu_item[3],
                "vegetarian": menu_item[4],
                "extra": menu_item[5],
                "extra2": menu_item[6],
                "calorie": menu_item[7]
            }
            menu_list.append(menu_dict)
        return menu_list
    
    def create_comment_list(self, data, isReply):
        menu_list = []
        for menu_item in data:
            if isReply:
                menu_dict = {
                    "ID": menu_item[0],
                    "comment_id": menu_item[1],  # "comment_id" alanı eklendi
                    "content": menu_item[2],
                    "created_at": menu_item[3]
                }
            else:
                menu_dict = {
                    "ID": menu_item[0],
                    "content": menu_item[1],
                    "created_at": menu_item[2]
                }
            menu_list.append(menu_dict)
        return menu_list
    
    def create_date_list(self, data, isReply):
        menu_list = []
        for menu_item in data:
            if isReply:
                menu_dict = {
                    "ID": menu_item[0],
                    "comment_id": menu_item[1],  # "comment_id" alanı eklendi
                    "content": menu_item[2],
                    "created_at": datetime.strptime(menu_item[3], '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y-%m-%d')  # Stringi datetime objesine dönüştürdük ve sadece tarih kısmını aldık
                }
            else:
                menu_dict = {
                    "ID": menu_item[0],
                    "content": menu_item[1],
                    "created_at": datetime.strptime(menu_item[2], '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y-%m-%d')  # Stringi datetime objesine dönüştürdük ve sadece tarih kısmını aldık
                }
            
            menu_list.append(menu_dict)
        return menu_list
    
if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=5050)
    app.run(debug=True)
