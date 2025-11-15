import type { UserProfile, ChamaGroup, Contribution, Loan, Message, Receipt, SubscriptionPlan, PaymentMethod, Invoice } from './types';
import { placeholderImages } from './placeholder-images';

const findImage = (id: string) => placeholderImages.find(img => img.id === id)?.imageUrl || '';

export const user: UserProfile = {
  id: 'user-1',
  name: 'Juma Clive',
  email: 'juma@example.com',
  avatarUrl: findImage('avatar-1'),
  groups: ['group-1', 'group-2'],
  role: 'admin',
};

const members: UserProfile[] = [
  user,
  { id: 'user-2', name: 'Aisha Ke', email: 'aisha@example.com', avatarUrl: findImage('avatar-2'), groups: ['group-1'], role: 'member' },
  { id: 'user-3', name: 'Ben Oloo', email: 'ben@example.com', avatarUrl: findImage('avatar-3'), groups: ['group-1', 'group-2'], role: 'treasurer' },
  { id: 'user-4', name: 'Caren W.', email: 'caren@example.com', avatarUrl: findImage('avatar-4'), groups: ['group-2'], role: 'member' },
];

export const groups: ChamaGroup[] = [
  {
    id: 'group-1',
    name: 'Kilimani Young Investors',
    description: 'Weekly investment group for young professionals in Kilimani.',
    createdBy: 'user-1',
    members: members.filter(m => ['user-1', 'user-2', 'user-3'].includes(m.id)),
    kittyBalance: 125000,
    merryGoRoundIndex: 1,
  },
  {
    id: 'group-2',
    name: 'Family & Friends SACCO',
    description: 'A small savings group for close family and friends.',
    createdBy: 'user-3',
    members: members.filter(m => ['user-1', 'user-3', 'user-4'].includes(m.id)),
    kittyBalance: 48500,
    merryGoRoundIndex: 0,
  },
];

export const contributions: Contribution[] = [
  { id: 'c1', groupId: 'group-1', memberId: 'user-1', memberName: 'Juma Clive', amount: 5000, date: '2024-06-28T10:00:00Z', ref: 'SFT8A7S1L0' },
  { id: 'c2', groupId: 'group-1', memberId: 'user-2', memberName: 'Aisha Ke', amount: 5000, date: '2024-06-29T11:00:00Z', ref: 'SFS9B8T2M1' },
  { id: 'c3', groupId: 'group-1', memberId: 'user-3', memberName: 'Ben Oloo', amount: 5000, date: '2024-06-30T09:30:00Z', ref: 'SFT0C9U3N2' },
  { id: 'c4', groupId: 'group-2', memberId: 'user-4', memberName: 'Caren W.', amount: 2500, date: '2024-07-01T15:00:00Z', ref: 'SFU1D0V4O3' },
  { id: 'c5', groupId: 'group-2', memberId: 'user-1', memberName: 'Juma Clive', amount: 2500, date: '2024-07-01T16:00:00Z', ref: 'SFV2E1W5P4' },
];

export const loans: Loan[] = [
  { id: 'l1', groupId: 'group-1', memberId: 'user-2', memberName: 'Aisha Ke', amount: 20000, status: 'approved', votes: [], repayments: [] },
  { id: 'l2', groupId: 'group-1', memberId: 'user-1', memberName: 'Juma Clive', amount: 15000, status: 'pending', votes: [], repayments: [] },
  { id: 'l3', groupId: 'group-2', memberId: 'user-4', memberName: 'Caren W.', amount: 10000, status: 'rejected', votes: [], repayments: [] },
];

export const messages: Message[] = [
    { id: 'm1', groupId: 'group-1', senderId: 'user-2', text: 'Hi everyone, I have paid my contribution for this week.', timestamp: '2024-06-29T11:05:00Z' },
    { id: 'm2', groupId: 'group-1', senderId: 'user-3', text: 'Thanks Aisha, received. I will update the records.', timestamp: '2024-06-29T11:10:00Z' },
    { id: 'm3', groupId: 'group-1', senderId: 'user-1', text: 'Great. Also, I have a loan request pending. Kindly review when you have time.', timestamp: '2024-06-30T10:00:00Z' },
];

export const receipts: Receipt[] = [
    { id: 'r1', groupId: 'group-1', url: findImage('receipt-1'), uploadedBy: 'user-3', timestamp: '2024-06-15T14:00:00Z' },
    { id: 'r2', groupId: 'group-1', url: findImage('receipt-2'), uploadedBy: 'user-3', timestamp: '2024-06-22T13:00:00Z' },
];

// Data for charts
export const contributionsChartData = [
    { month: "January", amount: 18600 },
    { month: "February", amount: 30500 },
    { month: "March", amount: 23700 },
    { month: "April", amount: 27300 },
    { month: "May", amount: 20900 },
    { month: "June", amount: 21400 },
  ];

export const loansChartData = [
    { status: "approved", count: 8, fill: "var(--color-approved)" },
    { status: "pending", count: 3, fill: "var(--color-pending)" },
    { status: "rejected", count: 2, fill: "var(--color-rejected)" },
  ];

// Data for Billing Page
export const subscriptions: Omit<SubscriptionPlan, 'status' | 'usage'>[] = [
    {
        planId: 'free',
        name: 'Free Plan',
        description: 'For individuals and small groups just getting started.',
        price: 0,
        features: ['Up to 3 Groups', 'Basic Reporting', 'Community Support'],
    },
    {
        planId: 'pro',
        name: 'Pro Plan',
        description: 'For larger groups and chamas that need more power.',
        price: 2000,
        features: ['Unlimited Groups', 'Advanced Reporting', 'Priority Support', 'Loan Management'],
    },
];

export const paymentMethods: PaymentMethod[] = [
    {
        id: 'pm_1',
        cardType: 'Visa',
        last4: '1234',
        expiry: '06/2027',
        isPrimary: true,
    }
];

export const invoices: Invoice[] = [
    { id: "INV001", date: "June 2024", amount: 500, status: "Paid" },
    { id: "INV002", date: "May 2024", amount: 500, status: "Paid" },
    { id: "INV003", date: "April 2024", amount: 500, status: "Paid" },
];

    
