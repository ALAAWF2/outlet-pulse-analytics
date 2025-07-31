import { useMemo } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { GaugeChart } from "@/components/dashboard/GaugeChart";
import { BranchDistribution } from "@/components/dashboard/BranchDistribution";
import { CustomerSatisfaction } from "@/components/dashboard/CustomerSatisfaction";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { extendedSampleData, categories, customerSatisfaction, regionalData } from "@/data/extendedSampleData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Building2, Users, Target } from "lucide-react";

const Dashboard = () => {
  // Calculate overall KPIs for all 50 branches
  const kpis = useMemo(() => {
    const currentYear = 2025;
    const previousYear = 2024;
    
    // Current year sales
    const currentYearSales = extendedSampleData.sales
      .filter(sale => sale.Year === currentYear)
      .reduce((sum, sale) => sum + sale["Sales Amount"], 0);
    
    // Previous year sales  
    const previousYearSales = extendedSampleData.sales
      .filter(sale => sale.Year === previousYear)
      .reduce((sum, sale) => sum + sale["Sales Amount"], 0);
    
    // Growth calculation
    const growthPercentage = previousYearSales > 0 
      ? ((currentYearSales - previousYearSales) / previousYearSales) * 100 
      : 0;
    
    // Visitors and invoices
    const totalVisitors = extendedSampleData.sales
      .filter(sale => sale.Year === currentYear)
      .reduce((sum, sale) => sum + sale.Visitors, 0);
    
    const totalInvoices = extendedSampleData.sales
      .filter(sale => sale.Year === currentYear)
      .reduce((sum, sale) => sum + sale.Invoices, 0);
    
    // Target achievements
    const totalDailyTarget = extendedSampleData["daily target"]
      .reduce((sum, target) => sum + target.Target, 0);
    
    const totalMonthlyTarget = extendedSampleData["monthly target"]
      .reduce((sum, target) => sum + target["Target Amount"], 0);
    
    const totalYearlyTarget = extendedSampleData["yearly target"]
      .reduce((sum, target) => sum + target["Target Amount"], 0);
    
    const dailyAchievement = totalDailyTarget > 0 ? (currentYearSales / totalDailyTarget) * 100 : 0;
    const monthlyAchievement = totalMonthlyTarget > 0 ? (currentYearSales / totalMonthlyTarget) * 100 : 0;
    const yearlyAchievement = totalYearlyTarget > 0 ? (currentYearSales / totalYearlyTarget) * 100 : 0;
    
    // Additional metrics
    const avgInvoiceValue = totalInvoices > 0 ? currentYearSales / totalInvoices : 0;
    const conversionRate = totalVisitors > 0 ? (totalInvoices / totalVisitors) * 100 : 0;
    const totalBranches = extendedSampleData.areas.length;
    const avgSalesPerBranch = totalBranches > 0 ? currentYearSales / totalBranches : 0;

    return {
      currentYearSales,
      previousYearSales,
      growthPercentage,
      totalVisitors,
      totalInvoices,
      avgInvoiceValue,
      conversionRate,
      totalBranches,
      avgSalesPerBranch,
      dailyAchievement,
      monthlyAchievement,
      yearlyAchievement,
      totalDailyTarget,
      totalMonthlyTarget,
      totalYearlyTarget
    };
  }, []);

  return (
    <DashboardLayout 
      title="Dashboard Overview" 
      subtitle="Complete sales performance summary across all 50 branches"
    >
      {/* Top KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Sales (2025)"
          value={kpis.currentYearSales}
          format="currency"
          change={kpis.growthPercentage}
          changeType={kpis.growthPercentage > 0 ? 'increase' : 'decrease'}
        />
        <KPICard
          title="Total Branches"
          value={kpis.totalBranches}
          format="number"
          subtitle="Active outlets"
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
      </div>

      {/* Second KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Avg Sales per Branch"
          value={kpis.avgSalesPerBranch}
          format="currency"
          subtitle="Monthly average"
        />
        <KPICard
          title="Avg Invoice Value"
          value={kpis.avgInvoiceValue}
          format="currency"
          subtitle="Per transaction"
        />
        <KPICard
          title="Conversion Rate"
          value={kpis.conversionRate}
          format="percentage"
          subtitle="Invoices / Visitors"
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          <SalesChart
            salesData={extendedSampleData.sales}
            targetData={extendedSampleData["daily target"]}
          />
        </div>
        <CustomerSatisfaction data={customerSatisfaction} />
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

      {/* Regional Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Regional Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionalData.map((region, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{region.region}</div>
                    <div className="text-sm text-muted-foreground">{region.branches} branches</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">
                      {region.achievement.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Achievement
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'SAR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(region.sales)}
                    </div>
                    <div className="text-xs text-muted-foreground">Sales</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <CategoryBreakdown categories={categories} />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BranchDistribution salesData={extendedSampleData.sales} year={2025} />
        <BranchDistribution salesData={extendedSampleData.sales} year={2024} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;