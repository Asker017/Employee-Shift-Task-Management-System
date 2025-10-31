import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useClockIn, useClockOut, useGetProfileDetails } from '../../Queries/employeeQueries';
import { useGetDepartments, useGetDesignations } from '../../Queries/useEmployeeTypes';
import profileAvatar from "../../assets/Profile-Avatar.png"
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

function EmployeeInfo() {

  const [clockIn, setClockIn] = useState("Clock In")
  const role = useSelector((state: any) => state.loggedRole);
  const { data: profileData, isPending: profilePending } = useGetProfileDetails(role)
  const { data: departments } = useGetDepartments()
  const { data: designations } = useGetDesignations()
  const { mutate: clockInMutate, isPending: clockInPending } = useClockIn()
  const { mutate: clockOutMutate, isPending: clockOutPending } = useClockOut()

  const getDepartmentName = (id: number) => {
    const departmentName = departments?.data?.data.find((dep: any) => dep.id === id)?.name;
    return departmentName;
  };

  const getDesignationName = (id: number) => {
    const departmentName = designations?.data?.data.find((des: any) => des.id === id)?.name;
    return departmentName;
  }; 

  const handleClockIn = () => {
    if(clockIn === "Clock In") {
      clockInMutate({ employeeId: profileData?.data?.employee?._id }, {
        onSuccess: (data) => {
          toast.success(data?.response?.data?.message || "Clocked in successfully");
          setClockIn("Clock Out");
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Something went wrong");
        }
      })
    } else {
      clockOutMutate({ employeeId: profileData?.data?.employee?._id }, {
        onSuccess: (data) => {
          toast.success(data?.response?.data?.message || "Clocked in successfully");
          setClockIn("Clock In");
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Something went wrong");
        }
      })
    }
  }

  const employee = profileData?.data?.employee || {};

  const clockInStyle = "bg-green-600 rounded-md text-white font-bold py-2 px-4";
  const clockOutStyle = "bg-red-600 rounded-md text-white font-bold py-2 px-4";

  return (
    <div className='h-full flex'>
      <div className='w-[400px] flex flex-col h-full'>
        <p className='font-bold text-2xl ml-6 mt-6'>Employee Info</p>
      <div className='h-[200px] p-6 flex justify-between items-center'>
        <img src={profileAvatar} className='border border-gray-500 size-[150px]' />
        <button className={clockIn === "Clock In" ? clockInStyle : clockOutStyle} onClick={handleClockIn}>
          {(clockInPending || clockOutPending) ? <ClipLoader size={20} color='white' /> : clockIn}
        </button>
      </div>
      <div className='h-[280px] p-6 flex justify-start gap-4'>
        {profilePending ? <ClipLoader size={24} color='black' /> : 
        <>
          <div className='h-full w-[150px] flex flex-col justify-evenly'>
            <div className='flex justify-between items-center font-bold'><p>Name</p><p>:</p></div>
            <div className='flex justify-between items-center font-bold'><p>Email</p><p>:</p></div>
            <div className='flex justify-between items-center font-bold'><p>Role</p><p>:</p></div>
            <div className='flex justify-between items-center font-bold'><p>Department</p><p>:</p></div>
            <div className='flex justify-between items-center font-bold'><p>Designation</p><p>:</p></div>
          </div>
          <div className='h-full flex flex-col justify-evenly'>
            <p>{employee.name}</p>
            <p>{employee.email}</p>
            <p>Employee</p>
            <p>{getDepartmentName(employee.department)}</p>
            <p>{getDesignationName(employee.designation)}</p>
          </div>
        </>}
      </div>
      </div>

      <div className='flex-1 flex justify-center items-center px-8'>
      </div>
    </div>
  )
}

export default EmployeeInfo