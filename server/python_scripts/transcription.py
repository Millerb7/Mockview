import pyaudio
import wave
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

def write_to_log(file_path, content):
    with open(file_path, 'w') as log_file:
        log_file.write(content)

# Transcribing the audio and logging the result
transcript = transcribe_audio('test.wav')
write_to_log('transcript.log', transcript)  # Save the transcript to a log file

print("Transcript has been saved to transcript.log")
