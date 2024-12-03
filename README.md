Architecture for Data Flow:

    Frontend (Electron + React):
        Connection to WebSocket: Establish one or more WebSocket connections to the backend.
        Waiting for Updates: The frontend essentially acts as a display manager. It listens for events like new_slide, highlight_key_point, or show_summary.
        UI Updates: On receiving an update from the backend, the frontend updates the presentation view accordingly.

    Backend (Python Flask + WebSocket Server):
        Audio Recording and Processing:
            Record audio and process it directly on the backend. This ensures that the model always has access to the audio stream without dependency on the user’s device capabilities.
            Handle model inference using ML models (e.g., transcribing the audio, summarizing it, extracting key points).
        WebSocket Communication:
            Emit events to the frontend when new information is generated, such as when a specific keyword is detected or a new segment of the summary is ready.
        Multiple WebSocket Channels (Events):
            You can use different channels (e.g., slide_update, summary_update, key_point_update) to emit information to the frontend.
            This ensures that the frontend can selectively update different components of the presentation interface depending on what type of data is received.