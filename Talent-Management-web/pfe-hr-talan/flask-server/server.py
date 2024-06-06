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
    """
    Reads the API key from the given file.

    Args:
        file_path (str): The path to the file containing the API key.

    Returns:
        str: The API key read from the file.
    """
    # Open the file in read mode
    with open(file_path, 'r') as file:
        # Read the content of the file, strip any leading or trailing whitespace
        # and return the API key
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
    """
    Get API response from the query pipeline using the given prompt.

    Args:
        prompt (str): The prompt for the API.
        qp (QP): The query pipeline instance.

    Returns:
        str: The API response.
    """
    try:
        # Run the query pipeline with the given prompt
        response = qp.run(query_str=prompt)
        # Return the content of the message
        return response.message.content
    except Exception as e:
        # If an error occurs, log the error and return a generic error message
        logging.exception('An error occurred:')
        return 'Something went wrong. Please try again later.'

# Function to update the prompt list
def update_prompt_list(message: str, prompt_list: list[str]) -> None:
    """
    Update the prompt list by appending a new message.

    Args:
        message (str): The new message to append to the prompt list.
        prompt_list (list[str]): The current prompt list.

    Returns:
        None
    """
    # Append the new message to the prompt list
    prompt_list.append(message)

# Function to create prompt
def create_prompt(message: str, prompt_list: list[str]) -> str:
    """
    Create a prompt by appending the new message to the prompt list and joining the list elements with line breaks.

    Args:
        message (str): The new message to append to the prompt list.
        prompt_list (list[str]): The current prompt list.

    Returns:
        str: The newly created prompt.
    """
    # Append the new message to the prompt list
    update_prompt_list(message, prompt_list)
    
    # Join the list elements with line breaks
    return '\n'.join(prompt_list)  # Return the newly created prompt

# Function to get bot response
def get_bot_response(message: str, prompt_list: list[str], qp: QP) -> str:
    """
    Get the response from the bot by making an API request with the given message.

    Args:
        message (str): The new message to append to the prompt list.
        prompt_list (list[str]): The current prompt list.
        qp (QP): The query pipeline instance.

    Returns:
        str: The response from the bot.
    """
    # Make the API request using the given message and query pipeline
    bot_response = get_api_response(message, qp)
    
    return bot_response


# API endpoint to receive messages from frontend
@app.route('/rag/message', methods=['POST'])
def receive_message():
    """
    API endpoint to receive messages from the frontend.

    This endpoint receives a POST request with JSON data containing a 'message' field.
    It then calls the get_bot_response function to get a response from the bot.
    The response is returned as a JSON object with a 'message' field.

    Returns:
        A JSON object with a 'message' field containing the response from the bot.
    """
    # Get the JSON data from the request
    data = request.json

    # Get the 'message' field from the JSON data
    user_input = data.get('message')

    # Get the response from the bot using the user's input and the current prompt list
    response = get_bot_response(user_input, prompt_list, qp)

    # Return the response as a JSON object with a 'message' field
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
    """
    Retrieves the radar data for two employees based on their IDs.

    Args:
        employee1_id (int): The ID of the first employee.
        employee2_id (int): The ID of the second employee.

    Returns:
        tuple: A tuple containing the common competencies, levels for employee1, and levels for employee2.
              If either employee ID is not found, returns (None, None, None).
    """
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
    """
    Retrieves the unique matricules from the dataframe.

    Returns:
        A JSON object containing the unique matricules.
    """
    # Get the unique matricules from the dataframe
    matricules = df['Matricule'].unique().tolist()

    # Return the unique matricules as a JSON object
    return jsonify(matricules)

@app.route('/barchartdata', methods=['POST'])
def bar_chart_data():
    """
    Retrieves the common competences and their corresponding levels for two employees and returns the data as JSON.
    
    Args:
        employee1_id (int): The ID of the first employee.
        employee2_id (int): The ID of the second employee.
    
    Returns:
        A JSON object containing the common competences, their levels for employee1, and their levels for employee2.
    """
    # Retrieve the POST request data
    data = request.json
    
    # Get the IDs of the two employees
    employee1_id = data.get('employee1_id')
    employee2_id = data.get('employee2_id')
    
    # Retrieve data for the two employees
    employee1_data = df[df['Matricule'] == employee1_id].iloc[0]
    employee2_data = df[df['Matricule'] == employee2_id].iloc[0]
    
    # Get the common competences
    common_competences = list(set(employee1_data['competence']).intersection(employee2_data['competence']))
    
    # Filter the levels for the common competences
    levels_employee1 = [employee1_data['niveau'][employee1_data['competence'].index(comp)] for comp in common_competences]
    levels_employee2 = [employee2_data['niveau'][employee2_data['competence'].index(comp)] for comp in common_competences]

    # Create a dictionary to hold the data
    data = {
        'common_competences': common_competences,
        'levels_employee1': levels_employee1,
        'levels_employee2': levels_employee2
    }
    
    # Return the data as JSON
    return jsonify(data)


@app.route("/")
def home():
    """
    This function is a route for the root URL ("/").
    It returns the path to the file that contains the HTML template for the home page.

    Returns:
        str: The path to the file that contains the HTML template for the home page.
    """
    # Return the path to the file that contains the HTML template for the home page
    return file_path
    return file_path

if __name__ == "__main__":
    app.run(app, debug=True)