import React, { useState } from 'react';
import '../App.css';

function VerifyUser() {
    const [userId, setUserId] = useState('');
    const [verifiedUser, setVerifiedUser] = useState(null);
    const [verifyMessage, setVerifyMessage] = useState('');
    const [verifyClicked, setVerifyClicked] = useState(false);
    const [token] = useState(localStorage.getItem('token') || '');

    const handleVerifyUser = async () => {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to verify user');
            }

            const { user } = await response.json();
            setVerifiedUser(user);
            setVerifyMessage('');
        } catch (error) {
            console.error('Error verifying user:', error);
            setVerifiedUser(null);
            setVerifyMessage(error.message);
        }
    };

    return (
        <div className="verify">
            <div className="verifyTitle">
                <h1>Verify User:</h1>
            </div>
            <div className="verifyPanel">
                <input
                    type="text"
                    placeholder="ENTER EMAIL"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button onClick={() => { handleVerifyUser(); setVerifyClicked(true); }}>
                    VERIFY
                </button>
            </div>
            {verifyClicked && (
                <div className="verifyInfo">
                    {verifiedUser ? (
                        <div>
                            <div className="verifyName">
                                <p className="infoTxt">Name:&nbsp;</p>
                                <p className="infoValue">{verifiedUser.name}</p>
                            </div>
                            <div className="verifyEmail">
                                <p className="infoTxt">Email:&nbsp;</p>
                                <p className="infoValue">{verifiedUser.email}</p>
                            </div>
                        </div>
                    ) : (
                        <p></p>
                    )}
                    {verifyMessage && <p>{verifyMessage}</p>}
                </div>
            )}
        </div>
    );
}

export default VerifyUser;
