# MCP Service for DnD2

This is a Model Control Protocol service that provides a REST API for managing local files in the DnD2 project.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the service:
```bash
python main.py
```

The service will run on http://localhost:8000

## API Endpoints

- GET `/`: Check if service is running
- GET `/files/{path}`: Get file or directory contents
- POST `/files/{path}`: Update file contents

## Features

- File system monitoring
- CORS support for React frontend
- Real-time file updates
- Directory traversal
- File content management
