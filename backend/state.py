from typing import Dict, List, TypedDict, Set


class AgentState(TypedDict):
    resume_text: str
    resume_skills: Dict[str, List[str]]

    # flattened skills used for matching
    flat_skills: List[str]

    # fast lookup set for python matching
    skill_lookup: Set[str]


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
    },

    # flattened skills
    "flat_skills": [],

    # set for fast membership checking
    "skill_lookup": set()
}