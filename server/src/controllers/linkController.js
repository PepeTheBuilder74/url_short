import Link from '../models/Link.js';
import { nanoid } from 'nanoid';
import validUrl from '../utils/validUrl.js';

export const createLink = async (req, res, next) => {
  try {
    const { originalUrl, customCode, expiresAt } = req.body;
    if (!originalUrl || !validUrl(originalUrl)) {
      return res.status(400).json({ message: 'Valid originalUrl required' });
    }
    let shortCode = customCode || nanoid(7);
    if (customCode) {
      const exists = await Link.findOne({ shortCode: customCode });
      if (exists) return res.status(409).json({ message: 'Custom code already taken' });
    } else {
      // ensure uniqueness
      while (await Link.findOne({ shortCode })) {
        shortCode = nanoid(7);
      }
    }
    const link = await Link.create({ shortCode, originalUrl, owner: req.user._id, expiresAt });
    res.status(201).json(link);
  } catch (err) { next(err); }
};

export const listLinks = async (req, res, next) => {
  try {
    const links = await Link.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(links);
  } catch (err) { next(err); }
};

export const deleteLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const link = await Link.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!link) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
