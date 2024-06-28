from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
from document_classifier import DocumentClassifier

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

classifier = DocumentClassifier()


@app.route("/")
def hello():
    return "Hello from Module"


@app.route("/classify-document", methods=["POST"])
def classify_document():
    # Assurez-vous que la requête contient des données JSON avec une clé "document_text"
    if not request.json or "document_text" not in request.json:
        return jsonify({"error": "Document text not provided or invalid format"}), 400

    # Obtenez le texte du document à partir des données JSON
    document_text = request.json["document_text"]

    # Utilisez le classifieur pour obtenir le type de document
    document_type = classifier.classify_document(document_text)

    # Retournez le type de document détecté en tant que réponse JSON
    return jsonify({"document_type": document_type}), 200


# Swagger UI setup
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={  # Swagger UI config overrides
        'app_name': "HrDocumentAnalyzer"
    }
)

app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

if __name__ == "__main__":
    app.run(debug=True)
