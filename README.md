# 🏥 Medical Healthcare Research AI Assistant using RAG and LLM

## 📖 Project Overview

The **Medical Healthcare Research AI Assistant** is an AI-powered web application designed to help researchers, healthcare professionals, and students search and interact with medical research papers using **Retrieval-Augmented Generation (RAG)** and **Large Language Models (LLMs)**.

The system retrieves relevant information from medical research documents and generates context-aware responses with proper source citations.

---

# 🎯 Project Objectives

- Build an AI-powered medical research assistant.
- Process medical research papers in XML format.
- Develop a Retrieval-Augmented Generation (RAG) pipeline.
- Generate accurate responses with source citations.
- Build an interactive chatbot-based web application.

---

# 🛠️ Technology Stack

## Frontend
- React.js
- HTML
- CSS
- JavaScript

## Backend
- FastAPI
- Python

## AI & RAG
- LangChain
- Sentence Transformers
- FAISS / ChromaDB
- Gemini / OpenAI API (To be finalized)

## Data Processing
- XML Parsing
- Text Preprocessing
- Chunking
- Metadata Extraction

---

# 📂 Project Structure

```
medical-rag-assistant/

├── data/
│   ├── raw_xml/
│   ├── processed/
│   ├── chunks/
│   └── metadata/
│
├── backend/
│
├── rag/
│
├── frontend/
│
├── evaluation/
│
├── tests/
│
├── logs/
│
├── README.md
├── requirements.txt
├── .gitignore
└── .env
```

---

# 🔄 Project Workflow

```
Medical XML Dataset
        │
        ▼
XML Parsing
        │
        ▼
Text Preprocessing
        │
        ▼
Chunk Generation
        │
        ▼
Embedding Generation
        │
        ▼
Vector Database
        │
        ▼
Hybrid Retrieval
        │
        ▼
Prompt Builder
        │
        ▼
Large Language Model
        │
        ▼
Response Generation
        │
        ▼
Source Citations
        │
        ▼
Frontend Chatbot
```

---

# 📋 Main Project Components

## 1. Data Processing
Responsible for preparing medical research documents before they are used by the RAG pipeline.

- XML Parsing
- Text Cleaning
- Metadata Extraction
- Section Identification
- Chunk Generation

---

## 2. RAG Pipeline
The core AI engine responsible for retrieving relevant information and generating responses.

- Embedding Generation
- Vector Database (FAISS/ChromaDB)
- Dense Retrieval
- BM25 Retrieval
- Hybrid Retrieval
- Prompt Builder
- LLM Integration
- Citation Generation

---

## 3. Backend
Acts as the communication layer between the frontend and the AI system.

- FastAPI
- REST APIs
- File Upload API
- Chat API
- Search API
- Database Integration
- Logging

---

## 4. Frontend
Provides the user interface for interacting with the Medical AI Assistant.

- Home Page
- Upload Page
- Chat Interface
- Search Filters
- Citation Display
- Chat History
- Responsive User Interface

---

## 5. Database & Storage
Stores processed documents, metadata, vectors, and application data.

- XML Dataset
- Processed Documents
- Metadata Storage
- Vector Database
- User Data (Optional)
- Chat History (Optional)

---

## 6. Evaluation & Testing
Evaluates the performance and reliability of the RAG system.

- RAGAS Evaluation
- Retrieval Accuracy
- Hallucination Detection
- Citation Verification
- Performance Testing
- Unit Testing

---

## 7. Deployment & Monitoring
Prepares the application for deployment and monitors system health.

- Docker
- CI/CD (Optional)
- Monitoring
- Audit Logs
- Error Logging
- Performance Monitoring

  # ✅ Work Completed

The following activities have been completed in the project:

Project Planning              ✅ Completed
Documentation                 ✅ Completed
Data Processing               ✅ Completed
Vector Database               ✅ Completed
Retrieval Pipeline            ✅ Completed
Prompt Engineering            ✅ Completed
Frontend Design               ✅ Completed


---

# 🚀 Current Status

**Project Phase:** Planning & Initial Setup ✅

The project foundation has been established, and the team is ready to begin the implementation phase.

**Project Phase:** Designing UI and Understanding the RAG ✅

The UI design of the project is finalized and completed the RAG Pipeline till embeddings.

**Project Phase:** Frontend Phase is completed and Retrivel pipeline is completed ✅

Vector Database is completed and Prompt Building is completed
---

# 📅 Upcoming Work
• LLM Integration
• Response Generation
• Citation Generation
• FastAPI Backend
• Database Integration
• Deployment
• Frontend-Backend Integration
---

# 👥 Team Roles

- Team Leader
- Scrum Master
- Product Owner
- Business Owner
- Developer

---

# 📌 Repository Guidelines
- Commit changes with meaningful messages.
- Pull the latest changes before starting new work.

---
