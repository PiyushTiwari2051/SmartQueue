export type Department = 'A' | 'B' | 'C' | 'D';

export interface Token {
  id: string;
  number: number;
  department: Department;
  displayNumber: string;
  customerName: string;
  phone?: string;
  status: 'waiting' | 'serving' | 'completed' | 'skipped';
  counter?: number;
  createdAt: Date;
  calledAt?: Date;
  completedAt?: Date;
}

export interface Counter {
  id: number;
  name: string;
  currentToken: Token | null;
  isActive: boolean;
  department: Department;
}

export interface DepartmentInfo {
  code: Department;
  name: string;
  description: string;
  color: string;
}

export const DEPARTMENTS: DepartmentInfo[] = [
  { code: 'A', name: 'General Enquiry', description: 'General information and assistance', color: 'token-a' },
  { code: 'B', name: 'Registration', description: 'New patient/customer registration', color: 'token-b' },
  { code: 'C', name: 'Billing', description: 'Payment and billing services', color: 'token-c' },
  { code: 'D', name: 'Consultation', description: 'Doctor/specialist consultation', color: 'token-d' },
];
