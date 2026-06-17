import Job from "../models/job.model";

type JobStatus = "pending" | "paid" | "cancelled";
type PaymentStatus = "pending" | "paid" | "failed";

type CreateJobInput = {
  title?: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
  status?: JobStatus;
  paymentStatus?: PaymentStatus;
  reference?: string;
};

type UpdateJobInput = Partial<CreateJobInput>;

export const createJob = async (input: CreateJobInput | number) => {
  const payload =
    typeof input === "number"
      ? {
          amount: input,
          title: "Service Request",
          customerName: "Test User",
          customerEmail: "test@email.com",
        }
      : input;

  const job = await Job.create({
    title: payload.title || "Service Request",
    amount: payload.amount,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    status: payload.status || "pending",
    paymentStatus: payload.paymentStatus || "pending",
    reference: payload.reference,
  });

  return job;
};

export const getJobs = async () => {
  return Job.find().sort({ createdAt: -1 });
};

export const getJobById = async (id: string) => {
  return Job.findById(id);
};

export const updateJobById = async (id: string, input: UpdateJobInput) => {
  return Job.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  });
};

export const updateJobPaymentById = async (
  jobId: string,
  reference: string,
  amount: number
) => {
  const job = await Job.findByIdAndUpdate(
    jobId,
    {
      status: "paid",
      paymentStatus: "paid",
      reference,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!job) {
    return {
      job: null,
      payment: null,
      allPayments: [],
      totalPaid: 0,
      balance: amount,
      aggregatePaymentStatus: "pending",
    };
  }

  return {
    job: {
      id: job.id,
      title: job.title,
      customerName: job.customerName || "",
      customerEmail: job.customerEmail || "",
      status: job.status,
      paymentStatus: job.paymentStatus,
      amount: Number(job.amount || 0),
      reference: job.reference,
    },
    payment: null,
    allPayments: [],
    totalPaid: Number(job.amount || 0),
    balance: 0,
    aggregatePaymentStatus: "paid",
  };
};