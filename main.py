import pandas as pd
import mysql.connector
from selenium import webdriver
from selenium.webdriver.common.by import By
from userInfo import host, user, password, database

class GetMenu:
    def __init__(self):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.output_list = []
        self.myCursor = None
        self.conn = None

    def GetTableElements(self):
        url = r'https://mediko.gazi.edu.tr/view/page/20412'
        tables = pd.read_html(url) # Returns list of all tables on page
        df = tables[0] # Select table of interest
        df = df.drop(14)

        df = df.fillna('')

        for i in range(df.shape[0]):
            for j in df.columns:
                if i % 7 == 0:
                    kalori_str = df.iloc[i:i+7, j].tolist()[-1]  # Son eleman 'Kalori:xxxx' metni
                    kalori = int(kalori_str.split(':')[1])  # ':' işaretinden sonrası, yani 'xxxx' kısmı
                    self.output_list = df.iloc[i:i+7, j].tolist()[:-1]  # Son eleman hariç diğerleri
                    self.output_list.append(kalori)  # Kalori değeri eklendi
                    self.output_list[0] = self.convert_date_format(self.output_list[0])  # Tarih formatını değiştir
                    # self.InsertToDatabase()
                    print(self.output_list)

    def convert_date_format(self, date_str):
        # Tarih formatını değiştirme işlemi
        # Örnek: '4 Mart 2024 Pazartesi' -> '29.03.2024'
        months = {'Ocak': '01', 'Şubat': '02', 'Mart': '03', 'Nisan': '04', 'Mayıs': '05', 'Haziran': '06',
                  'Temmuz': '07', 'Ağustos': '08', 'Eylül': '09', 'Ekim': '10', 'Kasım': '11', 'Aralık': '12'}
        day, month, year = date_str.split(' ')[0], months[date_str.split(' ')[1]], date_str.split(' ')[2]
        return f"{day.zfill(2)}.{month}.{year}"

    def ConnectDatabase(self):
        self.conn = mysql.connector.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database
        )
        self.mycursor = self.conn.cursor()

    def InsertToDatabase(self):
        sql = "INSERT INTO gazi (date, soup, dish, vegetarian, extra, extra2, calorie) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        val = (self.output_list[0], self.output_list[1], self.output_list[2], self.output_list[3], self.output_list[4], self.output_list[5], self.output_list[6])
        self.mycursor.execute(sql, val)
        self.conn.commit()
        print(self.mycursor.rowcount, "record inserted.")

getMenu = GetMenu()
getMenu.ConnectDatabase()
getMenu.GetTableElements()
