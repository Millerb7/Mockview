# Presentation App Notes

## Table of Contents

- [Business Case](#business-case)
- [Core Features for the Web App](#core-features-for-the-web-app)
  - [For the Audience](#for-the-audience)
  - [For the Presenter](#for-the-presenter)
- [Mobile App Features](#mobile-app-features)
  - [Key Features](#key-features)
- [How It All Ties Together](#how-it-all-ties-together)
  - [During the Presentation](#during-the-presentation)
  - [Post-Presentation](#post-presentation)
- [Optional Enhancements](#optional-enhancements)
- [Technology Stack Recommendations](#technology-stack-recommendations)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Mobile Features](#mobile-features)
  - [Drawing and Annotation](#drawing-and-annotation)
  - [QR Code Generation](#qr-code-generation)
- [Architecture for Data Flow](#architecture-for-data-flow)
- [Why This Makes Sense](#why-this-makes-sense)

---

## Business Case

### **Title: Empowering Presentations with Real-Time Adaptability and Audience Engagement**

### **Problem Statement**
Presentations today rely heavily on static tools like PowerPoint, limiting how presenters interact with their audience. These tools don’t support dynamic updates, live feedback, or real-time accessibility options. For audiences, it’s easy to lose engagement or feel disconnected, especially if the presenter’s pace or style doesn’t align with their needs. 

Additionally, presenters struggle to make their content adaptable in real time. Features like live transcription, audience engagement tools, or keyword matching are either unavailable or too cumbersome to set up.

### **Proposed Solution**
The goal is to create a dynamic presentation platform that integrates real-time transcription, slide updates, and audience interaction tools. This platform will allow presenters to adapt to their audience on the fly, while also giving audiences the tools to engage meaningfully with the content.

Key features include:
- A **mobile app** for presenters to control slides, highlight content, and interact with their audience while being mobile.
- A **web app** that provides live transcripts, downloadable resources, and interaction tools for the audience.
- Advanced features like keyword matching, note summarization, and interactive annotation tools.

### **Business Goals**
1. **Increase Presenter Freedom**:
   - Enable presenters to control their content dynamically, even when away from their computers.
2. **Engage Audiences**:
   - Provide tools that keep audiences connected, informed, and able to interact with the material in real time.
3. **Accessibility**:
   - Make presentations more inclusive by incorporating features like live transcription, translations, and adjustable text.

### **Expected Outcomes**
- Improved audience retention and engagement.
- Enhanced accessibility for diverse users and environments.
- A modern solution for corporate, educational, and personal presentations.

---

## Core Features for the Web App

The web app acts as the central hub for both the presenter and the audience.

### For the Audience:

1. **Live Transcripts & Notes**:
   - Display a live or delayed transcription of the presentation.
   - Allow audience members to bookmark sections or keywords for personal note-taking.

2. **QR Code Access**:
   - Present a QR code during the presentation for the audience to scan.
   - Direct them to a session-specific page to:
     - View transcripts in real-time.
     - Access downloadable content (e.g., PowerPoint, notes).
     - Interact with the presenter (e.g., ask questions, leave comments).

3. **Downloadable Resources**:
   - Provide links for:
     - Summarized notes.
     - The full transcript.
     - Presentation materials (e.g., PDFs or PowerPoint).

4. **Accessibility Options**:
   - Include features like adjustable font sizes, color contrast settings, and live translations for international audiences.

### For the Presenter:

1. **Dynamic Presentation Tools**:
   - Allow presenters to upload their PowerPoint or notes in advance.
   - Dynamically update slides based on audience interactions or new insights during the session.

2. **Control Panel**:
   - Provide controls to:
     - Adjust what the audience sees (e.g., switching slides, hiding/showing images).
     - Pause or highlight sections of the transcript.

3. **Drawing Tools**:
   - Enable simple annotation tools for diagrams, charts, or whiteboard-like interactions.

---

## Mobile App Features

The mobile app complements the web app by giving presenters freedom of movement while keeping their tools accessible.

### Key Features:

1. **Presentation View**:
   - A mobile version of the presenter control panel, with features like:
     - Advancing or going back through slides.
     - Highlighting key content.
     - Viewing live notes and transcription.

2. **Mic Integration**:
   - Use the phone as a microphone to capture the presenter’s voice.
   - Include basic audio processing for noise cancellation and enhancement.

3. **Remote Image Control**:
   - Let presenters select, zoom, or enhance images shown on the main screen.
   - Add a "focus mode" where specific areas of the image are magnified for the audience.

4. **Audience Interaction Tools**:
   - Display questions submitted by the audience through the web app.
   - Allow the presenter to mark questions as answered or dismiss them.

5. **Drawing/Annotation Tools**:
   - Include touch-based tools for sketching, underlining, or highlighting on slides.

6. **Offline Mode**:
   - Cache presentations and notes locally in case of poor internet connectivity.

---

## Architecture for Data Flow

### **Frontend (Electron + React):**
1. **Connection to WebSocket**:
   - Establish one or more WebSocket connections to the backend.
2. **Waiting for Updates**:
   - The frontend acts as a display manager, listening for events like `new_slide`, `highlight_key_point`, or `show_summary`.
3. **UI Updates**:
   - On receiving an update from the backend, the frontend updates the presentation view accordingly.

### **Backend (Python Flask + WebSocket Server):**
1. **Audio Recording and Processing**:
   - Record audio and process it directly on the backend to ensure that the model always has access to the audio stream without dependency on the user’s device capabilities.
   - Handle model inference using ML models (e.g., transcribing the audio, summarizing it, extracting key points).
2. **WebSocket Communication**:
   - Emit events to the frontend when new information is generated, such as when a specific keyword is detected or a new segment of the summary is ready.
3. **Multiple WebSocket Channels (Events)**:
   - Use different channels (e.g., `slide_update`, `summary_update`, `key_point_update`) to emit information to the frontend.
   - Ensure the frontend can selectively update different components of the presentation interface depending on what type of data is received.

---

## Why This Makes Sense

1. **Flexibility**:
   - A web app ensures accessibility across devices, while the mobile app enhances portability for the presenter.
   - You cater to both structured settings (e.g., classrooms with mics) and informal ones (e.g., a single mobile device).

2. **Audience Engagement**:
   - By giving audiences tools to interact (zooming, questions, downloads), you make the presentation experience more inclusive and impactful.

3. **Presenter Freedom**:
   - With mobile app control, presenters aren’t tied to a podium or laptop, enabling them to engage more dynamically.

4. **Future-Proofing**:
   - You can expand the app's capabilities with additional AI features like live translation, advanced summarization, or audience sentiment analysis.
