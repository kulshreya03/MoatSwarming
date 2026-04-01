from llm import llm
from langchain_core.messages import HumanMessage
import json
import re

def equity_distributer(contributions):

    prompt = f"""
You are an equity distribution engine using the Slicing Pie method.

Each user's contribution is represented in units.

Your task:
1. Calculate total units across all users
2. Calculate each user's equity percentage:
   equity = (user_units / total_units) * 100

Return ONLY valid JSON in this format:
[
  {{
    "user_id": int,
    "total_units": float,
    "equity": float
  }}
]

Input Contributions:
{json.dumps(contributions)}
"""

    response = llm.invoke([HumanMessage(content=prompt)])
    content = response.content.strip()

    # ✅ Clean JSON (important)
    content = re.sub(r"```json|```", "", content).strip()

    return content