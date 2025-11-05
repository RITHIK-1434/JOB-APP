const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');
const User = require('../models/User');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all jobs (with filters)
router.get('/', async (req, res) => {
  try {
    const { search, location, jobType, category, experienceLevel } = req.query;
    let query = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (category) {
      query.category = category;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name company')
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name company email phone');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create job (employer only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can post jobs' });
    }

    const jobData = {
      ...req.body,
      postedBy: req.user.userId,
      skills: req.body.skills ? req.body.skills.split(',').map(s => s.trim()) : []
    };

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update job
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.body.skills && typeof req.body.skills === 'string') {
      req.body.skills = req.body.skills.split(',').map(s => s.trim());
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete job
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get jobs posted by current employer
router.get('/my/posted', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can access this' });
    }

    const jobs = await Job.find({ postedBy: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;