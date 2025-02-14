from fastapi import FastAPI
from real_time_audio.routes import router as audio_router

app = FastAPI()

app.include_router(audio_router)

# To run the server, use the command:
# uvicorn main:app --reload