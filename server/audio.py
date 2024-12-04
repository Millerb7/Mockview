import time
import whisper
import torch
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

device = "cuda" if torch.cuda.is_available() else "cpu"
audio_file = "rec1.wav"

start_time = time.time()
tiny_model = whisper.load_model("tiny", device=device)
result_tiny = tiny_model.transcribe(audio_file, task="transcribe", language="en")
end_time = time.time()
print("Tiny Transcription:", result_tiny["text"])
print("Tiny Transcription Time:", end_time - start_time, "seconds")

start_time = time.time()
small_model = whisper.load_model("small", device=device)
result_small = small_model.transcribe(audio_file, task="transcribe", language="en")
end_time = time.time()
print("Small Transcription:", result_small["text"])
print("Small Transcription Time:", end_time - start_time, "seconds")

start_time = time.time()
base_model = whisper.load_model("base", device=device)
result_base = base_model.transcribe(audio_file, task="transcribe", language="en")
end_time = time.time()
print("Base Transcription:", result_base["text"])
print("Base Transcription Time:", end_time - start_time, "seconds")