import json
from flask import Flask, request, render_template, jsonify, redirect
from flask_restful import Api, Resource
from flask_cors import CORS
from openai import AsyncOpenAI
import asyncio
import time
import ast
import subprocess
import json
import difflib
import sys
from importlib import reload
import unicodedata
from glob import glob
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import tempfile

sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf8', buffering=1)
sys.stdin = open(sys.stdin.fileno(), mode='r', encoding='utf8', buffering=1)
sys.stderr = open(sys.stderr.fileno(), mode='w', encoding='utf8', buffering=1)

app = Flask(__name__)
CORS(app)
api = Api(app)

@app.route('/api/', methods=['POST'])
def get_result():
    """
    Get the employee description based on the employee ID and return the best match.

    Parameters:
        request (flask.Request): The Flask request object.

    Returns:
        flask.Response: The JSON response containing the best match or an error message.
    """
    # Get the employee ID from the request data
    data = request.json
    text_id = data.get('employeeId', '')

    # Read the CSV file
    df = pd.read_csv('data.csv')

    # Define the columns to be included in the description
    description_columns = ['Description', 'competence', 'niveau', 'company positions and classifications']

    # Get the description of the employee
    description = df.loc[df['Matricule'] == text_id, description_columns].values

    if len(description) > 0:
        # Convert the description to a list
        text_resume = description.tolist()

        # Convert the description to a JSON string
        json_string = json.dumps(text_resume)

        # Set the JSON file name
        json_file = "byText.json"

        # Create the command to execute the API script
        command = ["python", "api.py", json_string]

        try:
            # Execute the API script and get the output
            process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

            # Print the STDOUT and STDERR
            for line in process.stdout:
                print("STDOUT:", line.strip())

            for line in process.stderr:
                print("STDERR:", line.strip())

            process.wait()

            # Check if the command executed successfully
            if process.returncode != 0:
                print("Error executing command. Return code:", process.returncode)

        except Exception as e:
            print("Error executing command:", e)

        # Load the JSON file containing the best match
        with open(json_file, "r") as f:
            my_dict = json.load(f)

        # Return the JSON response
        return jsonify(my_dict)

    else:
        # Return an error message if the description is not found
        return jsonify({"error": f"Description not found for Matricule: {text_id}"})


@app.route('/api2/', methods=['POST'])
def get_result2():
    """
    Get the employee description based on the employee ID and return the best match.

    Parameters:
        request (flask.Request): The Flask request object.

    Returns:
        flask.Response: The JSON response containing the best match or an error message.
    """
    # Get the employee ID from the request data
    data = request.json
    text_id = data.get('employeeId', '')

    # Read the CSV file
    df = pd.read_csv('data.csv')

    # Define the columns to be included in the description
    description_columns = ['Description', 'competence', 'niveau', 'company positions and classifications']

    # Get the description of the employee
    description = df.loc[df['Matricule'] == text_id, description_columns].values

    if len(description) > 0:
        # Convert the description to a list
        text_resume = description.tolist()  # The first best match

        # Convert the description to a JSON string
        json_string = json.dumps(text_resume)

        # Set the JSON file name
        json_file = "byText.json"

        # Create the command to execute the API script
        command = ["python", "api2.py", json_string]

        try:
            # Execute the API script and get the output
            process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

            # Print the STDOUT and STDERR
            for line in process.stdout:
                print("STDOUT:", line.strip())

            for line in process.stderr:
                print("STDERR:", line.strip())

            process.wait()

            # Check if the command executed successfully
            if process.returncode != 0:
                print("Error executing command. Return code:", process.returncode)

        except Exception as e:
            print("Error executing command:", e)

        # Load the JSON file containing the best match
        with open(json_file, "r") as f:
            my_dict = json.load(f)

        # Return the JSON response
        return jsonify(my_dict)

    else:
        # Return an error message if the description is not found
        return jsonify({"error": f"Description not found for Matricule: {text_id}"})


@app.route('/api_matching/', methods=['POST'])
def get_result3():
    """
    Get the best matches based on job description and return them as a JSON response.

    Args:
        request (flask.Request): The Flask request object.

    Returns:
        flask.Response: The JSON response containing the best matches.
    """
    # Get the job description and number of top matches from the request
    data = request.json
    text_job = data.get('text', '')
    num_top_matches = data.get('numTopMatches', 5)

    # Read the CSV file
    df = pd.read_csv('data.csv')

    # Load the Sentence Transformer model
    model = SentenceTransformer("all-MiniLM-L6-v2")

    # Define the columns to be included
    columns_to_include = ['Description', 'competence' , 'niveau', 'company positions and classifications']

    # Concatenate the columns with their names
    df['Combined'] = df.apply(
        lambda row: ' '.join([f"{col}: {row[col]}" for col in columns_to_include if pd.notna(row[col])]),
        axis=1
    )

    # Encode the combined columns
    name_embeddings = model.encode(df['Combined'])

    # Encode the job description
    question_embedding = model.encode(text_job)

    # Calculate the cosine similarity between the job description and the combined columns
    similarities = cosine_similarity([question_embedding], name_embeddings)[0]

    # Get the indices of the top matches based on user input
    best_indices = similarities.argsort()[-num_top_matches:][::-1]

    # Create a list of best matches with their similarity percentages
    best_matches = []
    for idx in best_indices:
        match = df.iloc[idx][['Matricule', 'Description', 'competence', 'niveau']].to_dict()
        match['similarity'] = round(similarities[idx] * 100, 2)
        best_matches.append(match)

    if len(best_matches) > 0:
        # Convert the best matches to a JSON string
        json_string = json.dumps(best_matches)

        # Set the JSON file name
        json_file = "byText.json"

        # Create the command to execute the API script
        command = ["python", "api3.py", json_string]

        try:
            # Execute the API script and get the output
            process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

            # Print the STDOUT and STDERR
            for line in process.stdout:
                print("STDOUT:", line.strip())

            for line in process.stderr:
                print("STDERR:", line.strip())

            process.wait()

            # Check if the command executed successfully
            if process.returncode != 0:
                print("Error executing command. Return code:", process.returncode)

        except Exception as e:
            print("Error executing command:", e)

        # Load the JSON file containing the best matches
        with open(json_file, "r") as f:
            my_dict = json.load(f)

        # Update the dictionary with the best matches
        my_dict["table"] = best_matches

        # Save the updated dictionary to the JSON file
        with open(json_file, "w") as f:
            json.dump(my_dict, f, indent=4)

        # Load the updated dictionary from the JSON file
        with open(json_file, "r") as f:
            updated_dict = json.load(f)

        # Return the JSON response
        return jsonify(updated_dict)

    else:
        # Return an error message if no best matches are found
        return jsonify({"error": "Description not found for Matricule"})


if __name__ == '__main__':
    app.run(debug=True, port=4500)