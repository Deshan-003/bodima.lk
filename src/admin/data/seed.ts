import { LISTINGS } from "../../data/listings";
import { DISTRICT_TOWNS } from "../../data/locations";
import type {
  AdminActivity,
  AdminData,
  AdminListing,
  AdminNotification,
  AdminReview,
  AdminUser,
  Enquiry,
  LocationEntry,
  ListingStatus,
  Report,
} from "./types";

const SEEKER_NAMES = [
  "Nimali Fernando",
  "Kasun Perera",
  "Ayesha Silva",
  "Tharindu Wickramasinghe",
  "Sanduni Jayawardena",
  "Dilan Mendis",
  "Hiruni Karunarathne",
  "Samantha Cooray",
  "Kavindi Ratnayake",
  "Ruwan Pathirana",
  "Chamila Weerasekera",
  "Anushka Liyanage",
  "Thilina Ranasinghe",
  "Sashika Maduranga",
  "Pubudu Galappaththi",
  "Yasoda Kapila",
  "Nuwan Dharmasena",
  "Ishara Wedasinghe",
  "Chaminda Bandara",
  "Rashmi Herath",
  "Janith Amarasekara",
  "Dinushi Piyasena",
  "Mahesh Seneviratne",
  "Nilanka Dissanayake",
  "Sampath Kumara",
  "Kanchana Wijesiri",
  "Asanka Molligoda",
];

const OWNER_NAMES = [
  "Kamal Perera",
  "Sunil Fernando",
  "Ranjith Silva",
  "Priya Weerasinghe",
  "Ananda Jayawardena",
  "Chandrika Silva",
  "Upali Karunaratne",
  "Malathi de Silva",
  "Sujeewa Ranawana",
  "Hemantha Wijesooriya",
  "Lakshmi Amara",
  "Nandana Wickramasinghe",
  "Dhammika Hettiarachchi",
  "Rohani Jayasinghe",
  "Sirisena Amarasinghe",
  "Geetha Kumari",
  "Tiwanka Rathnayake",
  "Arjun Mensah",
];

const JOIN_DATES = [
  "2026-01-12",
  "2026-02-03",
  "2026-02-21",
  "2026-03-09",
  "2026-03-28",
  "2026-04-15",
  "2026-05-02",
  "2026-05-19",
  "2026-06-07",
  "2026-06-24",
  "2026-07-11",
  "2026-07-29",
  "2026-08-16",
  "2026-09-04",
  "2026-09-22",
  "2026-10-10",
  "2026-10-27",
  "2026-11-14",
  "2026-11-21",
];

const LOCATIONS: [string, string][] = Object.entries(DISTRICT_TOWNS).flatMap(
  ([district, towns]) => towns.map((town) => [district, town] as [string, string]),
);

function emailFor(name: string): string {
  const clean = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .join(".");
  return `${clean}@example.com`;
}

function seedUsers(): AdminUser[] {
  const seekers: AdminUser[] = SEEKER_NAMES.filter((n) => n.trim()).map((name, i) => ({
    id: i + 1,
    name,
    email: emailFor(name),
    phone: `+94 7${(i % 8) + 1} ${String(100 + i * 7).slice(0, 3)} ${String(2000 + i * 13).slice(0, 4)}`,
    role: "seeker",
    status: i % 17 === 0 ? "Suspended" : i % 19 === 0 ? "Pending" : "Active",
    joined: JOIN_DATES[i % JOIN_DATES.length],
    district: LOCATIONS[i % LOCATIONS.length][0],
    town: LOCATIONS[i % LOCATIONS.length][1],
    listings: 0,
    saved: 1 + (i % 7),
    enquiries: 1 + (i % 6),
    lastActive: ["2026-11-23", "2026-11-22", "2026-11-20", "2026-11-18", "2026-11-15"][i % 5],
    verified: i % 5 !== 0,
  }));

  const owners: AdminUser[] = OWNER_NAMES.map((name, i) => ({
    id: 100 + i,
    name,
    email: emailFor(name),
    phone: `+94 7${(i % 8) + 2} ${String(210 + i * 5).slice(0, 3)} ${String(3100 + i * 11).slice(0, 4)}`,
    role: "owner",
    status: i % 9 === 0 ? "Suspended" : "Active",
    joined: JOIN_DATES[i % JOIN_DATES.length],
    district: LOCATIONS[(i + 3) % LOCATIONS.length][0],
    town: LOCATIONS[(i + 3) % LOCATIONS.length][1],
    listings: 1 + (i % 4),
    saved: 0,
    enquiries: 3 + (i % 9),
    lastActive: ["2026-11-24", "2026-11-21", "2026-11-19", "2026-11-16", "2026-11-12"][i % 5],
    verified: i % 4 !== 0,
  }));

  return [...owners, ...seekers];
}

