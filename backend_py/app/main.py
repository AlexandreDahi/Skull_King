from fastapi import FastAPI
from app.api.http_rooms import router as http_rooms_router
from app.api.websocket_rooms import router as ws_rooms_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular en dev
    allow_credentials=True,
    allow_methods=["*"],  # <- important pour autoriser OPTIONS, POST, GET...
    allow_headers=["*"],  # <- important pour autoriser Content-Type, etc.
)


# inclure les routers
app.include_router(http_rooms_router)
app.include_router(ws_rooms_router)

@app.get("/")
async def root():
    return {"message": "Server Running"}

# uvicorn main:app --reload
