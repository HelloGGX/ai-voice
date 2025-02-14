# Live Transcription Server

## Overview

The **Live Transcription Server** is a backend application built with FastAPI, designed to handle real-time audio transcription. It leverages machine learning models to transcribe audio streams received via WebSocket connections and provides transcribed text back to connected clients in real-time. This server is a crucial component of the Live Transcription system, enabling seamless and efficient audio processing.

## Features

- **Real-Time Audio Transcription**: Transcribes incoming audio streams in real-time using advanced machine learning models.
- **WebSocket Support**: Handles multiple concurrent WebSocket connections for simultaneous transcription sessions.
- **Scalable Architecture**: Utilizes worker threads and asynchronous programming to efficiently manage transcription requests.
- **Audio Storage**: Saves audio chunks to the filesystem for record-keeping and further processing.
- **Robust Error Handling**: Implements comprehensive logging and error handling to ensure reliability and ease of debugging.
- **Configurable Environment**: Easily configurable through environment variables and runtime configurations.

## Prerequisites

- [Python](https://www.python.org/) (version 3.8 or later)
- [pip](https://pip.pypa.io/en/stable/) (comes with Python)
- [Git](https://git-scm.com/) (for cloning the repository)
- [Virtual Environment](https://docs.python.org/3/library/venv.html) (recommended)

## Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/live-transcription-server.git
   cd live-transcription-server
   ```

2. **Create a Virtual Environment**

   It's recommended to use a virtual environment to manage dependencies.

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. **Install Dependencies**

   Install the required Python packages using `pip`:

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**

   Create a `.env` file in the root directory to set up environment variables if necessary. For example:

   ```env
   # Server Configuration
   PORT=8000  # Change this to use a different port
   HOST=0.0.0.0  # Use 'localhost' for local development only

   # Application Configuration
   TRANSCRIPTION_MODEL_ID=openai/whisper-large-v3-turbo
   AUDIO_STORAGE_DIR=audio_chunks
   LOG_LEVEL=INFO
   ```

   > **Note:** The default configuration is already set in the code. Adjust the `.env` file if you need to change the default settings.

## Running the Server

### Development

To run the server in development mode with auto-reloading:

```bash
# Using default port (8000)
uvicorn main:app --reload

# Using custom port
uvicorn main:app --reload --port 8080

# Using environment variable
uvicorn main:app --reload --port $PORT
```

The server will be accessible at `http://localhost:<PORT>` (e.g., `http://localhost:8000` or your custom port).

### Production

For production deployment, it's recommended to use a production-ready ASGI server like **Gunicorn** with **Uvicorn** workers.

1. **Install Gunicorn**

   ```bash
   pip install gunicorn
   ```

2. **Run the Server with Gunicorn**

   ```bash
   # Using default port (8000)
   gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers 4

   # Using custom port
   gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8080 --workers 4

   # Using environment variables
   gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --workers 4
   ```

   Adjust the number of `--workers` based on your server's CPU cores.

## Project Structure

- `main.py`: Entry point for the FastAPI application.
- `real_time_audio/`: Contains modules related to real-time audio processing.
  - `__init__.py`: Initializes the transcription handler.
  - `handler.py`: Manages WebSocket connections and transcription workflows.
  - `models.py`: Defines data models used in the application.
  - `routes.py`: Defines API routes and WebSocket endpoints.
  - `service.py`: Implements the transcription service using machine learning models.
- `requirements.txt`: Lists all Python dependencies required for the project.
- `audio_chunks/`: Directory where audio chunks are stored. Created automatically if it doesn't exist.
- `README.md`: Documentation for the Live Transcription Server.

## Technologies Used

- [FastAPI](https://fastapi.tiangolo.com/): A modern, fast (high-performance) web framework for building APIs with Python.
- [Uvicorn](https://www.uvicorn.org/): A lightning-fast ASGI server for Python.
- [Gunicorn](https://gunicorn.org/): A Python WSGI HTTP Server for UNIX.
- [Transformers](https://huggingface.co/transformers/): State-of-the-art natural language processing for TensorFlow 2.0 and PyTorch.
- [Torch](https://pytorch.org/): An open-source machine learning library for Python.
- [Apollo GraphQL](https://www.apollographql.com/): A GraphQL implementation for Python.
- [Pinia](https://pinia.vuejs.org/): State management library for Vue (used in conjunction with the web frontend).
- [Vite](https://vitejs.dev/): Next-generation frontend tooling (used in conjunction with the web frontend).

## Usage

1. **Start the Server**

   Ensure the server is running by following the [Running the Server](#running-the-server) instructions.

2. **Connect the Web Client**

   The web client should be configured to connect to the server's WebSocket endpoint. Use the appropriate port in your connection URL:

   ```javascript
   // Example WebSocket connection URL
   const wsUrl = `ws://localhost:${PORT}/ws/transcribe`
   ```

   Configure this in your web application's settings (e.g., `nuxt.config.ts`).

3. **Begin Transcription**

   Use the web application's interface to start sending audio streams. The server will process the audio in real-time and send back transcribed text.

## Logging

The server uses Python's built-in `logging` module to log important events and errors. Logs are printed to the console with the default log level set to `INFO`. You can adjust the log level by setting the `LOG_LEVEL` environment variable in the `.env` file.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add your message"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

   Describe your changes and submit the pull request for review.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions, suggestions, or support, please contact [your.email@example.com](mailto:your.email@example.com).

## Acknowledgements

- [OpenAI Whisper](https://github.com/openai/whisper) for the powerful transcription models.
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent web framework.
- [Hugging Face Transformers](https://huggingface.co/transformers/) for providing state-of-the-art machine learning models.
- [Uvicorn](https://www.uvicorn.org/) and [Gunicorn](https://gunicorn.org/) for the ASGI and WSGI server implementations.

## Future Improvements

- **Dockerization**: Containerize the server for easier deployment and scalability.
- **Authentication**: Implement authentication mechanisms to secure WebSocket connections.
- **Enhanced Error Handling**: Improve error handling to cover more edge cases and provide better feedback.
- **Performance Optimization**: Optimize the transcription pipeline for lower latency and higher throughput.
- **Monitoring and Metrics**: Integrate monitoring tools to track server performance and usage metrics.

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Transformers Documentation](https://huggingface.co/transformers/)
- [Uvicorn Documentation](https://www.uvicorn.org/)
- [Gunicorn Documentation](https://docs.gunicorn.org/en/stable/)