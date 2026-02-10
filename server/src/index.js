require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize, Link, Click } = require('./models');

const authRoutes = require('./routes/auth');
const linkRoutes = require('./routes/links');
const analyticsRoutes = require('./routes/analytics');
const bioRoutes = require('./routes/bio');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/bio', bioRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Short URL redirect
app.get('/:shortCode', async (req, res) => {
  try {
    const link = await Link.findOne({
      where: { shortCode: req.params.shortCode, isActive: true },
    });
    if (!link) return res.status(404).json({ error: 'Link not found' });

    // Track click asynchronously
    Click.create({
      linkId: link.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || null,
      referrer: req.get('referrer') || null,
    }).catch(() => {});

    res.redirect(301, link.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync();
    console.log('Tables synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
};

start();
