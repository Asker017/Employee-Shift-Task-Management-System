import { useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "../../Services/LoginService";
import type { SignupPayload } from "../../Services/LoginService";
import { useNavigate } from "react-router-dom";
import { signUpSchema } from "../../ZodSchemas/SignUpSchema";
import loginScreenImage from "../../assets/Login_screen_vector.svg"

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: SignupPayload) => signUp(payload),
    onSuccess: (response) => {
      toast.success("Registered successfully");
      navigate("/")
      console.log(response?.data)
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      setErrors({
        name: "",
        email: "",
        password: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Sign up failed");
    },
  });

  const validateFormData = () => {
    const result = signUpSchema.safeParse(formData)

    if(!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as string;
        fieldErrors[fieldName] = err.message;
      })
      setErrors((prev) => ({...prev, ...fieldErrors}))
      return false
    }

    setErrors({
      name: "",
      email: "",
      password: "",
    });
    return true
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = () => {
    if (!validateFormData()) return;
    mutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };

  const handleDropdown = (value: number) => {
    setFormData((prev) => ({...prev, role: value}))
  }

  return (
    <div className="h-full flex items-center p-4 bg-[#2a2438]">
      <img className="w-1/2 h-[70%] rounded-lg" src={loginScreenImage} />
      <div className="w-1/2 flex flex-col justify-center items-center">
        <div className="w-[350px]">
          <p className="text-4xl text-white font-semibold">Create an account</p>
        </div>
        <div className="w-[350px]">
          <p className="text-sm text-white mt-[14px]">
            Already have an account?{" "}
            <span className="underline text-[#7251b5] cursor-pointer" onClick={() => navigate("/")}>Log in</span>
          </p>
        </div>
        <input
          name="name"
          className="bg-[#362f44] text-white rounded-sm py-2 px-3 h-[40px] w-[350px] placeholder:text-sm placeholder:text-[#9CA3AF] mt-[30px]"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && <p className="text-red-700 text-xs">{errors.name}</p>}
        <input
          name="email"
          className="bg-[#362f44] text-white rounded-sm py-2 px-3 h-[40px] w-[350px] placeholder:text-sm placeholder:text-[#9CA3AF] mt-[12px]"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <p className="text-red-700 text-xs">{errors.email}</p>}
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
              <Eye onClick={() => setShowPassword(!showPassword)} color="#9CA3AF" />
            ) : (
              <EyeOff onClick={() => setShowPassword(!showPassword)} color="#9CA3AF" />
            )}
          </div>
        </div>
        {errors.password && (
          <p className="text-red-700 text-xs">{errors.password}</p>
        )}

        <button
          className="bg-[#7251b5] rounded-sm text-white font-medium w-[350px] h-[40px] flex justify-center items-center cursor-pointer mt-[12px]"
          onClick={handleSignup}
        >
          {mutation.isPending ? (
            <ClipLoader size={20} color="white" />
          ) : (
            "Create account"
          )}
        </button>
      </div>
    </div>
  );
}

export default SignUp;
