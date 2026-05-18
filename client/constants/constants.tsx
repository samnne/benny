export const theme = {
    colors: {
        text: '#0e0104',
        background: '#fdedf0',
        primary: '#e61e3f',
        secondary: '#f1b883',
        accent: '#edcc5e',
        pill: '#f0f0f0',
        dark: {
            text: '#fef1f4',
            background: '#120205',
            primary: '#e1193a',
            secondary: '#7c430e',
            accent: '#a17f12',
            pill: '#050404',
        },
    },
};

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