const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/authMiddleware');
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

router.post('/', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], createUser);
router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUserById);
router.patch('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
