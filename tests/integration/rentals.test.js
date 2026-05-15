const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../index');

const Rental = require('../../models/Rental');
const Movie = require('../../models/Movie');
const Genre = require('../../models/Genre');
const User = require('../../models/User');

describe('/api/rentals', () => {

    beforeEach(async () => {

        await Rental.deleteMany({});
        await Movie.deleteMany({});
        await Genre.deleteMany({});
        await User.deleteMany({});
    });

    afterAll(async () => {

        await Rental.deleteMany({});
        await Movie.deleteMany({});
        await Genre.deleteMany({});
        await User.deleteMany({});

        await mongoose.connection.close();
    });

    describe('GET /data', () => {

        it('should return all rentals', async () => {

            const genre = await Genre.create({
                name: 'Action'
            });

            const movie = await Movie.create({
                title: 'Avengers',
                releaseYear: 2023,
                genres: [genre._id]
            });

            const user = await User.create({
                name: 'Shivam',
                email: 'shivam@gmail.com',
                password: '123456',
                age: 23
            });

            await Rental.create({
                movie: movie._id,
                user: user._id
            });

            const res = await request(app)
                .get('/api/rentals/data');

            expect(res.status).toBe(200);

            expect(res.body.length).toBe(1);
        });

    });

    describe('POST /data', () => {

        it('should create rental if valid data passed', async () => {

            const genre = await Genre.create({
                name: 'Action'
            });

            const movie = await Movie.create({
                title: 'Avengers',
                releaseYear: 2023,
                genres: [genre._id]
            });

            const user = await User.create({
                name: 'Shivam',
                email: 'shivam@gmail.com',
                password: '123456',
                age: 23
            });

            const res = await request(app)
                .post('/api/rentals/data')
                .send({
                    movieId: movie._id,
                    userId: user._id
                });

            expect(res.status).toBe(201);

            expect(res.body).toHaveProperty('_id');

            expect(res.body).toHaveProperty(
                'movie',
                movie._id.toString()
            );
        });

        it('should return 400 if movieId missing', async () => {

            const user = await User.create({
                name: 'Shivam',
                email: 'shivam@gmail.com',
                password: '123456',
                age: 23
            });

            const res = await request(app)
                .post('/api/rentals/data')
                .send({
                    userId: user._id
                });

            expect(res.status).toBe(400);
        });

        it('should return 400 if userId missing', async () => {

            const genre = await Genre.create({
                name: 'Action'
            });

            const movie = await Movie.create({
                title: 'Avengers',
                releaseYear: 2023,
                genres: [genre._id]
            });

            const res = await request(app)
                .post('/api/rentals/data')
                .send({
                    movieId: movie._id
                });

            expect(res.status).toBe(400);
        });

    });

});