from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="MRP Backend", version="0.1.0")

@app.get("/")
async def root():
    return {"status": "ok", "message": "MRP backend FastAPI is running"}

@app.get("/health")
async def health_check():
    return JSONResponse({"status": "healthy"})
