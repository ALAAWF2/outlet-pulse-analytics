export interface DailyTarget {
  "Outlet Name": string;
  DATE: string;
  DAY: number;
  target: number;
}

export interface Sale {
  "Outlet Name": string;
  DATE: string;
  "Bill Amount": number;
  "No Of Bills": number;
  YEAR: number;
  MONTH: number;
  DAY: number;
  visitors: number;
  "visitors rate": number;
  "bill rate": number;
  "sales rate": number;
  icons: number;
}

export interface Area {
  "Outlet Name": string;
  "area manager": string;
  type: string;
}

export interface MonthlyTarget {
  "Outlet Name": string;
  DATE: string;
  "Target Amount": number;
  YEAR: number;
  MONTH: number;
}

export interface YearlyTarget {
  "Outlet Name": string;
  "Target Amount": number;
  YEAR: number;
}

export interface DashboardData {
  "daily target": DailyTarget[];
  sales: Sale[];
  areas: Area[];
  "monthly target": MonthlyTarget[];
  "yearly target": YearlyTarget[];
}
