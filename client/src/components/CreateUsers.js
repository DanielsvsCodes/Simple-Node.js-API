import React, { useState } from 'react';
import { isValidEmail, checkEmailExists } from '../validators/helpers';
import '../App.css';

function CreateUsers() {
    const [createData, setCreateData] = useState({ name: '', email: '', password: '' });
    const [createMessage, setCreateMessage] = useState('');

    const handleCreateUser = async () => {
        try {
            const { name, email, password } = createData;

            if (!name || !email || !password) {
                throw new Error('Name, email, and password are required');
            }

            if (!isValidEmail(email)) {
                throw new Error('Invalid email format');
            }

            const emailExists = await checkEmailExists(email);
            if (emailExists) {
                throw new Error('Email already in use');
            }

            if (password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }

            const userData = { name, email, password };
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const responseData = await response.json();
            if (!response.ok) {
                if (responseData.error) {
                    throw new Error(responseData.error);
                } else {
                    throw new Error('Failed to create user');
                }
            }

            setCreateMessage('User has been created successfully');
        } catch (error) {
            console.error('Error creating user:', error);
            setCreateMessage(error.message);
        }
    };

    return (
        <div className="create">
            <div className='createTitle'>
                <h1>Create User:</h1>
            </div>
            <div className='createPanel'>
                <input type="text" placeholder='Name' value={createData.name} onChange={(e) => setCreateData({ ...createData, name: e.target.value.replace(/[^A-Za-z\s]/ig, '').slice(0, 64) })} />
                <input type="email" placeholder='Email' value={createData.email} onChange={(e) => setCreateData({ ...createData, email: e.target.value.slice(0, 64) })} />
                <input type="password" placeholder='Password' value={createData.password} onChange={(e) => setCreateData({ ...createData, password: e.target.value.slice(0, 64) })} />
                <button onClick={handleCreateUser}>CREATE</button>
                {createMessage && <p>{createMessage}</p>}
            </div>
        </div>
    );
}

export default CreateUsers;
