import { useQuery } from '@tanstack/react-query';
import type { DashboardData } from '@/types/data';

const fetchData = async (): Promise<DashboardData> => {
  const res = await fetch('/data.json');
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
};

export const useData = () =>
  useQuery({ queryKey: ['dashboard-data'], queryFn: fetchData });
