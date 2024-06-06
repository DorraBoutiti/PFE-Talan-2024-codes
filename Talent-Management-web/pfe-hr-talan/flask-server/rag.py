from flask import Flask, request, jsonify
from llama_index.core.query_pipeline import (
    QueryPipeline as QP,
    Link,
    InputComponent,
)
from llama_index.experimental.query_engine.pandas import PandasInstructionParser

from llama_index.llms.openai import OpenAI
from llama_index.core.prompts import PromptTemplate
import pandas as pd
import logging
import os

logging.basicConfig(level=logging.DEBUG)  #  configure logging

app = Flask(__name__)

# Function to read API key from file
def read_api_key(file_path: str) -> str:
    with open(file_path, 'r') as file:
        return file.read().strip()

# Initialize OpenAI client
api_key = read_api_key('hidden.txt')
os.environ["OPENAI_API_KEY"] =api_key


df = pd.read_csv("./csvs/eval.csv")

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
llm = OpenAI(model="gpt-3.5-turbo")

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
# add link from response synthesis prompt to llm2
qp.add_link("response_synthesis_prompt", "llm2")

# Initialize prompt list
prompt_list = ["""You are a professional HR and talent management assistant bot called TAL-BOT.
        You are developed and designed by Talan Tunisia in 2024.
        You are great at answering questions about Talent management and HR decisions in a concise
        You should provide this information when someone greets you \
        and easy to understand manners, not longer than 12 words.
        you never say that you are not a HR assistant or talent management assistant, and always say something helpful.
        You only answer questions about Talent management and HR decisions.
        When you don't know the answer to a question you admit that you don't know.
        You are integrated in a talent management web application for the company.
        The company "talan tunisia" is an IT services providing consulting for clients around the world.
        You will have access to the employees database.
        You are being used by HR manager and departments Managers.
        You are also responsible for helping them make well-considered decisions concerning employee development.
        You should, when asked, give recommendations about employees career path, learning plan and other decisions based on the employee's data base that you'll have access to.
        Your answers should be clear, short, no more than 12 words.
        Make sure that to give precise answers correctly and don't go of subject.
        Don't give any details about your AI model nor your API or how you are powered, it's top secret .
        dont share that you have access to the employee's database.
        Only talk about your self when asked to.\ """]

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
    prompt = create_prompt(message, prompt_list)
    bot_response = get_api_response(prompt, qp)
    return bot_response

# API endpoint to receive messages from frontend
@app.route('/rag/message', methods=['POST'])
def receive_message():
    data = request.json
    user_input = data.get('message')
    response = get_bot_response(user_input, prompt_list, qp)
    return jsonify({'message': response})

# Entry point
if __name__ == '__main__':
    app.run(debug=True)
