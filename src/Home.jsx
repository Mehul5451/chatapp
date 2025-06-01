import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import '../src/CSS/home.css';

const socket = io("https://chatappbackend-nntq.onrender.com");

export const Home = () => {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showChat, setShowChat] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, msgId: null, userId: null });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return console.error("No token found");

        const res = await axios.get("https://chatappbackend-nntq.onrender.com/getuser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data);
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        socket.emit("register_user", userId);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on("receive_message", ({ to, from, text }) => {
      setMessages(prev => ({
        ...prev,
        [from]: [...(prev[from] || []), { from, text }]
      }));

      setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user =>
          String(user._id) === String(from) ? { ...user, hasNewMessage: true } : user
        );

        const userIndex = updatedUsers.findIndex(user => String(user._id) === String(from));
        if (userIndex === -1) return prevUsers;

        const [movedUser] = updatedUsers.splice(userIndex, 1);
        return [movedUser, ...updatedUsers];
      });
    });

    return () => socket.off("receive_message");
  }, []);

  const handleUserClick = async (user) => {
    setActiveUser(user);
    setShowChat(true);

    const token = localStorage.getItem("token");
    const currentUserId = JSON.parse(atob(token.split('.')[1])).id;

    try {
      const res = await axios.get(`https://chatappbackend-nntq.onrender.com/messages/${currentUserId}/${user._id}`);
      const formattedMessages = res.data.map(msg => ({
        from: msg.senderId === currentUserId ? 'me' : msg.senderId,
        text: msg.message,
        _id: msg._id,
      }));
      setMessages(prev => ({
        ...prev,
        [user._id]: formattedMessages,
      }));
    } catch (err) {
      console.error("Error loading messages:", err);
    }

    setUsers(prev =>
      prev.map(u =>
        String(u._id) === String(user._id) ? { ...u, hasNewMessage: false } : u
      )
    );
  };

  const handleSend = () => {
    const token = localStorage.getItem("token");
    if (!token || !activeUser || !newMessage.trim()) return;

    const senderId = JSON.parse(atob(token.split('.')[1])).id;
    const payload = {
      senderId,
      receiverId: activeUser._id,
      message: newMessage
    };

    socket.emit("send_message", payload);

    setMessages(prev => ({
      ...prev,
      [activeUser._id]: [...(prev[activeUser._id] || []), { from: "me", text: newMessage }]
    }));

    setNewMessage('');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const closeMenu = () => setContextMenu({ ...contextMenu, visible: false });
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [contextMenu]);

    const handleDeleteMessage = async () => {
     const { userId, msgId } = contextMenu;

     try {
       // Call the delete endpoint
       await axios.delete(`https://chatappbackend-nntq.onrender.com/messages/${msgId}`);

       // Update local state
       setMessages(prev => ({
         ...prev,
         [userId]: prev[userId].filter(msg => msg._id !== msgId)
       }));
     } catch (error) {
       console.error("Error deleting message:", error);
     } finally {
       setContextMenu({ visible: false, x: 0, y: 0, msgId: null, userId: null });
     }
   };
   


  /*HANDLE HIDE MSG*/







  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${!isMobileView || !showChat ? 'show' : ''}`}>
        <input type="text" placeholder="Search or start a new chat" />
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        <div className="chat-list">
          {users.map((user, index) => (
            <div
              className={`chat-item ${user.hasNewMessage ? "new-message" : ""}`}
              key={index}
              onClick={() => handleUserClick(user)}
            >
              <div className="chat-name">{user.name}</div>
              <div className="chat-info">
                <span className="chat-time">{user.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`main-chat-area ${!isMobileView || showChat ? 'show' : ''}`}>
        {activeUser ? (
          <div className="chat-window">
            {isMobileView && (
              <button onClick={() => setShowChat(false)} className="back-button">← Back</button>
            )}
            <h2>Chat with {activeUser.name}</h2>
            <div className="messages">
              {(messages[activeUser._id] || []).map((msg, i) => (
                <div
                  key={msg._id || i}
                  className={`message ${msg.from === 'me' ? 'sent' : 'received'}`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (msg.from === 'me') {
                      setContextMenu({
                        visible: true,
                        x: e.pageX,
                        y: e.pageY,
                        msgId: msg._id,
                        userId: activeUser._id
                      });
                    }
                  }}
                  onTouchStart={(e) => {
                    if (msg.from !== 'me') return;
                    const timeoutId = setTimeout(() => {
                      const touch = e.touches[0];
                      setContextMenu({
                        visible: true,
                        x: touch.pageX,
                        y: touch.pageY,
                        msgId: msg._id,
                        userId: activeUser._id
                      });
                      navigator.vibrate?.(50);
                    }, 600);

                    const cancel = () => clearTimeout(timeoutId);
                    e.target.addEventListener('touchend', cancel, { once: true });
                    e.target.addEventListener('touchmove', cancel, { once: true });
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="input-area">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        ) : (
          <div className="empty-chat">
            <img src="./public/images/mchatlogo.png" alt="Chat Logo" style={{ height: "120px" }} />
            <p>WhatsApp for Windows</p>
            <p>Send and receive messages without keeping your phone online.</p>
            <p>Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
            <p><strong>End-to-end encrypted</strong></p>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ position: 'absolute', top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={handleDeleteMessage}>Delete Message</button>
        </div>
      )}
    </div>
  );
};
