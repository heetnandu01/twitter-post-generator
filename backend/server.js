require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/init');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

connectDB();

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

app.get('/', (req, res) => res.send('🟢 API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
