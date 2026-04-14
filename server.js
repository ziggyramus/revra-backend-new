import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
console.log(`Server running on port ${PORT}`);
});
