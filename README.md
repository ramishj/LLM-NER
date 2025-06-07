# LLM + NER Demo

A simple web application that combines Named Entity Recognition (NER) using spaCy with a local LLM using Ollama. The application allows users to input text, detect named entities, and get responses from a local LLM.


### 🎥 Demo

https://github.com/user-attachments/assets/50b76cd6-1bf8-4cb6-a245-aab8daf5784a


## Features

- Named Entity Recognition using spaCy
- Local LLM integration using Ollama
- Modern, responsive web interface
- Real-time entity highlighting
- Error handling and loading states

## Prerequisites

- Python 3.8+
- Node.js (for serving the frontend)
- Ollama installed and running locally with llama3.2 model

## Setup

1. Install Ollama:

   - Follow instructions at [https://ollama.ai](https://ollama.ai)
   - Pull the model: `ollama pull llama3.2`

2. Set up the backend:

   ```bash
   cd backend
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

3. Start the backend server:

   ```bash
   cd backend
   uvicorn main:app --reload
   ```

4. Serve the frontend:
   You can use any static file server. For example, with Python:
   ```bash
   cd frontend
   python -m http.server 3000
   ```

## Usage





1. Open your browser and navigate to `http://localhost:3000`
2. Enter a prompt in the text area
3. Click "Analyze" or press Enter
4. View the detected entities (highlighted in blue) and LLM response

## Example Prompts

- "Apple Inc. is headquartered in Cupertino, California and was founded by Steve Jobs."
- "The Eiffel Tower in Paris, France was completed in 1889."
- "Microsoft CEO Satya Nadella announced new AI features in Windows 11."

## Project Structure

```
.
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

## Notes

- The backend runs on port 8000 by default
- The frontend is served on port 3000
- Make sure Ollama is running before using the application
- The application uses the llama3.2 model by default

## Error Handling

- The application handles network errors gracefully
- Loading states are shown during API calls
- Invalid inputs are validated
- Error messages are displayed when something goes wrong
