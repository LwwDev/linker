const { Router } = require('express');
const { BioPage, User } = require('../models');
const authenticate = require('../middleware/auth');

const router = Router();

// Get current user's bio page
router.get('/', authenticate, async (req, res) => {
  try {
    let bioPage = await BioPage.findOne({ where: { userId: req.user.id } });
    if (!bioPage) {
      bioPage = await BioPage.create({ userId: req.user.id });
    }
    res.json({ bioPage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update current user's bio page
router.put('/', authenticate, async (req, res) => {
  try {
    let bioPage = await BioPage.findOne({ where: { userId: req.user.id } });
    if (!bioPage) {
      bioPage = await BioPage.create({ userId: req.user.id });
    }

    const { title, bioText, theme, links } = req.body;
    if (title !== undefined) bioPage.title = title;
    if (bioText !== undefined) bioPage.bioText = bioText;
    if (theme !== undefined) bioPage.theme = theme;
    if (links !== undefined) bioPage.links = links;
    await bioPage.save();

    res.json({ bioPage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public bio page by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bioPage = await BioPage.findOne({ where: { userId: user.id } });
    if (!bioPage) return res.status(404).json({ error: 'Bio page not found' });

    res.json({
      bioPage: {
        title: bioPage.title,
        bioText: bioPage.bioText,
        theme: bioPage.theme,
        links: bioPage.links,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
