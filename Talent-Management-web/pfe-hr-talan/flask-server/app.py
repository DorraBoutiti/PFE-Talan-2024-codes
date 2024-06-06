from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import ast
from flask_cors import CORS
from llama_index.core.query_pipeline import (
    QueryPipeline as QP,
    Link,
    InputComponent,
)
from llama_index.experimental.query_engine.pandas import PandasInstructionParser
from llama_index.llms.openai import OpenAI
from llama_index.core.prompts import PromptTemplate
import logging
import os
import logging


app= Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG)
#************************************************
#***************RAG*******************

# Function to read API key from file
def read_api_key(file_path: str) -> str:
    with open(file_path, 'r') as file:
        return file.read().strip()

# Initialize OpenAI client
api_key = read_api_key('hidden.txt')
os.environ["OPENAI_API_KEY"] = api_key

# Load the dataframe
df = pd.read_csv("./csvs/Table_Évaluation.csv")

# Define your prompt templates
instruction_str = (
    "1. Convert the query to executable Python code using Pandas.\n"
    "2. The final line of code should be a Python expression that can be called with the `eval()` function.\n"
    "3. The code should represent a solution to the query.\n"
    "4. PRINT ONLY THE EXPRESSION.\n"
    "5. Do not quote the expression.\n"
)

pandas_prompt_str = (
    "You are working with a pandas dataframe in Python.\n"
    "The name of the dataframe is `df`.\n"
    "This is the result of `print(df.head())`:\n"
    "{df_str}\n\n"
    "Follow these instructions:\n"
    "{instruction_str}\n"
    "Query: {query_str}\n\n"
    "Expression:"
)

response_synthesis_prompt_str = (
    """You are a professional HR and talent management assistant bot called ```TAL-BOT```.
        You are developed and designed by Talan Tunisia in 2024.
        The company "talan tunisia" is an IT services providing consulting for clients around the world.
        You should provide this information when someone greets you.
        You are being used by HR manager and departments Managers.
        You are great at answering questions about Talent management and HR decisions in a concise
        You only answer questions about Talent management and HR decisions.
        You will have access to the employees database.
        When you don't know the answer to a question you admit that you don't know.
        """
    "Given an input question, synthesize a response from the query results.\n"
    "Query: {query_str}\n\n"
    "Pandas Instructions (optional):\n{pandas_instructions}\n\n"
    "Pandas Output: {pandas_output}\n\n"
    "Response: "
)

# Create prompt instances
pandas_prompt = PromptTemplate(pandas_prompt_str).partial_format(
    instruction_str=instruction_str, df_str=df.head(5)
)
pandas_output_parser = PandasInstructionParser(df)
response_synthesis_prompt = PromptTemplate(response_synthesis_prompt_str)

# Create OpenAI instance
llm = OpenAI(model="gpt-4")

# Build the query pipeline
qp = QP(
    modules={
        "input": InputComponent(),
        "pandas_prompt": pandas_prompt,
        "llm1": llm,
        "pandas_output_parser": pandas_output_parser,
        "response_synthesis_prompt": response_synthesis_prompt,
        "llm2": llm,
    },
    verbose=True,
)
qp.add_chain(["input", "pandas_prompt", "llm1", "pandas_output_parser"])
qp.add_links(
    [
        Link("input", "response_synthesis_prompt", dest_key="query_str"),
        Link(
            "llm1", "response_synthesis_prompt", dest_key="pandas_instructions"
        ),
        Link(
            "pandas_output_parser",
            "response_synthesis_prompt",
            dest_key="pandas_output",
        ),
    ]
)
# Add link from response synthesis prompt to llm2
qp.add_link("response_synthesis_prompt", "llm2")

# Initialize prompt list
prompt_list = []

# Function to get API response
def get_api_response(prompt: str, qp: QP) -> str:
    try:
        response = qp.run(query_str=prompt)
        return response.message.content
    except Exception as e:
        logging.exception('An error occurred:')
        return 'Something went wrong. Please try again later.'

