import React from 'react';

const MessageBox = ({ sender, m, timestamp }) => {
  // Format the timestamp to a readable time format
  const formattedTime = new Date(timestamp).toLocaleTimeString();
  return (
    <div className="box-mess">
      <span className="message-content">{m.content}</span>
      <span className="message-time">{formattedTime}</span>
    </div>
  );
};

export default MessageBox;
