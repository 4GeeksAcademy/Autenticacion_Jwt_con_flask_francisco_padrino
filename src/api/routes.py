"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/users", methods=['GET', 'POST'])
def get_AddUser():
    if (request.method == 'GET'):
        result = User.query.all()
        result = list(map(lambda x: x.serialize(), result))
        return jsonify(result)

    elif (request.method == 'POST'):
        datos = request.get_json()
        result = User(username=datos["username"], password=datos["password"],
                      name=datos["name"], lastname=datos["lastname"])
        db.session.add(result)
        db.session.commit()
        return jsonify({"estado": "ok", "mensaje": "El usuario se agrego correctamente"})


@api.route("/users/<int:id>", methods=['GET', 'DELETE'])
def GetorDeleteUser(id):
    result = User.query.get(id)
    if (request.method == 'GET'):
        return User.serialize(result)
    elif (request.method == 'DELETE'):
        if (result):
            db.session.delete(result)
            db.session.commit()
            return jsonify({"estado": "ok", "mensaje": "El usuario se elimino correctamente"})
        else:
            return jsonify({"estado": "ok", "mensaje": "El usuario no se elimino correctamente"})


@api.route("/token", methods=['POST'])
def generateToken():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    # Consulta la base de datos por el nombre de usuario y la contraseña
    user = User.query.filter_by(username=username, password=password).first()
    if user is None:
        # el usuario no se encontró en la base de datos
        return jsonify({"msg": "Bad username or password"}), 401
    # Crea un nuevo token con el id de usuario dentro
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user_id": user.id, "user_name": user.name, "user_username": user.username})


# Protege una ruta con jwt_required, bloquea las peticiones sin un JWT válido
@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Accede a la identidad del usuario actual con get_jwt_identity
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({"id": user.id, "username": user.username, "name": user.name, "lastname": user.lastname}), 200
