import React, { useState } from 'react';
import { checkEmailExists, isValidEmail } from '../validators/helpers';
import '../App.css';

function UpdateUser() {
    const [userId, setUserId] = useState('');
    const [updateData, setUpdateData] = useState({ name: '', email: '', password: '' });
    const [updateMessage, setUpdateMessage] = useState('');
    const [token] = useState(localStorage.getItem('token') || '');

    const handleUpdateUser = async () => {
        try {
            const { name, email, password } = updateData;

            if (!userId) {
                throw new Error('Email is required');
            }

            if (!name && !email && !password) {
                throw new Error('At least one field (Name, Email, or Password) must be provided for update');
            }

            if (email && !isValidEmail(email)) {
                throw new Error('Invalid email format');
            }

            if (email) {
                const emailExists = await checkEmailExists(email);
                if (emailExists) {
                    throw new Error('Email already in use');
                }
            }

            if (password && password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }

            const userData = { name, email, password };
            const response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const responseData = await response.json();
                if (responseData.error) {
                    throw new Error(responseData.error);
                } else {
                    throw new Error('Failed to update user');
                }
            }

            setUpdateMessage('User has been updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            setUpdateMessage(error.message);
        }
    };

    return (
        <div className="update">
            <div className="updateTitle">
                <h1>Update User:</h1>
            </div>
            <div className="updatePanel">
                <div className="updateId">
                    <input
                        type="text"
                        placeholder="ENTER EMAIL"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Name"
                    value={updateData.name}
                    onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={updateData.email}
                    onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={updateData.password}
                    onChange={(e) => setUpdateData({ ...updateData, password: e.target.value })}
                />
                <button onClick={handleUpdateUser}>UPDATE</button>
                {updateMessage && <p>{updateMessage}</p>}
            </div>
        </div>
    );
}

export default UpdateUser;
