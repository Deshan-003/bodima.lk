import type { Listing } from "../../data/listings";

export type UserStatus = "Active" | "Suspended" | "Pending";
export type AccountType = "seeker" | "owner";

/** An administrator's view of a Bodima.lk account (seeker or owner). */
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: AccountType;
  status: UserStatus;
  joined: string;
  district: string;
  town: string;
  listings: number;
  saved: number;
  enquiries: number;
  lastActive: string;
  verified: boolean;
  notes?: string;
}

export type ListingStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Active"
  | "Inactive"
  | "Reported";

/** Extends the public Listing entity so admin edits map onto real marketplace data. */
export interface AdminListing extends Listing {
  ownerId: number;
  ownerName: string;
  status: ListingStatus;
  featured: boolean;
  submitted: string;
  views: number;
  enquiries: number;
  reports: number;
}

export type ReportStatus = "Open" | "In Review" | "Resolved" | "Dismissed";

export interface Report {
  id: number;
  type: "listing" | "user" | "review";
  targetId: number;
  targetTitle: string;
  reportedBy: string;
  reason: string;
  details: string;
  created: string;
  status: ReportStatus;
  notes: string;
}

export type ReviewStatus = "Published" | "Pending" | "Reported";

export interface AdminReview {
  id: number;
  listingId: number;
  listingTitle: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  status: ReviewStatus;
  reports: number;
}

export interface EnquiryMessage {
  from: "seeker" | "owner" | "admin";
  text: string;
  at: string;
}

export interface Enquiry {
  id: number;
  listingId: number;
  listingTitle: string;
  seeker: string;
  owner: string;
  preview: string;
  date: string;
  unread: boolean;
  messages: EnquiryMessage[];
}

export interface AdminActivity {
  id: number;
  type: "user" | "listing" | "report" | "review" | "message" | "system";
  text: string;
  time: string;
}

export interface LocationEntry {
  id: number;
  district: string;
  town: string;
  listings: number;
  status: "Active" | "Inactive";
}

export interface AdminNotification {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
  tone: "info" | "warning" | "success";
}

export interface PlatformSettings {
  siteName: string;
  supportEmail: string;
  currency: string;
  autoApproveListings: boolean;
  allowReviews: boolean;
  maintenanceMode: boolean;
  maxListingsPerOwner: number;
  minPrice: number;
  maxPrice: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  weeklyDigest: boolean;
}

export interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
}

export interface AdminData {
  users: AdminUser[];
  listings: AdminListing[];
  reports: Report[];
  reviews: AdminReview[];
  enquiries: Enquiry[];
  locations: LocationEntry[];
  activities: AdminActivity[];
  notifications: AdminNotification[];
  settings: PlatformSettings;
  adminProfile: AdminProfile;
}
