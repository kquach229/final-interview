import os
import json
import requests
from dotenv import load_dotenv

from livekit import agents, api
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import google

load_dotenv()

API_BASE = os.getenv("NEXT_PUBLIC_API_BASE", "http://localhost:3000")


class Assistant(agents.Agent):
    def __init__(self, instructions: str) -> None:
        super().__init__(instructions=instructions)


async def entrypoint(ctx: agents.JobContext):
    try:
        metadata_str = json.loads(ctx.job.room.metadata)
        interviewId = metadata_str["interviewId"]
        if not interviewId:
            raise ValueError("interviewId is missing in room metadata")
    except Exception as e:
        raise RuntimeError(f"Failed to parse room metadata: {e}")

    # Fetch interview data from your API
    res = requests.get(f"{API_BASE}/api/get-interview/{interviewId}")
    if res.status_code != 200:
        raise RuntimeError(f"Failed to fetch interview {interviewId}: {res.text}")
    interview = res.json()

    instructions = f"""
    You are a helpful voice AI assistant.
    Conduct a mock interview for the position "{interview['jobTitle']}" 
    at {interview.get('companyName', 'an unspecified company')}.
    Start by greeting the candidate, then ask questions based on the job description.
    Provide feedback after each response.
    """

    session = AgentSession(
        llm=google.beta.realtime.RealtimeModel(
            model="gemini-2.0-flash-exp",
            voice="Puck",
            temperature=0.8,
            instructions=instructions,
        )
    )

    print(f"[Agent] Starting session in room: {ctx.room.name}")
    
    # Auto-start agent session and publish audio
    await session.start(
        room=ctx.room,
        agent=Assistant(instructions=instructions),
        room_input_options=RoomInputOptions(
            publish_audio=True  # Ensures the agent publishes its audio track immediately
        ),
    )

    print("[Agent] Audio track published, starting mock interview...")
    
    # Start the interview immediately
    await session.generate_reply(
        instructions="Greet the candidate and begin the interview."
    )
    print("[Agent] Interview started.")
