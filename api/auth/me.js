const jwt = require('jsonwebtoken');

const JWT_SECRET=proces...CRET || 'pb-club-secret-2026';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const payload = jwt.verify(auth.slice(7), JWT_SECRET);
    res.json({ user: { email: payload.email, name: payload.name } });
  } catch {
    res.status(401).json({ error: 'Not authenticated' });
  }
};
