import Link from '../models/Link.js';

export const handleRedirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const link = await Link.findOne({ shortCode });
    if (!link) return res.status(404).json({ message: 'Link not found' });
    if (link.expiresAt && link.expiresAt < new Date()) {
      return res.status(410).json({ message: 'Link expired' });
    }
    link.clicks += 1;
    link.lastAccessedAt = new Date();
    await link.save();
    return res.redirect(link.originalUrl);
  } catch (err) { next(err); }
};
