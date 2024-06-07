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
    """
    Reads the API key from the given file.

    Args:
        file_path (str): The path to the file containing the API key.

    Returns:
        str: The API key read from the file.
    """
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
    """
    Get API response from the query pipeline using the given prompt.

    Args:
        prompt (str): The prompt for the API.
        qp (QP): The query pipeline instance.

    Returns:
        str: The API response.

    Raises:
        Exception: If an error occurs during the API request.

    """
    try:
        # Run the query pipeline with the given prompt
        response = qp.run(query_str=prompt)

        # Return the content of the message from the API response
        return response.message.content
    except Exception as e:
        # If an error occurs, log the exception and return a generic error message
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
    return '\n'.join(prompt_list)

# Function to get bot response
def get_bot_response(message: str, prompt_list: list[str], qp: QP) -> str:
    """
    Get the response from the bot by creating a prompt and making an API request.

    Args:
        message (str): The new message to append to the prompt list.
        prompt_list (list[str]): The current prompt list.
        qp (QP): The query pipeline instance.

    Returns:
        str: The response from the bot.
    """
    # Create the prompt by appending the new message to the prompt list
    prompt = create_prompt(message, prompt_list)
    
    # Make the API request using the created prompt and query pipeline
    bot_response = get_api_response(prompt, qp)
    
    # Return the response from the bot
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

# Entry point
if __name__ == '__main__':
    app.run(debug=True)
