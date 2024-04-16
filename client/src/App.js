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
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [action, setAction] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [createData, setCreateData] = useState({ name: '', email: '', password: '' });
  const [createMessage, setCreateMessage] = useState('');

  const handleAction = async (selectedAction) => {
    setAction(selectedAction);
    switch (selectedAction) {
      case 'create':
        console.log('Create User action');
        setCreateMessage('');
        setUserList('');
        break;
      case 'seeAll':
        await fetchUsers();
        break;
      case 'verify':
        console.log('Verify User action');
        break;
      case 'update':
        console.log('Update User action');
        break;
      case 'delete':
        console.log('Delete User action');
        break;
      default:
        break;
    }
  };

  const fetchUsers = async () => {
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
  };

  const handleActionSubmit = async () => {
    setUserList('');
    switch (action) {
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
          const { password, ...userData } = user;
          setUserList(JSON.stringify(userData, null, 2));
        } catch (error) {
          console.error('Error verifying user:', error);
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
        }
        break;
        case 'create':
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
            if (!response.ok) {
              throw new Error('Failed to create user');
            }
            setCreateMessage('User has been created successfully');
          } catch (error) {
            console.error('Error creating user:', error);
            setCreateMessage(error.message);
          }
        break;
      default:
        break;
    }
  };

  return (
    <div className="App">
      <h1>Actions</h1>
      <div className="actions">
        <button onClick={() => handleAction('create')}>Create User</button>
        <button onClick={() => handleAction('seeAll')}>See All Users</button>
        <button onClick={() => handleAction('verify')}>Verify User</button>
        <button onClick={() => handleAction('update')}>Update User</button>
        <button onClick={() => handleAction('delete')}>Delete User</button>
      </div>
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
          {action === 'delete' || action === 'verify' ? (
            <div>
              <div className="input">
                <input
                  type="text"
                  placeholder={`Enter user ID/EMAIL to ${action.toUpperCase()}`}
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
      <div className='back'>
        <Link to="/"><button>Back to Token Generation</button></Link>
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
