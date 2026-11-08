export function notFound(req, res) {
  res.status(404).json({ error: { message: 'הנתיב המבוקש לא נמצא' } });
}
