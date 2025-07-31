import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileBarChart, Download, Calendar, TrendingUp, Building2, Users, Target, Clock } from "lucide-react";

const Reports = () => {
  const reports = [
    {
      title: "Monthly Sales Report",
      description: "Comprehensive monthly sales analysis across all branches",
      type: "Sales",
      lastGenerated: "2025-07-31",
      size: "2.3 MB",
      status: "Ready",
      icon: TrendingUp
    },
    {
      title: "Branch Performance Report",
      description: "Individual branch performance metrics and comparisons",
      type: "Performance",
      lastGenerated: "2025-07-30",
      size: "1.8 MB",
      status: "Ready",
      icon: Building2
    },
    {
      title: "Target Achievement Analysis",
      description: "Target vs actual performance analysis with growth projections",
      type: "Analytics",
      lastGenerated: "2025-07-29",
      size: "1.2 MB",
      status: "Ready",
      icon: Target
    },
    {
      title: "Customer Analytics Report",
      description: "Customer satisfaction and behavior analysis",
      type: "Customer",
      lastGenerated: "2025-07-28",
      size: "3.1 MB",
      status: "Ready",
      icon: Users
    },
    {
      title: "Manager Performance Report",
      description: "Area manager performance and team management metrics",
      type: "Management",
      lastGenerated: "2025-07-27",
      size: "1.5 MB",
      status: "Processing",
      icon: Users
    },
    {
      title: "Real-time Operations Report",
      description: "Live operational metrics and daily performance tracking",
      type: "Operations",
      lastGenerated: "2025-07-31",
      size: "0.8 MB",
      status: "Ready",
      icon: Clock
    }
  ];

  const quickStats = [
    { label: "Reports Generated This Month", value: "42", change: "+12%", trend: "up" },
    { label: "Average Report Size", value: "1.8 MB", change: "-5%", trend: "down" },
    { label: "Auto-Generated Reports", value: "85%", change: "+8%", trend: "up" },
    { label: "Report Processing Time", value: "3.2 min", change: "-15%", trend: "down" }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'default';
      case 'Processing':
        return 'secondary';
      case 'Failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Sales':
        return 'bg-chart-primary/10 text-chart-primary';
      case 'Performance':
        return 'bg-chart-secondary/10 text-chart-secondary';
      case 'Analytics':
        return 'bg-chart-tertiary/10 text-chart-tertiary';
      case 'Customer':
        return 'bg-accent/10 text-accent';
      case 'Management':
        return 'bg-warning/10 text-warning';
      case 'Operations':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <DashboardLayout 
      title="Reports & Export" 
      subtitle="Generate, download, and manage business intelligence reports"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
                <div className={`text-xs flex items-center gap-1 ${
                  stat.trend === 'up' ? 'text-success' : 'text-destructive'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${
                    stat.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generate New Report */}
      <Card className="mb-6 transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-primary" />
            Generate New Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex flex-col items-start gap-2">
              <TrendingUp className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Sales Report</div>
                <div className="text-xs text-muted-foreground">Weekly/Monthly sales analysis</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
              <Building2 className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Branch Report</div>
                <div className="text-xs text-muted-foreground">Individual branch performance</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
              <Target className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Target Analysis</div>
                <div className="text-xs text-muted-foreground">Achievement vs targets</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
              <Users className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Customer Report</div>
                <div className="text-xs text-muted-foreground">Customer analytics & satisfaction</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
              <Calendar className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Custom Report</div>
                <div className="text-xs text-muted-foreground">Configure custom parameters</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
              <Clock className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Schedule Report</div>
                <div className="text-xs text-muted-foreground">Automate recurring reports</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-primary" />
            Available Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-dashboard-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <report.icon className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground truncate">
                        {report.title}
                      </h3>
                      <Badge variant={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(report.type)}`}>
                        {report.type}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {report.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(report.lastGenerated)}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileBarChart className="w-3 h-3" />
                        {report.size}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {report.status === 'Ready' && (
                    <>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </>
                  )}
                  {report.status === 'Processing' && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-muted-foreground">Processing...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-dashboard-border rounded-lg">
                <div>
                  <div className="font-medium text-foreground">PDF Report</div>
                  <div className="text-sm text-muted-foreground">Professional formatted reports</div>
                </div>
                <Button variant="outline" size="sm">Export</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-dashboard-border rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Excel Spreadsheet</div>
                  <div className="text-sm text-muted-foreground">Raw data for analysis</div>
                </div>
                <Button variant="outline" size="sm">Export</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-dashboard-border rounded-lg">
                <div>
                  <div className="font-medium text-foreground">CSV Data</div>
                  <div className="text-sm text-muted-foreground">Machine-readable format</div>
                </div>
                <Button variant="outline" size="sm">Export</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-dashboard-border rounded-lg">
                <div>
                  <div className="font-medium text-foreground">PowerPoint Slides</div>
                  <div className="text-sm text-muted-foreground">Presentation-ready charts</div>
                </div>
                <Button variant="outline" size="sm">Export</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Weekly Sales Summary</div>
                  <div className="text-sm text-muted-foreground">Every Monday at 9:00 AM</div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Monthly Performance</div>
                  <div className="text-sm text-muted-foreground">1st of every month</div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/20 border border-muted rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Quarterly Review</div>
                  <div className="text-sm text-muted-foreground">End of quarter</div>
                </div>
                <Badge variant="secondary">Paused</Badge>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule New Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;