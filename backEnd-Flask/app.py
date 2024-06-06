# Importation des modules nécessaires
from flask import Flask
from flask_cors import CORS
from salary_recommendations import salary_recommendations_bp
from rag import rag_bp
from benchmarking import benchmarking_bp

# Crée une instance de l'application Flask
app = Flask(__name__)
# Active CORS sur l'application Flask pour gérer les requêtes cross-origin
CORS(app)

# Enregistre les blueprints dans l'application Flask
# Ceux-ci organisent le code en modules réutilisables et modulaires
app.register_blueprint(salary_recommendations_bp)
app.register_blueprint(rag_bp)
app.register_blueprint(benchmarking_bp)

# Si le script est exécuté directement...
if __name__ == '__main__':
    # Lance l'application Flask en mode debug
    app.run(debug=True)