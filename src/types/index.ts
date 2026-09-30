export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  material: string;
  tolerance: string;
  quantity: string;
  completionDate: string;
  clientIndustry: string;
  image: string;
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  challenge?: string;
  solution?: string;
  featured?: boolean;
}

export interface LiveJob {
  id: string;
  bayNumber: string;
  jobTitle: string;
  material: string;
  tolerance: string;
  progress: number;
  status: 'In Progress' | 'Setup Phase' | 'Quality Check' | 'Completed';
  startedTime: string;
  estimatedCompletion: string;
  technician: string;
  partReference: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceType: string;
  message: string;
  drawingUrl?: string;
  status: 'New' | 'In Review' | 'Quoted' | 'Closed';
  createdAt: string;
}

export interface WorkshopSettings {
  workshopName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  activeBays: number;
  totalBays: number;
  isoCertified: boolean;
  standardTolerance: string;
}
