import tornado.ioloop
import tornado.web
import socketio

# Create a new Async Socket.IO server
sio = socketio.AsyncServer(cors_allowed_origins='*', async_mode='tornado')
app = tornado.web.Application([
    (r"/socket.io/", socketio.get_tornado_handler(sio)),
])

@sio.event
async def connect(sid, environ):
    print('connect ', sid)

@sio.event
async def disconnect(sid):
    print('disconnect ', sid)

@sio.event
async def fileLocation(sid, data):
    print('Received file location: ', data)
    response = {"status": "success", "filePath": "processed/file/path"}
    await sio.emit('fileLocationResponse', response, to=sid)

if __name__ == '__main__':
    app.listen(4000)
    tornado.ioloop.IOLoop.current().start()
