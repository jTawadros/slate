from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from openai import OpenAI
import os
from dotenv import load_dotenv
from fastapi.responses import JSONResponse

load_dotenv()

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class ReportReq(BaseModel):
    notes: str
    report_type: Optional[str] = "General Summary"


@router.options("/generate")
async def handle_preflight():
    return JSONResponse(status_code=200)


@router.post("/generate")
async def generate_report(request: ReportReq):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a professional assistant that transforms unstructured notes, emails, or threads into clear, structured reports. "
                        "Your reports are concise, comprehensive, and organized for clarity.\n\n"
                        "Use this format:\n\n"
                        "📬 Sender: [Extracted name or organization]\n"
                        "📝 Topic: [Short and specific summary of the subject]\n\n"
                        "🧠 Key Points:\n"
                        "• Bullet point list of important takeaways, facts, tasks, or decisions\n"
                        "• Be thorough, but keep each point short and precise\n"
                        "• If multiple themes are present (e.g., health, project, logistics), separate them clearly in bullets\n\n"
                        "🔗 Links:\n"
                        "• Include any relevant URLs, login/reset instructions, or references\n\n"
                        "Keep formatting clean with whitespace. Do not use markdown symbols. Do not explain or apologize. "
                        "Maintain a professional, formal tone across all topics."
                    )
                },
                {"role": "user", "content": request.notes}
            ],
            temperature=0.3,
            max_tokens=600
        )

        summary = response.choices[0].message.content.strip()
        return {"summary": summary}

    except Exception as e:
        return {"summary": f"Error: {str(e)}"}

