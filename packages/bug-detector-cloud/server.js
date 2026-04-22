const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3456;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Stats
app.get('/api/stats', (req, res) => {
  res.json(db.getStats());
});

// List reports
app.get('/api/reports', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '100', 10), 500);
  const offset = parseInt(req.query.offset || '0', 10);
  res.json(db.getReports(limit, offset));
});

// Get single report
app.get('/api/reports/:id', (req, res) => {
  const report = db.getReportById(req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json(report);
});

// Create report
app.post('/api/reports', (req, res) => {
  const report = req.body;
  if (!report.id || !report.description) {
    return res.status(400).json({ error: 'id and description are required' });
  }
  try {
    db.saveReport(report);
    res.status(201).json({ id: report.id, saved: true });
  } catch (err) {
    console.error('Error saving report:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update status
app.patch('/api/reports/:id/status', (req, res) => {
  const { status } = req.body;
  const updated = db.updateReportStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Report not found' });
  res.json({ updated: true });
});

// Delete report
app.delete('/api/reports/:id', (req, res) => {
  const deleted = db.deleteReport(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Report not found' });
  res.json({ deleted: true });
});

// Serve static dashboard if built
const dashboardPath = path.join(__dirname, 'dashboard', 'dist');
app.use(express.static(dashboardPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(dashboardPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BugDetector Cloud running on http://localhost:${PORT}`);
});
