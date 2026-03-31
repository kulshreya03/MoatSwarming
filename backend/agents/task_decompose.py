from llm import llm
from langchain_core.messages import HumanMessage
import json
import re

def task_decompose(project_name: str):
    
    prompt = f"""
You are a senior software architect.

Decompose the given project into realistic software development tasks.

Project Name: {project_name}

Rules:
- Generate 2 to 3 tasks
- Tasks should be practical and implementation-focused
- Generate short task description of only 5 to 6 words
- Include backend, frontend, database, deployment if applicable
- Keep descriptions similar to real-world GitHub tasks
- Use modern tech stacks (FastAPI, Node.js, React, AWS, etc.)
- Return ONLY JSON array. No text before or after.

Return ONLY valid JSON in this format:

[
  {{
    "task_description": "string"
  }}
]

Example:
[
  {{
    "task_description": "Develop backend REST API using Node.js and Express.js"
  }}
]

Example 2:
[
  {{
    "task_description": "Store parsed resumes and task mappings in MongoDB database"
  }}
]
"""

    response = llm.invoke([HumanMessage(content=prompt)])

    content = response.content.strip()

    print("RAW LLM:", content)

    try:
        # ✅ Extract JSON safely
        json_match = re.search(r"\[.*\]", content, re.DOTALL)
        if json_match:
            tasks = json.loads(json_match.group())
        else:
            raise ValueError("No JSON found")
        
        print("PARSED TASKS:", tasks)

    
    except Exception as e:
        print("LLM ERROR:", content)

        tasks = [
            {"task_description": "Setup project structure"},
            {"task_description": "Develop core backend API"},
            {"task_description": "Create frontend UI"}
        ]

    return tasks