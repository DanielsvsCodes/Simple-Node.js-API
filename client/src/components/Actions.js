import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import CreateUsers from './CreateUsers';
import SeeAllUsers from './SeeAllUsers';
import VerifyUser from './VerifyUser';
import UpdateUser from './UpdateUser';
import DeleteUser from './DeleteUser';

function Actions({ token }) {
    const [action, setAction] = useState('');

    return (
        <div className="AppActions">
            <div className='sideBar'>
                <h1>ACTIONS</h1>
                <div className="actions">
                    <button onClick={() => setAction('create')}>Create User</button>
                    <button onClick={() => setAction('seeAll')}>See All Users</button>
                    <button onClick={() => setAction('verify')}>Verify User</button>
                    <button onClick={() => setAction('update')}>Update User</button>
                    <button onClick={() => setAction('delete')}>Delete User</button>
                </div>
                <div className='back'>
                    <Link to="/"><button>Back to Menu</button></Link>
                </div>
            </div>
            <div className='mainPanel'>
                {action === 'create' && <CreateUsers />}
                {action === 'seeAll' && <SeeAllUsers token={token} />}
                {action === 'verify' && <VerifyUser token={token} />}
                {action === 'update' && <UpdateUser token={token} />}
                {action === 'delete' && <DeleteUser token={token} />}
            </div>
        </div>
    );
}

export default Actions;
