import { DashboardData } from "./sampleData";

// Extended data for 50 branches
const branchNames = [
  "01-Jeddah INT Market", "02-Riyadh Central", "03-Dammam Plaza", "04-Mecca Grand", "05-Medina Center",
  "06-Taif Mall", "07-Khobar Corniche", "08-Abha Heights", "09-Tabuk North", "10-Hail Square",
  "11-Najran South", "12-Jizan Port", "13-Arar Border", "14-Sakaka Plaza", "15-Bisha Center",
  "16-Riyadh North", "17-Riyadh East", "18-Riyadh West", "19-Jeddah South", "20-Jeddah North",
  "21-Dammam North", "22-Dammam South", "23-Khobar Mall", "24-Dhahran Tech", "25-Qatif Coast",
  "26-Jubail Industrial", "27-Yanbu Port", "28-Rabigh Beach", "29-Madinah Mall", "30-Mecca Center",
  "31-Taif Souk", "32-Abha Mall", "33-Khamis Mushait", "34-Najran Mall", "35-Jazan Center",
  "36-Tabuk Mall", "37-Hail Center", "38-Arar Plaza", "39-Sakaka Mall", "40-Bisha Plaza",
  "41-Al-Ahsa Oasis", "42-Hafr Al-Batin", "43-Dawadmi Center", "44-Afif Mall", "45-Zulfi Plaza",
  "46-Majmaah Center", "47-Qassim Mall", "48-Unaizah Plaza", "49-Buraidah Center", "50-Rass Market"
];

const managers = [
  "Ahmed Al-Rashid", "Sarah Al-Mutawa", "Mohammed Al-Zahrani", "Fatima Al-Ahmad", "Omar Al-Khalil",
  "Nora Al-Salem", "Ali Al-Mansour", "Layla Al-Otaibi", "Hassan Al-Ghamdi", "Maryam Al-Dosari",
  "Abdullah Al-Harbi", "Khadija Al-Malki", "Khalid Al-Subai", "Aisha Al-Qahtani", "Youssef Al-Shehri",
  "Hanan Al-Thuwaini", "Faisal Al-Enezi", "Nouf Al-Baqami", "Saad Al-Juhani", "Reem Al-Khaldi"
];

