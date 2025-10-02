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
  members: UserProfile[];
  kittyBalance: number;
  merryGoRoundIndex: number;
}

export interface Contribution {
  id: string;
  groupId: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string; // ISO string
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
    timestamp: string; // ISO string
}

export interface Receipt {
    id: string;
    groupId: string;
    url: string;
    uploadedBy: string;
    timestamp: string; // ISO string
}
