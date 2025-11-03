import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetDataCounts, useGetRecentEmployees } from "../Queries/adminQueries";
import { ClipLoader } from "react-spinners";

function EmployeesStats() {

  const { data: countsData, isPending: countsPending } = useGetDataCounts()
  const { data } = useGetRecentEmployees()

  const navigate = useNavigate()

  const columns = [
    {
      header: "S. No",
      cell: (info: any) => info.row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    }
  ];

  const table = useReactTable({
    data: data?.data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border border-black p-8 h-full flex flex-col">
      <p className="text-2xl font-bold text-black">Employees Stats</p>

      {/* Stats */}
      <div className="h-[120px] mt-8 flex gap-8 items-center">
        <div className="w-[20%] bg-[#7251b5] h-[90%] py-4 rounded-lg flex flex-col justify-evenly pl-8">
          <p className="text-white font-bold text-md">Total Employees</p>
          {countsPending ? (
            <ClipLoader size={22} color="white" />
          ) : (
            <p className="text-md text-white text-[40px] font-bold">
              {countsData?.data?.data?.employees}
            </p>
          )}
        </div>
        <div className="w-[20%] bg-[#7251b5] h-[90%] py-4 rounded-lg flex flex-col justify-evenly pl-8">
          <p className="text-white font-bold text-md">Total Departments</p>
          {countsPending ? (
            <ClipLoader size={20} color="white" />
          ) : (
            <p className="text-md text-white text-[40px] font-bold">
              {countsData?.data?.data?.departments}
            </p>
          )}
        </div>
        <div className="w-[20%] bg-[#7251b5] h-[90%] py-4 rounded-lg flex flex-col justify-evenly pl-8">
          <p className="text-white font-bold text-md">Total Designations</p>
          {countsPending ? (
            <ClipLoader size={22} color="white" />
          ) : (
            <p className="text-md text-white text-[40px] font-bold">
              {countsData?.data?.data?.designations}
            </p>
          )}
        </div>
      </div>

      {/* Recently Added Employees */}
      <div className="mt-8 flex flex-col items-center">
        <p className="text-2xl font-bold text-black w-full">
          Recently Added Employees
        </p>

        {/* Table */}
        <table className="min-w-full mt-4 shadow-2xl">
          <thead className="bg-[#362f44] text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 border border-gray-300"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 border border-gray-300 text-center"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Button
          className="w-[100px] bg-[#7251b5] font-bold mt-2 cursor-pointer"
          onClick={() => navigate("/admin/dashboard/add-employee")}
        >
          View more
        </Button>
      </div>
    </div>
  );
}

export default EmployeesStats