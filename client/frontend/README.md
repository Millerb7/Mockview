# Frontend README

## ML X-Ray Image Analysis Frontend

This document covers the setup and usage of the frontend portion of the ML X-Ray Image Analysis project. The frontend is built with React, Material UI, and Electron, making it a modern and responsive desktop application.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Development Mode vs Production Mode](#development-mode-vs-production-mode)
4. [File Paths in Electron Apps](#file-paths-in-electron-apps)
5. [Backend Requirements](#backend-requirements)

## Introduction

The frontend of the ML X-Ray Image Analysis project provides a user-friendly interface for uploading and analyzing X-ray images. It is built using React and Material UI, with Electron enabling cross-platform desktop application deployment.

## Installation

### Prerequisites

- Node.js and npm

### Setup

1. Install dependencies:
    ```bash
    npm install
    ```

### Development Mode

To run the frontend in development mode, use the following command:
```bash
npm start
```
This will start a development server with hot-reloading, allowing you to see changes immediately as you code.

### Production Mode

To build the frontend for production and create an Electron executable:
1. Build the React app:
    ```bash
    npm run build
    ```

2. Package the Electron app:
    ```bash
    npm run electron-build
    ```

This will create a deployable version of the application that can be distributed and run on different platforms.

## Development Mode vs Production Mode

### Development Mode

In development mode, the application runs in a browser environment with hot-reloading enabled. This mode is optimized for rapid development and testing. However, some features that rely on file system access may not work as expected due to browser security restrictions.

### Production Mode

In production mode, the application is packaged into an Electron executable, which provides a native-like experience. This mode allows full access to the file system, enabling features that may not work in development mode. The packaged app can be distributed and installed on different platforms.

## File Paths in Electron Apps

One of the advantages of deploying the frontend as an Electron app is the ability to access the file system directly. This allows the application to read and write files, which is not possible in a typical browser environment due to security restrictions.

### Potential Issues in Development Mode

In development mode, features that depend on file system access may not function correctly. These features will work as intended in the packaged Electron app. If you encounter issues with file paths during development, verify that the feature works in the production build.

## Backend Requirements

The deployed frontend interacts with the backend, which is required to be in the `flaskComb` file when creating an executable. Ensure that the backend is accessible through the expected file paths when creating the Electron app. This integration allows the frontend to communicate with the backend for image analysis tasks.