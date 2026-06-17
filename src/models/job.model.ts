import mongoose, { Schema, Document } from "mongoose";

export type JobStatus = "pending" | "paid" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface IJob extends Document {
  title: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
  status: JobStatus;
  paymentStatus: PaymentStatus;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Service Request",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    customerName: {
      type: String,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    reference: {
      type: String,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IJob>("Job", jobSchema);