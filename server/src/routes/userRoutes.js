const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/authMiddleware');
const { createUser, getUsers, getUser, updateUser, deleteUser, generateToken } = require('../controllers/userController');

router.post('/', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], createUser);
router.get('/', authenticateToken, getUsers);
router.get('/:identifier', authenticateToken, getUser);
router.patch('/:id', authenticateToken, updateUser);
router.delete('/:identifier', authenticateToken, deleteUser);
router.post('/token', generateToken);

module.exports = router;
