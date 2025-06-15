const request = require('supertest');
const express = require('express');
const itemsRouter = require('../routes/items');
const fs = require('fs').promises;

jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
        writeFile: jest.fn(),
    },
}));

const app = express();
app.use(express.json());
app.use('/api/items', itemsRouter);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

const mockItems = [
    { id: 1, name: 'Item A', price: 10 },
    { id: 2, name: 'Item B', price: 20 },
];

describe('GET /api/items', () => {
    it('should return all items', async () => {
        fs.readFile.mockResolvedValueOnce(JSON.stringify(mockItems));

        const res = await request(app).get('/api/items');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].name).toBe('Item A');
    });

    it('should filter items by query', async () => {
        fs.readFile.mockResolvedValueOnce(JSON.stringify(mockItems));

        const res = await request(app).get('/api/items?q=item b');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].name).toBe('Item B');
    });

    it('should limit the number of items', async () => {
        fs.readFile.mockResolvedValueOnce(JSON.stringify(mockItems));

        const res = await request(app).get('/api/items?limit=1');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('should handle readFile error', async () => {
        fs.readFile.mockRejectedValueOnce(new Error('File read error'));

        const res = await request(app).get('/api/items');

        expect(res.statusCode).toBe(500); // assuming you use `next(err)`
    });
});

describe('GET /api/items/:id', () => {
    it('should return the correct item', async () => {
        fs.readFile.mockResolvedValueOnce(JSON.stringify(mockItems));

        const res = await request(app).get('/api/items/2');

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Item B');
    });

    it('should return 404 for missing item', async () => {
        fs.readFile.mockResolvedValueOnce(JSON.stringify(mockItems));

        const res = await request(app).get('/api/items/999');

        expect(res.statusCode).toBe(404);
        // console.log(res.body)
        expect(res.body.message).toBe('Item not found');
    });
});

describe('POST /api/items', () => {
    it('should add a new item', async () => {
        fs.readFile.mockResolvedValueOnce(JSON.stringify(mockItems));
        fs.writeFile.mockResolvedValueOnce();

        const newItem = { name: 'Item C', price: 30 };
        const res = await request(app).post('/api/items').send(newItem);

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Item C');
        expect(res.body).toHaveProperty('id');
        expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should handle write error', async () => {
        fs.readFile.mockResolvedValueOnce(JSON.stringify(mockItems));
        fs.writeFile.mockRejectedValueOnce(new Error('Write failed'));

        const newItem = { name: 'Item D', price: 40 };
        const res = await request(app).post('/api/items').send(newItem);

        expect(res.statusCode).toBe(500);
    });
});
