const request = require('supertest');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = require('../../index');
const User = require('../../models/User');

describe('/api/auth', () => {

    beforeEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /login', () => {

        it('should return 400 if user does not exist', async () => {

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@gmail.com',
                    password: '123456'
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/Invalid email or password/i);
        });

        it('should return 400 if password is invalid', async () => {

            const hashedPassword = await bcrypt.hash('123456', 10);

            await User.create({
                name: 'Shivam',
                email: 'test@gmail.com',
                password: hashedPassword
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@gmail.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(400);
        });

        it('should return token if credentials are valid', async () => {

            const hashedPassword = await bcrypt.hash('123456', 10);

            await User.create({
                name: 'Shivam',
                email: 'test@gmail.com',
                password: hashedPassword
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@gmail.com',
                    password: '123456'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should return 400 if email is missing', async () => {

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    password: '123456'
                });

            expect(res.status).toBe(400);
        });

    });

});