const BASE_STATUSES: ListingStatus[] = [
  "Active", "Active", "Active", "Active", "Active", "Inactive",
  "Active", "Active", "Active", "Active", "Reported", "Active",
];

const EXTRA_LISTINGS: Array<Pick<AdminListing, "title" | "district" | "town" | "price" | "type" | "facilities" | "boardingType" | "occupancy" | "status">> = [
  { title: "Bright Room near University of Colombo", district: "Colombo", town: "Colombo 07", price: 15500, type: "Any", facilities: ["Wi-Fi", "Meals"], boardingType: "Room", occupancy: "1 person", status: "Pending" },
  { title: "Annex with Garden in Nugegoda", district: "Colombo", town: "Nugegoda", price: 17500, type: "Female", facilities: ["Wi-Fi", "AC", "Parking"], boardingType: "Annex", occupancy: "2 persons", status: "Pending" },
  { title: "Affordable Room in Peradeniya", district: "Kandy", town: "Peradeniya", price: 10500, type: "Male", facilities: ["Wi-Fi", "Meals"], boardingType: "Room", occupancy: "2 persons", status: "Pending" },
  { title: "Sea View Boarding in Unawatuna", district: "Galle", town: "Unawatuna", price: 21000, type: "Any", facilities: ["Wi-Fi", "AC", "Parking", "Meals"], boardingType: "House", occupancy: "2 persons", status: "Pending" },
  { title: "Modern Apartment in Wattala", district: "Gampaha", town: "Wattala", price: 18500, type: "Any", facilities: ["Wi-Fi", "AC", "Parking"], boardingType: "Apartment", occupancy: "1 person", status: "Pending" },
  { title: "Quiet Room in Panadura", district: "Kalutara", town: "Panadura", price: 9500, type: "Female", facilities: ["Wi-Fi", "Meals"], boardingType: "Room", occupancy: "1 person", status: "Pending" },
  { title: "Shared Room in Kurunegala", district: "Kurunegala", town: "Kurunegala", price: 8000, type: "Male", facilities: ["Meals"], boardingType: "Room", occupancy: "2 persons", status: "Pending" },
  { title: "Furnished Annex in Beruwala", district: "Kalutara", town: "Beruwala", price: 13000, type: "Any", facilities: ["Wi-Fi", "Parking"], boardingType: "Annex", occupancy: "2 persons", status: "Pending" },
  { title: "Luxury Room in Hikkaduwa", district: "Galle", town: "Hikkaduwa", price: 26000, type: "Any", facilities: ["Wi-Fi", "AC", "Parking", "Meals"], boardingType: "House", occupancy: "1 person", status: "Rejected" },
  { title: "Old Boarding in Matale", district: "Kandy", town: "Matale", price: 7000, type: "Any", facilities: ["Meals"], boardingType: "Room", occupancy: "3 persons", status: "Rejected" },
  { title: "Unverified Room in Dehiwala", district: "Colombo", town: "Dehiwala", price: 12000, type: "Any", facilities: ["Wi-Fi"], boardingType: "Room", occupancy: "1 person", status: "Reported" },
  { title: "Crowded Annex in Kelaniya", district: "Gampaha", town: "Kelaniya", price: 8500, type: "Male", facilities: [], boardingType: "Annex", occupancy: "4 persons", status: "Reported" },
  { title: "Temporary Room in Colombo 05", district: "Colombo", town: "Colombo 05", price: 11000, type: "Any", facilities: ["Wi-Fi"], boardingType: "Room", occupancy: "1 person", status: "Inactive" },
];

