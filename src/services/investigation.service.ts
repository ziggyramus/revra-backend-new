import Investigation from "../models/investigation.model";

type InvestigationFilters = {
  organizationId?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
};

export const createInvestigation = async (data: any) => {
  const caseNumber =
    data.caseNumber ||
    `CASE-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  return Investigation.create({
    ...data,
    caseNumber,
    status: data.status || "open",
    priority: data.priority || "medium",
    classification: data.classification || "unclassified",
  });
};

export const getInvestigationById = async (id: string) => {
  return Investigation.findById(id);
};

export const listInvestigations = async (filters: InvestigationFilters) => {
  const { organizationId, status, priority, page = 1, limit = 100 } = filters;

  const query: Record<string, string> = {};

  if (organizationId) query.organizationId = organizationId;
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const skip = (page - 1) * limit;

  return Investigation.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const updateInvestigation = async (id: string, data: any) => {
  return Investigation.findByIdAndUpdate(
    id,
    {
      ...data,
      updatedBy: data.updatedBy,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteInvestigation = async (id: string) => {
  return Investigation.findByIdAndDelete(id);
};

export const getInvestigations = async () => {
  return Investigation.find().sort({ createdAt: -1 });
};