export const theme = {
  colors: {
    text: "#0e0104",
    background: "#fdedf0",
    primary: "#e61e3f",
    secondary: "#f1b883",
    accent: "#edcc5e",
    pill: "#f0f0f0",
    dark: {
      text: "#fef1f4",
      background: "#120205",
      primary: "#e1193a",
      secondary: "#7c430e",
      accent: "#a17f12",
      pill: "#050404",
    },
  },
};

export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const categories = [
  {
    id: 1,
    name: "Auto & Transport",
    icon: "car.fill",
    budget: 700,
    spent: 514,
    subCategories: [
      { name: "Fuel", budget: 250, spent: 180 },
      { name: "Auto Insurance", budget: 250, spent: 250 },
      { name: "Maintenance", budget: 200, spent: 84 },
    ],
  },
  {
    id: 2,
    name: "Food & Grocery",
    icon: "cart.fill",
    budget: 600,
    spent: 420,
    subCategories: [
      { name: "Groceries", budget: 350, spent: 280 },
      { name: "Dining Out", budget: 150, spent: 100 },
      { name: "Coffee & Snacks", budget: 100, spent: 40 },
    ],
  },
  {
    id: 3,
    name: "Health & Fitness",
    icon: "heart.fill",
    budget: 300,
    spent: 190,
    subCategories: [
      { name: "Gym Membership", budget: 100, spent: 100 },
      { name: "Pharmacy", budget: 100, spent: 55 },
      { name: "Supplements", budget: 100, spent: 35 },
    ],
  },
  {
    id: 4,
    name: "Home & Utilities",
    icon: "house.fill",
    budget: 800,
    spent: 650,
    subCategories: [
      { name: "Rent", budget: 500, spent: 500 },
      { name: "Electricity", budget: 150, spent: 100 },
      { name: "Internet", budget: 150, spent: 50 },
    ],
  },
  {
    id: 5,
    name: "Entertainment",
    icon: "sparkles.tv.fill",
    budget: 200,
    spent: 95,
    subCategories: [
      { name: "Streaming", budget: 50, spent: 50 },
      { name: "Games", budget: 75, spent: 30 },
      { name: "Events", budget: 75, spent: 15 },
    ],
  },
  {
    id: 44,
    name: "Add A Category",
    icon: "plus",
    budget: 0,
    spent: 0,
    subCategories: [],
  },
];

// Define a strict union type for Benny's app phases
export type BennyPhase = "standard" | "predictor";

// The mapped type ensuring both pools are completely filled
const BENNY_MESSAGES: Record<BennyPhase, string[]> = {
  standard: [
    "Got it down in the hutch! Tracking manually builds the best financial habits.",
    "Sniffed and stored! Your future self is going to thank you for logging this.",
    "Boom! Added to the burrow. Every little bit tracked helps us see the big picture.",
    "Tucked away safely! Look at you keeping the ledger crystal clear.",
    "Logged! Benny approves of this meticulous bookkeeping.",
    "Every logged carrot counts! We're building a massive stash for later.",
    "Sweet! That's going right into our winter store. Keep up the great pace.",
    "Logged! We’re keeping those expenses on a short leash today.",
    "Nice move! Keeping a close eye on the flow keeps our field green.",
    "Added! Your wallet is looking more resilient by the minute.",
  ],
  predictor: [
    "Added! My ears are perking up. I'm already using this to map out next week's current.",
    "Perfect. The more clues you give me, the better I can scout the trail downstream!",
    "Got it! I'm adding this price point to my radar for our next store run.",
    "Stored! I’m crunching the numbers to see how this shifts our upcoming paycheck cadence.",
    "Logged! This data is pure gold for predicting what's around the bend.",
    "Excellent! This price point helps me map out your exact grocery path next month.",
    "Into the brain bank! Every line item makes my future predictions just a bit sharper.",
    "Tracked. I'm keeping this receipt pattern in mind for when your next paycheck drops.",
    "Got it! Adding this slice of data so I can warn you about future price trends.",
    "Perfect fit. This helps me build the ultimate financial map for your upcoming weeks.",
  ],
};

/**
 * Gets a random companion message from Benny based on the app's current context phase.
 * @param phase - 'standard' for regular tracking, 'predictor' for prediction-focused updates.
 * @returns A friendly string message from Benny.
 */
export function getBennyMessage(phase: BennyPhase = "standard"): string {
  const pool = BENNY_MESSAGES[phase];
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}



export const CATEGORY_ICONS: Record<string, string> = {
  groceries: "cart.fill",
  dining: "fork.knife",
  transport: "car.fill",
  entertainment: "film.fill",
  health: "heart.fill",
  shopping: "bag.fill",
  utilities: "bolt.fill",
  other: "square.grid.2x2.fill",
};