const LISTING_IMAGES = [
  "/assets/listing-colombo.jpg",
  "/assets/listing-wellawatte.jpg",
  "/assets/listing-kandy.jpg",
  "/assets/listing-gampaha.jpg",
  "/assets/listing-nugegoda.jpg",
  "/assets/listing-moratuwa.jpg",
];

function seedListings(): AdminListing[] {
  const base: AdminListing[] = LISTINGS.map((listing, i) => ({
    ...listing,
    ownerId: 100 + (i % 12),
    ownerName: OWNER_NAMES[i % 12],
    status: BASE_STATUSES[i],
    featured: i === 0 || i === 2 || i === 4,
    submitted: JOIN_DATES[(i + 4) % JOIN_DATES.length],
    views: 82 + i * 37,
    enquiries: 2 + (i % 7),
    reports: i === 10 ? 3 : 0,
  }));

  const extra: AdminListing[] = EXTRA_LISTINGS.map((item, i) => ({
    id: 100 + i,
    title: item.title,
    location: item.town,
    district: item.district,
    town: item.town,
    price: item.price,
    img: LISTING_IMAGES[i % LISTING_IMAGES.length],
    type: item.type,
    facilities: item.facilities,
    boardingType: item.boardingType,
    occupancy: item.occupancy,
    description: `A boarding place in ${item.town}, ${item.district}. Submitted to Bodima.lk for review by the property owner.`,
    ownerId: 100 + (i % 18),
    ownerName: OWNER_NAMES[i % 18],
    status: item.status,
    featured: false,
    submitted: ["2026-11-24", "2026-11-23", "2026-11-22", "2026-11-21", "2026-11-19", "2026-11-17", "2026-11-15", "2026-11-12", "2026-11-08", "2026-11-05", "2026-10-30", "2026-10-26", "2026-10-18"][i],
    views: item.status === "Pending" ? i * 3 : 40 + i * 12,
    enquiries: item.status === "Pending" ? 0 : 1 + (i % 4),
    reports: item.status === "Reported" ? 2 + (i % 3) : 0,
  }));

  return [...base, ...extra];
}

function seedReports(listings: AdminListing[], users: AdminUser[]): Report[] {
  type ReportStatusLike = Report["status"];
  const rows: Array<[Report["type"], number, string, string, ReportStatusLike, string]> = [
    ["listing", 11, "Misleading photos", "The photos do not match the actual room. Please review.", "Open", "2026-11-23"],
    ["listing", 112, "Incorrect location", "Listed in Dehiwala but the property is in Colombo 05.", "In Review", "2026-11-22"],
    ["listing", 111, "Unsanitary conditions", "Reported by two seekers after a viewing.", "Open", "2026-11-21"],
    ["user", 104, "Fake owner profile", "Owner is advertising properties they do not own.", "In Review", "2026-11-20"],
    ["user", 109, "Harassing messages", "Sent inappropriate messages to a seeker via chat.", "Open", "2026-11-19"],
    ["review", 3, "Abusive language", "Review contains personal attacks against the owner.", "Open", "2026-11-18"],
    ["listing", 9, "Price mismatch", "Advertised price is different from the price quoted on site.", "Resolved", "2026-11-16"],
    ["user", 17, "Spam account", "Duplicate account created to post repeated enquiries.", "Dismissed", "2026-11-14"],
    ["review", 7, "Fake review", "Review appears to be written by the property owner.", "Resolved", "2026-11-12"],
    ["listing", 6, "Already rented", "Property is no longer available but still listed.", "Open", "2026-11-11"],
    ["user", 115, "Suspicious payment request", "Asked a seeker to pay an advance outside the platform.", "In Review", "2026-11-09"],
    ["review", 11, "Offensive content", "Review includes offensive wording.", "Open", "2026-11-07"],
  ];

  return rows.map(([type, targetId, reason, details, status, created], i) => {
    const target =
      type === "listing"
        ? listings.find((l) => l.id === targetId)
        : type === "user"
          ? users.find((u) => u.id === targetId)
          : undefined;
    return {
      id: i + 1,
      type,
      targetId,
      targetTitle:
        type === "listing"
          ? (target as AdminListing | undefined)?.title ?? `Listing #${targetId}`
          : type === "user"
            ? (target as AdminUser | undefined)?.name ?? `User #${targetId}`
            : `Review #${targetId}`,
      reportedBy: users[(i + 5) % users.length].name,
      reason,
      details,
      created,
      status,
      notes: status === "Resolved" ? "Reviewed and action taken by the moderation team." : "",
    } satisfies Report;
  });
}

