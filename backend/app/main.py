from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.generate import router as generate_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Add CORS middleware BEFORE including routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router with API prefix
app.include_router(generate_router, prefix="/api")

