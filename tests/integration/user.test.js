const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const app = require('../../index');
const User = require('../../models/User');

describe('/api/customers', () => {

    beforeEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('GET /data', () => {

        it('should return all users', async () => {

            await User.create([
                {
                    name: 'Shivam',
                    email: 'newhser@gmail.com',
                    password: '123456',
                    age: 23
                },
                {
                    name: 'Rahul',
                    email: 'rahul@gmail.com',
                    password: '123456',
                    age: 25
                }
            ]);

            const res = await request(app)
                .get('/api/customers/data');

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
        });

    });

    describe('GET /data/:id', () => {

        it('should return user if valid id is passed', async () => {

            const user = await User.create({
                name: 'Shivam',
                email: 'xyz@gmail.com',
                password: '123456',
                age: 23
            });

            const res = await request(app)
                .get('/api/customers/data/' + user._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'Shivam');
        });

        it('should return 404 if invalid user id', async () => {

            const id = new mongoose.Types.ObjectId();

            const res = await request(app)
                .get('/api/customers/data/' + id);

            expect(res.status).toBe(404);
        });

    });

    describe('POST /data', () => {

        it('should create user if valid data is passed', async () => {

            const res = await request(app)
                .post('/api/customers/data')
                .send({
                    name: 'Shivam',
                    email: 'xyz@gmail.com',
                    password: '123456',
                    age: 23
                });

            expect(res.status).toBe(201);

            expect(res.body).toHaveProperty('_id');

            expect(res.headers).toHaveProperty('x-auth-token');
        });

        it('should return 400 if name is missing', async () => {

            const res = await request(app)
                .post('/api/customers/data')
                .send({
                    email: 'xyz@gmail.com',
                    password: '123456',
                    age: 23
                });

            expect(res.status).toBe(400);
        });

    });

    describe('PUT /data/:id', () => {

        it('should update user if valid data passed', async () => {

            const user = await User.create({
                name: 'Old Name',
                email: 'old@gmail.com',
                password: '123456',
                age: 23
            });

            const res = await request(app)
                .put('/api/customers/data/' + user._id)
                .send({
                    name: 'New Name',
                    email: 'new@gmail.com',
                    password: '123456',
                    age: 24
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'New Name');
        });

    });

    describe('DELETE /data/:id', () => {

        it('should delete user if valid id passed', async () => {

            const user = await User.create({
                name: 'Delete User',
                email: 'delete@gmail.com',
                password: '123456',
                age: 23
            });

            const res = await request(app)
                .delete('/api/customers/data/' + user._id);

            expect(res.status).toBe(200);

            expect(res.body).toHaveProperty(
                'message',
                'User deleted successfully'
            );
        });

    });

    describe('GET /me', () => {

        it('should return current user if valid token passed', async () => {

            const user = await User.create({
                name: 'Shivam',
                email: 'xyz@gmail.com',
                password: '123456',
                age: 23
            });

            const token = jwt.sign(
                {
                    _id: user._id
                },
                config.get('jwtPrivateKey')
            );

            const res = await request(app)
                .get('/api/customers/me')
                .set('x-auth-token', token);

            expect(res.status).toBe(200);

            expect(res.body).toHaveProperty(
                'email',
                'xyz@gmail.com'
            );
        });

        it('should return 401 if no token provided', async () => {

            const res = await request(app)
                .get('/api/customers/me');

            expect(res.status).toBe(401);
        });

    });

});