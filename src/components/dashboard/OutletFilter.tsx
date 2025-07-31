import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Area } from "@/types/data";

interface OutletFilterProps {
  areas: Area[];
  selectedOutlet?: string;
  onOutletChange: (outlet: string | undefined) => void;
  selectedManager?: string;
  onManagerChange: (manager: string | undefined) => void;
}

export const OutletFilter = ({ 
  areas, 
  selectedOutlet, 
  onOutletChange, 
  selectedManager, 
  onManagerChange 
}: OutletFilterProps) => {
  const uniqueManagers = Array.from(new Set(areas.map(area => area["area manager"])));
  const filteredOutlets = selectedManager
    ? areas.filter(area => area["area manager"] === selectedManager)
    : areas;

  return (
    <div className="flex gap-4 items-center">
      <div className="min-w-[200px]">
        <Select value={selectedManager || "all"} onValueChange={(value) => 
          onManagerChange(value === "all" ? undefined : value)
        }>
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
      </div>
      
      <div className="min-w-[250px]">
        <Select value={selectedOutlet || "all"} onValueChange={(value) => 
          onOutletChange(value === "all" ? undefined : value)
        }>
          <SelectTrigger className="bg-dashboard-card border-dashboard-border">
            <SelectValue placeholder="Filter by Outlet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Outlets</SelectItem>
            {filteredOutlets.map((area) => (
              <SelectItem key={area["Outlet Name"]} value={area["Outlet Name"]}>
                {area["Outlet Name"]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};