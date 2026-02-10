const { Router } = require('express');
const QRCode = require('qrcode');
const { Link, Click } = require('../models');
const authenticate = require('../middleware/auth');
const { generateShortCode } = require('../utils/shortCode');

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const links = await Link.findAll({
      where: { userId: req.user.id },
      include: { model: Click, as: 'clicks', attributes: [] },
      attributes: {
        include: [
          [Link.sequelize.fn('COUNT', Link.sequelize.col('clicks.id')), 'clickCount'],
        ],
      },
      group: ['Link.id'],
      order: [['createdAt', 'DESC']],
    });
    res.json({ links });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { originalUrl, customCode, title } = req.body;
    if (!originalUrl) return res.status(400).json({ error: 'URL is required' });

    let shortCode = customCode || generateShortCode();

    if (customCode) {
      if (!/^[a-zA-Z0-9_-]+$/.test(customCode)) {
        return res.status(400).json({ error: 'Custom code can only contain letters, numbers, hyphens, and underscores' });
      }
      const existing = await Link.findOne({ where: { shortCode: customCode } });
      if (existing) return res.status(409).json({ error: 'Custom code already taken' });
    }

    const link = await Link.create({
      userId: req.user.id,
      originalUrl,
      shortCode,
      title: title || null,
    });

    res.status(201).json({ link });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const link = await Link.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!link) return res.status(404).json({ error: 'Link not found' });
    res.json({ link });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const link = await Link.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!link) return res.status(404).json({ error: 'Link not found' });

    const { title, originalUrl, isActive } = req.body;
    if (title !== undefined) link.title = title;
    if (originalUrl !== undefined) link.originalUrl = originalUrl;
    if (isActive !== undefined) link.isActive = isActive;
    await link.save();

    res.json({ link });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const link = await Link.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!link) return res.status(404).json({ error: 'Link not found' });

    await Click.destroy({ where: { linkId: link.id } });
    await link.destroy();
    res.json({ message: 'Link deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/qr', authenticate, async (req, res) => {
  try {
    const link = await Link.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!link) return res.status(404).json({ error: 'Link not found' });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const qrDataUrl = await QRCode.toDataURL(`${baseUrl}/${link.shortCode}`);
    res.json({ qr: qrDataUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