function seedReviews(listings: AdminListing[]): AdminReview[] {
  const texts = [
    "Clean and comfortable room, very friendly owner. Highly recommended!",
    "Great location close to public transport. Wi-Fi was reliable.",
    "The room was not as described and the photos were misleading.",
    "Affordable and peaceful. Perfect for students.",
    "Owner was responsive but maintenance could be better.",
    "Excellent facilities and a quiet neighbourhood.",
    "Good value for money, would stay again.",
    "Had issues with water supply during my stay.",
    "Very convenient for university students.",
    "Friendly family environment and safe area.",
    "The listing said meals included but they were not.",
    "Nice room with plenty of natural light.",
  ];
  const statuses: AdminReview["status"][] = [
    "Published", "Published", "Reported", "Published", "Published", "Pending",
    "Published", "Reported", "Published", "Published", "Reported", "Pending",
  ];
  return texts.map((text, i) => ({
    id: i + 1,
    listingId: listings[i % Math.min(listings.length, 16)].id,
    listingTitle: listings[i % Math.min(listings.length, 16)].title,
    author: SEEKER_NAMES.filter((n) => n.trim())[i % 27],
    rating: [5, 4, 2, 5, 3, 4, 5, 2, 4, 5, 1, 4][i],
    text,
    date: ["2026-11-22", "2026-11-20", "2026-11-18", "2026-11-15", "2026-11-12", "2026-11-10", "2026-11-08", "2026-11-05", "2026-11-02", "2026-10-28", "2026-10-24", "2026-10-19"][i],
    status: statuses[i],
    reports: statuses[i] === "Reported" ? 2 : 0,
  }));
}

function seedEnquiries(listings: AdminListing[], users: AdminUser[]): Enquiry[] {
  const seekers = users.filter((u) => u.role === "seeker");
  const previews = [
    "Is this room still available for next month?",
    "Do you have a separate entrance to the annex?",
    "Can I schedule a viewing this weekend?",
    "Are meals included in the monthly rent?",
    "Is parking available for a motorbike?",
    "What is the minimum lease period?",
    "Are utilities included in the price?",
    "Is the room suitable for a female student?",
  ];
  return Array.from({ length: 14 }, (_, i) => {
    const listing = listings[(i * 2) % Math.min(listings.length, 20)];
    const seeker = seekers[i % seekers.length];
    return {
      id: i + 1,
      listingId: listing.id,
      listingTitle: listing.title,
      seeker: seeker.name,
      owner: listing.ownerName,
      preview: previews[i % previews.length],
      date: ["2026-11-23", "2026-11-22", "2026-11-21", "2026-11-20", "2026-11-18", "2026-11-17", "2026-11-15", "2026-11-13", "2026-11-11", "2026-11-09", "2026-11-07", "2026-11-05", "2026-11-03", "2026-11-01"][i],
      unread: i % 3 !== 0,
      messages: [
        { from: "seeker", text: previews[i % previews.length], at: "09:15" },
        { from: "owner", text: "Hi! Thanks for reaching out. Yes, it is available — happy to arrange a viewing.", at: "10:02" },
      ],
    };
  });
}

