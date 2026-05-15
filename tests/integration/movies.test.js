const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../index');

const Movie = require('../../models/Movie');
const Genre = require('../../models/Genre');

describe('/api/movies', () => {

    beforeEach(async () => {

        await Movie.deleteMany({});
        await Genre.deleteMany({});
    });

    afterAll(async () => {

        await Movie.deleteMany({});
        await Genre.deleteMany({});

        await mongoose.connection.close();
    });

    describe('GET /data', () => {

        it('should return all movies', async () => {

            const genre = await Genre.create({
                name: 'Action'
            });

            await Movie.create([
                {
                    title: 'Movie One',
                    releaseYear: 2020,
                    genres: [genre._id]
                },
                {
                    title: 'Movie Two',
                    releaseYear: 2021,
                    genres: [genre._id]
                }
            ]);

            const res = await request(app)
                .get('/api/movies/data');

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
        });

    });

    describe('POST /data', () => {

        it('should create movie if valid data passed', async () => {

            const genre = await Genre.create({
                name: 'Action'
            });

            const res = await request(app)
                .post('/api/movies/data')
                .send({
                    title: 'Avengers',
                    releaseYear: 2023,
                    genres: [genre._id]
                });

            expect(res.status).toBe(201);

            expect(res.body).toHaveProperty('_id');

            expect(res.body).toHaveProperty(
                'title',
                'Avengers'
            );
        });

        it('should return 400 if invalid genre id passed', async () => {

            const fakeGenreId =
                new mongoose.Types.ObjectId();

            const res = await request(app)
                .post('/api/movies/data')
                .send({
                    title: 'Avengers',
                    releaseYear: 2023,
                    genres: [fakeGenreId]
                });

            expect(res.status).toBe(400);

            expect(res.body).toHaveProperty(
                'error',
                'Invalid genre IDs'
            );
        });

        it('should return 400 if title missing', async () => {

            const genre = await Genre.create({
                name: 'Action'
            });

            const res = await request(app)
                .post('/api/movies/data')
                .send({
                    releaseYear: 2023,
                    genres: [genre._id]
                });

            expect(res.status).toBe(400);
        });

    });

});