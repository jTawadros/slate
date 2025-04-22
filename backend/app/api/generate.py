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
    summary_length: Optional[str] = "Medium"


@router.options("/generate")
async def handle_preflight():
    return JSONResponse(status_code=200)


@router.post("/generate")
async def generate_report(request: ReportReq):
    try:
        length_instruction = {
            "Short":  "In 2‑3 complete sentences, no bullets, no headings.",
            "Medium": "Around 5 concise bullet points.",
            "Long":   "8 or more detailed bullet points."
        }.get(request.summary_length, "Around 5 concise bullet points.")

        # 👉 Build the *format* section only for Medium / Long
        format_block = (
            "\nUse this format:\n\n"
            "📬 Sender: [Extracted name or organization]\n"
            "📝 Topic:  [Short, specific subject]\n\n"
            "🧠 Key Points:\n"
            "• Bullet list of important facts, tasks, or decisions\n"
            "🔗 Links:\n"
            "• Relevant URLs / references\n"
        ) if request.summary_length != "Short" else ""   # <‑‑ skip for Short

        system_prompt = (
            f"{length_instruction}\n\n"
            "You are a professional assistant that transforms unstructured notes into clear, structured reports. "
            "Keep formatting clean with whitespace. Do not use markdown symbols. Do not explain or apologize. "
            "Maintain a professional, formal tone across all topics."
            f"{format_block}"
        )

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.notes}
            ],
            temperature=0.3,
            max_tokens=600
        )

        return {"summary": response.choices[0].message.content.strip()}

    except Exception as e:
        return {"summary": f"Error: {str(e)}"}

