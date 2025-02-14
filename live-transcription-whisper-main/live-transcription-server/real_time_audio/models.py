from dataclasses import dataclass

@dataclass
class AudioChunk:
    data: bytes
    session_id: str
    timestamp: float
    audio_file_path: str