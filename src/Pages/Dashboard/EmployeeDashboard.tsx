import { useState } from "react"
import { useGetProfileDetails } from "../../Queries/employeeQueries"
import { useSelector } from "react-redux";
import { CalendarCheck2, User, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";


function EmployeeDashboard() {

  const navigate = useNavigate()

  const role = useSelector((state: any) => state.loggedRole)
  const { data: profileData, isPending: profilePending } = useGetProfileDetails(role)
  const [openDialog, setOpenDialog] = useState(false);


  const menuItems = [
    {
      id: 0,
      label: "Employees Info",
      logo: <User color="white" />,
      path: "employee-info",
    },
    {
      id: 1,
      label: "Tasks",
      logo: <CalendarCheck2 color="white" />,
      path: "employee-tasks",
    }
  ];

  const OnLogOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="h-full flex">
      <Sidebar menuItems={menuItems} setOpenDialog={setOpenDialog} />
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
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              No
            </Button>
            <Button type="submit" onClick={OnLogOut}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmployeeDashboard