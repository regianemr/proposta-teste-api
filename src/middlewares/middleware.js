import proposal from "../models/proposal.js";

async function checkIdempotency(req, res, next) {
  const key = req.header('Idempotency-Key');
  if (!key) return res.status(400).json({ error: 'Idempotency-Key required' });

  const existing = await proposal.findOne({ idempotencyKey: key });
  if (existing) return res.status(200).json(existing);

  req.idempotencyKey = key;
  next();
}

export default checkIdempotency;