import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function GenerateToken() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleGenerateToken = async () => {
    try {
      const response = await fetch('http://localhost:5000/users/token', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to generate token');
      }
      const { token } = await response.json();
      setToken(token);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Error generating token:', error);
    }
  };

  return (
    <div className="App">
      <h1>Generate Token</h1>
      <div className="token-container">
        <input type="text" value={token} readOnly />
      </div>
      <div className="buttons-container">
        <button onClick={handleGenerateToken}>Generate Token</button>
        <Link to="/actions"><button>Next</button></Link>
      </div>
    </div>
  );
}

function Actions() {
  const [userList, setUserList] = useState('');
  const [token] = useState(localStorage.getItem('token') || '');
  const [action, setAction] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [createData, setCreateData] = useState({ name: '', email: '', password: '' });
  const [createMessage, setCreateMessage] = useState('');
  const [updateData, setUpdateData] = useState({ name: '', email: '', password: '' });
  const [updateMessage, setUpdateMessage] = useState('');

  const handleActionSubmit  = async (selectedAction) => {
    setAction(selectedAction);
    setUserList('');
    let identifierType = 'id';
    if (userId.includes('@')) {
      identifierType = 'email';
    }

    switch (selectedAction) {
      case 'seeAll':
        console.log("See All Action");
        try {
          const response = await fetch('http://localhost:5000/users', {
            headers: {
              'Authorization': `${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }
          const data = await response.json();
          setUserList(JSON.stringify(data, null, 2));
        } catch (error) {
          console.error('Error fetching users:', error);
        }
        break;
      case 'verify':
        console.log("Verify Action");
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
          const { password, ...userData } = user;
          setUserList(JSON.stringify(userData, null, 2));
        } catch (error) {
          console.error('Error verifying user:', error);
        }
        break;
      case 'delete':
        console.log("Delete Action");
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
        }
        break;
      case 'create':
        console.log("Create Action");
        try {
          const { name, email, password } = createData;
          if (!name || !email || !password) {
            throw new Error('Name, email, and password are required');
          }
          const userData = { name, email, password };
          const response = await fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
          });
          console.log(response);
          console.log(JSON.stringify(userData));
          if (!response.ok) {
            throw new Error('Failed to create user');
          }
          setCreateMessage('User has been created successfully');
        } catch (error) {
          console.error('Error creating user:', error);
          setCreateMessage(error.message);
        }
        break;
      case 'update':
        console.log("Update Action");
        try {
          const { name, email, password } = updateData;
          if (!name && !email && !password) {
            throw new Error('At least one field (name, email, or password) must be filled to update');
          }
          const userData = {};
          if (name) userData.name = name;
          if (email) userData.email = email;
          if (password) userData.password = password;
          
          let updateUrl = `http://localhost:5000/users/${userId}`;
          if (identifierType === 'email') {
            updateUrl += '?email=true';
          }
  
          const response = await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${token}`
            },
            body: JSON.stringify(userData)
          });
          if (!response.ok) {
            throw new Error('Failed to update user');
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
    <div className="App">
      <div className='sideBar'>
        <h1>ACTIONS</h1>
        <div className="actions">
          <button onClick={() => handleActionSubmit ('create')}>Create User</button>
          <button onClick={() => handleActionSubmit ('seeAll')}>See All Users</button>
          <button onClick={() => handleActionSubmit ('verify')}>Verify User</button>
          <button onClick={() => handleActionSubmit ('update')}>Update User</button>
          <button onClick={() => handleActionSubmit ('delete')}>Delete User</button>
        </div>
        <div className='back'>
          <Link to="/"><button>Back to Token Generation</button></Link>
        </div>
      </div>
      <div className='mainPanel'>
        {action === 'create' ? (
          <div>
            <div className="create">
              <input
                type="text"
                placeholder="Name"
                value={createData.name}
                onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={createData.email}
                onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={createData.password}
                onChange={(e) => setCreateData({ ...createData, password: e.target.value })}
              />
              <button onClick={handleActionSubmit}>CREATE</button>
            </div>
            {createMessage && <p>{createMessage}</p>}
          </div>
        ) : (
          <div>
            {action === 'update' ? (
              <div className="create">
                <input
                  type="text"
                  placeholder="User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="New Name"
                  value={updateData.name}
                  onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="New Email"
                  value={updateData.email}
                  onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={updateData.password}
                  onChange={(e) => setUpdateData({ ...updateData, password: e.target.value })}
                />
                <button onClick={handleActionSubmit}>UPDATE</button>
                {updateMessage && <p>{updateMessage}</p>}
              </div>
            ) : (
              <div>
                {action === 'delete' || action === 'verify' ? (
                  <div>
                    <div className="input">
                      <input
                        type="text"
                        placeholder={`Enter user EMAIL to ${action.toUpperCase()}`}
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                      />
                      <button onClick={handleActionSubmit}>{action.toUpperCase()}</button>
                    </div>
                    {action === 'verify' && <textarea value={userList} readOnly rows={10} cols={50} />}
                    {action === 'delete' && <p>{deleteMessage}</p>}
                  </div>
                ) : (
                  <div className="textshow">
                    <textarea value={userList} readOnly rows={10} cols={50} />
                  </div>
                )}
              </div>
            )}
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
