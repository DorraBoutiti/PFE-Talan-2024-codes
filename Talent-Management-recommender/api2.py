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
    Asynchronous function that reads text resume from command line argument, 
    reads API key from 'hidden.txt' file, generates a chat completion using GPT-4o model, 
    saves the completion to 'byText.json' file, and prints the path to the file.
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

    # Generate chat completion using OpenAI API
    chat_completion = await openai_api.generate_chat_response2(prompt =text_resume, model =model, api_key=api_key )

    # Create dictionary with response and save it to JSON file
    my_dict = {'response' : str(chat_completion) }
    with open(json_file, "w") as f:
        json.dump(my_dict, f, indent=4)

    # Print path to JSON file
    print(f"Element saved to {json_file}")


asyncio.run(main())