import React, { useState, useEffect } from 'react';
import '../App.css';

function SeeAllUsers() {
    const [userList, setUserList] = useState([]);
    const [token] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUserList(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [token]);

    return (
        <div className='seeAll'>
            <div className='seeAllTitle'>
                <h1>See All User:</h1>
            </div>
            <div className='seeAllPanel'>
                <table className='seeAllTable'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.deleted ? 'Inactive' : 'Active'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SeeAllUsers;