function seedLocations(listings: AdminListing[]): LocationEntry[] {
  return LOCATIONS.map(([district, town], i) => ({
    id: i + 1,
    district,
    town,
    listings: listings.filter((l) => l.district === district && l.town === town).length,
    status: i === LOCATIONS.length - 1 || i === 14 ? "Inactive" : "Active",
  }));
}

const ACTIVITIES: AdminActivity[] = [
  { id: 1, type: "user", text: "New seeker Nimali Fernando registered", time: "12 min ago" },
  { id: 2, type: "listing", text: "New boarding submitted in Unawatuna", time: "38 min ago" },
  { id: 3, type: "report", text: "Listing #11 was reported by a seeker", time: "1 hour ago" },
  { id: 4, type: "message", text: "New enquiry on \"Comfortable Room in Wellawatte\"", time: "2 hours ago" },
  { id: 5, type: "review", text: "A 2-star review was posted in Kandy", time: "3 hours ago" },
  { id: 6, type: "listing", text: "Listing #5 was marked as featured", time: "5 hours ago" },
  { id: 7, type: "user", text: "Owner Sunil Fernando uploaded 2 new listings", time: "Yesterday" },
  { id: 8, type: "report", text: "Complaint against user #104 is in review", time: "Yesterday" },
  { id: 9, type: "user", text: " Owner account #109 was suspended", time: "Yesterday" },
  { id: 10, type: "system", text: "Weekly analytics report generated", time: "2 days ago" },
  { id: 11, type: "listing", text: "Listing #10 was approved", time: "2 days ago" },
  { id: 12, type: "review", text: "Reported review #6 is awaiting moderation", time: "3 days ago" },
];

const NOTIFICATIONS: AdminNotification[] = [
  { id: 1, title: "8 listings awaiting approval", body: "New boarding advertisements need your review.", time: "10 min ago", read: false, tone: "warning" },
  { id: 2, title: "4 open complaints", body: "Community reports are waiting for a decision.", time: "1 hour ago", read: false, tone: "warning" },
  { id: 3, title: "New owner registered", body: "Geetha Kumari joined Bodima.lk as an owner.", time: "3 hours ago", read: false, tone: "info" },
  { id: 4, title: "Review moderation needed", body: "3 reviews have been reported by users.", time: "5 hours ago", read: false, tone: "warning" },
  { id: 5, title: "Weekly report ready", body: "Registration and listing analytics are up to date.", time: "Yesterday", read: true, tone: "success" },
  { id: 6, title: "Listing approved", body: "Modern Room in Kandy is now live.", time: "2 days ago", read: true, tone: "success" },
  { id: 7, title: "Storage usage", body: "Photo storage usage is within normal limits.", time: "3 days ago", read: true, tone: "info" },
  { id: 8, title: "Password changed", body: "Your admin password was updated successfully.", time: "1 week ago", read: true, tone: "info" },
];

/** Fixed, deterministic demo dataset — never random, so tests and screenshots are stable. */
export function makeSeedData(): AdminData {
  const users = seedUsers();
  const listings = seedListings();
  return {
    users,
    listings,
    reports: seedReports(listings, users),
    reviews: seedReviews(listings),
    enquiries: seedEnquiries(listings, users),
    locations: seedLocations(listings),
    activities: ACTIVITIES,
    notifications: NOTIFICATIONS,
    settings: {
      siteName: "Bodima.lk",
      supportEmail: "support@bodima.lk",
      currency: "LKR (Rs.)",
      autoApproveListings: false,
      allowReviews: true,
      maintenanceMode: false,
      maxListingsPerOwner: 10,
      minPrice: 5000,
      maxPrice: 50000,
      emailNotifications: true,
      smsNotifications: false,
      weeklyDigest: true,
    },
    adminProfile: {
      name: "Bodima Administrator",
      email: "admin@bodima.lk",
      phone: "+94 11 234 5678",
      role: "Super Admin",
      location: "Colombo, Sri Lanka",
    },
  };
}
