import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

function GenerateToken() {
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

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

async function checkEmailExists(email) {
  try {
    const response = await fetch(`http://localhost:5000/users/email/${email}`);
    if (!response.ok) {
      throw new Error('Failed to check email existence');
    }
    const data = await response.json();
    return !!data.exists;
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
}

function Actions() {
  const [userList, setUserList] = useState('');
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [token] = useState(localStorage.getItem('token') || '');
  const [action, setAction] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [createData, setCreateData] = useState({ name: '', email: '', password: '' });
  const [createMessage, setCreateMessage] = useState('');
  const [updateData, setUpdateData] = useState({ name: '', email: '', password: '' });
  const [updateMessage, setUpdateMessage] = useState('');
  const [verifyMessage, setVerifyMessage] = useState('');
  const [verifyClicked, setVerifyClicked] = useState(false);

  const handleActionSubmit = async (selectedAction) => {
    switch (selectedAction) {
      case 'seeAll':
        setAction('seeAll');
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
        break;
      case 'verify':
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
        break;
      case 'delete':
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
        break;
      case 'create':
        try {
          const { name, email, password } = createData;

          if (!name || !email || !password) {
            throw new Error('Name, email, and password are required');
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
        break;    
      case 'update':
        try {
          if (!userId) {
            throw new Error('Email is required');
          }

          if (!updateData.name && !updateData.email && !updateData.password) {
            throw new Error('At least one field (Name, Email, or Password) must be provided for update');
          }

          if (updateData.email && !isValidEmail(updateData.email)) {
            throw new Error('Invalid email format');
          }  

          if (updateData.email) {
            const emailExists = await checkEmailExists(updateData.email);
            if (emailExists) {
              throw new Error('Email already in use');
            }
          }
          
          if (updateData.password && updateData.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
          }
      
          const { name, email, password } = updateData;
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
        break;      
      default:
        break;
    }
  };

  return (
    <div className="AppActions">
      <div className='sideBar'>
        <h1>ACTIONS</h1>
        <div className="actions">
          <button onClick={() => setAction('create')}>Create User</button>
          <button onClick={() => handleActionSubmit('seeAll')}>See All Users</button>
          <button onClick={() => setAction('verify')}>Verify User</button>
          <button onClick={() => setAction('update')}>Update User</button>
          <button onClick={() => setAction('delete')}>Delete User</button>
        </div>
        <div className='back'>
          <Link to="/"><button>Back to Menu</button></Link>
        </div>
      </div>
      <div className='mainPanel'>
        {action === 'seeAll' && userList.length > 0 && (
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
                    <th>Password</th>
                    <th>Deleted</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.password}</td>
                      <td>{user.deleted ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {action === 'seeAll' && userList.length === 0 && (
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
                    <th>Password</th>
                    <th>Deleted</th>
                  </tr>
                </thead>
                <tbody>
                  <p>No users found</p>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {action === 'create' && (
          <div className="create">
            <div className='createTitle'>
              <h1>Create User:</h1>
            </div>
            <div className='createPanel'>
              <input type="text" placeholder="Name" value={createData.name} onChange={(e) => { const inputText = e.target.value.replace(/[^A-Za-z\s]/ig, '').slice(0, 64); setCreateData({ ...createData, name: inputText }); }} />
              <input type="email" placeholder="Email" value={createData.email} onChange={(e) => setCreateData({ ...createData, email: e.target.value.slice(0, 64) })} />
              <input type="password" placeholder="Password" value={createData.password} onChange={(e) => setCreateData({ ...createData, password: e.target.value.slice(0, 64) })} />
              <button onClick={() => handleActionSubmit('create')}>CREATE</button>
              {createMessage && <p>{createMessage}</p>}
            </div>
          </div>
        )}
        {action === 'verify' && !verifyClicked && (
          <div className='verify'>
            <div className='verifyTitle'>
              <h1>Verify User:</h1>
            </div>
            <div className='verifyPanel'>
              <input type="text" placeholder="ENTER EMAIL" value={userId} onChange={(e) => setUserId(e.target.value)} />
              <button onClick={() => { handleActionSubmit('verify'); setVerifyClicked(true); }}>VERIFY</button>
            </div>
          </div>
        )}
        {action === 'verify' && verifyClicked && (
          <div className='verify'>
            <div className='verifyTitle'>
              <h1>Verify User:</h1>
            </div>
            <div className='verifyPanel'>
              <input type="text" placeholder="ENTER EMAIL" value={userId} onChange={(e) => setUserId(e.target.value)} />
              <button onClick={() => { handleActionSubmit('verify'); setVerifyClicked(true); }}>VERIFY</button>
            </div>
            <div className='verifyInfo'>
              {verifiedUser ? (
                <div>
                  <div className='verifyName'>
                    <p className='infoTxt'>Name:&nbsp;</p><p className='infoValue'>{verifiedUser.name}</p>
                  </div>
                  <div className='verifyEmail'>
                    <p className='infoTxt'>Email:&nbsp;</p><p className='infoValue'> {verifiedUser.email}</p>
                  </div>
                </div>
              ) : (
                <p></p>
              )}
              {verifyMessage && <p>{verifyMessage}</p>}
            </div>
          </div>
        )}
        {action === 'delete' && (
          <div className='delete'>
            <div className='deleteTitle'>
              <h1>Delete User:</h1>
            </div>
            <div className='deletePanel'>
              <input type="text" placeholder="ENTER EMAIL" value={userId} onChange={(e) => setUserId(e.target.value)} />
              <button onClick={() => handleActionSubmit('delete')}>DELETE</button>
              {deleteMessage && <p>{deleteMessage}</p>}
            </div>
          </div>
        )}
        {action === 'update' && (
          <div className='update'>
            <div className='updateTitle'>
              <h1>Update User:</h1>
            </div>
            <div className='updatePanel'>
              <div className='updateId'>           
                <input type="text" placeholder="ENTER EMAIL" value={userId} onChange={(e) => setUserId(e.target.value)} />
              </div>
              <input type="text" placeholder="Name" value={updateData.name} onChange={(e) => setUpdateData({ ...updateData, name: e.target.value.replace(/[^A-Za-z\s]/ig, '').slice(0, 64) })} />
              <input type="email" placeholder="Email" value={updateData.email} onChange={(e) => setUpdateData({ ...updateData, email: e.target.value.slice(0, 64) })} />
              <input type="password" placeholder="Password" value={updateData.password} onChange={(e) => setUpdateData({ ...updateData, password: e.target.value.slice(0, 64) })} />
              <button onClick={() => handleActionSubmit('update')}>UPDATE</button>
              {updateMessage && <p>{updateMessage}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GenerateToken />} />
        <Route path="/actions" element={<Actions />} />
      </Routes>
    </Router>
  );
}

export default App;
