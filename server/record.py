import pyaudio

def process_audio(duration):
    chunk = 1024
    format = pyaudio.paInt16
    channels = 1
    rate = 44100

    p = pyaudio.PyAudio()

    stream = p.open(format=format,
                    channels=channels,
                    rate=rate,
                    input=True,
                    frames_per_buffer=chunk)

    print("Processing audio in real-time...")
    
    for _ in range(0, int(rate / chunk * duration)):
        data = stream.read(chunk)
        # Pass audio `data` to your transcription/processing function
        process_audio_chunk(data)

    print("Finished processing.")
    
    stream.stop_stream()
    stream.close()
    p.terminate()

def process_audio_chunk(audio_chunk):
    # Example: Send the chunk to Whisper or another transcription library
    pass


# Example usage:
process_audio(duration=10)
