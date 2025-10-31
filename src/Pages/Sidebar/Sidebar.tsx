import React from "react";
import { LaptopMinimal, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface MenuItem {
  id: number;
  label: string;
  logo: React.ReactElement;
  path: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
}

function Sidebar({ menuItems, setOpenDialog }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const currentPath = location.pathname.split("/").pop();

  const [currentItem, setCurrentItem] = useState(0)

  const handleSelect = (id: number, path: string) => {
    setCurrentItem(id);
    navigate(path)
  }

  return (
    <div className={`bg-[#362f44] w-[250px] h-full flex flex-col`}>
      {/* Header */}
      <div className="h-[10%] pl-6 flex items-center gap-2">
        <div className="size-[40px] flex justify-center items-center">
          <LaptopMinimal color="white" />
        </div>
        <p className="text-lg font-bold text-white">ESMS</p>
      </div>

      {/* Body */}
      <div className="h-[80%] pt-16 px-2 flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <div 
            className={`${currentPath === item.path ? "bg-[#7251b5]" : "bg-[#362f44]"} h-[60px] pl-6 flex items-center gap-4 rounded-md cursor-pointer`} 
            key={index}
            onClick={() => handleSelect(item.id, item.path)}
          >
            {item.logo}
            <p className="text-white text-md font-semibold">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div 
        className="border border-black h-[10%] pl-6 flex items-center gap-4 cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <LogOut color="white" />
        <p className="text-white text-md font-semibold">Log out</p>
      </div>
    </div>
  );
}

export default Sidebar