// server.js

// ----------------------
// 1. Packages
// ----------------------
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

// ----------------------
// 2. MongoDB connection
// ----------------------
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected..."))
  .catch(err => console.log("❌ Mongo Error:", err));

// ----------------------
// 3. Middleware
// ----------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------
// 4. Static files (frontend)
// ----------------------
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------
// 5. Root route
// ----------------------
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ----------------------
// 6. Socket.io setup
// ----------------------
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Example: chat message event
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// ----------------------
// 7. Server listen
// ----------------------
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
