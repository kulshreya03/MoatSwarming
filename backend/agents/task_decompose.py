from llm import llm
import re
from langchain_core.messages import HumanMessage


def task_decompose(task: str) -> list[str]:
    prompt = f"""Decompose the following task into simpler subtasks:
    Task: {task}
    Return a list of subtasks, each on a new line."""

    response = llm.invoke([HumanMessage(content=prompt)])

    return re.split(r'\n+', response.content.strip())

