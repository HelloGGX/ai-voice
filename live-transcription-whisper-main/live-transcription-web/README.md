# Live Transcription Demo Web Application

A real-time speech-to-text transcription demo application built with Nuxt 3. This application showcases live audio transcription capabilities using WebSocket connections for real-time communication.

## Features

- Real-time speech-to-text transcription
- Low latency audio processing
- Simple and intuitive user interface
- WebSocket-based communication
- Responsive design with TailwindCSS

## Technical Requirements

- Node.js 16.x or higher
- NPM 8.x or higher
- Modern web browser with WebSocket support
- Microphone access

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd live-transcription-web
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
NUXT_PUBLIC_TRANSCRIPTION_WS_ENDPOINT=ws://localhost:8000/ws/transcribe
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Project Structure

```
live-transcription-web/
├── assets/
│   └── css/
│       └── main.css        # Global CSS and Tailwind imports
├── components/             # Vue components
├── layouts/               
│   └── default.vue        # Default application layout
├── pages/                 # Application pages/routes
├── public/                # Static files
├── stores/                # Pinia stores
├── nuxt.config.ts         # Nuxt configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Project dependencies and scripts
```

## Key Components

- **WebSocket Connection**: Handles real-time communication with the transcription server
- **Audio Processing**: Manages microphone input and audio streaming
- **Transcription Display**: Shows real-time transcription results
- **Error Handling**: Manages connection and transcription errors

## Browser Support

The application supports all modern browsers including:
- Chrome (recommended)
- Firefox
- Safari
- Edge

Note: Microphone access and WebSocket support are required.

## Troubleshooting

### Microphone Access

If you're having issues with microphone access:
1. Ensure your browser has permission to access the microphone
2. Check if another application is using the microphone
3. Try refreshing the page
4. Ensure you're using HTTPS in production (required for microphone access)

### WebSocket Connection

If the WebSocket connection fails:
1. Verify the WebSocket server is running
2. Check the TRANSCRIPTION_WS_ENDPOINT environment variable
3. Ensure there are no firewall blocking WebSocket connections

## Development Guidelines

- Follow Vue 3 Composition API practices
- Use TypeScript for type safety
- Follow TailwindCSS class naming conventions
- Implement error handling for all async operations
- Add comments for complex logic
- Use Vue DevTools for debugging

## License

[Your License Here]

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request