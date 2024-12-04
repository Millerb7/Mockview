import time
import whisper
import torch
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

start_time = time.time()

device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("base", device=device)
result = model.transcribe("test.wav", task="transcribe", language="en")

end_time = time.time()
print("Transcription:", result["text"])
print("Transcription Time:", end_time - start_time, "seconds")