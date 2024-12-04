import pyaudio
import numpy as np
import whisper
import torch
import warnings
from scipy.signal import resample

warnings.filterwarnings("ignore", category=FutureWarning)

def start_record():
    pass

def transcribe():
    pass

def post():
    pass

def end_record():
    pass


# main
# setup models and gpu use
device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("small", device=device)