import { useState, useMemo } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { useData } from "@/hooks/useData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building2, Search, TrendingUp, MapPin, Users, Target } from "lucide-react";

const Branches = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedManager, setSelectedManager] = useState<string>('all');
  const { data } = useData();

  // Get unique managers and regions
  const getRegion = (name: string) => {
    if (name.includes('Riyadh')) return 'Riyadh';
    if (name.includes('Jeddah')) return 'Jeddah';
    if (name.includes('Dammam') || name.includes('Khobar') || name.includes('Dhahran')) return 'Eastern Province';
    if (name.includes('Mecca')) return 'Mecca';
    if (name.includes('Medina')) return 'Medina';
    return 'Other Regions';
  };

  const uniqueManagers = useMemo(() =>
    data ? Array.from(new Set(data.areas.map(area => area["area manager"]))) : []
  , [data]);

  const uniqueRegions = useMemo(() => {
    if (!data) return [] as string[];
    const set = new Set<string>();
    data.areas.forEach(a => set.add(getRegion(a["Outlet Name"])));
    return Array.from(set);
  }, [data]);

  // Calculate branch performance data
  const branchesData = useMemo(() => {
    if (!data) return [] as Array<Record<string, unknown>>;
    const branchPerformance = data.areas.map(area => {
      const branchName = area["Outlet Name"];
      const manager = area["area manager"];
      
      // Get region
      let region = 'Other Regions';
      if (branchName.includes('Riyadh')) region = 'Riyadh';
      else if (branchName.includes('Jeddah')) region = 'Jeddah';
      else if (branchName.includes('Dammam') || branchName.includes('Khobar') || branchName.includes('Dhahran')) region = 'Eastern Province';
      else if (branchName.includes('Mecca')) region = 'Mecca';
      else if (branchName.includes('Medina')) region = 'Medina';
      
      // Calculate sales for this branch
      const branchSales2025 = data.sales
        .filter(sale => sale["Outlet Name"] === branchName && sale.YEAR === 2025)
        .reduce((sum, sale) => sum + sale["Bill Amount"], 0);
      
      const branchSales2024 = data.sales
        .filter(sale => sale["Outlet Name"] === branchName && sale.YEAR === 2024)
        .reduce((sum, sale) => sum + sale["Bill Amount"], 0);
      
      // Calculate visitors and invoices
      const visitors = data.sales
        .filter(sale => sale["Outlet Name"] === branchName && sale.YEAR === 2025)
        .reduce((sum, sale) => sum + sale.visitors, 0);
      
      const invoices = data.sales
        .filter(sale => sale["Outlet Name"] === branchName && sale.YEAR === 2025)
        .reduce((sum, sale) => sum + sale["No Of Bills"], 0);
      
      // Get target
      const target = data["yearly target"]
        .find(t => t["Outlet Name"] === branchName)?.["Target Amount"] || 0;
      
      const growth = branchSales2024 > 0 ? ((branchSales2025 - branchSales2024) / branchSales2024) * 100 : 0;
      const achievement = target > 0 ? (branchSales2025 / target) * 100 : 0;
      const avgInvoiceValue = invoices > 0 ? branchSales2025 / invoices : 0;
      const conversionRate = visitors > 0 ? (invoices / visitors) * 100 : 0;
      
      return {
        name: branchName,
        displayName: branchName.replace(/^\d+-/, ''),
        manager,
        region,
        sales2025: branchSales2025,
        sales2024: branchSales2024,
        growth,
        visitors,
        invoices,
        target,
        achievement,
        avgInvoiceValue,
        conversionRate
      };
    });

    // Apply filters
    return branchPerformance.filter(branch => {
      const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           branch.manager.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || branch.region === selectedRegion;
      const matchesManager = selectedManager === 'all' || branch.manager === selectedManager;
      
      return matchesSearch && matchesRegion && matchesManager;
    });
  }, [data, searchTerm, selectedRegion, selectedManager]);

  const regionalData = useMemo(() => {
    if (!data) return [] as Array<{ region: string; branches: number }>;
    const map = new Map<string, number>();
    data.areas.forEach(area => {
      const region = getRegion(area["Outlet Name"]);
      map.set(region, (map.get(region) || 0) + 1);
    });
    return Array.from(map.entries()).map(([region, count]) => ({ region, branches: count }));
  }, [data]);

  // Calculate summary KPIs
  const summaryKpis = useMemo(() => {
    const totalSales = branchesData.reduce((sum, branch) => sum + branch.sales2025, 0);
    const totalTarget = branchesData.reduce((sum, branch) => sum + branch.target, 0);
    const avgGrowth = branchesData.length > 0 ? 
      branchesData.reduce((sum, branch) => sum + branch.growth, 0) / branchesData.length : 0;
    const topPerformers = branchesData.filter(branch => branch.achievement > 100).length;
    
    return {
      totalBranches: branchesData.length,
      totalSales,
      totalTarget,
      avgGrowth,
      topPerformers
    };
  }, [branchesData]);

  // Top 10 branches for chart
  const topBranches = branchesData
    .sort((a, b) => b.sales2025 - a.sales2025)
    .slice(0, 10);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getPerformanceColor = (achievement: number) => {
    if (achievement >= 100) return 'success';
    if (achievement >= 80) return 'warning';
    return 'destructive';
  };

  const getPerformanceText = (achievement: number) => {
    if (achievement >= 100) return 'Excellent';
    if (achievement >= 80) return 'Good';
    if (achievement >= 60) return 'Average';
    return 'Below Target';
  };

  return (
    <DashboardLayout 
      title="Branch Management" 
      subtitle="Performance analysis across all 50 retail locations"
    >
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search branches or managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-dashboard-card border-dashboard-border"
          />
        </div>
        
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="bg-dashboard-card border-dashboard-border">
            <SelectValue placeholder="Filter by Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {uniqueRegions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedManager} onValueChange={setSelectedManager}>
          <SelectTrigger className="bg-dashboard-card border-dashboard-border">
            <SelectValue placeholder="Filter by Manager" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Managers</SelectItem>
            {uniqueManagers.map((manager) => (
              <SelectItem key={manager} value={manager}>
                {manager}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {summaryKpis.totalBranches} branches found
          </span>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <KPICard
          title="Total Branches"
          value={summaryKpis.totalBranches}
          format="number"
          subtitle="Active locations"
        />
        <KPICard
          title="Total Sales"
          value={summaryKpis.totalSales}
          format="currency"
          subtitle="Current year"
        />
        <KPICard
          title="Average Growth"
          value={summaryKpis.avgGrowth}
          format="percentage"
          change={summaryKpis.avgGrowth}
          changeType={summaryKpis.avgGrowth > 0 ? 'increase' : 'decrease'}
        />
        <KPICard
          title="Top Performers"
          value={summaryKpis.topPerformers}
          format="number"
          subtitle="Above 100% target"
        />
        <KPICard
          title="Target Achievement"
          value={(summaryKpis.totalTarget > 0 ? (summaryKpis.totalSales / summaryKpis.totalTarget) * 100 : 0)}
          format="percentage"
          subtitle="Overall performance"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top 10 Performing Branches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topBranches} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis 
                  type="number"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  type="category"
                  dataKey="displayName"
                  tick={{ fontSize: 10 }}
                  width={100}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Sales']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--dashboard-card))',
                    border: '1px solid hsl(var(--dashboard-border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="sales2025" 
                  fill="hsl(var(--chart-primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Regional Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={regionalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ region, branches }) => `${region} (${branches})`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="branches"
                >
                  {regionalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${['primary', 'secondary', 'tertiary', 'quaternary', 'accent', 'warning'][index % 6]}))`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Branch List */}
      <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Branch Performance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {branchesData.map((branch, index) => (
              <div key={index} className="p-4 border border-dashboard-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{branch.displayName}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          <Users className="w-3 h-3 inline mr-1" />
                          {branch.manager}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {branch.region}
                        </p>
                      </div>
                      <Badge variant={
                        branch.achievement >= 100 ? 'default' :
                        branch.achievement >= 80 ? 'secondary' : 'destructive'
                      }>
                        {getPerformanceText(branch.achievement)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {formatCurrency(branch.sales2025)}
                    </div>
                    <div className="text-xs text-muted-foreground">2025 Sales</div>
                    <div className={`text-xs mt-1 ${branch.growth > 0 ? 'text-success' : 'text-destructive'}`}>
                      {branch.growth > 0 ? '+' : ''}{branch.growth.toFixed(1)}% YoY
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {branch.achievement.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Target Achievement</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Target: {formatCurrency(branch.target)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-foreground">
                      {formatCurrency(branch.avgInvoiceValue)}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Invoice</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {branch.conversionRate.toFixed(1)}% conversion
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Branches;