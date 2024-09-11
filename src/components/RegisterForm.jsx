import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);

  // Handle file change
  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  // Register user with avatar
  const registerUser = async (e) => {
    e.preventDefault(); // Prevent form from reloading page

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (avatar) {
      formData.append('avatar', avatar); // Append avatar file
    }

    try {
      await axios.post('http://localhost:3000/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('User registered successfully');
    } catch (error) {
      console.error('Error registering user', error);
    }
  };

  return (
    <form onSubmit={registerUser}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Avatar:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
