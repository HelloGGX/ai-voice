export interface TranscriptionMessage {
  type: string;
  text?: string;
  timestamp?: number;
  audio_file?: string;
}

export interface WebSocketMessage extends TranscriptionMessage {}