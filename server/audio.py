import whisper
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("small", device=device)
result = model.transcribe("test.wav", task="transcribe", language="en")

print("Transcription:", result["text"])
