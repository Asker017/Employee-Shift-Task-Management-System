import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";

function EmployeeTable({ data, page, setPage, totalPages, handleDelete, handleEdit, departments, designations }: any) {

  const getDepartmentName = (id: number) => {
    const departmentName = departments.find((dep: any) => dep.id === id)?.name
    return departmentName
  }

  const getDesignationName = (id: number) => {
    const departmentName = designations.find((des: any) => des.id === id)?.name
    return departmentName
  } 
   
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
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: (info: any) => getDepartmentName(info.row.original.department),
    },
    {
      accessorKey: "designation",
      header: "Designation",
      cell: (info: any) => getDesignationName(info.row.original.designation),
    },
    {
      header: "Action",
      cell: (info: any) => (
        <div className="flex justify-center items-center gap-2">
          <button
            className="bg-red-700 p-2 rounded-sm"
            onClick={() => handleDelete(info.row.original._id)}
          >
            <Trash size={14} color="white" />
          </button>
          <button
            className="bg-green-600 p-2 rounded-sm"
            onClick={() => handleEdit(info.row.original._id)}
          >
            <Pencil size={14} color="white" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table className="min-w-full mt-8 shadow-2xl">
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
      <div className="flex justify-end items-center pr-8 py-2 gap-4 mt-4 w-full">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev: any) => prev - 1)}
          className="px-4 py-1 rounded bg-[#7251b5] text-white font-semibold cursor-pointer"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === data?.data?.totalPages}
          onClick={() => setPage((prev: any) => prev + 1)}
          className="px-4 py-1 rounded bg-[#7251b5] text-white font-semibold cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default EmployeeTable