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
    data = request.json
    text_id = data.get('employeeId', '')
    df = pd.read_csv('data.csv')
    description_columns = ['Description', 'competence', 'niveau', 'company positions and classifications']
    description = df.loc[df['Matricule'] == text_id, description_columns].values

    if len(description) > 0:
        text_resume = description.tolist()  # The first best match
        json_string = json.dumps(text_resume)  # Convert to JSON string
        json_file = "byText.json"
        command = ["python", "api.py", json_string]

        try:
            process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
            for line in process.stdout:
                print("STDOUT:", line.strip())

            for line in process.stderr:
                print("STDERR:", line.strip())

            process.wait()

            if process.returncode != 0:
                print("Error executing command. Return code:", process.returncode)

        except Exception as e:
            print("Error executing command:", e)

        with open(json_file, "r") as f:
            my_dict = json.load(f)

        return jsonify(my_dict)
    else:
        return jsonify({"error": f"Description not found for Matricule: {text_id}"})


@app.route('/api2/', methods=['POST'])
def get_result2():
    data = request.json
    text_id = data.get('employeeId', '')
    df = pd.read_csv('data.csv')
    description_columns = ['Description', 'competence', 'niveau', 'company positions and classifications']
    description = df.loc[df['Matricule'] == text_id, description_columns].values
    if len(description) > 0:
        text_resume = description.tolist()  # The first best match
        json_string = json.dumps(text_resume)  # Convert to JSON string
        json_file = "byText.json"
        command = ["python", "api2.py", json_string]

        try:
            process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
            for line in process.stdout:
                print("STDOUT:", line.strip())

            for line in process.stderr:
                print("STDERR:", line.strip())

            process.wait()

            if process.returncode != 0:
                print("Error executing command. Return code:", process.returncode)

        except Exception as e:
            print("Error executing command:", e)

        with open(json_file, "r") as f:
            my_dict = json.load(f)

        return jsonify(my_dict)
    else:
        return jsonify({"error": f"Description not found for Matricule: {text_id}"})


@app.route('/api_matching/', methods=['POST'])
def get_result3():
    data = request.json
    text_job = data.get('text', '')
    num_top_matches = data.get('numTopMatches', 5)  # Get the number of top matches from the request, default is 5

    df = pd.read_csv('data.csv')
    model = SentenceTransformer("all-MiniLM-L6-v2")

    # Define the columns to be included
    columns_to_include = ['Description', 'competence' , 'niveau', 'company positions and classifications']

    # Concatenate the columns with their names
    df['Combined'] = df.apply(
        lambda row: ' '.join([f"{col}: {row[col]}" for col in columns_to_include if pd.notna(row[col])]),
        axis=1
    )

    name_embeddings = model.encode(df['Combined'])

    question_embedding = model.encode(text_job)
    similarities = cosine_similarity([question_embedding], name_embeddings)[0]
    best_indices = similarities.argsort()[-num_top_matches:][::-1]  # Get indices of top matches based on user input

    # Create a list of best matches with their similarity percentages
    best_matches = []
    for idx in best_indices:
        match = df.iloc[idx][['Matricule', 'Description', 'competence', 'niveau']].to_dict()
        match['similarity'] = round(similarities[idx] * 100, 2)  # Add similarity percentage
        best_matches.append(match)

    if len(best_matches) > 0:
        text_resume = best_matches  # The best matches
        json_string = json.dumps(text_resume)  # Convert to JSON string
        json_file = "byText.json"
        command = ["python", "api3.py", json_string]
        try:
            process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
            for line in process.stdout:
                print("STDOUT:", line.strip())

            for line in process.stderr:
                print("STDERR:", line.strip())

            process.wait()

            if process.returncode != 0:
                print("Error executing command. Return code:", process.returncode)

        except Exception as e:
            print("Error executing command:", e)

        with open(json_file, "r") as f:
            my_dict = json.load(f)

        my_dict["table"] = best_matches

        with open(json_file, "w") as f:
            json.dump(my_dict, f, indent=4)

        with open(json_file, "r") as f:
            updated_dict = json.load(f)

        return jsonify(updated_dict)
    else:
        return jsonify({"error": "Description not found for Matricule"})


if __name__ == '__main__':
    app.run(debug=True, port=4500)