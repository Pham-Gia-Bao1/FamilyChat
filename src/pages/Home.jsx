import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Home.css'; // Import file CSS cho trang
import ChatImage from '../assets/images/ảnh nền 4.jpg'
export default function Home() {
  const navigate = useNavigate(); // Điều hướng đến trang chat

  const goToChat = () => {
    navigate('/chat');
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to Web Chat!</h1>
        <p>Connect with friends and colleagues in real-time with our secure and intuitive chat platform.</p>
      </header>

      <div className="landing-content">
        <img
          className="landing-image"
          src={ChatImage}
          alt="Web Chat"
        />

        <div className="landing-features">
          <h2>Why Choose Our Web Chat?</h2>
          <ul>
            <li>✔ Real-time Messaging</li>
            <li>✔ Secure and Private</li>
            <li>✔ Easy to Use Interface</li>
            <li>✔ Group Chat Support</li>
          </ul>
          <button className="chat-button" onClick={goToChat}>
            Go to Chat
          </button>
        </div>
      </div>
    </div>
  );
}
