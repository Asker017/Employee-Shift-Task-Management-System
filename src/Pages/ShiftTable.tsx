import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ShiftTable({data, shifts, handleEdit, handleDelete, page, setPage, totalPages}: any) {

  const getShiftName = (id: number) => {
    const shiftName = shifts.find((shift: any) => shift.id === id)?.name;
    return shiftName;
  };

  const getTime = (id: number) => {
    const startTime = shifts.find((shift: any) => shift.id === id)?.start;
    const endTime = shifts.find((shift: any) => shift.id === id)?.end;

    return `${startTime} - ${endTime}`
  }

  const columns = [
    {
      header: "S. No",
      cell: (info: any) => info.row.index + 1,
    },
    {
      accessorKey: "employeeName",
      header: "Name",
    },
    {
      accessorKey: "shift",
      header: "Shift",
      cell: (info: any) => getShiftName(info.row.original.shift),
    },
    {
      accessorKey: "shift",
      header: "Time",
      cell: (info: any) => getTime(info.row.original.shift),
    },
    {
      header: "Action",
      cell: (info: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger><EllipsisVertical size={20} /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleEdit(info.row.original._id)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(info.row.original._id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

export default ShiftTable