import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useGetEmployeeTasks, useUpdateTaskStatus } from "../../Queries/employeeQueries";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { UpdateStatusPayload } from "../../Services/EmployeeService";
import { ClipLoader } from "react-spinners";

function EmployeeTasks() {
  const id = useSelector((state: any) => state.loggedRole);
  const { data: allTasksData, isPending: allTasksPending } =
    useGetEmployeeTasks(id);
  const { mutate: updateStatusMutate, isPending: updateStatusPending } = useUpdateTaskStatus()

  const allTasks = allTasksData?.data?.data || [];

  const [columns, setColumns] = useState<Record<string, any[]>>({
    Pending: [],
    "In Progress": [],
    Completed: [],
  });

  useEffect(() => {
    setColumns({
      Pending: allTasks.filter((t: any) => t.status === "Pending"),
      "In Progress": allTasks.filter((t: any) => t.status === "In Progress"),
      Completed: allTasks.filter((t: any) => t.status === "Completed"),
    });
  }, [allTasks])

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    if (sourceCol === destCol) return;

    const sourceTasks = Array.from(columns[sourceCol]);
    const destTasks = Array.from(columns[destCol]);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    movedTask.status = destCol;
    destTasks.splice(destination.index, 0, movedTask)

    setColumns({
      ...columns,
      [sourceCol]: sourceTasks,
      [destCol]: destTasks,
    });

    updateStatusMutate({ id: movedTask._id, payload: { status: destCol } })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-[100px] p-8 flex justify-between items-center">
        <p className="text-2xl font-bold text-black">Employee Tasks</p>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {allTasksPending ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader size={22} color="black" />
          </div>
        ) : (
          <div className="flex justify-center gap-8">
            {Object.entries(columns).map(([status, tasks]) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col gap-2 w-[350px] h-[550px] p-2 overflow-auto rounded-md"
                  >
                    <p className="font-semibold text-lg">{status}</p>

                    {tasks.length === 0 ? (
                      <p className="text-gray-400 italic text-center mt-4">
                        No {status} Tasks
                      </p>
                    ) : (
                      tasks.map((task: any, index: number) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="w-full shrink-0 rounded-sm shadow-[0_5px_5px_rgba(0,0,0,0.25)] flex flex-col gap-2 p-4 bg-white"
                            >
                              <p className="font-semibold">
                                Title:{" "}
                                <span className="text-gray-400">
                                  {task.title}
                                </span>
                              </p>
                              <p className="font-semibold">
                                Description:{" "}
                                <span className="text-gray-400">
                                  {task.description || "-"}
                                </span>
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        )}
      </DragDropContext>
    </div>
  );
}

export default EmployeeTasks;
