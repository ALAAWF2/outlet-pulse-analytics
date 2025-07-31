export interface DailyTarget {
  "Outlet Name": string;
  DATE: string;
  Target: number;
}

export interface Sales {
  "Outlet Name": string;
  DATE: string;
  "Sales Amount": number;
  Visitors: number;
  Invoices: number;
  Year: number;
  Month: number;
  Day: number;
}

export interface Area {
  "Outlet Name": string;
  "Area Manager": string;
}

export interface MonthlyTarget {
  "Outlet Name": string;
  DATE: string;
  "Target Amount": number;
  Year: number;
  Month: number;
}

export interface YearlyTarget {
  "Outlet Name": string;
  "Target Amount": number;
}

export interface DashboardData {
  "daily target": DailyTarget[];
  "sales": Sales[];
  "areas": Area[];
  "monthly target": MonthlyTarget[];
  "yearly target": YearlyTarget[];
}

// Sample data for demonstration
export const sampleData: DashboardData = {
  "daily target": [
    { "Outlet Name": "01-Jeddah INT Market", "DATE": "2025-07-01", "Target": 1000000 },
    { "Outlet Name": "01-Jeddah INT Market", "DATE": "2025-07-02", "Target": 1200000 },
    { "Outlet Name": "02-Riyadh Central", "DATE": "2025-07-01", "Target": 800000 },
    { "Outlet Name": "02-Riyadh Central", "DATE": "2025-07-02", "Target": 950000 },
    { "Outlet Name": "03-Dammam Plaza", "DATE": "2025-07-01", "Target": 600000 },
    { "Outlet Name": "03-Dammam Plaza", "DATE": "2025-07-02", "Target": 700000 },
  ],
  "sales": [
    { "Outlet Name": "01-Jeddah INT Market", "DATE": "2025-07-01", "Sales Amount": 900000, "Visitors": 5000, "Invoices": 250, "Year": 2025, "Month": 7, "Day": 1 },
    { "Outlet Name": "01-Jeddah INT Market", "DATE": "2025-07-02", "Sales Amount": 1100000, "Visitors": 5200, "Invoices": 280, "Year": 2025, "Month": 7, "Day": 2 },
    { "Outlet Name": "01-Jeddah INT Market", "DATE": "2024-07-01", "Sales Amount": 750000, "Visitors": 4800, "Invoices": 220, "Year": 2024, "Month": 7, "Day": 1 },
    { "Outlet Name": "01-Jeddah INT Market", "DATE": "2024-07-02", "Sales Amount": 820000, "Visitors": 4900, "Invoices": 245, "Year": 2024, "Month": 7, "Day": 2 },
    { "Outlet Name": "02-Riyadh Central", "DATE": "2025-07-01", "Sales Amount": 720000, "Visitors": 4200, "Invoices": 190, "Year": 2025, "Month": 7, "Day": 1 },
    { "Outlet Name": "02-Riyadh Central", "DATE": "2025-07-02", "Sales Amount": 890000, "Visitors": 4400, "Invoices": 210, "Year": 2025, "Month": 7, "Day": 2 },
    { "Outlet Name": "02-Riyadh Central", "DATE": "2024-07-01", "Sales Amount": 650000, "Visitors": 3900, "Invoices": 175, "Year": 2024, "Month": 7, "Day": 1 },
    { "Outlet Name": "02-Riyadh Central", "DATE": "2024-07-02", "Sales Amount": 710000, "Visitors": 4100, "Invoices": 195, "Year": 2024, "Month": 7, "Day": 2 },
    { "Outlet Name": "03-Dammam Plaza", "DATE": "2025-07-01", "Sales Amount": 580000, "Visitors": 3200, "Invoices": 160, "Year": 2025, "Month": 7, "Day": 1 },
    { "Outlet Name": "03-Dammam Plaza", "DATE": "2025-07-02", "Sales Amount": 680000, "Visitors": 3400, "Invoices": 180, "Year": 2025, "Month": 7, "Day": 2 },
    { "Outlet Name": "03-Dammam Plaza", "DATE": "2024-07-01", "Sales Amount": 520000, "Visitors": 3000, "Invoices": 145, "Year": 2024, "Month": 7, "Day": 1 },
    { "Outlet Name": "03-Dammam Plaza", "DATE": "2024-07-02", "Sales Amount": 590000, "Visitors": 3100, "Invoices": 165, "Year": 2024, "Month": 7, "Day": 2 },
  ],
  "areas": [
    { "Outlet Name": "01-Jeddah INT Market", "Area Manager": "Ahmed Al-Rashid" },
    { "Outlet Name": "02-Riyadh Central", "Area Manager": "Sarah Al-Mutawa" },
    { "Outlet Name": "03-Dammam Plaza", "Area Manager": "Mohammed Al-Zahrani" },
  ],
  "monthly target": [
    { "Outlet Name": "01-Jeddah INT Market", "DATE": "2025-07-01", "Target Amount": 30000000, "Year": 2025, "Month": 7 },
    { "Outlet Name": "02-Riyadh Central", "DATE": "2025-07-01", "Target Amount": 25000000, "Year": 2025, "Month": 7 },
    { "Outlet Name": "03-Dammam Plaza", "DATE": "2025-07-01", "Target Amount": 18000000, "Year": 2025, "Month": 7 },
  ],
  "yearly target": [
    { "Outlet Name": "01-Jeddah INT Market", "Target Amount": 360000000 },
    { "Outlet Name": "02-Riyadh Central", "Target Amount": 300000000 },
    { "Outlet Name": "03-Dammam Plaza", "Target Amount": 216000000 },
  ]
};