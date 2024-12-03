from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__)

# Configure Flask-SocketIO
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# Define routes
@app.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Test route is working"}), 200

@app.route('/health', methods=['GET'])
def health_route():
    return jsonify({"status": "healthy"}), 200

# Load presentation notes from a text file
def get_presentation_notes():
    if os.path.exists("presentation_notes.txt"):
        with open("presentation_notes.txt", "r") as file:
            return file.read()
    return "No notes available"

# WebSocket event for audio input
@socketio.on('audio_input')
def handle_audio_input(data):
    # Simulate processing the audio data
    print("Received audio input data:", data)

    # Here you would run your model and process the data
    # For now, we're just reading notes from a text file
    presentation_notes = get_presentation_notes()

    # Decide if we need to send back some notes
    if "trigger" in data:  # Example condition: If the data contains the word "trigger"
        emit('presentation_notes', {"notes": presentation_notes})

# Handle WebSocket connections
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# Run the Flask server with SocketIO
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=4000, debug=True)
