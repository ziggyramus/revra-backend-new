import mongoose, { Schema, Document } from "mongoose";

export interface IInvestigation extends Document {
  organizationId: string;
  caseNumber: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  classification: string;
  jurisdiction?: string;
  linkedIncidentId?: string;
  investigatorName?: string;
  investigatorBadge?: string;
  investigatorUnit?: string;
  supervisorName?: string;
  location?: string;
  incidentDate?: string;
  suspects?: string;
  victims?: string;
  witnesses?: string;
  vehiclePlate?: string;
  driverLicense?: string;
  passportOrNIN?: string;
  description?: string;
  narrativeReport?: string;
  progress?: number;
  evidenceCount?: number;
  warrantStatus?: string;
  riskScore?: number;
  assignedOfficerId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const investigationSchema = new Schema<IInvestigation>(
  {
    organizationId: {
      type: String,
      required: true,
      index: true,
    },
    caseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "open",
      enum: [
        "open",
        "active",
        "under_review",
        "escalated",
        "awaiting_evidence",
        "warrant_requested",
        "court_pending",
        "closed",
        "archived",
      ],
    },
    priority: {
      type: String,
      default: "medium",
      enum: ["low", "medium", "high", "critical"],
    },
    classification: {
      type: String,
      default: "unclassified",
      enum: ["unclassified", "confidential", "secret", "top_secret"],
    },
    jurisdiction: String,
    linkedIncidentId: String,
    investigatorName: String,
    investigatorBadge: String,
    investigatorUnit: String,
    supervisorName: String,
    location: String,
    incidentDate: String,
    suspects: String,
    victims: String,
    witnesses: String,
    vehiclePlate: String,
    driverLicense: String,
    passportOrNIN: String,
    description: String,
    narrativeReport: String,
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    evidenceCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    warrantStatus: {
      type: String,
      default: "none",
      enum: ["none", "requested", "issued", "executed", "expired"],
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    assignedOfficerId: String,
    createdBy: String,
    updatedBy: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IInvestigation>(
  "Investigation",
  investigationSchema
);