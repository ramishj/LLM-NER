from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spacy
import os
from typing import List
import ollama

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model...")
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Ollama configuration
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

class PromptRequest(BaseModel):
    prompt: str

class Entity(BaseModel):
    text: str
    label: str
    start: int
    end: int

class AnalyzeResponse(BaseModel):
    entities: List[Entity]
    llm_response: str

@app.get("/")
async def read_root():
    return {"status": "ok", "message": "LLM NER API is running"}

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: PromptRequest):
    prompt = req.prompt
    
    # Perform NER using spaCy
    doc = nlp(prompt)
    entities = [
        Entity(
            text=ent.text,
            label=ent.label_,
            start=ent.start_char,
            end=ent.end_char
        )
        for ent in doc.ents
    ]
    
    print("Detected named entities:", entities)

    # Get LLM response from Ollama using the ollama Python library
    try:
        response = ollama.generate(model=OLLAMA_MODEL, prompt=prompt)
        llm_response = response.get("response", "")
    except Exception as e:
        print(f"Error calling Ollama: {str(e)}")
        llm_response = "Error: Could not get response from LLM"

    print("LLM response:", llm_response)

    return AnalyzeResponse(
        entities=entities,
        llm_response=llm_response
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 