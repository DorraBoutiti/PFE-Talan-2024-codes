import os
import asyncio
from openai import AsyncOpenAI
from model_class import OpenAIAPI
import sys
import json

def read_api_key(file_path: str) -> str:
    """
    Reads the API key from the specified file.

    Args:
        file_path (str): The path to the file containing the API key.

    Returns:
        str: The API key.
    """
    # Open the file in read mode and read the contents
    with open(file_path, 'r') as file:
        # Remove any leading or trailing whitespace and return the API key
        return file.read().strip()



async def main() -> None:
    """
    Asynchronous function that generates a chat completion using GPT-4o model,
    saves the completion to 'byText.json' file, and prints the path to the file.

    This function reads the text resume from the command line argument, reads the API key
    from 'hidden.txt' file, and sets the model to GPT-4o.

    This function first checks if enough arguments are provided. If not, it prints an error message
    and exits the program. It then reads the text resume from the command line argument.
    Next, it reads the API key from 'hidden.txt' file and sets the model to GPT-4o.
    Next, it creates an instance of the OpenAIAPI class.
    Next, it sets the JSON file name to 'byText.json'.
    Next, it removes the JSON file if it exists and prints a message indicating that the file was removed.
    If the file does not exist, it prints a message indicating that the file does not exist.
    Next, it generates a chat completion using the OpenAI API, saving it to the JSON file.
    Finally, it prints a message indicating the path to the JSON file.
    """
    # Check if enough arguments provided
    if len(sys.argv) < 2:
        print("Insufficient arguments provided.")
        sys.exit(1)

    # Read text resume from command line argument
    text_resume = sys.argv[1]

    # Read API key from 'hidden.txt' file
    api_key = read_api_key('hidden.txt')

    # Set model to GPT-4o
    model = "gpt-4o"

    # Create OpenAIAPI object
    openai_api = OpenAIAPI()

    # Set JSON file name
    json_file = "byText.json"

    # Remove JSON file if it exists
    if os.path.exists(json_file):
        os.remove(json_file)
        print(f"{json_file} removed")
    else:
        print(f"{json_file} does not exist")

    # Generate chat completion using OpenAI API and save it to JSON file
    chat_completion = await openai_api.generate_chat_response3(prompt=text_resume, model=model, api_key=api_key)

    my_dict = {'response': str(chat_completion)}
    with open(json_file, "w") as f:
        json.dump(my_dict, f, indent=4)

    # Print path to JSON file
    print(f"Element saved to {json_file}")
    print(f"Element saved to {json_file}")

asyncio.run(main())