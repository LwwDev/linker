const { Router } = require('express');
const { Op } = require('sequelize');
const { Link, Click } = require('../models');
const authenticate = require('../middleware/auth');

const router = Router();

router.get('/:id', authenticate, async (req, res) => {
  try {
    const link = await Link.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!link) return res.status(404).json({ error: 'Link not found' });

    const days = parseInt(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const clicks = await Click.findAll({
      where: { linkId: link.id, clicked_at: { [Op.gte]: since } },
      order: [['clicked_at', 'DESC']],
    });

    const totalClicks = await Click.count({ where: { linkId: link.id } });

    // Group clicks by day
    const clicksByDay = {};
    clicks.forEach((click) => {
      const day = click.clicked_at.toISOString().split('T')[0];
      clicksByDay[day] = (clicksByDay[day] || 0) + 1;
    });

    // Top referrers
    const referrerCounts = {};
    clicks.forEach((click) => {
      const ref = click.referrer || 'Direct';
      referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
    });
    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      link,
      totalClicks,
      clicksByDay,
      topReferrers,
      recentClicks: clicks.slice(0, 50),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
