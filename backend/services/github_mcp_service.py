import os
import json
from dotenv import load_dotenv

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

load_dotenv()

GITHUB_MCP_PATH = os.environ["GITHUB_MCP_PATH"]
GITHUB_PAT = os.environ["GITHUB_PERSONAL_ACCESS_TOKEN"]

def parse_repo(repo_full: str):
    """
    Accepts:
    user/repo
    https://github.com/user/repo
    github.com/user/repo
    """

    if not repo_full:
        return None, None

    repo_full = repo_full.strip()

    if "github.com" in repo_full:
        parts = repo_full.split("github.com/")[-1].split("/")
    else:
        parts = repo_full.split("/")

    if len(parts) >= 2:
        owner = parts[0]
        repo = parts[1]
        return owner, repo

    return None, None


async def get_commit_count(repo_full: str):

    owner, repo = parse_repo(repo_full)

    if not owner or not repo:
        return 0

    server_params = StdioServerParameters(
        command=GITHUB_MCP_PATH,
        args=["stdio"],
        env={
            **os.environ,
            "GITHUB_PERSONAL_ACCESS_TOKEN": GITHUB_PAT,
        },
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:

            await session.initialize()

            result = await session.call_tool(
                "list_commits",
                {
                    "owner": owner,
                    "repo": repo,
                    "sha": "main"
                }
            )

            if hasattr(result, "content"):

                text = "\n".join(
                    getattr(c, "text", str(c))
                    for c in result.content
                )

                try:
                    import json
                    data = json.loads(text)

                    if isinstance(data, list):
                        return len(data)

                    if isinstance(data, dict) and "commits" in data:
                        return len(data["commits"])

                except Exception:
                    return 0

    return 0

