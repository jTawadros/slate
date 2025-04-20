from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.generate import router as generate_router

app = FastAPI()
app.include_router(generate_router, prefix="/api")
