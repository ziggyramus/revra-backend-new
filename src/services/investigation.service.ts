export type Investigation = {
  id: string;
  organizationId: string;
  caseNumber: string;
  title: string;
  type: string;
  status: 'open' | 'active' | 'under_review' | 'escalated' | 'awaiting_evidence' | 'warrant_requested' | 'court_pending' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  classification: 'unclassified' | 'confidential' | 'secret' | 'top_secret';
  jurisdiction: string;
  linkedIncidentId?: string;
  investigatorName: string;
  investigatorBadge: string;
  investigatorUnit: string;
  supervisorName?: string;
  location: string;
  incidentDate?: string;
  suspects?: string;
  victims?: string;
  witnesses?: string;
  vehiclePlate?: string;
  driverLicense?: string;
  passportOrNIN?: string;
  description: string;
  narrativeReport?: string;
  progress?: number;
  evidenceCount?: number;
  warrantStatus?: 'none' | 'requested' | 'issued' | 'executed' | 'expired';
  riskScore?: number;
  assignedOfficerId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
};

const investigations: Investigation[] = [];

export const createInvestigation = (data: Omit<Investigation, 'id' | 'createdAt' | 'updatedAt'>): Investigation => {
  const investigation: Investigation = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  investigations.push(investigation);
  return investigation;
};

export const getInvestigationById = (id: string): Investigation | undefined => {
  return investigations.find(inv => inv.id === id);
};

export const getInvestigationsByOrgId = (organizationId: string, page: number = 1, limit: number = 100): Investigation[] => {
  const filtered = investigations.filter(inv => inv.organizationId === organizationId);
  const offset = (page - 1) * limit;
  return filtered.slice(offset, offset + limit);
};

export const listInvestigations = (filters: {
  organizationId?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}): Investigation[] => {
  const { organizationId, status, priority, page = 1, limit = 100 } = filters;

  let filtered = investigations;

  if (organizationId) {
    filtered = filtered.filter(inv => inv.organizationId === organizationId);
  }
  if (status) {
    filtered = filtered.filter(inv => inv.status === status);
  }
  if (priority) {
    filtered = filtered.filter(inv => inv.priority === priority);
  }

  // Sort by createdAt descending
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const offset = (page - 1) * limit;
  return filtered.slice(offset, offset + limit);
};

export const updateInvestigation = (id: string, data: Partial<Omit<Investigation, 'id' | 'createdAt'>>): Investigation | undefined => {
  const index = investigations.findIndex(inv => inv.id === id);

  if (index === -1) {
    return undefined;
  }

  investigations[index] = {
    ...investigations[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return investigations[index];
};

export const deleteInvestigation = (id: string): boolean => {
  const index = investigations.findIndex(inv => inv.id === id);

  if (index === -1) {
    return false;
  }

  investigations.splice(index, 1);
  return true;
};

export const getInvestigations = (): Investigation[] => {
  return investigations;
};