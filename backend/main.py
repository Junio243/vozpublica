from __future__ import annotations

import os
from pathlib import Path
from typing import Literal

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / '.env')
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

SYSTEM_PROMPT = """Você é o VozPública, um assistente virtual brasileiro especializado em direitos dos cidadãos e serviços públicos.

REGRAS IMPORTANTES:
1. Responda SEMPRE em português brasileiro simples, acessível para pessoas com baixa escolaridade
2. NUNCA use juridiquês ou termos técnicos sem explicar em linguagem do dia a dia
3. Seja acolhedor, empático e paciente
4. Sempre inclua PRÓXIMOS PASSOS concretos (onde ir, que documentos levar, que site acessar)
5. Quando relevante, mencione telefones públicos úteis (135 INSS, 136 Saúde, 100 Direitos Humanos)
6. Formate respostas com HTML simples usando <strong>, <ul>, <li>, <br>
7. Se não souber com segurança, indique procurar o órgão oficial competente
"""


class ChatTurn(BaseModel):
    role: Literal["user", "model"]
    text: str = Field(min_length=1)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=6000)
    history: list[ChatTurn] = []
    apiKey: str | None = None


class AnalyzeRequest(BaseModel):
    imageBase64: str = Field(min_length=8)
    mimeType: str = Field(default="image/jpeg")
    apiKey: str | None = None


app = FastAPI(title="VozPublica API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static assets for full-stack local run.
app.mount("/assets", StaticFiles(directory=BASE_DIR / "assets"), name="assets")
app.mount("/css", StaticFiles(directory=BASE_DIR / "css"), name="css")
app.mount("/js", StaticFiles(directory=BASE_DIR / "js"), name="js")


@app.get("/", include_in_schema=False)
def root() -> FileResponse:
    return FileResponse(BASE_DIR / "index.html")


@app.get("/index.html", include_in_schema=False)
def index_page() -> FileResponse:
    return FileResponse(BASE_DIR / "index.html")


@app.get("/app.html", include_in_schema=False)
def app_page() -> FileResponse:
    return FileResponse(BASE_DIR / "app.html")


@app.get("/manifest.json", include_in_schema=False)
def manifest() -> FileResponse:
    return FileResponse(BASE_DIR / "manifest.json")


@app.get("/sw.js", include_in_schema=False)
def service_worker() -> FileResponse:
    return FileResponse(BASE_DIR / "sw.js")


def get_active_api_key(request_key: str | None) -> str | None:
    env_key = os.getenv("GEMINI_API_KEY", "").strip()
    key = env_key or (request_key or "").strip()
    return key or None


async def call_gemini(payload: dict, api_key: str) -> str:
    url = f"{GEMINI_API_BASE}/{GEMINI_MODEL}:generateContent?key={api_key}"

    try:
        async with httpx.AsyncClient(timeout=35) as client:
            response = await client.post(url, json=payload)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Falha de rede ao consultar Gemini: {exc}") from exc

    if response.status_code >= 400:
        detail = response.text[:400]
        raise HTTPException(status_code=502, detail=f"Gemini retornou erro ({response.status_code}): {detail}")

    data = response.json()
    text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text")
    if not text:
        raise HTTPException(status_code=502, detail="Gemini não retornou conteúdo válido")

    return text


@app.get("/api/health")
def health() -> dict:
    has_server_key = bool(os.getenv("GEMINI_API_KEY", "").strip())
    return {
        "ok": True,
        "mode": "server-key" if has_server_key else "client-key-needed",
        "gemini_model": GEMINI_MODEL,
        "has_server_gemini_key": has_server_key,
    }


@app.post("/api/chat")
async def api_chat(request: ChatRequest) -> dict:
    api_key = get_active_api_key(request.apiKey)
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="Nenhuma chave Gemini disponível. Configure GEMINI_API_KEY no backend ou envie apiKey.",
        )

    contents = []
    for msg in request.history[-6:]:
        contents.append(
            {
                "role": "user" if msg.role == "user" else "model",
                "parts": [{"text": msg.text}],
            }
        )

    contents.append({"role": "user", "parts": [{"text": request.message}]})

    payload = {
        "contents": contents,
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1500,
            "topP": 0.9,
        },
    }

    text = await call_gemini(payload, api_key)
    return {"text": text}


@app.post("/api/analyze")
async def api_analyze(request: AnalyzeRequest) -> dict:
    api_key = get_active_api_key(request.apiKey)
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="Nenhuma chave Gemini disponível. Configure GEMINI_API_KEY no backend ou envie apiKey.",
        )

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inlineData": {
                            "mimeType": request.mimeType,
                            "data": request.imageBase64,
                        }
                    },
                    {
                        "text": """Você é o VozPública. Analise este documento governamental brasileiro e explique em linguagem muito simples.

Inclua:
1. O que é este documento e para que serve
2. Resumo principal em bullets
3. Pontos de atenção (prazos, valores, obrigações)
4. Próximos passos práticos

Use HTML com <strong>, <ul>, <li>, <br>."""
                    },
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 2000,
        },
    }

    text = await call_gemini(payload, api_key)
    return {"text": text}
