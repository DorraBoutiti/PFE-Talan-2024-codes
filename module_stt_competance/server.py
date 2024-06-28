from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
import spacy
from spacy.matcher import PhraseMatcher
from skillNer.skill_extractor_class import SkillExtractor
from skillNer.general_params import SKILL_DB
import json
from langdetect import detect
from googletrans import Translator

app = Flask(__name__)

# Update CORS configuration
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

api = Api(app)

# Initialize SpaCy model and PhraseMatcher
nlp = spacy.load("en_core_web_lg")
skill_extractor = SkillExtractor(nlp, SKILL_DB, PhraseMatcher)

# Load skill database
with open("./static/skill_db_relax_20.json", "r") as file:
    data = json.load(file)


class SkillExtraction(Resource):
    def post(self):
        # Get text data from request
        interview_transcript = request.json.get("text", "")

        # Detect language
        language = detect(interview_transcript)

        # Translate text to English if not already in English
        if language != "en":
            translator = Translator()
            interview_transcript = translator.translate(
                interview_transcript, src=language, dest="en"
            ).text

        # Annotate the text to extract skills
        annotations = skill_extractor.annotate(interview_transcript)

        # Initialize an empty list to store the skills
        skills_list = []

        # Iterate over full_matches
        for skill in annotations["results"]["full_matches"]:
            skill_info = {
                "doc_node_value": skill["doc_node_value"],
                "score": skill["score"],
                "skill_type": data[skill["skill_id"]]["skill_type"],
                "skill_name": data[skill["skill_id"]]["skill_name"],
            }
            skills_list.append(skill_info)

        # Iterate over ngram_scored
        for skill in annotations["results"]["ngram_scored"]:
            skill_info = {
                "doc_node_value": skill["doc_node_value"],
                "score": skill["score"],
                "skill_type": data[skill["skill_id"]]["skill_type"],
                "skill_name": data[skill["skill_id"]]["skill_name"],
            }
            skills_list.append(skill_info)

        # Initialize weights for different skill types
        weights = {"Hard Skill": 0.7, "Soft Skill": 0.3}

        # Initialize dictionaries to calculate the weighted sum and count for each skill type
        weighted_sums = {"Hard Skill": 0, "Soft Skill": 0}
        skill_counts = {"Hard Skill": 0, "Soft Skill": 0}

        # Iterate over the skills list
        for skill in skills_list:
            skill_type = skill["skill_type"]

            # Get the weight for the skill type
            weight = weights.get(skill_type, 0)

            # Add the weighted score to the weighted sum for the skill type
            weighted_sums[skill_type] += skill["score"] * weight

            # Increment the count for the skill type
            skill_counts[skill_type] += 1

        # Calculate the normalized weighted average score for each skill type
        normalized_scores = {}
        for skill_type, weighted_sum in weighted_sums.items():
            count = skill_counts[skill_type]
            normalized_scores[skill_type] = weighted_sum / count if count > 0 else 0

        # Calculate the global score as the average of the normalized scores
        global_score = (
            sum(normalized_scores.values()) / len(normalized_scores)
            if normalized_scores
            else 0
        )

        # Convert the global score to a percentage
        global_score_percentage = global_score * 100

        # Filter skills_list by skill_type
        filtered_skills = {}
        for skill_type in normalized_scores:
            filtered_skills[skill_type] = [
                skill for skill in skills_list if skill["skill_type"] == skill_type
            ]

        # Prepare response data
        response_data = {
            "global_score_percentage": global_score_percentage,
            "filtered_skills": filtered_skills,
        }

        return jsonify(response_data)


api.add_resource(SkillExtraction, "/extract_skills")


@app.route("/")
def hello():
    return "Hello from Module Speech-to-Text"


# Swagger UI setup
SWAGGER_URL = "/swagger"
API_URL = "/static/swagger.json"

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={"app_name": "HrDocumentAnalyzer"},  # Swagger UI config overrides
)

app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

if __name__ == "__main__":
    app.run(debug=True)
