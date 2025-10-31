import { useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../Services/LoginService";
import type { LoginPayload } from "../../Services/LoginService";
import { useNavigate } from "react-router-dom";
import loginScreenImage from "../../assets/Login_screen_vector.svg";
import { useDispatch } from "react-redux";
import { setRole } from "../../Redux/Slices/loggedRoleSlice";

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (response) => {
      toast.success("Login successful");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      dispatch(setRole(response.data.id))
      if (response.data.role === 1) {
        navigate("/admin/dashboard/employees-stats");
      } else {
        navigate("/employee/dashboard/employee-info");
      }
      setFormData({
        email: "",
        password: "",
      });
      setErrors({
        email: "",
        password: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Login failed");
    },
  });

  const { isPending } = mutation;

  const validateFormData = () => {
    if (formData.email.length === 0) {
      setErrors((prev) => ({ ...prev, email: "Email is required!" }));
      return false;
    }
    if (formData.password.length === 0) {
      setErrors((prev) => ({ ...prev, password: "Password is required!" }));
      return false;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    if (!validateFormData()) return;
    mutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="h-full flex items-center p-4 bg-[#2a2438]">
      <img className="w-1/2 h-[70%] rounded-lg" src={loginScreenImage} />
      <div className="w-1/2 flex flex-col justify-center items-center">
        <div className="w-[350px]">
          <p className="text-3xl text-white font-semibold">Welcome to ESMS</p>
          <p className="text-3xl text-white font-semibold mt-[14px]">
            Sign into your account
          </p>
        </div>
        <input
          name="email"
          className="bg-[#362f44] text-white rounded-sm py-2 px-3 h-[40px] w-[350px] placeholder:text-sm placeholder:text-[#9CA3AF] mt-[30px]"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && (
          <p className="text-red-700 text-xs my-1">{errors.email}</p>
        )}
        <div className="bg-[#362f44] rounded-sm py-2 px-3 h-[40px] w-[350px] flex mt-[12px]">
          <input
            name="password"
            type={!showPassword ? "password" : "text"}
            className="h-full w-[90%] text-white focus:outline-none placeholder:text-sm placeholder:text-[#9CA3AF]"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <div className="h-full w-[10%] flex justify-center items-center">
            {showPassword ? (
              <Eye
                onClick={() => setShowPassword(!showPassword)}
                color="#9CA3AF"
              />
            ) : (
              <EyeOff
                onClick={() => setShowPassword(!showPassword)}
                color="#9CA3AF"
              />
            )}
          </div>
        </div>
        {errors.password && (
          <p className="text-red-700 text-xs my-1">{errors.password}</p>
        )}
        <button
          className="bg-[#7251b5] rounded-sm text-white font-medium w-[350px] h-[40px] flex justify-center items-center cursor-pointer mt-[12px]"
          onClick={handleLogin}
        >
          {isPending ? <ClipLoader size={20} color="white" /> : "Log In"}
        </button>
        <div className="w-[350px]">
          <p className="text-sm text-white mt-[14px]">
            New user ?{" "}
            <span
              className="underline text-[#7251b5] cursor-pointer"
              onClick={() => navigate("/signUp")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login