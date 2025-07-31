import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const Customers = () => {
  const customers = [
    { name: "John Doe", email: "john@example.com", satisfaction: "High" },
    { name: "Jane Smith", email: "jane@example.com", satisfaction: "Medium" },
    { name: "Bob Brown", email: "bob@example.com", satisfaction: "Low" },
  ];

  return (
    <DashboardLayout title="Customers">
      <div className="bg-dashboard-card border border-dashboard-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Satisfaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={index} className="border-t">
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.satisfaction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
