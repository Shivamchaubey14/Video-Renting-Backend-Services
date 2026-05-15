const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const app = require('../../index');
const Genre = require('../../models/Genre');

describe('/api/genres', () => {

    beforeEach(async () => {
        await Genre.deleteMany({});
    });

    afterAll(async () => {
        await Genre.deleteMany({});
        await mongoose.connection.close();
    });

    // Helper function to generate token
    function generateToken(isAdmin = false) {

        return jwt.sign(
            {
                _id: new mongoose.Types.ObjectId(),
                isAdmin
            },
            config.get('jwtPrivateKey')
        );
    }

    describe('GET /data', () => {

        it('should return all genres', async () => {

            await Genre.create([
                { name: 'Action' },
                { name: 'Comedy' }
            ]);

            const res = await request(app)
                .get('/api/genres/data');

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
        });

    });

    describe('GET /data/:id', () => {

        it('should return genre if valid id passed', async () => {

            const genre = await Genre.create({
                name: 'Action'
            });

            const res = await request(app)
                .get('/api/genres/data/' + genre._id);

            expect(res.status).toBe(200);

            expect(res.body).toHaveProperty(
                'name',
                'Action'
            );
        });

        it('should return 404 if genre not found', async () => {

            const id = new mongoose.Types.ObjectId();

            const res = await request(app)
                .get('/api/genres/data/' + id);

            expect(res.status).toBe(404);
        });

    });

    describe('POST /data', () => {

        it('should return 401 if no token provided', async () => {

            const res = await request(app)
                .post('/api/genres/data')
                .send({
                    name: 'Action'
                });

            expect(res.status).toBe(401);
        });

        it('should create genre if valid data passed', async () => {

            const token = generateToken();

            const res = await request(app)
                .post('/api/genres/data')
                .set('x-auth-token', token)
                .send({
                    name: 'Action'
                });

            expect(res.status).toBe(201);

            expect(res.body).toHaveProperty(
                '_id'
            );

            expect(res.body).toHaveProperty(
                'name',
                'Action'
            );
        });

    });

    describe('PUT /data/:id', () => {

        it('should update genre if valid data passed', async () => {

            const token = generateToken();

            const genre = await Genre.create({
                name: 'Old Genre'
            });

            const res = await request(app)
                .put('/api/genres/data/' + genre._id)
                .set('x-auth-token', token)
                .send({
                    name: 'Updated Genre'
                });

            expect(res.status).toBe(200);

            expect(res.body).toHaveProperty(
                'name',
                'Updated Genre'
            );
        });

        it('should return 404 if genre does not exist', async () => {

            const token = generateToken();

            const id = new mongoose.Types.ObjectId();

            const res = await request(app)
                .put('/api/genres/data/' + id)
                .set('x-auth-token', token)
                .send({
                    name: 'Updated Genre'
                });

            expect(res.status).toBe(404);
        });

    });

    describe('DELETE /data/:id', () => {

        it('should return 401 if no token provided', async () => {

            const genre = await Genre.create({
                name: 'Action'
            });

            const res = await request(app)
                .delete('/api/genres/data/' + genre._id);

            expect(res.status).toBe(401);
        });

        it('should return 403 if user is not admin', async () => {

            const token = generateToken(false);

            const genre = await Genre.create({
                name: 'Action'
            });

            const res = await request(app)
                .delete('/api/genres/data/' + genre._id)
                .set('x-auth-token', token);

            expect(res.status).toBe(403);
        });

        it('should delete genre if user is admin', async () => {

            const token = generateToken(true);

            const genre = await Genre.create({
                name: 'Action'
            });

            const res = await request(app)
                .delete('/api/genres/data/' + genre._id)
                .set('x-auth-token', token);

            expect(res.status).toBe(200);

            expect(res.body).toHaveProperty(
                'message',
                'Genre deleted successfully'
            );
        });

    });

});