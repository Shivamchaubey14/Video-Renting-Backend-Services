const Genre = require('../../models/Genre');

jest.mock('../../models/Genre');

describe('Genre Routes Unit Test', () => {

    let req;
    let res;

    beforeEach(() => {

        req = {
            params: {
                id: '123'
            },
            body: {
                name: 'Action'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Import router AFTER mocks
    const router = require('../../routes/genreRoutes');

    // Extract handlers
    const getAllGenresHandler = router.stack.find(
        layer => layer.route.path === '/data' &&
        layer.route.methods.get
    ).route.stack[0].handle;

    const getGenreByIdHandler = router.stack.find(
        layer => layer.route.path === '/data/:id' &&
        layer.route.methods.get
    ).route.stack[0].handle;

    const createGenreHandler = router.stack.find(
        layer => layer.route.path === '/data/' &&
        layer.route.methods.post
    ).route.stack[2].handle;

    const updateGenreHandler = router.stack.find(
        layer => layer.route.path === '/data/:id' &&
        layer.route.methods.put
    ).route.stack[2].handle;

    const deleteGenreHandler = router.stack.find(
        layer => layer.route.path === '/data/:id' &&
        layer.route.methods.delete
    ).route.stack[2].handle;

    // =========================
    // GET ALL GENRES
    // =========================

    it('should return all genres', async () => {

        const genres = [
            { name: 'Action' },
            { name: 'Comedy' }
        ];

        Genre.find.mockResolvedValue(genres);

        await getAllGenresHandler(req, res);

        expect(Genre.find).toHaveBeenCalled();

        expect(res.json).toHaveBeenCalledWith(genres);
    });

    // =========================
    // GET GENRE BY ID
    // =========================

    it('should return genre by id', async () => {

        const genre = {
            _id: '123',
            name: 'Action'
        };

        Genre.findById.mockResolvedValue(genre);

        await getGenreByIdHandler(req, res);

        expect(Genre.findById).toHaveBeenCalledWith('123');

        expect(res.json).toHaveBeenCalledWith(genre);
    });

    it('should return 404 if genre not found', async () => {

        Genre.findById.mockResolvedValue(null);

        await getGenreByIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Genre not found'
        });
    });

    // =========================
    // CREATE GENRE
    // =========================

    it('should create genre', async () => {

        const genre = {
            _id: '123',
            name: 'Action'
        };

        Genre.create.mockResolvedValue(genre);

        await createGenreHandler(req, res);

        expect(Genre.create).toHaveBeenCalledWith({
            name: 'Action'
        });

        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith(genre);
    });

    // =========================
    // UPDATE GENRE
    // =========================

    it('should update genre', async () => {

        const updatedGenre = {
            _id: '123',
            name: 'Updated Action'
        };

        Genre.findByIdAndUpdate.mockResolvedValue(updatedGenre);

        await updateGenreHandler(req, res);

        expect(Genre.findByIdAndUpdate).toHaveBeenCalledWith(
            '123',
            {
                name: 'Action'
            },
            { new: true }
        );

        expect(res.json).toHaveBeenCalledWith(updatedGenre);
    });

    it('should return 404 if updating non-existing genre', async () => {

        Genre.findByIdAndUpdate.mockResolvedValue(null);

        await updateGenreHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Genre not found'
        });
    });

    // =========================
    // DELETE GENRE
    // =========================

    it('should delete genre', async () => {

        Genre.findByIdAndDelete.mockResolvedValue({
            _id: '123',
            name: 'Action'
        });

        await deleteGenreHandler(req, res);

        expect(Genre.findByIdAndDelete).toHaveBeenCalledWith('123');

        expect(res.json).toHaveBeenCalledWith({
            message: 'Genre deleted successfully'
        });
    });

    it('should return 404 if deleting non-existing genre', async () => {

        Genre.findByIdAndDelete.mockResolvedValue(null);

        await deleteGenreHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Genre not found'
        });
    });

});