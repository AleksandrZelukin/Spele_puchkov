from flask import Flask, json, request, render_template
# from flask_cors import CORS, cross_origin
import sqlite3

def top():

  DB = sqlite3.connect('top.db')
  SQL = DB.cursor()
  
  SQL.execute("""CREATE TABLE IF NOT EXISTS rezultati ( 
              id INTEGER NOT NULL UNIQUE,
              vards TEXT,
              punkti INTEGER,
              PRIMARY KEY("id" AUTOINCREMENT)
           )""")
  SQL.execute("""CREATE TABLE IF NOT EXISTS atsauksmes (
              id TEXT NOT NULL,
              article TEXT)""")

  SQL.execute("SELECT * FROM rezultati ORDER BY punkti DESC")
  rezultati = SQL.fetchall()
  print(rezultati)
  dati = []
  for rez in rezultati:
    dati.append({
      "id":rez[0],
      "vards":rez[1],
      "punkti":rez[2]
    })
  
  DB.close()
  return dati

def pievienot(dati):
  DB = sqlite3.connect('top.db')
  SQL = DB.cursor()
  SQL.execute("INSERT INTO rezultati (vards, punkti) VALUES (:vards, :punkti)", {'vards': dati['vards'], 'punkti': dati['punkti']})
  DB.commit()
  DB.close()

# print(__name__)
app = Flask(__name__)
#app.debug = True

# CORS(app)  # enable crossdomain access

@app.route('/')
def index():
  return render_template("index.html")

@app.route('/spele')
def spele():
  return render_template("spele.html")

@app.route('/tops')
def tops():
  DB = sqlite3.connect('top.db')
  SQL = DB.cursor()
  SQL.execute("SELECT * FROM atsauksmes ")
  records = SQL.fetchall()
  print(records)
  return render_template("tops.html", rows = records)

  # return render_template("tops.html")

@app.route('/par')
def par():
  return render_template("par.html")

@app.route('/noteikumi')
def noteikumi():
  return render_template("noteikumi.html")

@app.route('/api', methods=['GET', 'POST'])  # what to return at base
# @cross_origin(origin='*')
def api():
    if (request.method == 'GET'):
        return json.dumps(top())
    if (request.method == 'POST'):
        jaunsIeraksts = request.get_json(force=True)
        pievienot(jaunsIeraksts)
        return json.dumps(top())


@app.route('/atsauksmes', methods=['GET','POST'])
def atsausksmes():
  if request.method == "POST":
    id = request.form["id"]
    article = request.form["article"]
    art = [id,article]
    DB = sqlite3.connect('top.db')
    SQL = DB.cursor()
    SQL.execute("INSERT INTO atsauksmes VALUES(?,?)",art)
    DB.commit()
    DB.close()
  return render_template('atsauksmes.html')

app.run(host='127.0.0.1', port=8050)
# http serv start


# f = open("rezultati.txt","a+")
# f.write("Pēteris, 55\n")
# f.close()