// Generate data for 50 branches with realistic variations
const generateExtendedData = (): DashboardData => {
  const dailyTargets = [];
  const sales = [];
  const areas = [];
  const monthlyTargets = [];
  const yearlyTargets = [];

  // Base multipliers for different regions
  const regionMultipliers = {
    'Riyadh': 1.3,
    'Jeddah': 1.2,
    'Dammam': 1.0,
    'Mecca': 1.1,
    'Medina': 1.0,
    'Other': 0.8
  };

  branchNames.forEach((branch, index) => {
    // Determine region
    let region = 'Other';
    if (branch.includes('Riyadh')) region = 'Riyadh';
    else if (branch.includes('Jeddah')) region = 'Jeddah';
    else if (branch.includes('Dammam') || branch.includes('Khobar') || branch.includes('Dhahran')) region = 'Dammam';
    else if (branch.includes('Mecca')) region = 'Mecca';
    else if (branch.includes('Medina')) region = 'Medina';

    const multiplier = regionMultipliers[region];
    const manager = managers[index % managers.length];

    // Generate area data
    areas.push({
      "Outlet Name": branch,
      "Area Manager": manager
    });

    // Base targets and sales (with realistic variations)
    const baseDaily = 500000 + (index * 20000) + Math.random() * 200000;
    const baseMonthly = baseDaily * 30;
    const baseYearly = baseMonthly * 12;

    // Generate yearly targets
    yearlyTargets.push({
      "Outlet Name": branch,
      "Target Amount": Math.round(baseYearly * multiplier)
    });

    // Generate monthly targets for July 2025
    monthlyTargets.push({
      "Outlet Name": branch,
      "DATE": "2025-07-01",
      "Target Amount": Math.round(baseMonthly * multiplier),
      "Year": 2025,
      "Month": 7
    });

    // Generate daily data for first 10 days of July (2024 and 2025)
    for (let day = 1; day <= 10; day++) {
      const dateStr2024 = `2024-07-${day.toString().padStart(2, '0')}`;
      const dateStr2025 = `2025-07-${day.toString().padStart(2, '0')}`;

      // Daily targets
      const dailyTarget = Math.round((baseDaily + (day * 10000)) * multiplier);
      dailyTargets.push({
        "Outlet Name": branch,
        "DATE": dateStr2025,
        "Target": dailyTarget
      });

      // 2024 Sales (lower performance)
      const sales2024 = Math.round(dailyTarget * (0.7 + Math.random() * 0.3) * 0.9);
      const visitors2024 = Math.round(2000 + Math.random() * 3000);
      const invoices2024 = Math.round(visitors2024 * (0.05 + Math.random() * 0.1));

      sales.push({
        "Outlet Name": branch,
        "DATE": dateStr2024,
        "Sales Amount": sales2024,
        "Visitors": visitors2024,
        "Invoices": invoices2024,
        "Year": 2024,
        "Month": 7,
        "Day": day
      });

      // 2025 Sales (improved performance)
      const sales2025 = Math.round(dailyTarget * (0.8 + Math.random() * 0.4));
      const visitors2025 = Math.round(2500 + Math.random() * 3500);
      const invoices2025 = Math.round(visitors2025 * (0.06 + Math.random() * 0.12));

      sales.push({
        "Outlet Name": branch,
        "DATE": dateStr2025,
        "Sales Amount": sales2025,
        "Visitors": visitors2025,
        "Invoices": invoices2025,
        "Year": 2025,
        "Month": 7,
        "Day": day
      });
    }
  });

  return {
    "daily target": dailyTargets,
    "sales": sales,
    "areas": areas,
    "monthly target": monthlyTargets,
    "yearly target": yearlyTargets
  };
};

export const extendedSampleData = generateExtendedData();

// Categories for analysis
export const categories = [
  { name: "Grocery", percentage: 35, amount: 2500000, color: "hsl(var(--chart-primary))" },
  { name: "Fruits & Vegetables", percentage: 20, amount: 1400000, color: "hsl(var(--chart-secondary))" },
  { name: "Gifts & Toys", percentage: 15, amount: 1050000, color: "hsl(var(--chart-tertiary))" },
  { name: "Art & Decorations", percentage: 12, amount: 840000, color: "hsl(var(--chart-quaternary))" },
  { name: "Cosmetics", percentage: 10, amount: 700000, color: "hsl(var(--accent))" },
  { name: "Electronics", percentage: 8, amount: 560000, color: "hsl(var(--warning))" }
];

// Customer satisfaction data
export const customerSatisfaction = {
  overall: 87,
  categories: [
    { name: "Service", rating: 4.2, percentage: 85 },
    { name: "Cleanliness and Hygiene", rating: 4.5, percentage: 92 },
    { name: "Freshness and Quality", rating: 4.1, percentage: 83 },
    { name: "Affordable", rating: 3.8, percentage: 78 },
    { name: "Availability and Accessibility", rating: 4.0, percentage: 81 }
  ]
};

// Regional performance data
export const regionalData = [
  { region: "Riyadh", branches: 5, sales: 45000000, target: 50000000, achievement: 90 },
  { region: "Jeddah", branches: 4, sales: 38000000, target: 42000000, achievement: 90.5 },
  { region: "Eastern Province", branches: 8, sales: 52000000, target: 55000000, achievement: 94.5 },
  { region: "Mecca", branches: 3, sales: 28000000, target: 30000000, achievement: 93.3 },
  { region: "Medina", branches: 2, sales: 18000000, target: 20000000, achievement: 90 },
  { region: "Other Regions", branches: 28, sales: 95000000, target: 110000000, achievement: 86.4 }
];