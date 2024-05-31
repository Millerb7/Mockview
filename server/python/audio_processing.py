import speech_recognition as sr

def record_audio():
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    with mic as source:
        recognizer.adjust_for_ambient_noise(source)
        print("Microphone calibrated for ambient noise")

    print("Start speaking...")

    while True:
        try:
            with mic as source:
                audio = recognizer.listen(source, timeout=5)
                print("Recognizing...")
                text = recognizer.recognize_google(audio)
                print(f"Recognized Text: {text}")

        except sr.WaitTimeoutError:
            print("Listening timed out while waiting for phrase to start")
        except sr.UnknownValueError:
            print("Google Web Speech API could not understand the audio")
        except sr.RequestError as e:
            print(f"Could not request results from Google Web Speech API; {e}")

if __name__ == "__main__":
    record_audio()
