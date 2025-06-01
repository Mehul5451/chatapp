// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

// const App = () => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [username, setUsername] = useState("");
//   const [joined, setJoined] = useState(false);

//   const sendMessage = () => {
//     if (message.trim() && username.trim()) {
//       socket.emit("send_message", {
//         user: username,
//         text: message,
//         time: new Date().toLocaleTimeString()
//       });
//       setMessage("");
//     }
//   };

//   useEffect(() => {
//     socket.on("receive_message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => socket.off("receive_message");
//   }, []);

//   return (
//     <div style={styles.container}>
//       <h1>💬 Real-Time Chat</h1>

//       {!joined ? (
//         <div style={styles.loginBox}>
//           <input
//             placeholder="Enter your name"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             style={styles.input}
//           />
//           <button onClick={() => setJoined(true)} style={styles.button}>
//             Join Chat
//           </button>
//         </div>
//       ) : (
//         <div style={styles.chatBox}>
//           <div style={styles.chat}>
//             {messages.map((msg, idx) => (
//               <div key={idx} style={styles.message}>
//                 <strong>{msg.user}</strong> [{msg.time}]: {msg.text}
//               </div>
//             ))}
//           </div>
//           <div style={styles.controls}>
//             <input
//               placeholder="Type message..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               style={styles.input}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <button onClick={sendMessage} style={styles.button}>
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     fontFamily: "sans-serif",
//     textAlign: "center",
//     marginTop: "50px"
//   },
//   loginBox: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "10px"
//   },
//   chatBox: {
//     maxWidth: "600px",
//     margin: "auto"
//   },
//   chat: {
//     border: "1px solid #ccc",
//     borderRadius: "10px",
//     padding: "10px",
//     height: "300px",
//     overflowY: "auto",
//     backgroundColor: "#f9f9f9",
//     marginBottom: "10px"
//   },
//   controls: {
//     display: "flex",
//     gap: "10px"
//   },
//   input: {
//     flex: 1,
//     padding: "10px",
//     fontSize: "16px",
//     borderRadius: "5px",
//     border: "1px solid #ccc"
//   },
//   button: {
//     padding: "10px 20px",
//     fontSize: "16px",
//     backgroundColor: "#3498db",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px"
//   },
//   message: {
//     textAlign: "left",
//     margin: "5px 0"
//   }
// };

// export default App;
