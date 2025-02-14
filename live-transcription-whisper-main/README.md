# Live Transcription System

## Overview

The Live Transcription System is a full-stack application that provides real-time speech-to-text transcription capabilities. It consists of two main components:

1. **Live Transcription Server**: A FastAPI-based backend that handles real-time audio processing and transcription using machine learning models.
2. **Live Transcription Web**: A Nuxt 3-based frontend that provides an intuitive user interface for audio capture and real-time transcription display.

## System Architecture

```
┌─────────────────┐         WebSocket         ┌─────────────────┐
│                 │◄────── Audio Stream ──────┤                 │
│  Transcription  │                          │  Transcription   │
│     Server      │────── Transcribed ───────►│      Web        │
│    (FastAPI)    │         Text             │    (Nuxt 3)     │
│                 │                          │                 │
└─────────────────┘                          └─────────────────┘
```

The system uses WebSocket connections for bidirectional real-time communication:
- Frontend captures and streams audio to the backend
- Backend processes audio and returns transcribed text in real-time
- Frontend displays the transcription results instantly

## Prerequisites

- Python 3.8 or later
- Node.js 16.x or later
- NPM 8.x or later
- Git
- Modern web browser with WebSocket support
- Microphone access

## Quick Start

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd live-transcription-system
   ```

2. **Start the Backend Server**
   ```bash
   cd live-transcription-server
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

3. **Start the Frontend Application**
   ```bash
   cd ../live-transcription-web
   npm install
   npm run dev
   ```

4. Access the application at `http://localhost:3000`

For detailed setup instructions and configuration options, refer to:
- [Server Documentation](live-transcription-server/README.md)
- [Web Application Documentation](live-transcription-web/README.md)

## Project Structure

```
live-transcription-system/
├── live-transcription-server/    # Backend application
│   ├── real_time_audio/         # Audio processing modules
│   ├── requirements.txt         # Python dependencies
│   └── README.md               # Server documentation
│
├── live-transcription-web/      # Frontend application
│   ├── components/             # Vue components
│   ├── pages/                  # Application routes
│   ├── stores/                 # State management
│   └── README.md              # Web app documentation
│
└── README.md                   # This file
```

## Technology Stack

### Backend (Server)
- FastAPI
- Uvicorn/Gunicorn
- OpenAI Whisper (via Transformers)
- WebSocket support
- Python async programming

### Frontend (Web)
- Nuxt 3
- Vue 3 Composition API
- TailwindCSS
- WebSocket client
- TypeScript

## Development Workflow

1. Start the backend server (development mode)
2. Start the frontend application (development mode)
3. Make changes to either component
4. Both applications support hot-reloading for development

## Production Deployment

Refer to component-specific documentation for detailed deployment instructions:
- [Server Deployment Guide](live-transcription-server/README.md#production)
- [Web Application Deployment](live-transcription-web/README.md#building-for-production)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read the component-specific contribution guidelines for detailed information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI Whisper for transcription models
- FastAPI for the backend framework
- Nuxt team for the frontend framework
- All contributors and users of this project

## Support

For support and questions:
- Open an issue in the repository
- Contact the maintainers at [your.email@example.com]

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Nuxt 3 Documentation](https://nuxt.com/)
- [OpenAI Whisper](https://github.com/openai/whisper)
- [WebSocket Protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)