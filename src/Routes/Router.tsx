import { BrowserRouter, Routes , Route } from "react-router-dom"
import Login from "../Pages/Login/Login"
import SignUp from "../Pages/SignUp/SignUp"
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute"
import AdminDashboard from "../Pages/Dashboard/AdminDashboard"
import EmployeeDashboard from "../Pages/Dashboard/EmployeeDashboard"
import AddEmployee from "../Pages/AddEmployee"
import EmployeesStats from "../Pages/EmployeesStats"
import ShiftAssignment from "../Pages/ShiftAssignment"
import EmployeeInfo from "../Pages/EmployeePages/EmployeeInfo"
import CreateTasks from "../Pages/CreateTasks"
import EmployeeTasks from "../Pages/EmployeePages/EmployeeTasks"

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="1">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="employees-stats" element={<EmployeesStats />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="shift-assignment" element={<ShiftAssignment />} />
          <Route path="create-task" element={<CreateTasks />} />
        </Route>

        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute requiredRole="2">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="employee-info" element={<EmployeeInfo />} />
          <Route path="employee-tasks" element={<EmployeeTasks />} />
        </Route>
        <Route path="/unauthorized" element={<h1>Unauthorized access</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router