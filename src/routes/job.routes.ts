import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/create', async (req, res) => {
try {
const { amount } = req.body;

const response = await axios.post(
'https://api.paystack.co/transaction/initialize',
{
email: 'test@email.com',
amount: amount * 100, // Paystack uses kobo
},
{
headers: {
Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
'Content-Type': 'application/json',
},
}
);

const data = response.data.data;

res.json({
success: true,
authorization_url: data.authorization_url,
reference: data.reference,
});

} catch (error) {
res.status(500).json({
success: false,
error: error.response?.data || error.message,
});
}
});

export default router;