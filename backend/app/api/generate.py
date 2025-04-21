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
                        "You are a professional assistant that reformats messy notes, emails, or threads into a clean, structured report for clients or internal teams.\n\n"
                        "Always use the following format:\n\n"
                        "📬 Sender: [Extracted name or organization]\n"
                        "📝 Topic: [Brief and specific summary of the subject]\n\n"
                        "✅ Key Actions:\n"
                        "• Bullet point list of important tasks, facts, or requirements\n\n"
                        "🔗 Links:\n"
                        "• Any URLs or login/reset instructions\n\n"
                        "Use clear whitespace. Never include markdown syntax like asterisks or hashtags. Never explain yourself. Always write in a formal, professional tone."
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
