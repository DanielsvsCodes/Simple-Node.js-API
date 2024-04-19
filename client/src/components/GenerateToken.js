import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function GenerateToken() {
    // eslint-disable-next-line no-unused-vars
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const handleGenerateToken = async () => {
        try {
            const response = await fetch('http://localhost:5000/users/token', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to generate token');
            }
            const { token } = await response.json();
            localStorage.setItem('token', token);
            setToken(token);
            navigate('/actions');
        } catch (error) {
            console.error('Error generating token:', error);
        }
    };

    return (
        <div className="App">
            <div className='AppBox'>
                <h1>Unlock Actions</h1>
                <div className="buttons-container">
                    <button onClick={handleGenerateToken}>UNLOCK</button>
                </div>
            </div>
        </div>
    );
}

export default GenerateToken;
