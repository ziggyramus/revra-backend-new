type Job = {
id: string;
amount: number;
status: 'pending' | 'paid';
reference?: string;

// 🔥 ADD THESE
title?: string;
customerName?: string;
customerEmail?: string;
};

const jobs: Job[] = [];

export const createJob = (amount: number) => {
  const job = {
id: Date.now().toString(),
amount,
status: 'pending',

// 🔥 ADD REAL DATA
title: "Service Request", // replace later from frontend
customerName: "Test User",
customerEmail: "test@email.com"
};
  jobs.push(job);
  return job;
};

export const updateJobPayment = (reference: string, amount: number) => {
const job = jobs.find(
(j) =>
j.reference === reference ||
(j.amount === amount && j.status === "pending")
);

if (!job) {
return {
job: null,
payment: null,
allPayments: [],
totalPaid: 0,
balance: 0,
aggregatePaymentStatus: "pending"
};
}

// ✅ UPDATE JOB (this is what was missing before)
job.status = "paid";
job.reference = reference;

const normalizedJob = {
id: job.id,
title: job.title || "Service Request",
customerName: job.customerName || "",
customerEmail: job.customerEmail || "",
status: job.status,
amount: Number(job.amount || 0),
reference: job.reference
};

return {
job: normalizedJob,
payment: null,
allPayments: [],
totalPaid: normalizedJob.amount,
balance: 0,
aggregatePaymentStatus: "paid"
};
};

export const getJobs = () => jobs;