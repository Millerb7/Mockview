import pyaudio
import wave
import speech_recognition as sr
from transformers import pipeline
import spacy

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

def write_to_log(file_path, content):
    with open(file_path, 'w') as log_file:
        log_file.write(content)

def summarize_text(text):
    summarizer = pipeline('summarization', model="sshleifer/distilbart-cnn-12-6")
    summary = summarizer(text, max_length=300, min_length=50, do_sample=False)
    return summary[0]['summary_text']

def extract_entities(text):
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        entities.append((ent.text, ent.label_))
    return entities

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

# Recording audio
# record_audio('output.wav', 30)  # Record for 30 seconds

# Transcribing the audio and logging the result
transcript = transcribe_audio('test.wav')
write_to_log('transcript.log', transcript)  # Save the transcript to a log file
print('script done')

# Summarizing and extracting key points
summary = summarize_text(transcript)
entities = extract_entities(transcript)
print('summary done')

# Creating notes from summary and entities
notes = create_notes(transcript, entities)
print('notes done')

# Output notes and log them as well
print(notes)
write_to_log('notes.log', notes)  # Save the notes to a separate log file
