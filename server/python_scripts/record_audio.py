import pyaudio
import wave

def record_audio(filename, duration):
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

    print("Recording...")

    frames = []

    for _ in range(0, int(rate / chunk * duration)):
        data = stream.read(chunk)
        frames.append(data)

    print("Finished recording.")

    stream.stop_stream()
    stream.close()
    p.terminate()

    wf = wave.open(filename, 'wb')
    wf.setnchannels(channels)
    wf.setsampwidth(p.get_sample_size(format))
    wf.setframerate(rate)
    wf.writeframes(b''.join(frames))
    wf.close()

record_audio('output.wav', 30)  # Record for 10 seconds

import speech_recognition as sr

def transcribe_audio(filename):
    recognizer = sr.Recognizer()
    audio_file = sr.AudioFile(filename)

    with audio_file as source:
        audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        return "Google Speech Recognition could not understand audio"
    except sr.RequestError as e:
        return f"Could not request results from Google Speech Recognition service; {e}"

transcript = transcribe_audio('output.wav')

# from transformers import pipeline

# def summarize_text(text):
#     summarizer = pipeline('summarization')
#     summary = summarizer(text, max_length=150, min_length=50, do_sample=False)
#     return summary[0]['summary_text']

# summary = summarize_text(transcript)

from transformers import pipeline

# Load a smaller summarization model
summarizer = pipeline('summarization', model="sshleifer/distilbart-cnn-12-6")

def summarize_text(text):
    summary = summarizer(text, max_length=150, min_length=50, do_sample=False)
    return summary[0]['summary_text']

# Example usage
summary = summarize_text(transcript)
print(summary)


import spacy

nlp = spacy.load("en_core_web_sm")

def extract_entities(text):
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        entities.append((ent.text, ent.label_))
    return entities

entities = extract_entities(transcript)

def create_notes(summary, entities):
    notes = []
    notes.append("### Summary\n")
    notes.append(summary + "\n\n")

    notes.append("### Key Points and Entities\n")
    entity_dict = {}
    for ent_text, ent_label in entities:
        if ent_label not in entity_dict:
            entity_dict[ent_label] = []
        entity_dict[ent_label].append(ent_text)

    for label, texts in entity_dict.items():
        notes.append(f"**{label}**:\n")
        for text in set(texts):  # Use set to avoid duplicate entries
            notes.append(f"- {text}\n")
        notes.append("\n")

    return ''.join(notes)

notes = create_notes(summary, entities)

print(notes)
