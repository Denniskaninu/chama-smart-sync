import { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "treasurer" | "member";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  groups: string[];
  role: UserRole;
}

export interface ChamaGroup {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: UserProfile[]; // Storing full member profiles for simplicity
  kittyBalance: number;
  merryGoRoundIndex: number;
}

export interface Contribution {
  id: string;
  groupId: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: Timestamp | string; // Can be a server timestamp or an ISO string
  ref: string;
}

export interface Loan {
  id: string;
  groupId: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  votes: { userId: string; vote: boolean }[];
  repayments: { amount: number; date: string }[];
}

export interface Message {
    id: string;
    groupId: string;
    senderId: string;
    text: string;
    timestamp: Timestamp;
}

export interface Receipt {
    id: string;
    groupId: string;
    url: string;
    uploadedBy: string;
    timestamp: string; // ISO string
}

export interface SubscriptionPlan {
    planId: string;
    name: string;
    description: string;
    price: number;
    features: string[];
    status: 'active' | 'inactive';
    usage: {
        groupsUsed: number;
        groupsLimit: number;
    }
}

export interface PaymentMethod {
    id: string;
    cardType: string;
    last4: string;
    expiry: string;
    isPrimary: boolean;
}

export interface Invoice {
    id: string;
    date: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Failed';
}
