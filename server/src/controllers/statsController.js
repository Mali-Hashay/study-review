import { findTopicConfidence } from '../repositories/statsRepository.js';

export async function getTopicConfidence(req, res) {
  const rows = await findTopicConfidence(req.userId);

  // pg returns numeric (AVG) and bigint (COUNT) as strings
  const topics = rows.map((row) => ({
    id: row.topic_id,
    name: row.topic_name,
    avgConfidence: Number(row.avg_confidence),
    reviewCount: Number(row.review_count),
  }));

  res.json({ topics });
}