# Function to update the prompt list
def update_prompt_list(message: str, prompt_list: list[str]) -> None:
    prompt_list.append(message)

# Function to create prompt
def create_prompt(message: str, prompt_list: list[str]) -> str:
    update_prompt_list(message, prompt_list)
    return '\n'.join(prompt_list)

# Function to get bot response
def get_bot_response(message: str, prompt_list: list[str], qp: QP) -> str:
    #prompt = create_prompt(message, prompt_list)
    bot_response = get_api_response(message, qp)
    return bot_response

# API endpoint to receive messages from frontend
@app.route('/rag/message', methods=['POST'])
def receive_message():
    data = request.json
    user_input = data.get('message')
    response = get_bot_response(user_input, prompt_list, qp)
    return jsonify({'message': response})

#******************************end RAG*******************************
#*********************************************************************


# Spécifier le chemin complet du fichier CSV
file_path = r'./csvs/op.csv'

# Charger les données à partir du fichier CSV
df = pd.read_csv(file_path)

# Replace NaN values in the 'competence' column with an empty list
df['competence'].fillna('[]', inplace=True)

# Replace NaN values in the 'niveau' column with a list containing zeros
df['niveau'].fillna('[0]', inplace=True)

# Function to parse list-like strings into actual lists
def parse_list_column(column):
    return column.apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)

# Parse the 'competence' and 'niveau' columns
df['competence'] = parse_list_column(df['competence'])
df['niveau'] = parse_list_column(df['niveau'])

# Function to get radar data for two employees
def get_radar_data(employee1_id, employee2_id):
    try:
        # Retrieve the data for the two employees
        employee1_data = df[df['Matricule'] == employee1_id].iloc[0]
        employee2_data = df[df['Matricule'] == employee2_id].iloc[0]
        # Get the common competencies between the two employees
        common_competencies = list(set(employee1_data['competence']).intersection(employee2_data['competence']))

        # Filter the levels for common competencies
        levels_employee1 = [employee1_data['niveau'][employee1_data['competence'].index(comp)] for comp in common_competencies]
        levels_employee2 = [employee2_data['niveau'][employee2_data['competence'].index(comp)] for comp in common_competencies]

        return common_competencies, levels_employee1, levels_employee2
    except IndexError:
        # Handle case where employee ID(s) are not found
        return None, None, None

# API endpoint to get radar data
@app.route('/radar-data', methods=['POST'])
def radar_data():
    data = request.json
    employee1_id = data.get('employee1_id')
    employee2_id = data.get('employee2_id')
    
    
    common_competencies, levels_employee1, levels_employee2 = get_radar_data(employee1_id, employee2_id)
    
    return jsonify({
        'common_competencies': common_competencies,
        'levels_employee1': levels_employee1,
        'levels_employee2': levels_employee2
    })

@app.route('/matricules', methods=['GET'])
def get_matricules():
    matricules = df['Matricule'].unique().tolist()
    return jsonify(matricules)

@app.route('/barchartdata', methods=['POST'])
def bar_chart_data():
    data = request.json
    employee1_id = data.get('employee1_id')
    employee2_id = data.get('employee2_id')
    
    # Retrieve data for the two employees
    employee1_data = df[df['Matricule'] == employee1_id].iloc[0]
    employee2_data = df[df['Matricule'] == employee2_id].iloc[0]
    
    # Get common competences
    common_competences = list(set(employee1_data['competence']).intersection(employee2_data['competence']))
    
    # Filter levels for common competences
    levels_employee1 = [employee1_data['niveau'][employee1_data['competence'].index(comp)] for comp in common_competences]
    levels_employee2 = [employee2_data['niveau'][employee2_data['competence'].index(comp)] for comp in common_competences]

    # Create dictionary to hold the data
    data = {
        'common_competences': common_competences,
        'levels_employee1': levels_employee1,
        'levels_employee2': levels_employee2
    }
    
    # Return the data as JSON
    return jsonify(data)

@app.route("/")
def home():
    return file_path

if __name__ == "__main__":
    app.run(app, debug=True)