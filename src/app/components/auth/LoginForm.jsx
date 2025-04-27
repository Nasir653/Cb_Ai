// "use client";
// import React, { useEffect, useState } from "react";
// //import { useForm } from "react-hook-form";
// //import { zodResolver } from "@hookform/resolvers/zod";
// //import { z } from "zod";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Loader2 } from "lucide-react";
// //import toast from "react-hot-toast";
// //import { cn } from "@/lib/utils";
// import Link from "next/link";
// import Image from "next/image";
// //import { SiteLogo } from "@/components/svg";
// // /import { Icon } from "@iconify/react";
// // //import { Checkbox } from "@/components/ui/checkbox";
// // import { signIn } from "next-auth/react";
// // import googleIcon from "@/public/images/auth/google.png";
// // import auth0Icon from "@/public/images/auth/auth0.png";
// const schema = z.object({
//   email: z.string().email({ message: "Your email is invalid." }),
//   password: z.string().min(4),
// });
// //import { useMediaQuery } from "@/hooks/use-media-query";
// //import { useAppDispatch } from "@/provider/Store";
// //import { setUser } from "@/provider/slice/UserSlice";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// //import axiosInstance from "@/config/axios.config";
// //import CryptoJS from "crypto-js";

// const LoginForm = () => {
//   const [isPending, startTransition] = React.useTransition();
//   const [passwordType, setPasswordType] = React.useState("password");
//   const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [isLoading , setIsLoading] = useState(false)

//   const togglePasswordType = () => {
//     if (passwordType === "text") {
//       setPasswordType("password");
//     } else if (passwordType === "password") {
//       setPasswordType("text");
//     }
//   };
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(schema),
//     mode: "all",
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const pathName = usePathname();
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     const res = localStorage.getItem("rememberData");
//     if (res) {
//       const data = JSON.parse(res);
//       reset(data);
//     }
//   }, []);

//   // Check if there's an encrypted code in the URL
//   useEffect(() => {
//     const encryptedCode = searchParams.get("code"); // Example: /login?code=ENCRYPTED_STRING
//     if (encryptedCode) {
//       handleDirectLogin(encryptedCode);
//     }
//   }, []);

//   // 🔐 Function to send encrypted data to the backend for decryption
//   const handleDirectLogin = async (encryptedCode) => {
//     try {
//       setIsLoading(true);
//       const response = await axiosInstance.post("/api/direct-login/custom-auth", {
//         encryptedData: encryptedCode,
//       });

//       if (response.data?.token) {
//         localStorage.setItem("token", response.data.token);
//         toast.success("Login Successful");
//         router.replace("/");
//         window.location.href = window.location.origin;
//       } else {
//         throw new Error("No token received from server.");
//       }
//     } catch (error) {
//       console.error("Login Error:", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "Login failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onSubmit = (formData) => {
//     startTransition(async () => {
//       try {
//         const { data } = await axiosInstance({
//           url: `/api/auth/local?populate=*`,
//           method: "POST",
//           data: {
//             identifier: formData?.email,
//             password: formData?.password,
//           },
//         });
//         console.log("data", data);
//         console.log(data);
//         toast.success("Login Successful");
//         localStorage.setItem("token", data.jwt);
//         if (rememberMe) {
//           localStorage.setItem("rememberData", JSON.stringify(formData));
//           setRememberMe(rememberMe);
//         } else {
//           localStorage.removeItem("rememberData", JSON.stringify(formData));
//           setRememberMe(!rememberMe);
//         }
//         router.replace("/");
//         window.location.href = window.location.origin;
//       } catch (error) {
//         console.log(error);
//         toast.error(
//           error.response?.data.error.message ||
//           "Login failed. Please try again."
//         );
//       }
//     });
//   };

//   function handleAuth0Login() {
//     signIn("auth0")
//       .then(() => console.log("logged in successfully"))
//       .catch((err) => console.log("login failed", err));
//   }

//   return (
//     <div className="w-full py-10">
//       <Link href="/dashboard" className="inline-block">
//         <SiteLogo className="h-25 w-25 3xl:w-14 3xl:h-14 text-primary" />
//       </Link>
//       <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
//         Hey, Hello 👋
//       </div>
//       <div className="2xl:text-lg text-base text-default-600 2xl:mt-2 leading-6">
//         Enter your login details to access your account.
//       </div>
//       <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
//         <div>
//           <Label htmlFor="email" className="mb-2 font-medium text-default-600">
//             Email{" "}
//           </Label>
//           <Input
//             disabled={isPending}
//             {...register("email")}
//             type="email"
//             id="email"
//             className={cn("", {
//               "border-destructive": errors.email,
//             })}
//             size={!isDesktop2xl ? "xl" : "lg"}
//           />
//         </div>
//         {errors.email && (
//           <div className=" text-destructive mt-2">{errors.email.message}</div>
//         )}

