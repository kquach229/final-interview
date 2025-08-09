import os
import json
import requests
from dotenv import load_dotenv


from livekit import agents, api
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import google

load_dotenv()

API_BASE = os.getenv("NEXT_PUBLIC_API_BASE", "http://localhost:3000")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
LIVEKIT_URL = os.getenv("LIVEKIT_URL")


class Assistant(agents.Agent):
    def __init__(self, instructions: str) -> None:
        super().__init__(instructions=instructions)


async def entrypoint(ctx: agents.JobContext):
    print(f"Entrypoint called for room: {ctx.job.room.metadata}")
    metadata_str = json.loads(ctx.job.room.metadata)

    interviewId = metadata_str["interviewId"]
    print(f"interviewid {interviewId}")

  
     

    res = requests.get(f"{API_BASE}/api/get-interview/{interviewId}")
    if res.status_code != 200:
        raise RuntimeError(f"Failed to fetch interview {interviewId}: {res.text}")
    interview = res.json()

    context_instructions = f"""
    You are a helpful voice AI assistant.
    You are conducting a mock interview for the position "{interview['jobTitle']}"
    at {interview.get('companyName', 'an unspecified company')}.
    Job Description: {interview['jobDescription']}
    Company Description: {interview.get('companyDescription', 'N/A')}
    Resume: {interview.get('resume', 'No resume provided')}
    """

    session = AgentSession(
        llm=google.beta.realtime.RealtimeModel(
            model="gemini-2.0-flash-exp",
            voice="Puck",
            temperature=0.8,
            instructions=context_instructions,
        )
    )

    await session.start(
        room=ctx.room,
        agent=Assistant(instructions=context_instructions),
        room_input_options=RoomInputOptions(),
    )

    await session.generate_reply(
        instructions="Greet the candidate and begin the interview."
    )


if __name__ == "__main__":
    print("Starting LiveKit agent worker...")
    agents.cli.run_app(
        agents.WorkerOptions(entrypoint_fnc=entrypoint)
    )
