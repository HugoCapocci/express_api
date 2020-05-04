const request = require('supertest');
const MessageService = require('./services/message-service');

jest.mock('./middleware/basic-auth', () => {
    return {
      basicAuth: (request, response, next) => next()
    };
});

jest.mock('./services/message-service', () => {
    return jest.fn().mockImplementation(() => {
        return {
            getMessages: jest.fn().mockResolvedValue([ 'fakeMessage' ]),
            getMessage: jest.fn().mockResolvedValue({ id: 51 }),
            createMessage: jest.fn().mockResolvedValue({ message: '', _id: 42 }),
            updateMessage: jest.fn().mockResolvedValue({ isFind: true, isModified: true }),
            deleteMessage: jest.fn().mockResolvedValue(true)
        };
    });
});

MessageService.isMessageValid = jest.fn().mockReturnValue(true);

const mockedFileService = {
    getFilesInfo: jest.fn().mockResolvedValue(['fileInfos']),
    saveFileInfos: jest.fn().mockResolvedValue(),
    getFile: jest.fn().mockResolvedValue({
      file: {
        pipe: (response) => response.sendStatus(200)
      },
      fileInfo: {
        'original-name': 'realName',
        'mime-type': 'pdf',
        size: 51
      }
    }),
    deleteFile: jest.fn().mockResolvedValue(true)
  }
  
jest.mock('./services/file-service', () => {
    return jest.fn().mockImplementation(() => {
        return mockedFileService;
    });
});

const app = require('./main');


describe('Express API', () => {
    it('Should have nothing mapped on root', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(404);
    });

    describe('Message API', () => {
        it('Should return messages', async () => {
            const response = await request(app).get('/api/v1/message');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(['fakeMessage']);
        });

        it('Should return message according to id', async () => {
            const response = await request(app).get('/api/v1/message/1');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ id: 51 });
        });

        it('Should create new message', async () => {
            const response = await request(app)
                .post('/api/v1/message')
                .type('form')
                .send({ author: 'fakeAuthor' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: '', _id: 42 });
        });

        it('Should update message', async () => {
            const response = await request(app)
                .put('/api/v1/message/50')
                .type('form')
                .send({ author: 'fakeAuthor' });

            expect(response.statusCode).toBe(200);
        });

        it('Should delete message', async () => {
            const response = await request(app).delete('/api/v1/message/2');

            expect(response.statusCode).toBe(204);
        });
    });

    describe('File API', () => {
        it('Should send file', async () => {
            const response = await request(app).post('/api/v1/file')
                .attach('myFile', __dirname + '/README.md');
            expect(response.statusCode).toBe(200);
        });

        it('Should return error when saveFileInfos fails', async () => {
            mockedFileService.saveFileInfos = jest.fn().mockRejectedValue('fail');

            const response = await request(app).post('/api/v1/file')
                .attach('myFile', __dirname + '/README.md');
            expect(response.statusCode).toBe(500);
        });

        it('Should retrieve files infos', async() => {
            const response = await request(app).get('/api/v1/file');

            expect(response.statusCode).toBe(200);
        });

        it('Should download file', async() => {
            const response = await request(app).get('/api/v1/file/42');

            expect(mockedFileService.getFile).toBeCalledWith('42');
            expect(response.statusCode).toBe(200);
        });

        it('Should delete file', async() => {
            const response = await request(app).delete('/api/v1/file/42');

            expect(mockedFileService.deleteFile).toBeCalledWith('42');
            expect(response.statusCode).toBe(204);
        });
    });
});
