from typing import Dict, List, TypedDict


class AgentState(TypedDict):
    resume_text: str
    resume_skills: Dict[str, List[str]]


# Global runtime state
state: AgentState = {
    "resume_text": "",
    "resume_skills": {
        "languages": [],
        "frameworks": [],
        "libraries": [],
        "databases": [],
        "cloud": [],
        "devops": [],
        "tools": [],
        "concepts": []
    }
}
