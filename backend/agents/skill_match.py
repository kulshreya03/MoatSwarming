from llm import llm
from database.database import SessionLocal, engine
import database.models as models
from sqlalchemy.orm import Session
from state import state
from langchain_core.messages import HumanMessage
import json
import re
from tools.task_match_tool import fetch_matching_tasks
from langchain.agents import create_agent


def match_skills_to_tasks(user_id:int):

    tools = [fetch_matching_tasks]
    agent = create_agent(model=llm,tools=tools)

    prompt = f"""
You are a Skill-Task Matching Engine.

Match resume skills with project tasks.

Your Task:
Return ONLY tasks that match the resume skills.

First call the tool:
fetch_matching_tasks

Input:
user_id = {user_id}

The tool returns:
- resume_skills
- filtered_tasks

------------------------
MATCHING RULES
------------------------

A task matches if:

1. A resume skill appears in the task description
2. A framework matches its language
   example: react → frontend
3. A cloud skill matches cloud tasks
   example: aws → deployment
4. A database skill matches database tasks
5. DevOps skills match CI/CD or deployment tasks

------------------------
OUTPUT FORMAT
------------------------

Return ONLY JSON.

[
  {{
    "task_id": int,
    "project_id": int,
    "task_description": string,
    "github_repo": string,
    "status": string,
    "matched_skills": [string]
  }}
]

Do NOT return tasks with no matching skills.
"""

    

    response = agent.invoke({
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    })
    try:
        final_message = response["messages"][-1].content

        print("RAW MESSAGE:", final_message)

        # Extract actual text from LangChain content blocks
        if isinstance(final_message, list):

            text_output = ""

            for item in final_message:

                if item.get("type") == "text":
                    text_output += item.get("text", "")

        else:
            text_output = final_message

        # Remove markdown json fences
        content = re.sub(r"```json|```", "", text_output).strip()

        print("CLEANED CONTENT:", content)

        matched_tasks = json.loads(content)
    except Exception:
        matched_tasks = []

    return matched_tasks
