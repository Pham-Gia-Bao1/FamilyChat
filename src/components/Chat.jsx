import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { PiPaperPlaneRightFill } from "react-icons/pi";
import { FaImage } from "react-icons/fa";
import MessageBox from "./MessageBox";

// List of users
const users = [
    {
      id: 1,
      name: "Bảo",
      avatar:
        "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/anh-avatar-cute-58.jpg",
      password: "passwordBảo" // Thêm trường password
    },
    {
      id: 2,
      name: "Mái",
      avatar:
        "https://p16-va.lemon8cdn.com/tos-alisg-v-a3e477-sg/og9Y7EBPPA6Ak3wHBZ6AxbRkvAuqiimQIVBsq~tplv-tej9nj120t-origin.webp",
      password: "passwordMái" // Thêm trường password
    },
    {
      id: 3,
      name: "Mệ nội",
      avatar:
        "https://p16-va.lemon8cdn.com/tos-alisg-v-a3e477-sg/og9Y7EBPPA6Ak3wHBZ6AxbRkvAuqiimQIVBsq~tplv-tej9nj120t-origin.webp",
      password: "passwordMệNội" // Thêm trường password
    },
    {
      id: 4,
      name: "Mệ ngoại",
      avatar:
        "https://p16-va.lemon8cdn.com/tos-alisg-v-a3e477-sg/og9Y7EBPPA6Ak3wHBZ6AxbRkvAuqiimQIVBsq~tplv-tej9nj120t-origin.webp",
      password: "passwordMệNgoại" // Thêm trường password
    },
    {
      id: 5,
      name: "Nghĩa",
      avatar:
        "https://p16-va.lemon8cdn.com/tos-alisg-v-a3e477-sg/og9Y7EBPPA6Ak3wHBZ6AxbRkvAuqiimQIVBsq~tplv-tej9nj120t-origin.webp",
      password: "passwordNghĩa" // Thêm trường password
    },
    {
      id: 6,
      name: "Tân",
      avatar:
        "https://p16-va.lemon8cdn.com/tos-alisg-v-a3e477-sg/og9Y7EBPPA6Ak3wHBZ6AxbRkvAuqiimQIVBsq~tplv-tej9nj120t-origin.webp",
      password: "passwordTân" // Thêm trường password
    },
  ];
// Server host
const host = "https://server-realtime-node.onrender.com";

