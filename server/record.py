import pyaudio
import numpy as np
import whisper
import torch
import warnings
from scipy.signal import resample

warnings.filterwarnings("ignore", category=FutureWarning)

def process_audio(duration):
    chunk = 1024
    format = pyaudio.paInt16
    channels = 1
    input_rate = 44100
    target_rate = 16000

    p = pyaudio.PyAudio()

    stream = p.open(format=format,
                    channels=channels,
                    rate=input_rate,
                    input=True,
                    frames_per_buffer=chunk)

    print("Processing audio in real-time...")

    # Buffer to store audio data
    audio_buffer = []

    for _ in range(0, int(input_rate / chunk * duration)):
        audio_bytes = stream.read(chunk)
        audio_buffer.append(audio_bytes)

    print("Finished recording. Processing transcription...")
    stream.stop_stream()
    stream.close()
    p.terminate()

    # Combine audio chunks into a single buffer
    audio_data = np.frombuffer(b"".join(audio_buffer), dtype=np.int16)

    # Resample audio to 16 kHz
    audio_resampled = resample(audio_data, int(len(audio_data) * target_rate / input_rate))

    # Normalize to [-1.0, 1.0]
    audio_normalized = audio_resampled / 32768.0

    # Convert to float32
    audio_float32 = audio_normalized.astype(np.float32)

    # Transcribe using the buffer
    result = model.transcribe(audio_float32)
    print("Transcription result (buffer):", result["text"])


# Example usage:
device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("small", device=device)
process_audio(duration=10)
