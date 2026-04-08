const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../dist')));

// MySQL Pool
const pool = mysql.createPool(process.env.DATABASE_URL);

// --- Authentication Middlewares ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Admin access required' });
  next();
};

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO User (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, role === 'admin' ? 'ADMIN' : 'STUDENT']
    );

    const token = jwt.sign({ id: result.insertId, email, role: role.toUpperCase() }, JWT_SECRET);
    res.json({ token, user: { id: result.insertId, email, name, role: role.toUpperCase() } });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'User already exists or invalid data' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.execute('SELECT * FROM User WHERE email = ?', [email]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// --- Leave Request Routes ---
app.get('/api/requests', authenticateToken, async (req, res) => {
  let query = `
    SELECT lr.*, u.name as userName, u.email as userEmail 
    FROM LeaveRequest lr 
    JOIN User u ON lr.userId = u.id
  `;
  let params = [];
  
  if (req.user.role !== 'ADMIN') {
    query += ' WHERE lr.userId = ?';
    params.push(req.user.id);
  }
  
  query += ' ORDER BY lr.createdAt DESC';
  
  const [rows] = await pool.execute(query, params);
  
  // Format for frontend
  const requests = rows.map(r => ({
    ...r,
    user: { name: r.userName, email: r.userEmail }
  }));
  
  res.json(requests);
});

app.post('/api/requests', authenticateToken, async (req, res) => {
  const { type, reason, startDate, endDate } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO LeaveRequest (type, reason, startDate, endDate, userId, status) VALUES (?, ?, ?, ?, ?, ?)',
      [type, reason, new Date(startDate), new Date(endDate), req.user.id, 'Pending']
    );
    res.json({ id: result.insertId, type, reason, status: 'Pending' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to create request' });
  }
});

app.patch('/api/requests/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.execute('UPDATE LeaveRequest SET status = ? WHERE id = ?', [status, id]);
    res.json({ id, status });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to update request' });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
  const indexPath = path.resolve(__dirname, '..', 'dist', 'index.html');
  console.log(`Catch-all for: ${req.url} -> serving ${indexPath}`);
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