function Chat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState({});
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [recipientId1, setRecipientId] = useState(null);
  const [newMessages, setNewMessages] = useState({});
  const [password, setPassword] = useState("");
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  // Fetch messages when currentUser or recipientId1 changes
  useEffect(() => {
    const getMessagesBySenderIdAndRecipientId = async (senderId, recipientId) => {
      try {
        const res = await axios.get(`${host}/api/messages`, {
          params: { senderId, recipientId },
        });
        setConversations((prev) => ({
          ...prev,
          [recipientId]: res.data,
        }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (currentUser && recipientId1) {
      getMessagesBySenderIdAndRecipientId(currentUser.id, recipientId1);
    }
  }, [currentUser, recipientId1]);

  // Handle socket connection
  useEffect(() => {
    if (currentUser && !socketRef.current) {
      socketRef.current = socketIOClient(host, {
        auth: { userId: currentUser.id },
      });

      socketRef.current.on("connect", () => console.log("Connected to server"));
      socketRef.current.on("disconnect", () => console.log("Disconnected from server"));

      socketRef.current.on("sendDataServer", ({ data, senderId, recipientId }) => {
        if (recipientId === recipientId1 || currentUser.id === recipientId) {
          setConversations((prevConversations) => {
            const conversationKey = senderId === currentUser.id ? recipientId : senderId;
            return {
              ...prevConversations,
              [conversationKey]: [
                ...(prevConversations[conversationKey] || []),
                { ...data, senderId, recipientId },
              ],
            };
          });

          if (senderId !== currentUser.id && senderId !== recipientId1) {
            setNewMessages((prev) => ({
              ...prev,
              [senderId]: (prev[senderId] || 0) + 1,
            }));
          }
        }
      });

      return () => {
        socketRef.current.disconnect();
        socketRef.current = null;
      };
    }
  }, [currentUser, recipientId1]);

  // Reset message and image when recipientId1 changes
  useEffect(() => {
    if (recipientId1 && currentUser) {
      setMessage("");
      setImage(null);
      setNewMessages((prev) => ({
        ...prev,
        [recipientId1]: 0,
      }));
    }
  }, [recipientId1, currentUser]);

  // Scroll to the bottom of the messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations]);

  // Send message and image
  const sendMessage = async () => {
    if ((message.trim() !== "" || image) && recipientId1 && currentUser) {
      const msg = {
        content: message,
        senderId: currentUser.id,
        recipientId: recipientId1,
      };

      socketRef.current.emit("sendDataClient", msg);

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        try {
          const response = await axios.post(`${host}/upload`, formData);
          const imageUrl = response.data.imageUrl;
          const imageMsg = {
            senderId: currentUser.id,
            recipientId: recipientId1,
            imageUrl: imageUrl,
          };
          socketRef.current.emit("sendImageClient", imageMsg);
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setImage(null);
        }
      }

      setMessage("");
    }
  };

  // Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle login
  const handleLogin = (user) => {
    if (user.password === password) {
      setCurrentUser(user);
      setPassword(""); // Reset password field after successful login
    } else {
      alert("Mật khẩu không đúng");
    }
  };

  const renderLoginForm = () => (
    <div className="login-form">
      <h2>Đăng nhập vào phòng chat</h2>
      <select onChange={(e) => handleLogin(users[e.target.value])}>
        <option value="">Chọn người dùng</option>
        {users.map((user, index) => (
          <option key={user.id} value={index}>
            {user.name}
          </option>
        ))}
      </select>
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => handleLogin(users[0])}>Đăng nhập</button>
    </div>
  );

  // Render messages
  const renderMess = (conversations[recipientId1] || []).map((m, index) => {
    // Kiểm tra xem tin nhắn có phải là của người gửi hiện tại hay không
    const isMessageFromCurrentUser = m.senderId == currentUser?.id;

    // Tìm thông tin người gửi từ danh sách người dùng
    const sender = users.find((u) => u.id === m.senderId);
    // Đặt tên và avatar người gửi mặc định nếu không tìm thấy
    const senderName = sender ? sender.senderName : 'Unknown Sender';
    const senderAvatar = sender ? sender.avatar : '';

    // Sử dụng thời gian tin nhắn hiện tại nếu không có
    const messageTime = m.timestamp || new Date().toISOString();

    return (
      <div
        key={index}
        className={`${
          isMessageFromCurrentUser ? "your-message" : "other-people"
        } chat-item ${m.content ? "text" : "image"}`}
      >
        {/* Hiển thị avatar người gửi nếu tin nhắn không phải của người gửi hiện tại */}
        {!isMessageFromCurrentUser && sender && (
          <img src={senderAvatar} alt={senderName} className="avatar" />
        )}

        {/* Hiển thị nội dung tin nhắn */}
        {m.content && (
          <MessageBox
            m={m}
            sender={sender}
            timestamp={messageTime}
          />
        )}
        {/* Hiển thị ảnh nếu có */}
        {m.image && <img src={m.image} alt="Sent" className="sent-image" />}
      </div>
    );
  });



  // Render friends list
  const renderFriends = users
    .filter((user) => user.id !== currentUser?.id)
    .map((user) => (
      <div
        key={user.id}
        className={`friend-item ${recipientId1 === user.id ? "selected" : ""}`}
        onClick={() => setRecipientId(user.id)}
      >
        <div className="friend-item_box1">
          <img src={user.avatar} alt={user.name} className="avatar" />
          <p>{user.name} (ID: {user.id})</p>
        </div>
        {newMessages[user.id] > 0 && (
          <span className="new-message-indicator">{newMessages[user.id]}</span>
        )}
      </div>
    ));

  // Render login screen if no currentUser
  if (!currentUser) {
    return (
      <div className="login-box">
        <h2>Login</h2>
        <div className="login-container">
          {users.map((user) => (
            <button key={user.id} onClick={() => setCurrentUser(user)}>
              <img src={user.avatar} alt={user.name} className="avatar" />
              Đăng nhập vào tài khoản {user.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Render chat interface
  return (
    <div className="chat-container">
      <div className="friend-list">
        <h3>Friends</h3>
        {renderFriends}
      </div>

      <div className="chat-box">
        <div className="box-chat_message">
          {renderMess}
          <div ref={messagesEndRef} />
        </div>

        <div className="box-input">
          <textarea
            value={message}
            onKeyDown={handleKeyDown}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message ..."
          />
          <div className="box-input_button">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={{ display: "none" }}
              id="fileInput"
            />
            <label htmlFor="fileInput">
              <FaImage />
            </label>
            <PiPaperPlaneRightFill onClick={sendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
