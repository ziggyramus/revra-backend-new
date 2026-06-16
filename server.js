import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';


const app = express();

app.use(cors());
app.use(express.json());

console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((error) => {
  console.error('MongoDB connection error:', error.message);
});

app.get('/', (req, res) => {
res.status(200).json({
status: 'OK',
message: 'RevRa Backend Running',
timestamp: new Date()
});
});

app.get('/health', (req, res) => {
res.send('OK');
});

app.get('/db-health', (req, res) => {
  res.json({
    mongoReadyState: mongoose.connection.readyState,
    status: mongoose.connection.readyState === 1 ? 'connected' : 'not connected'
  });
});

app.get('/test', (req, res) => {
res.json({ message: 'API working' });
});

import axios from 'axios';

app.get('/paystack/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;

    if (data.status !== 'success') {
      return res.status(400).json({
        success: false,
      });
    }

    res.json({
      success: true,
      reference: data.reference,
      amount: data.amount / 100,
      email: data.customer.email,
      status: data.status,
      metadata: data.metadata,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
});

app.post('/jobs/create-test', async (req, res) => {
  try {
    const jobSchema = new mongoose.Schema({}, { strict: false });
    const Job = mongoose.models.Job || mongoose.model('Job', jobSchema, 'jobs');

    const job = new Job({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'base44-local-test'
    });

    const saved = await job.save();

    res.status(201).json({
      success: true,
      insertedId: saved._id,
      job: saved.toObject()
    });

  } catch (error) {
    console.error('Create test job error:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/jobs', async (req, res) => {
  try {
    const jobSchema = new mongoose.Schema({}, { strict: false });

    const Job =
      mongoose.models.Job ||
      mongoose.model('Job', jobSchema, 'jobs');

    const jobs = await Job.find({})
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: jobs.length,
      jobs: jobs.map(job => job.toObject())
    });

  } catch (error) {
    console.error('List jobs error:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/jobs/:id', async (req, res) => {
  try {
    const jobSchema = new mongoose.Schema({}, { strict: false });

    const Job =
      mongoose.models.Job ||
      mongoose.model('Job', jobSchema, 'jobs');

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    res.json({
      success: true,
      job: job.toObject()
    });

  } catch (error) {
    console.error('Read job error:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
console.log(`Server running on port ${PORT}`);
});
