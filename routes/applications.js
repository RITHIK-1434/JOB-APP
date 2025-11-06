const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Apply for a job
router.post('/', auth, async (req, res) => {
  try {
    const { jobId, coverLetter, resumeUrl } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.userId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user.userId,
      coverLetter,
      resumeUrl
    });

    await application.save();

    // Add applicant to job's applicants array
    job.applicants.push(req.user.userId);
    await job.save();

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CHANGE THIS: from '/my-applications' to '/my'
router.get('/my', auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.userId })
      .populate('job')
      .sort({ appliedAt: -1 });
    res.json({ applications });
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
    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone')
      .sort({ appliedAt: -1 });
    
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CHANGE THIS: from '/:id/status' to '/:id/status'
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the employer
    if (application.job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADD THIS: Delete application route
router.delete('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the applicant
    if (application.applicant.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
