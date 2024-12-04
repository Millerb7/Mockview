import pyaudio
import numpy as np
import whisper
import torch
import threading
import keyboard
import warnings
from scipy.signal import resample
from collections import deque

warnings.filterwarnings("ignore", category=FutureWarning)

# Global variables
stop_flag = False
buffer_lock = threading.Lock()  # To ensure thread safety for the buffer
audio_buffer = deque(maxlen=5 * 44100 // 1024)  # Circular buffer for 5 seconds of audio
input_rate = 44100
target_rate = 16000  # Whisper expects 16kHz audio
chunk = 1024  # Number of frames per audio chunk
overlap_seconds = 1.5  # Overlap duration in seconds
overlap_buffer = deque(maxlen=int(overlap_seconds * input_rate // chunk))  # Overlap buffer

# Function to check for key press to stop recording
def check_key():
    global stop_flag
    while not stop_flag:
        if keyboard.is_pressed('e'):  # Stop when 'e' is pressed
            print("Detected 'e'. Stopping...")
            stop_flag = True

# Function to transcribe audio from the buffer
def transcribe():
    while not stop_flag:
        if len(audio_buffer) >= 5 * (input_rate // chunk):  # Ensure the buffer has 5 seconds of audio
            with buffer_lock:
                # Combine overlap with current buffer
                combined_buffer = list(overlap_buffer) + list(audio_buffer)
                
                # Prepare for next window: Keep last 1.5 seconds for overlap
                overlap_buffer.clear()
                overlap_buffer.extend(audio_buffer)

                # Collect audio data from the combined buffer
                audio_data = np.frombuffer(b"".join(combined_buffer), dtype=np.int16)
                audio_buffer.clear()  # Clear the main buffer after use

            # Resample and normalize the audio data
            audio_resampled = resample(audio_data, int(len(audio_data) * target_rate / input_rate))
            audio_normalized = audio_resampled / 32768.0
            audio_float32 = audio_normalized.astype(np.float32)

            # Transcribe using Whisper
            print("Processing transcription...")
            result = model.transcribe(audio_float32)
            print("Transcription result:", result["text"])

# Function to end recording
def end_record(stream, p):
    print("Finished recording.")
    stream.stop_stream()
    stream.close()
    p.terminate()

# Main
if __name__ == "__main__":
    # Setup Whisper model
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = whisper.load_model("base", device=device)

    # Setup PyAudio
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16,
                    channels=1,
                    rate=input_rate,
                    input=True,
                    frames_per_buffer=chunk)

    # Start the key-checking thread
    key_thread = threading.Thread(target=check_key)
    key_thread.start()

    # Start the transcription thread
    transcribe_thread = threading.Thread(target=transcribe)
    transcribe_thread.start()

    print("Recording audio... Press 'e' to stop.")
    try:
        # Continuously read audio data into the buffer
        while not stop_flag:
            audio_bytes = stream.read(chunk)
            with buffer_lock:
                audio_buffer.append(audio_bytes)
    except Exception as e:
        print(f"Error occurred: {e}")
    finally:
        end_record(stream, p)
        stop_flag = True

    # Wait for threads to finish
    key_thread.join()
    transcribe_thread.join()

    print("Program stopped.")
