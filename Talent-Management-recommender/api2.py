import os
import asyncio
from openai import AsyncOpenAI
from model_class import OpenAIAPI
import sys
import json

def read_api_key(file_path: str) -> str:
    with open(file_path, 'r') as file:
        return file.read().strip()
async def main() -> None:
    if len(sys.argv) < 2:
        print("Insufficient arguments provided.")
        sys.exit(1)
    text_resume = sys.argv[1]

    api_key = read_api_key('hidden.txt')
    model = "gpt-4o"
    openai_api = OpenAIAPI()

    json_file = "byText.json"
    if os.path.exists(json_file):
        os.remove(json_file)
        print(f"{json_file} removed")
    else:
        print(f"{json_file} does not exist")


    chat_completion = await openai_api.generate_chat_response2(prompt =text_resume, model =model, api_key=api_key )

    my_dict = {'response' : str(chat_completion) }
    with open(json_file, "w") as f:
        json.dump(my_dict, f, indent=4)

    print(f"Element saved to {json_file}")

asyncio.run(main())