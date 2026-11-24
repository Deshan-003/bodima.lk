/** Towns grouped by district for the cascading Browse filters */
export const DISTRICT_TOWNS: Record<string, string[]> = {
  Colombo: [
    "Colombo 07",
    "Colombo 05",
    "Wellawatte",
    "Nugegoda",
    "Dehiwala",
    "Moratuwa",
    "Homagama",
  ],
  Gampaha: ["Gampaha", "Kelaniya", "Negombo", "Wattala"],
  Kandy: ["Kandy", "Peradeniya", "Matale"],
  Galle: ["Galle", "Unawatuna", "Hikkaduwa"],
  Kalutara: ["Kalutara", "Panadura", "Beruwala"],
  Kurunegala: ["Kurunegala", "Kuliyapitiya"],
};

export const DISTRICTS = [
  "All Districts",
  ...Object.keys(DISTRICT_TOWNS),
];

export const ALL_TOWNS = Array.from(
  new Set(Object.values(DISTRICT_TOWNS).flat()),
).sort();

/** Towns available for the currently selected district */
export function townsFor(district: string): string[] {
  if (district === "All Districts") return ALL_TOWNS;
  return DISTRICT_TOWNS[district] ?? [];
}
