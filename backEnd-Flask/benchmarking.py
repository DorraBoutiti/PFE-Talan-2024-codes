import logging
from langchain_openai import OpenAI
from flask import Flask, request, jsonify, Blueprint

benchmarking = Flask(__name__)

benchmarking_bp = Blueprint('benchmarking', __name__)

logging.basicConfig(level=logging.DEBUG) # configure logging

# Clé d'API OpenAI utilisée
OPENAI_API_KEY = "VOTRE_CLÉ_API_OPENAI"

if not OPENAI_API_KEY:
    raise ValueError("La clé d'API OpenAI n'a pas été trouvée dans les variables d'environnement.")

llm = OpenAI(api_key=OPENAI_API_KEY, model_name = 'gpt-3.5-turbo-instruct', max_tokens=512, temperature=0)
question = """
    En effectuant une étude comparative sur le marché de l'emploi au Maroc, quelle est la fourchette des salaires mensuels moyens pour un ${poste} avec ${experience} ans d'expérience ?
    Veuillez utiliser le dirham marocain comme devise.
    Assurez-vous de donner des réponses précises correctement et ne pas vous écarter du sujet.
    Affichez le résultat sous forme : ```💰 Fourchette de salaire : [DM - DM]```
"""

@benchmarking_bp.route('/api/llm/benchmarking', methods=['POST'])
def receive_message():
    data = request.json
    poste = data.get('poste')
    experience = data.get('experience')
    question_with_values = question.replace('${poste}', poste).replace('${experience}', str(experience))
    response = llm.invoke(question_with_values)
    return jsonify({'benchmarking': response})

if __name__ == '__main__':
    benchmarking.run(debug=True)