import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <DashboardLayout title="Settings">
      <div className="space-y-4 max-w-md">
        <div className="flex items-center justify-between p-4 bg-dashboard-card border border-dashboard-border rounded-lg">
          <span className="text-sm font-medium">Enable Notifications</span>
          <Switch />
        </div>
        <div className="flex items-center justify-between p-4 bg-dashboard-card border border-dashboard-border rounded-lg">
          <span className="text-sm font-medium">Dark Mode</span>
          <Switch />
        </div>
        <div className="flex items-center justify-between p-4 bg-dashboard-card border border-dashboard-border rounded-lg">
          <span className="text-sm font-medium">Auto Update</span>
          <Switch />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