//         <div className="mt-3.5">
//           <Label
//             htmlFor="password"
//             className="mb-2 font-medium text-default-600"
//           >
//             Password{" "}
//           </Label>
//           <div className="relative">
//             <Input
//               disabled={isPending}
//               {...register("password")}
//               type={passwordType}
//               id="password"
//               className="peer "
//               size={!isDesktop2xl ? "xl" : "lg"}
//               placeholder=" "
//             />

//             <div
//               className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
//               onClick={togglePasswordType}
//             >
//               {passwordType === "password" ? (
//                 <Icon
//                   icon="heroicons:eye"
//                   className="w-5 h-5 text-default-400"
//                 />
//               ) : (
//                 <Icon
//                   icon="heroicons:eye-slash"
//                   className="w-5 h-5 text-default-400"
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//         {errors.password && (
//           <div className=" text-destructive mt-2">
//             {errors.password.message}
//           </div>
//         )}

//         <div className="mt-5  mb-8 flex flex-wrap gap-2">
//           <div className="flex-1 flex  items-center gap-1.5 ">
//             <Checkbox
//               {...register("remember-me")}
//               size="sm"
//               className="border-default-300 mt-[1px]"
//               id="isRemebered"
//               checked={rememberMe}
//               onClick={() => setRememberMe(!rememberMe)}
//             />
//             <Label
//               htmlFor="isRemebered"
//               className="text-sm text-default-600 cursor-pointer whitespace-nowrap"
//             >
//               Remember me
//             </Label>
//           </div>
//           <Link href="/auth/forgot" className="flex-none text-sm text-primary">
//             Forgot Password?
//           </Link>
//         </div>
//         <Button
//           className="w-full"
//           disabled={isPending}
//           size={!isDesktop2xl ? "lg" : "md"}
//         >
//           {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//           {isPending ? "Loading..." : "Login"}
//         </Button>
//       </form>
//       <Button
//         className="w-full mt-6"
//         color="dark" 
//         variant="outline"
//         disabled={isLoading}
//         size={!isDesktop2xl ? "lg" : "md"}
//         onClick={() => router.push("/auth/forgot")} // Change to your actual link
//       >
//         {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//         {isLoading ? "Loading..." : "Signup"}
//       </Button>

//       {/* <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
//         Login With{" "}
//       </div>
//       <div className="mt-6 xl:mt-3 flex flex-wrap justify-center gap-4">
//         <Button
//           type="button"
//           size="icon"
//           variant="outline"
//           className="rounded-full  border-default-300 hover:bg-transparent"
//           disabled={isPending}
//           onClick={handleAuth0Login}
//         >
//           <Image src={auth0Icon} alt="google" className="w-6 h-6" />
//         </Button>
//       </div> */}
//     </div>
//   );
// };

// export default LoginForm;


// // "use client";
// // import { useState } from "react";
// // import { useRouter } from "next/navigation"; // ✅ Import router for navigation
// // import loginUser from "../../config/auth";

// // const Login = () => {
// //   const [email, setEmail] = useState("");
// //   const [employeeCode, setEmployeeCode] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const router = useRouter(); // ✅ Router instance for redirection

// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
    
// //     const result = await loginUser(email, employeeCode);
// //     console.log("heyyyyy",result)
    
// //     if (result.success) {
// //       console.log("✅ Login Successful");
// //       router.replace("/"); // ✅ Redirect to homepage
// //       window.location.reload(); // ✅ Force reload to update auth state
// //     } else {
// //       alert(result.message || "Login failed. Please try again.");
// //     }
    
// //     setLoading(false);
// //   };

// //   return (
// //     <div className="flex flex-col items-center justify-center min-h-screen">
// //       <h2 className="text-2xl font-bold">Login</h2>
// //       <form onSubmit={handleLogin} className="flex flex-col space-y-3">
// //         <input
// //           type="email"
// //           placeholder="Enter Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           className="border px-3 py-2"
// //           required
// //         />
// //         <input
// //           type="text"
// //           placeholder="Enter Employee Code"
// //           value={employeeCode}
// //           onChange={(e) => setEmployeeCode(e.target.value)}
// //           className="border px-3 py-2"
// //           required
// //         />
// //         <button
// //           type="submit"
// //           className="bg-blue-500 text-white px-4 py-2 rounded"
// //           disabled={loading}
// //         >
// //           {loading ? "Logging in..." : "Login"}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Login;