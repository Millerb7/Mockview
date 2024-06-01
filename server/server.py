import os
import time
import tornado.ioloop
import tornado.web
import tornado.websocket
import json

class FileLocationWebSocket(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        # Allow cross-origin WebSocket requests
        return True

    def open(self):
        print("WebSocket opened")

    def on_message(self, message):
        data = json.loads(message)
        file_path = data.get('filePath')
        if file_path and os.path.exists(file_path):
            # Simulate file processing
            time.sleep(5)
            response = {'status': 'success', 'filePath': file_path}
            self.write_message(json.dumps(response))
        else:
            response = {'status': 'error', 'message': 'File not found'}
            self.write_message(json.dumps(response))

    def on_close(self):
        print("WebSocket closed")

def make_app():
    return tornado.web.Application([
        (r"/fileLocation", FileLocationWebSocket),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(4000)
    tornado.ioloop.IOLoop.current().start()
