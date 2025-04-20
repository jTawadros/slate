from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ReportReq(BaseModel):
    notes: str
    report_type: str

@router.post("/generate")
async def generate_report(request: ReportReq):
    # Place OpenAI response in here
    return {"summary": "Template Summary"}



