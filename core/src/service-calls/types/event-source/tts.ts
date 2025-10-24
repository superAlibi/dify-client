import { EventSourceBase } from "./base"


export interface TTSMessageResponse extends EventSourceBase {
  event: 'tts_message'
  message_id: string
  /**
   * base64 encoded audio
   * audio type is audio/mpeg
   */
  audio: string
  /**
   * audio type is audio/mpeg
   */
  audio_type: string
}
export interface TTSMessageEndResponse extends EventSourceBase {
  event: 'tts_message_end'
  message_id: string
  /**
   * base64 encoded audio
   */
  audio: string
}
