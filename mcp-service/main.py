from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from typing import List, Optional
from watchfiles import awatch
import asyncio
from pathlib import Path

app = FastAPI()

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base directory for file operations
BASE_DIR = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class FileInfo(BaseModel):
    path: str
    content: Optional[str] = None
    is_directory: bool

@app.get("/")
async def root():
    return {"status": "MCP service is running"}

@app.get("/files/{path:path}")
async def get_files(path: str):
    try:
        full_path = BASE_DIR / path
        if not full_path.exists():
            raise HTTPException(status_code=404, detail="Path not found")
        
        if full_path.is_file():
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return FileInfo(path=str(path), content=content, is_directory=False)
        
        files = []
        for item in full_path.iterdir():
            files.append(FileInfo(
                path=str(item.relative_to(BASE_DIR)),
                is_directory=item.is_dir()
            ))
        return files
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/files/{path:path}")
async def update_file(path: str, file_info: FileInfo):
    try:
        full_path = BASE_DIR / path
        if not full_path.parent.exists():
            full_path.parent.mkdir(parents=True)
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(file_info.content)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def watch_files():
    async for changes in awatch(str(BASE_DIR)):
        # Here you can implement WebSocket notifications for file changes
        print(f"Changes detected: {changes}")

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(watch_files())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
