from flask import Flask, request, jsonify
from openai import OpenAI

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
    # Open the file in read mode
    with open(file_path, 'r') as file:
        # Read the content of the file, strip any leading or trailing whitespace
        # and return the API key
        return file.read().strip()

# Initialize OpenAI client
api_key = read_api_key('hidden.txt')
openai_client = OpenAI(api_key=api_key)

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
def get_api_response(prompt: str, client: OpenAI) -> str:
    """
    Get API response from OpenAI API using the given prompt and client.

    Args:
        prompt (str): The prompt for the API.
        client (OpenAI): The OpenAI client for making the API request.

    Returns:
        str: The API response.
    """
    try:
        # Make API request using the given prompt and client
        response = client.completions.create(
            model="gpt-3.5-turbo-instruct",  # Use GPT-3.5-turbo-instruct model
            prompt=prompt,  # Use the given prompt
            temperature=0.9,  # Use temperature parameter for generating more varied responses
            max_tokens=150,  # Limit the maximum number of tokens in the response
            top_p=1,  # Use top_p parameter for generating more diverse responses
            frequency_penalty=0,  # Use frequency_penalty parameter for preventing repetition
            presence_penalty=0.6,  # Use presence_penalty parameter for reducing the presence of certain words
            stop=['Human:', 'AI:']  # Use stop parameter to stop the response at a specific string
        )
        # Get the first choice from the API response
        choices = response.choices[0]
        # Strip any leading or trailing whitespace from the response text
        return choices.text.strip()
    except Exception as e:
        # If an error occurs, print the error and return a generic error message
        print('ERROR:', e)
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
def get_bot_response(message: str, prompt_list: list[str], client: OpenAI) -> str:
    """
    Get the response from the bot by creating a prompt and making an API request.

    Args:
        message (str): The new message to append to the prompt list.
        prompt_list (list[str]): The current prompt list.
        client (OpenAI): The OpenAI client for making the API request.

    Returns:
        str: The response from the bot.
    """
    # Create the prompt by appending the new message to the prompt list
    prompt = create_prompt(message, prompt_list)
    
    # Make the API request using the created prompt and client
    bot_response = get_api_response(prompt, client)
    
    # Return the response from the bot
    return bot_response


# API endpoint to receive messages from frontend
@app.route('/chatbot/message', methods=['POST'])
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
    response = get_bot_response(user_input, prompt_list, openai_client)

    # Return the response as a JSON object with a 'message' field
    return jsonify({'message': response})


# Entry point
if __name__ == '__main__':
    app.run(debug=True)
