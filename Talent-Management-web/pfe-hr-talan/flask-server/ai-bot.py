from flask import Flask, request, jsonify
from openai import OpenAI

app = Flask(__name__)

# Function to read API key from file
def read_api_key(file_path: str) -> str:
    with open(file_path, 'r') as file:
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
    try:
        response = client.completions.create(
            model="gpt-3.5-turbo-instruct",
            prompt=prompt,
            temperature=0.9,
            max_tokens=150,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0.6,
            stop=['Human:', 'AI:']
        )
        choices = response.choices[0]
        return choices.text.strip()
    except Exception as e:
        print('ERROR:', e)
        return 'Something went wrong. Please try again later.'

# Function to update the prompt list
def update_prompt_list(message: str, prompt_list: list[str]) -> None:
    prompt_list.append(message)

# Function to create prompt
def create_prompt(message: str, prompt_list: list[str]) -> str:
    update_prompt_list(message, prompt_list)
    return '\n'.join(prompt_list)

# Function to get bot response
def get_bot_response(message: str, prompt_list: list[str], client: OpenAI) -> str:
    prompt = create_prompt(message, prompt_list)
    bot_response = get_api_response(prompt, client)
    return bot_response

# API endpoint to receive messages from frontend
@app.route('/chatbot/message', methods=['POST'])
def receive_message():
    data = request.json
    user_input = data.get('message')
    response = get_bot_response(user_input, prompt_list, openai_client)
    return jsonify({'message': response})

# Entry point
if __name__ == '__main__':
    app.run(debug=True)
