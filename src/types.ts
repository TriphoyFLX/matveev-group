/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StartupMetrics {
  founded: string;
  stage: string;
  valuation: string;
  team: number;
  marketSize: string;
  efficiencyRating: string; // iOS battery/efficiency style rating
}

export interface Startup {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  longDescription: string;
  icon: string; // Lucide icon identifier
  color: string; // Accent color hex
  url?: string;
  metrics: StartupMetrics;
  achievements: string[];
  productIds: string[];
}

export interface Product {
  id: string;
  startupId: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  specifications: {
    label: string;
    value: string;
  }[];
  features: {
    title: string;
    desc: string;
    icon: string;
  }[];
}

export interface Milestone {
  id: string;
  date: string;
  quarter: string;
  title: string;
  category: 'Expansion' | 'Acquisition' | 'Product' | 'Funding' | 'Carbon-Zero';
  tagline: string;
  summary: string;
}

export interface Pillar {
  id: string;
  title: string;
  quote: string;
  author: string;
  description: string;
  details: string[];
  icon: string;
}

export interface FeedbackSubmission {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  interestType: 'Investment' | 'Partnership' | 'Venture Pitch' | 'Other';
  message: string;
  investmentTier: string;
  agreedToTerms: boolean;
  signature: string;
  timestamp: string;
}
