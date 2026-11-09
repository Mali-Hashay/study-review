import { HttpError } from '../utils/HttpError.js';
import { parseId } from '../utils/parseId.js';
import { findActiveTopicById } from '../repositories/topicsRepository.js';
import { taskBelongsToTopic } from '../repositories/tasksRepository.js';
import { createReviewLog, deleteThisWeekReviewLogs } from '../repositories/reviewLogsRepository.js';

export async function addReviewLog(req, res) {
  const topicId = parseId(req.params.topicId);
  const { confidence, taskId, notes } = req.body;

  const topic = await findActiveTopicById(topicId);
  if (!topic) {
    throw new HttpError(404, 'הנושא לא נמצא');
  }

  if (taskId !== undefined && !(await taskBelongsToTopic(taskId, topicId))) {
    throw new HttpError(400, 'המשימה לא שייכת לנושא הזה');
  }

  const reviewLog = await createReviewLog(req.userId, topicId, taskId, confidence, notes);
  res.status(201).json({ reviewLog });
}

export async function removeThisWeekReviewLogs(req, res) {
  const topicId = parseId(req.params.topicId);
  const deleted = await deleteThisWeekReviewLogs(req.userId, topicId);
  res.json({ deleted });
}
