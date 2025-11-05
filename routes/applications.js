const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Apply for a job
router.post('/', auth, async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      coverLetter
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all applications for a user
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get applications for a job (employer only)
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the employer
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email')
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update application status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the employer
    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;