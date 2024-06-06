# Importation des modules nécessaires
import logging
import pandas as pd
from flask import Flask, request, jsonify, Blueprint

# Importation des classes et fonctions nécessaires depuis les modules locaux
from llama_index.core.query_pipeline import QueryPipeline as QP, Link, InputComponent
from llama_index.experimental.query_engine.pandas import PandasInstructionParser
from llama_index.llms.openai import OpenAI
from llama_index.core import PromptTemplate

# Création de l'application Flask
rag = Flask(__name__)

# Création d'un Blueprint pour organiser les routes liées à cette partie de l'application
rag_bp = Blueprint('rag', __name__)

# Configuration des journaux pour le débogage
logging.basicConfig(level=logging.DEBUG)

# Clé d'API OpenAI utilisée
OPENAI_API_KEY = "VOTRE_CLÉ_API_OPENAI"

# Chargement des données depuis un fichier CSV dans un DataFrame pandas
df = pd.read_csv("./result.csv", low_memory=False)

# Définition des instructions pour transformer une requête en code Python Pandas exécutable
instruction_str = (
    "1. Convertis la requête en code Python exécutable utilisant Pandas.\n"
    "2. La dernière ligne de code doit être une expression Python pouvant être appelée avec la fonction `eval()`.\n"
    "3. Le code doit représenter une solution à la requête.\n"
    "4. IMPRIMER SEULEMENT L'EXPRESSION.\n"
    "5. Ne pas inclure de guillemets autour de l'expression.\n"
)

# Définition du prompt pour l'utilisation de Pandas
pandas_prompt_str = (
    "Vous travaillez avec un dataframe pandas en Python.\n"
    "Le nom du dataframe est `df`.\n"
    "Voici le résultat de `print(df.head())`:\n"
    "{df_str}\n\n"
    "Suivez ces instructions:\n"
    "{instruction_str}\n"
    "Requête : {query_str}\n\n"
    "Expression :"
)

# Définition du prompt pour la synthèse de réponse par l'IA
response_synthesis_prompt_str = (
    "Instructions pour l'IA :\n{pandas_instructions}\n\n"
    "Résultat de l'exécution de la requête sur Pandas :\n{pandas_output}\n\n"
    "Requête à synthétiser :\n{query_str}\n\n"
    "Réponse :"
)

# Formatage des prompts avec les valeurs spécifiques
pandas_prompt = PromptTemplate(pandas_prompt_str).partial_format(
    instruction_str=instruction_str, df_str=df.head(5)
)
response_synthesis_prompt = PromptTemplate(response_synthesis_prompt_str)

# Initialisation de l'API OpenAI
llm = OpenAI(model="gpt-3.5-turbo")

# Initialisation du pipeline de requête
qp = QP(
    modules={
        "input": InputComponent(),
        "pandas_prompt": pandas_prompt,
        "llm1": llm,
        "pandas_output_parser": PandasInstructionParser(df),
        "response_synthesis_prompt": response_synthesis_prompt,
        "llm2": llm,
    },
    verbose=True,
)

# Configuration des étapes du pipeline de requête
qp.add_chain(["input", "pandas_prompt", "llm1", "pandas_output_parser"])
qp.add_links(
    [
        Link("input", "response_synthesis_prompt", dest_key="query_str"),
        Link("llm1", "response_synthesis_prompt", dest_key="pandas_instructions"),
        Link(
            "pandas_output_parser",
            "response_synthesis_prompt",
            dest_key="pandas_output",
        ),
    ]
)
qp.add_link("response_synthesis_prompt", "llm2")

# Liste pour stocker les prompts
prompt_list = []

# Fonction pour obtenir une réponse de l'API
def get_api_response(prompt: str, qp: QP) -> str:
    try:
        response = qp.run(query_str=prompt)
        return response.message.content
    except Exception as e:
        logging.exception('An error occurred:')
        return 'Something went wrong. Please try again later.'

# Fonction pour obtenir la réponse du bot
def get_bot_response(message: str, prompt_list: list[str], qp: QP) -> str:
    bot_response = get_api_response(message, qp)
    return bot_response

# Route pour recevoir les messages et obtenir les réponses du bot
@rag_bp.route('/rag/message', methods=['POST'])
def receive_message():
    data = request.json
    user_input = data.get('message')
    response = get_bot_response(user_input, prompt_list, qp)
    return jsonify({'message': response})

# Exécution de l'application Flask si le script est exécuté directement
if __name__ == '__main__':
    rag.run(debug=True)