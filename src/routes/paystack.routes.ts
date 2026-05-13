import { Router, Request, Response } from "express";
import { updateJobPayment } from "../services/job.service";

const router = Router();

/**
* ===============================
* 🔹 INITIALIZE PAYMENT
* ===============================
*/
router.post("/initialize", async (req: Request, res: Response) => {
try {
const { email, amount, metadata } = req.body;

const callback_url =
req.body.callback_url ||
"https://user-stream-flow.base44.app/payment-success";

const paystackResponse = await fetch(
"https://api.paystack.co/transaction/initialize",
{
method: "POST",
headers: {
Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
email,
amount: Math.round(Number(amount) * 100),
callback_url,
metadata,
}),
}
);

const paystackData = await paystackResponse.json();

if (!paystackResponse.ok || !paystackData.status) {
console.log("PAYSTACK ERROR:", paystackData);
return res.status(400).json({
status: false,
error: paystackData?.message || "Paystack initialization failed",
});
}

return res.status(200).json({
status: true,
message: "Payment initialized",
data: paystackData.data,
});
} catch (error: any) {
return res.status(500).json({
status: false,
error: error?.message || "Payment initialization failed",
});
}
});


/**
* ===============================
* 🔹 VERIFY PAYMENT
* ===============================
*/
router.get("/verify/:reference", async (req: Request, res: Response) => {
try {
const { reference } = req.params;

if (!reference) {
return res.status(400).json({
status: false,
error: "Reference is required"
});
}

if (!process.env.PAYSTACK_SECRET_KEY) {
return res.status(500).json({
status: false,
error: "Missing PAYSTACK_SECRET_KEY"
});
}

const response = await fetch(
`https://api.paystack.co/transaction/verify/${reference}`,
{
method: "GET",
headers: {
Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
}
}
);

let data: any;

try {
data = await response.json();
} catch (err) {
return res.status(500).json({
status: false,
error: "Invalid Paystack response"
});
}

if (!response.ok || !data?.status || data?.data?.status !== "success") {
return res.status(400).json({
status: false,
error: data?.message || "Payment verification failed"
});
}

const amount = Number(data?.data?.amount || 0) / 100;

// IMPORTANT:
// Use your existing service function that links the verified payment
// to the correct job record.
const updatedJob = updateJobPayment(reference, amount);

return res.status(200).json({
status: true,
message: "Payment verified",
data: {
reference,
amount,
payment: data.data,
job: updatedJob
}
});

} catch (error: any) {
return res.status(500).json({
status: false,
error: error?.message || "Verification failed"
});
}
});

export default router;