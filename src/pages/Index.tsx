import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Filter, Download } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { GaugeChart } from "@/components/dashboard/GaugeChart";
import { OutletFilter } from "@/components/dashboard/OutletFilter";
import { BranchDistribution } from "@/components/dashboard/BranchDistribution";
import { YearOverYearComparison } from "@/components/dashboard/YearOverYearComparison";
import { sampleData } from "@/data/sampleData";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<string | undefined>();
  const [selectedManager, setSelectedManager] = useState<string | undefined>();

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Calculate KPIs
  const kpis = useMemo(() => {
    const currentYear = 2025;
    const previousYear = 2024;
    
    // Filter data based on selected outlet
    const salesData = selectedOutlet 
      ? sampleData.sales.filter(sale => sale["Outlet Name"] === selectedOutlet)
      : sampleData.sales;
    
    const dailyTargets = selectedOutlet
      ? sampleData["daily target"].filter(target => target["Outlet Name"] === selectedOutlet)
      : sampleData["daily target"];
    
    const monthlyTargets = selectedOutlet
      ? sampleData["monthly target"].filter(target => target["Outlet Name"] === selectedOutlet)
      : sampleData["monthly target"];
    
    const yearlyTargets = selectedOutlet
      ? sampleData["yearly target"].filter(target => target["Outlet Name"] === selectedOutlet)
      : sampleData["yearly target"];

    // Current year sales
    const currentYearSales = salesData
      .filter(sale => sale.Year === currentYear)
      .reduce((sum, sale) => sum + sale["Sales Amount"], 0);
    
    // Previous year sales  
    const previousYearSales = salesData
      .filter(sale => sale.Year === previousYear)
      .reduce((sum, sale) => sum + sale["Sales Amount"], 0);
    
    // Growth calculation
    const growthPercentage = previousYearSales > 0 
      ? ((currentYearSales - previousYearSales) / previousYearSales) * 100 
      : 0;
    
    // Visitors
    const totalVisitors = salesData
      .filter(sale => sale.Year === currentYear)
      .reduce((sum, sale) => sum + sale.Visitors, 0);
    
    // Invoices
    const totalInvoices = salesData
      .filter(sale => sale.Year === currentYear)
      .reduce((sum, sale) => sum + sale.Invoices, 0);
    
    // Daily target achievement
    const totalDailyTarget = dailyTargets.reduce((sum, target) => sum + target.Target, 0);
    const dailyAchievement = totalDailyTarget > 0 ? (currentYearSales / totalDailyTarget) * 100 : 0;
    
    // Monthly target achievement
    const totalMonthlyTarget = monthlyTargets.reduce((sum, target) => sum + target["Target Amount"], 0);
    const monthlyAchievement = totalMonthlyTarget > 0 ? (currentYearSales / totalMonthlyTarget) * 100 : 0;
    
    // Yearly target achievement
    const totalYearlyTarget = yearlyTargets.reduce((sum, target) => sum + target["Target Amount"], 0);
    const yearlyAchievement = totalYearlyTarget > 0 ? (currentYearSales / totalYearlyTarget) * 100 : 0;
    
    // Additional KPIs
    const avgInvoiceValue = totalInvoices > 0 ? currentYearSales / totalInvoices : 0;
    const conversionRate = totalVisitors > 0 ? (totalInvoices / totalVisitors) * 100 : 0;
    const avgVisitorsPerInvoice = totalInvoices > 0 ? totalVisitors / totalInvoices : 0;

    return {
      currentYearSales,
      previousYearSales,
      growthPercentage,
      totalVisitors,
      totalInvoices,
      avgInvoiceValue,
      conversionRate,
      avgVisitorsPerInvoice,
      dailyAchievement,
      monthlyAchievement,
      yearlyAchievement,
      totalDailyTarget,
      totalMonthlyTarget,
      totalYearlyTarget
    };
  }, [selectedOutlet]);

  return (
    <div className="min-h-screen bg-dashboard-bg transition-all duration-300">
      {/* Header */}
      <div className="border-b border-dashboard-border bg-dashboard-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sales Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive sales performance and target tracking
              </p>
            </div>
            <div className="flex items-center gap-4">
              <OutletFilter
                areas={sampleData.areas}
                selectedOutlet={selectedOutlet}
                onOutletChange={setSelectedOutlet}
                selectedManager={selectedManager}
                onManagerChange={setSelectedManager}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="border-dashboard-border"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-dashboard-border"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        {/* KPI Cards Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <KPICard
            title="Total Sales (2025)"
            value={kpis.currentYearSales}
            format="currency"
            change={kpis.growthPercentage}
            changeType={kpis.growthPercentage > 0 ? 'increase' : 'decrease'}
          />
          <KPICard
            title="Total Visitors"
            value={kpis.totalVisitors}
            format="number"
            subtitle="Current year"
          />
          <KPICard
            title="Total Invoices"
            value={kpis.totalInvoices}
            format="number"
            subtitle="Current year"
          />
          <KPICard
            title="Avg Invoice Value"
            value={kpis.avgInvoiceValue}
            format="currency"
            subtitle="Per transaction"
          />
        </div>

        {/* KPI Cards Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <KPICard
            title="Conversion Rate"
            value={kpis.conversionRate}
            format="percentage"
            subtitle="Invoices / Visitors"
          />
          <KPICard
            title="Visitors per Invoice"
            value={kpis.avgVisitorsPerInvoice}
            format="number"
            subtitle="Average ratio"
          />
          <KPICard
            title="YoY Growth"
            value={`${kpis.growthPercentage > 0 ? '+' : ''}${kpis.growthPercentage.toFixed(1)}%`}
            change={kpis.growthPercentage}
            changeType={kpis.growthPercentage > 0 ? 'increase' : 'decrease'}
            subtitle="2025 vs 2024"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <SalesChart
            salesData={sampleData.sales}
            targetData={sampleData["daily target"]}
            selectedOutlet={selectedOutlet}
          />
          <YearOverYearComparison salesData={sampleData.sales} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <GaugeChart
            title="Daily Target Achievement"
            percentage={kpis.dailyAchievement}
            value={kpis.currentYearSales}
            target={kpis.totalDailyTarget}
          />
          <GaugeChart
            title="Monthly Target Achievement"
            percentage={kpis.monthlyAchievement}
            value={kpis.currentYearSales}
            target={kpis.totalMonthlyTarget}
          />
          <GaugeChart
            title="Yearly Target Achievement"
            percentage={kpis.yearlyAchievement}
            value={kpis.currentYearSales}
            target={kpis.totalYearlyTarget}
          />
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BranchDistribution salesData={sampleData.sales} year={2025} />
          <BranchDistribution salesData={sampleData.sales} year={2024} />
        </div>
      </div>
    </div>
  );
};

export default Index;
