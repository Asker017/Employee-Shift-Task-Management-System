import { CalendarCheck2, ChartPie, UserPlus, UserRoundCheck } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar"
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useState } from "react";

function AdminDashboard() {

  const navigate = useNavigate()
  const [openDialog, setOpenDialog] = useState(false)

  const menuItems = [
    {
      id: 0,
      label: "Employees Stats",
      logo: <ChartPie color="white" />,
      path: "employees-stats",
    },
    {
      id: 1,
      label: "Add Employee",
      logo: <UserPlus color="white" />,
      path: "add-employee",
    },
    {
      id: 2,
      label: "Assign Shifts",
      logo: <UserRoundCheck color="white" />,
      path: "shift-assignment",
    },
    {
      id: 3,
      label: "Create Task",
      logo: <CalendarCheck2 color="white" />,
      path: "create-task",
    }
  ];

  const OnLogOut = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div className="h-full flex">
      <Sidebar
        menuItems={menuItems}
        setOpenDialog={setOpenDialog} 
      />
      <div className="flex-1">
        <Outlet />
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[280px]">
            <DialogHeader>
              <DialogDescription className="text-black font-medium text-md">
                Are you sure to log out ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>No</Button>
              <Button type="submit" onClick={OnLogOut}>Yes</Button>
            </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminDashboard