import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async (e) => {
    e.preventDefault(); // Prevent form from reloading page

    try {
      const response = await axios.post('http://localhost:3000/api/users/login', {
        email,
        password,
      });

      // Assuming the backend sends a token or some user data back
      const { token, user } = response.data;
      localStorage.setItem('token', token); // Save token to localStorage
      alert('Login successful');

      // Do something with the user data, such as redirecting
      console.log('Logged in user:', user);
    } catch (error) {
      console.error('Error logging in', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={loginUser}>
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

      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
