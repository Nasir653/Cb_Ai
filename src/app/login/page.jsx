// "use client";
// //import Image from "next/image";
// //import { Icon } from "@iconify/react";
// //import background from "@/public/images/auth/login-bg.jpg";
// //import background from "@/public/images/auth/login-screen-rodic-lms.png";
// //import { Button } from "@/components/ui/button";
// //import { X } from "lucide-react";
// import { useState } from "react";
// //import { Dialog, DialogContent } from "@/components/ui/dialog";
// import LoginForm from "../components/auth/LoginForm";
// function Login() {
//     const [openVideo, setOpenVideo] = useState(false);
//     return (
//         <>
//             <div className="min-h-screen bg-background  flex items-center  overflow-hidden w-full">
//                 <div className="min-h-screen basis-full flex flex-wrap w-full  justify-center overflow-y-auto">
//                     <div
//                         className="basis-1/2 bg-primary w-full  relative hidden xl:flex justify-center items-center bg-gradient-to-br
//         from-primary-600 via-primary-400 to-primary-600
//        "
//                     >
//                         {/* <Image
//             src={background}
//             alt="image"
//             className="absolute top-0 left-0 w-full h-full "
//           /> */}
//                         <div className="relative z-10 max-w-[1024px]">
//                             <div>
//                                 <Image
//                                     src={background}
//                                     alt="image"
//                                     className="w-full h-full "
//                                 />
//                                 {/* <div className="text-4xl leading-[50px] 2xl:text-6xl 2xl:leading-[72px] font-semibold mt-2.5">
//                 <span className="text-default-600 dark:text-default-300 ">
//                   Unlock <br />
//                   Your Project <br />
//                 </span>
//                 <span className="text-default-900 dark:text-default-50">
//                   Performance
//                 </span>
//               </div> */}
//                                 {/* <div className="mt-5 2xl:mt-8 text-default-900 dark:text-default-200  text-2xl font-medium">
//                 You will never know everything. <br />
//                 But you will know more...
//               </div> */}
//                             </div>
//                         </div>
//                     </div>

//                     <div className=" min-h-screen basis-full md:basis-1/2 w-full px-4 py-5 flex justify-center items-center">
//                         <div className="lg:w-[480px] ">
//                             <LoginForm />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Dialog open={openVideo}>
//                 <DialogContent size="lg" className="p-0" hideCloseIcon>
//                     <Button
//                         size="icon"
//                         onClick={() => setOpenVideo(false)}
//                         className="absolute -top-4 -right-4 bg-default-900"
//                     >
//                         <X className="w-6 h-6" />
//                     </Button>
//                     <iframe
//                         width="100%"
//                         height="315"
//                         src="https://www.youtube.com/embed/8D6b3McyhhU?si=zGOlY311c21dR70j"
//                         title="YouTube video player"
//                         frameBorder="0"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                         allowFullScreen
//                     ></iframe>
//                 </DialogContent>
//             </Dialog>
//         </>
//     )
// }

// export default Login