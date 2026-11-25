export type BathroomType = "Attached" | "Common";

/** Key money is quoted as a number of months' rent plus the calculated rupee amount. */
export type KeyMoney = {
  months: number;
  amount: number;
};

export type Listing = {
  id: number;
  title: string;
  location: string;
  district: string;
  town: string;
  price: number;
  img: string;
  type: "Male" | "Female" | "Any";
  facilities: string[];
  badges?: string[];
  boardingType?: string;
  occupancy?: string;
  description?: string;
  gallery?: string[];
  bathroom?: BathroomType;
  keyMoney?: KeyMoney;
  /** Marks a freshly published owner post so seekers can spot it. */
  isNew?: boolean;
};

export const LISTINGS: Listing[] = [
  {
    id: 1,
    title: "Spacious Boarding in Colombo 07",
    location: "Colombo 07",
    district: "Colombo",
    town: "Colombo 07",
    price: 18000,
    img: "/assets/listing-colombo.jpg",
    type: "Any",
    facilities: ["Wi-Fi", "AC", "Parking", "Meals"],
    badges: ["Available", "Verified"],
    boardingType: "Annex",
    occupancy: "1 person",
    bathroom: "Attached",
    keyMoney: { months: 2, amount: 36000 },
    description:
      "A comfortable and well-maintained boarding space in the heart of Colombo 07. Conveniently located close to universities, colleges, and public transport. The room is fully furnished with essential amenities, making it ideal for students and young professionals looking for a hassle-free stay.",
    gallery: [
      "/assets/detail-main.jpg",
      "/assets/detail-thumb-1.jpg",
      "/assets/detail-thumb-2.jpg",
      "/assets/detail-thumb-3.jpg",
    ],
  },
  {
    id: 2,
    title: "Comfortable Room in Wellawatte",
    location: "Wellawatte",
    district: "Colombo",
    town: "Wellawatte",
    price: 15000,
    img: "/assets/listing-wellawatte.jpg",
    type: "Female",
    facilities: ["Wi-Fi", "AC"],
    boardingType: "Room",
    occupancy: "1 person",
    bathroom: "Common",
    keyMoney: { months: 1, amount: 15000 },
  },
  {
    id: 3,
    title: "Modern Boarding in Kandy",
    location: "Kandy",
    district: "Kandy",
    town: "Kandy",
    price: 20000,
    img: "/assets/listing-kandy.jpg",
    type: "Male",
    facilities: ["Wi-Fi", "Parking"],
    boardingType: "Annex",
    occupancy: "2 persons",
    bathroom: "Attached",
    keyMoney: { months: 3, amount: 60000 },
  },
  {
    id: 4,
    title: "Cozy Room in Gampaha",
    location: "Gampaha",
    district: "Gampaha",
    town: "Gampaha",
    price: 12000,
    img: "/assets/listing-gampaha.jpg",
    type: "Any",
    facilities: ["Wi-Fi", "Meals"],
    boardingType: "Room",
    occupancy: "1 person",
    bathroom: "Common",
    keyMoney: { months: 1, amount: 12000 },
  },
  {
    id: 5,
    title: "Spacious Boarding in Nugegoda",
    location: "Nugegoda",
    district: "Colombo",
    town: "Nugegoda",
    price: 17000,
    img: "/assets/listing-nugegoda.jpg",
    type: "Female",
    facilities: ["Wi-Fi", "AC", "Meals"],
    boardingType: "Annex",
    occupancy: "1 person",
    bathroom: "Attached",
    keyMoney: { months: 2, amount: 34000 },
  },
  {
    id: 6,
    title: "Student Friendly Room in Moratuwa",
    location: "Moratuwa",
    district: "Colombo",
    town: "Moratuwa",
    price: 14000,
    img: "/assets/listing-moratuwa.jpg",
    type: "Any",
    facilities: ["Parking", "Meals"],
    boardingType: "Room",
    occupancy: "2 persons",
    bathroom: "Common",
    keyMoney: { months: 1, amount: 14000 },
  },
  {
    id: 7,
    title: "Quiet Annex in Colombo 05",
    location: "Colombo 05",
    district: "Colombo",
    town: "Colombo 05",
    price: 16000,
    img: "/assets/listing-wellawatte.jpg",
    type: "Any",
    facilities: ["Wi-Fi", "AC"],
    boardingType: "Annex",
    occupancy: "1 person",
    bathroom: "Attached",
    keyMoney: { months: 2, amount: 32000 },
  },
  {
    id: 8,
    title: "Family Annex in Dehiwala",
    location: "Dehiwala",
    district: "Colombo",
    town: "Dehiwala",
    price: 13500,
    img: "/assets/listing-gampaha.jpg",
    type: "Any",
    facilities: ["Wi-Fi", "Parking", "Meals"],
    boardingType: "Annex",
    occupancy: "2 persons",
  },
  {
    id: 9,
    title: "Hill View Room in Kandy",
    location: "Kandy",
    district: "Kandy",
    town: "Kandy",
    price: 16500,
    img: "/assets/listing-kandy.jpg",
    type: "Female",
    facilities: ["Wi-Fi", "AC", "Meals"],
    badges: ["Available"],
    boardingType: "Room",
    occupancy: "1 person",
  },
  {
    id: 10,
    title: "Modern Annex in Negombo",
    location: "Negombo",
    district: "Gampaha",
    town: "Negombo",
    price: 19000,
    img: "/assets/listing-nugegoda.jpg",
    type: "Any",
    facilities: ["Wi-Fi", "AC", "Parking"],
    boardingType: "Annex",
    occupancy: "2 persons",
  },
  {
    id: 11,
    title: "Shared Room in Kelaniya",
    location: "Kelaniya",
    district: "Gampaha",
    town: "Kelaniya",
    price: 9000,
    img: "/assets/listing-moratuwa.jpg",
    type: "Male",
    facilities: ["Wi-Fi", "Meals"],
    boardingType: "Room",
    occupancy: "2 persons",
  },
  {
    id: 12,
    title: "Budget Friendly Room in Homagama",
    location: "Homagama",
    district: "Colombo",
    town: "Homagama",
    price: 11000,
    img: "/assets/listing-colombo.jpg",
    type: "Any",
    facilities: ["Parking"],
    boardingType: "Room",
    occupancy: "1 person",
  },
];
