import React, { useState } from 'react';
import '../App.css';

function DeleteUser() {
    const [userId, setUserId] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    const [token] = useState(localStorage.getItem('token') || '');

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setDeleteMessage('User has been deleted');
        } catch (error) {
            console.error('Error deleting user:', error);
            setDeleteMessage(error.message);
        }
    };

    return (
        <div className="delete">
            <div className="deleteTitle">
                <h1>Delete User:</h1>
            </div>
            <div className="deletePanel">
                <input
                    type="text"
                    placeholder="ENTER EMAIL"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button onClick={handleDeleteUser}>DELETE</button>
                {deleteMessage && <p>{deleteMessage}</p>}
            </div>
        </div>
    );
}

export default DeleteUser;
