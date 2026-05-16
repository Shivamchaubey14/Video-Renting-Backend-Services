const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

jest.mock('../../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Routes Unit Test', () => {

    let req;
    let res;

    beforeEach(() => {

        req = {
            body: {
                email: 'test@gmail.com',
                password: '123456'
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

    // Import route handler AFTER mocks
    const router = require('../../routes/authRoutes');

    // Get the login route handler
    const loginHandler = router.stack.find(
        layer => layer.route.path === '/login'
    ).route.stack[1].handle;

    it('should return 400 if user does not exist', async () => {

        User.findOne.mockResolvedValue(null);

        await loginHandler(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: 'test@gmail.com'
        });

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid email or password'
        });
    });

    it('should return 400 if password is invalid', async () => {

        User.findOne.mockResolvedValue({
            email: 'test@gmail.com',
            password: 'hashedpassword'
        });

        bcrypt.compare.mockResolvedValue(false);

        await loginHandler(req, res);

        expect(bcrypt.compare).toHaveBeenCalledWith(
            '123456',
            'hashedpassword'
        );

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid email or password'
        });
    });

    it('should return token if credentials are valid', async () => {

        User.findOne.mockResolvedValue({
            _id: '123',
            name: 'Shivam',
            email: 'test@gmail.com',
            password: 'hashedpassword'
        });

        bcrypt.compare.mockResolvedValue(true);

        jwt.sign.mockReturnValue('mocked_token');

        await loginHandler(req, res);

        expect(jwt.sign).toHaveBeenCalled();

        expect(res.json).toHaveBeenCalledWith({
            token: 'mocked_token'
        });
    });

});