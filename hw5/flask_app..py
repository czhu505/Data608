# -*- coding: utf-8 -*-
"""
Created on Sun Nov 18 22:46:27 2018

@author: Zhu
"""

import pandas as pd
import io
import requests
import json 

url="https://raw.githubusercontent.com/czhu505/Data608/master/hw5/presidents.csv"
s=requests.get(url).content
c=pd.read_csv(io.StringIO(s.decode('utf-8')))
df=c.to_json(orient='records')

from flask import Flask, render_template,request, jsonify

app = Flask(__name__)


#localhost:5000/
@app.route('/send', methods=['GET','POST'])

def send():
    if request.method == "POST":
        name = request.form['name']
        for i in df:
            if i['President'] == name:
               return jsonify(i)

if __name__=='__main__':
    app.run(debug=True)
