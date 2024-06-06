import os
import asyncio
from openai import AsyncOpenAI
from dotenv import load_dotenv
import math
import re
import tiktoken
from typing import Iterator, Optional





class OpenAIAPI:
    async def generate_recommendations(self, resume: str) -> str:
        """
        Generate recommendations for certificates and provide advice based on the provided employee resume.

        Args:
            :param(str) resume: The employee's resume.

        Returns:
            :return:(str) The generated recommendations and advice.
        """
        cleaned_resume = self.text_cleaner(resume)

        recommendations_and_advice = await self.generate_chat_response(
            prompt=cleaned_resume,
            model="gpt-3.5-turbo"
        )

        return recommendations_and_advice

    def text_cleaner(self, prompt: str) -> str:
        """
        Cleans the text by removing stopwords to make prompt shorter and censoring profane words.

        Args:
            :param(str) prompt: The text to be cleaned.

        Returns:
            :return:(str) response: The cleaned text.
        """
        return prompt

    async def generate_chat_response(self, prompt: str, *, model: str, api_key: Optional[str] = None) -> str:
        """
        Generate a response from the OpenAI API based on the specified parameters.

        Args:
            :param(str) prompt: The text input to be used for generating the response.
            :param(str) model: The model to be used for generating the response.
            :param(Optional[str]) api_key: The API key to be used for generating the response. If not provided, the value of the OPENAI_API_KEY environment variable will be used.

        Returns:
            :return:(str) The generated response.
        """
        client = AsyncOpenAI(api_key=api_key)

        try:
            completion = await client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": """
                    Please generate a personalized learning plan for the provided employee. The goal is to help the employee advance in their career within the company by focusing on the necessary skills, certifications, and professional development activities. Use the provided employee information and the company positions list to know what are the suitable future positions for this employee within the company and tailor the learning plan to help the employee achieve that career goals. Use the "employee" instead of "you" when responding. The response should be clear, concise, and engaging, using bullet points, emojis, and a friendly tone.
                    📝 **Personalized Learning Plan**
                    **Current Position**: `<current_position>`
                    📚 **Recommended Learning Plan**:
                    **Courses and Certifications**🎓:
                      - 🏅 **<certificate_1>**: <reason_1>
                      - 🏅 **<certificate_2>**: <reason_2>
                      - 🏅 **<certificate_3>**: <reason_3>
                      ...
                    **Professional Development**💼:
                      - 🌟 **<development_activity_1>**: <benefit_1>
                      - 🌟 **<development_activity_2>**: <benefit_2>
                      - 🌟 **<development_activity_3>**: <benefit_3>
                      ...
                    Example:
                    📝 **Personalized Learning Plan**
                    **Current Position**: Software Engineer
                    📚 **Recommended Learning Plan**:
                    **Courses and Certifications**🎓:
                      - 🏅 **Advanced Software Architecture**: Enhances design and architecture skills, preparing for senior roles.
                      - 🏅 **Project Management Professional (PMP)**: Equips with skills to manage larger projects and lead teams.
                      - 🏅 **Certified Scrum Master (CSM)**: Improves agile project management capabilities, fostering better team collaboration.
                    **Professional Development**💼:
                      - 🌟 **Take on leadership roles in projects**: Gain hands-on leadership experience.
                      - 🌟 **Network with professionals in your desired field**: Gain insights and mentorship.
                      - 🌟 **Continuously update your skills with the latest industry trends and technologies**: Stay competitive and knowledgeable.
                    """},

                    {"role": "user", "content": prompt}
                ],
                temperature=0,
            )
            response = completion.choices[0].message.content
        except Exception as e:
            response = f"Error: {e}"

        return response


    async def generate_chat_response2(self, prompt: str, *, model: str, api_key: Optional[str] = None) -> str:
        """
        Gene'rate a response from the OpenAI API based on the specified parameters.

        Args:
            :param(str) prompt: The text input to be used for generating the response.
            :param(str) model: The model to be used for generating the response.
            :param(Optional[str]) api_key: The API key to be used for generating the response. If not provided, the value of the OPENAI_API_KEY environment variable will be used.

        Returns:
            :return:(str) The generated response.
        """
        client = AsyncOpenAI(api_key=api_key)

        try:
            completion = await client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": """
                    🔍 **Guidance on Career Trajectory**
                    Please provide guidance on the career trajectory for this employee, outlining recommendations for their next positions. 
                    Focus on simplicity and only give the top and most clear choices using the company positions provided. 
                    Ensure all recommended positions are from the list of company positions provided in the prompt. 
                    Format your response as follows:
                    📈 **Guidance on Career Trajectory**

**Current Position**: `<current_position>`

**Recommended Next Positions**:

**<next_position_1>**:
  -✨ **Reason**: <detailed_reason_1>
  -📘 **Necessary Skills to Improve**: <skills_to_improve_1>
  
**<next_position_2>**:
  -✨ **Reason**: <detailed_reason_2>
  -📘 **Necessary Skills to Improve**: <skills_to_improve_2>
  
**<next_position_3>**:
  -✨ **Reason**: <detailed_reason_3>
  -📘 **Necessary Skills to Improve**: <skills_to_improve_3>

Example:
📈 **Guidance on Career Trajectory**
**Current Position**: Software Engineer
**Recommended Next Positions**:
**Senior Software Engineer**:
  -✨ **Reason**: Demonstrated proficiency in coding, design, and problem-solving, along with successful completion of several high-impact projects.
  -📘 **Necessary Skills to Improve**: Leadership, team collaboration, code review expertise.
**Tech Lead**:
  -✨ **Reason**: Exhibits strong leadership abilities, mentoring skills, and effective project management, having led multiple teams to successful project completions.
  -📘 **Necessary Skills to Improve**: Strategic planning, conflict resolution, stakeholder management.
**Engineering Manager**:
  -✨ **Reason**: Extensive experience in team management, strategic planning, and operational efficiency, contributing to overall company goals.
  -📘 **Necessary Skills to Improve**: Visionary leadership, financial acumen, performance evaluation.
                    """},

                    {"role": "user", "content": prompt}
                ],
                temperature=0,
            )
            response = completion.choices[0].message.content
        except Exception as e:
            response = f"Error: {e}"

        return response



    async def generate_chat_response3(self, prompt: str, *, model: str, api_key: Optional[str] = None) -> str:
        """
        Generate a response from the OpenAI API based on the specified parameters.

        Args:
            :param(str) prompt: The text input to be used for generating the response.
            :param(str) model: The model to be used for generating the response.
            :param(Optional[str]) api_key: The API key to be used for generating the response. If not provided, the value of the OPENAI_API_KEY environment variable will be used.

        Returns:
            :return:(str) The generated response.
        """
        client = AsyncOpenAI(api_key=api_key)

        try:
            completion = await client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": "Please summarize the information provided below. It outlines the top matched employees who have been matched to a specific job description. Your summary should be concise, highlighting key details such as the qualifications, skills, and experiences of the matched employees, as well as any notable insights or trends."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0,
            )
            response = completion.choices[0].message.content
        except Exception as e:
            response = f"Error: {e}"

        return response