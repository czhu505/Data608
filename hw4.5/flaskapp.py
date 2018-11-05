#jsonify take list to convert to python dictionary json format
from flask import Flask, jsonify, request, render_template
#rest_api : representational State Transfer application programming Interface
#Client send http request to Server, like id, name, and server return info as json formate back
from flask_restful import Api, Resource


app = Flask(__name__)
api = Api(app)

#return 200 means no error, else has error
#this is like POST function, based on GET info, return info to POST
def checkPostedData(postedData,functionName):
    if (functionName=="add" or functionName=="subtract" or functionName=="mutiply"):
        if "x" not in postedData or "y" not in postedData:
            return 301
        else:
            return 200

    elif (functionName=="divide" ):
        if "x" not in postedData or "y" not in postedData:
            return 301
        elif int(postedData["y"])==0:
            return 302
        else:
            return 200


class Add(Resource):
    def post(self):
        #get post data:
        postedData = request.get_json()

        status_code = checkPostedData(postedData,"add")

        #check if x or y missing, then return message and code
        if (status_code!=200):
            retJson={
                "Message": "An error happened",
                "status code": status_code
            }
            return jsonify(retJson)

        #if the x and y both are not missing
        x=postedData["x"]
        y=postedData["y"]
        x=int(x)
        y=int(y)
        ret=x+y
        retJson = {
            'Sum':ret,
            'Status Code':200
        }
        return jsonify(retJson)


class Subtract(Resource):
    def post(self):
        #get post data:
        postedData = request.get_json()

        status_code = checkPostedData(postedData,"subtract")

        #check if x or y missing, then return message and code
        if (status_code!=200):
            retJson={
                "Message": "An error happened",
                "status code": status_code
            }
            return jsonify(retJson)

        #if the x and y both are not missing
        x=postedData["x"]
        y=postedData["y"]
        x=int(x)
        y=int(y)
        ret=x-y
        retJson={
            'Subtract':ret,
            'Status Code':200
        }
        return jsonify(retJson)


class Mutiply(Resource):
    def post(self):
        #get post data:
        postedData = request.get_json()

        status_code = checkPostedData(postedData,"mutiply")

        #check if x or y missing, then return message and code
        if (status_code!=200):
            retJson={
                "Message": "An error happened",
                "status code": status_code
            }
            return jsonify(retJson)

        #if the x and y both are not missing
        x=postedData["x"]
        y=postedData["y"]
        x=int(x)
        y=int(y)
        ret=x*y
        retJson={
            'Mutiply':ret,
            'Status Code':200
        }
        return jsonify(retJson)

class Divide(Resource):
    def post(self):
        #get post data:
        postedData = request.get_json()

        status_code = checkPostedData(postedData,"divide")

        #check if x or y missing, then return message and code
        if (status_code!=200):
            retJson={
                "Message": "An error happened",
                "status code": status_code
            }
            return jsonify(retJson)

        #if the x and y both are not missing
        x=postedData["x"]
        y=postedData["y"]
        x=int(x)
        y=int(y)
        ret=x/y
        retJson={
            'Divide':ret,
            'Status Code':200
        }
        return jsonify(retJson)

#localhost:5000/add
api.add_resource(Add,"/add")
#localhost:5000/subtract
api.add_resource(Subtract,"/subtract")
#localhost:5000/mutiply
api.add_resource(Mutiply,"/mutiply")
#localhost:5000/divide
api.add_resource(Divide,"/divide")



#localhost:5000/
@app.route('/')
def homepage():
    return render_template("js_in_webpage.html")


#localhost:5000/bye
#this is similar like GET funtion, and return info
@app.route('/me')
def bye():
    age=2*5
    retJson={
        'name': 'zhu',
        'age':age,
        'phone':[
        {
            "phoneName": "apple",
            "phonenumber": 123456888
        },
        {
            "phoneName": "andri",
            "phonenumber": 124568891

        }]

    }
    return jsonify(retJson)

if __name__=="__main__":
    app.run(debug=True)
