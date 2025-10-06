"use client";
import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineHeart, AiOutlineGift } from "react-icons/ai";
import Image from "next/image";
import { GoPerson, GoShareAndroid } from "react-icons/go";
import { IoArrowBackOutline } from "react-icons/io5";
import {
  RiLogoutBoxLine,
  RiNotification2Line,
  RiWalletLine,
} from "react-icons/ri";
import { FaAngleRight } from "react-icons/fa";
import { LuCrown, LuMapPin, LuShieldCheck } from "react-icons/lu";
import { MdOutlineHeadsetMic } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";
import {
  IoIosInformationCircleOutline,
  IoMdCheckmark,
  IoMdStarOutline,
} from "react-icons/io";
import { CiGlobe } from "react-icons/ci";
import { CgDarkMode } from "react-icons/cg";
export default function ProfilePage() {
  const [cartCount] = useState(3);

  // 🔹 Reusable Components
  const Section = ({ title, children }: any) => (
    <div className="p-4 bg-white my-2">
      {title && <h3 className="text-md font-semibold text-gray-800 mb-4">{title}</h3>}
      {children}
    </div>
  );

  const SettingButton = ({
    icon,
    label,
    right,
  }: {
    icon: any;
    label: string;
    right?: any;
  }) => (
    <button className="w-full flex items-center p-3 bg-white rounded-lg text-gray-700 hover:bg-gray-100 mb-2">
      <span className="w-5 h-5 mr-4 text-gray-500 flex items-center justify-center">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      <span className="ml-auto text-gray-400 flex items-center gap-1">{right}</span>
    </button>
  );

  const QuickAction = ({ icon, label, bg }: any) => (
    <button className="flex flex-col items-center text-gray-700">
      <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-sm mt-2">{label}</span>
    </button>
  );

  //  Main JSX
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      {/* Header */}
      <header className="sticky top-0 bg-white flex justify-between items-center px-4 py-3 shadow-sm z-20"
        style={{ boxShadow: "0 2px 4px -1px rgba(0,0,0,0.1)" }}>
        <button aria-label="Back" className="text-gray-600 text-xl"><IoArrowBackOutline /></button>
        <h2 className="font-semibold text-lg flex-1 text-center">Profile</h2>
        <div className="flex items-center space-x-4">
          <button aria-label="Share" className="text-gray-600 text-xl hover:text-orange-500"><GoShareAndroid /></button>
          <div className="relative">
            <button aria-label="View cart" className="text-gray-600 text-xl hover:text-orange-500">
              <FiShoppingCart />
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center 
                text-[10px] font-bold text-white bg-orange-500 rounded-full w-[16px] h-[16px]">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <div className="flex-1 shadow-lg">
        <div className="relative overflow-hidden">
          <Image width={200} height={300} src="/images/image.png" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-orange-400/30"></div>
          <div className="relative z-10 flex flex-col items-center py-8 px-14 text-white">
            <div className="relative w-24 h-24">
              <Image src="/images/profile_img.png" alt="Profile Picture" fill className="rounded-full shadow-md object-cover" />
            </div>
            <h1 className="text-xl font-bold mt-2">Priya Sharma</h1>
            <p className="text-sm">Premium Member</p>

            <div className="flex justify-between w-full mt-4">
              {[
                { label: "Orders", value: "28" },
                { label: "Points", value: "156" },
                { label: "Saved", value: "₹12,480" },
              ].map((item, i) => (
                <div className="text-center" key={i}>
                  <p className="text-sm">{item.label}</p>
                  <p className="text-lg font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Section title="Quick Actions">
          <div className="grid grid-cols-4 gap-4">
            <QuickAction icon={<FiShoppingCart className="text-xl text-orange-600" />} label="My Orders" bg="bg-orange-50" />
            <QuickAction icon={<AiOutlineHeart className="text-xl text-orange-600" />} label="Wishlist" bg="bg-orange-50" />
            <QuickAction icon={<AiOutlineGift className="text-xl text-purple-600" />} label="Rewards" bg="bg-purple-200" />
            <QuickAction icon={<RiWalletLine className="text-xl text-green-500" />} label="Wallet" bg="bg-green-100" />
          </div>
        </Section>

        {/* Account Settings */}
        <Section title="Account Settings">
          <SettingButton icon={<GoPerson />} label="Personal Information" right={<FaAngleRight />} />
          <SettingButton icon={<LuMapPin />} label="Delivery Addresses" right={<FaAngleRight />} />
          <SettingButton icon={<RiWalletLine />} label="Payment Methods" right={<FaAngleRight />} />
          <SettingButton icon={<RiNotification2Line />} label="Notifications" right={<FaAngleRight />} />
        </Section>

        {/* Support & Help */}
        <Section title="Support & Help">
          <SettingButton icon={<MdOutlineHeadsetMic />} label="Customer Support" right={<FaAngleRight />} />
          <SettingButton icon={<BsQuestionCircle />} label="FAQ" right={<FaAngleRight />} />
          <SettingButton icon={<IoMdStarOutline />} label="Rate App" right={<FaAngleRight />} />
          <SettingButton icon={<IoIosInformationCircleOutline />} label="About Us" right={<FaAngleRight />} />
        </Section>

        {/* Premium Section */}
        <Section>
          <div className="bg-purple-50 p-4 rounded-lg mb-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-1">Premium Membership</h3>
                <p className="text-sm text-gray-600">Get exclusive benefits and offers</p>
              </div>
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <LuCrown />
              </span>
            </div>

            <ul className="grid grid-cols-2 gap-4 text-sm list-none mt-4 mb-4">
              {["Free delivery", "Early access", "Extra rewards", "Priority support"].map((item) => (
                <li key={item} className="flex items-center">
                  <IoMdCheckmark className="mr-2 text-green-600" /> {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-purple-800">
              Upgrade Now
            </button>
          </div>
        </Section>

        {/* Recent Orders */}
        <Section title="Recent Orders">
          {[
            { name: "Luxury Foundation", order: "#RP2044001", status: "Delivered", price: "₹1,299", color: "text-green-600", action: "Reorder" },
            { name: "Matte Lipstick", order: "#RP2044002", status: "In Transit", price: "₹700", color: "text-orange-600", action: "Track" },
          ].map((item) => (
            <div key={item.order} className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl mr-2 overflow-hidden">
                  <Image src="/images/image.png" alt={item.name} width={40} height={40} layout="responsive" objectFit="cover" />
                </div>
                <div>
                  <p className="text-sm text-gray-800 font-semibold">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.order}</p>
                  <p className={`text-xs ${item.color}`}>{item.status}</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold mb-2">{item.price}</span>
                <span className="text-orange-500 text-xs">{item.action}</span>
              </div>
            </div>
          ))}
        </Section>

        {/* App Settings */}
        <Section title="App Settings">
          <SettingButton
            icon={<CiGlobe />}
            label="Language"
            right={<><span>English</span><FaAngleRight /></>}
          />
          <SettingButton
            icon={<CgDarkMode />}
            label="Dark Mode"
            right={
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                  after:bg-white after:border-gray-300 after:border after:rounded-full
                  after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            }
          />
          <SettingButton icon={<LuShieldCheck />} label="Privacy Settings" right={<FaAngleRight />} />
        </Section>

        {/* Logout */}
        <Section>
          <button className="w-full flex items-center justify-center gap-2 py-3 text-orange-700 hover:bg-orange-50 rounded-lg">
            <RiLogoutBoxLine className="text-lg" />
            <span className="font-semibold">Logout</span>
          </button>
        </Section>
      </div>
    </div>
  );
}


// "use client";
// import { useState } from "react";
// import { FiShoppingCart } from "react-icons/fi";
// import { AiOutlineHeart, AiOutlineGift } from "react-icons/ai";
// import Image from "next/image";
// import { GoPerson, GoShareAndroid } from "react-icons/go";
// import { IoArrowBackOutline } from "react-icons/io5";
// import {
//   RiLogoutBoxLine,
//   RiNotification2Line,
//   RiWalletLine,
// } from "react-icons/ri";
// import { FaAngleRight } from "react-icons/fa";
// import { LuCrown, LuMapPin, LuShieldCheck } from "react-icons/lu";
// import { MdOutlineHeadsetMic } from "react-icons/md";
// import { BsQuestionCircle } from "react-icons/bs";
// import {
//   IoIosInformationCircleOutline,
//   IoMdCheckmark,
//   IoMdStarOutline,
// } from "react-icons/io";
// import { CiGlobe } from "react-icons/ci";
// import { CgDarkMode } from "react-icons/cg";
// export default function ProfilePage() {
//   const [cartCount] = useState(3);

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col pb-16 ">
//       {/* Header */}
//       <header
//         className="sticky top-0 bg-white flex justify-between items-center px-4 py-3 shadow-sm z-20"
//         style={{ boxShadow: "0 2px 4px -1px rgba(0,0,0,0.1)" }}
//       >
//         {/* Back Button */}
//         <button
//           aria-label="Back"
//           className="text-gray-600 text-xl flex-shrink-0"
//         >
//           <IoArrowBackOutline />
//         </button>

//         {/* Title */}
//         <h2 className="font-semibold text-lg text-center flex-1">Profile</h2>

//         {/* Right Icons */}
//         <div className="flex items-center space-x-4 flex-shrink-0">
//           {/* Share Button */}
//           <button
//             aria-label="Share"
//             className="text-gray-600 text-xl hover:text-orange-500"
//           >
//             <GoShareAndroid />
//           </button>

//           {/* Cart Button */}
//           <div className="relative">
//             <button
//               aria-label="View cart"
//               className="text-gray-600 text-xl hover:text-orange-500"
//             >
//               <FiShoppingCart />
//             </button>

//             {cartCount > 0 && (
//               <span
//                 className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center 
//              text-[10px] font-bold text-white bg-orange-500 rounded-full 
//              w-[16px] h-[16px]"
//               >
//                 {cartCount}
//               </span>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Profile Section */}
//       <div className="flex-1 shadow-lg">
//         <div className="relative overflow-hidden">
//           {/* Background image */}
//           <Image
//             width={200}
//             height={300}
//             src="/images/image.png"
//             alt="Faded orange background with soft gradient texture"
//             className="absolute inset-0 w-full h-full object-cover"
//           />

//           {/* Semi-transparent orange overlay */}
//           <div className="absolute inset-0 bg-orange-400/30"></div>

//           {/* Content container */}
//           <div className="relative z-10 flex flex-col items-center py-8 px-14 w-full max-w-md text-white">
//             <div className="relative w-24 h-24">
//               <Image
//                 src="/images/profile_img.png"
//                 alt="Profile Picture"
//                 fill
//                 className="rounded-full  shadow-md object-cover"
//               />
//             </div>

//             <h1 className="text-xl font-bold mt-2">Priya Sharma</h1>
//             <p className="text-sm ">Premium Member</p>

//             <div className="flex justify-between w-full mt-4 ">
//               <div className="text-center">
//                 <p className="text-sm">Orders</p>
//                 <p className="text-lg font-semibold">28</p>
//               </div>

//               <div className="text-center">
//                 <p className="text-sm">Points</p>
//                 <p className="text-lg font-semibold">156</p>
//               </div>

//               <div className="text-center">
//                 <p className="text-sm">Saved</p>
//                 <p className="text-lg font-semibold">₹12,480</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className=" p-4 mb-2 bg-white">
//           <h3 className="text-md font-semibold text-gray-800 mb-4">
//             Quick Actions
//           </h3>
//           <div className="grid grid-cols-4 gap-4">
//             <button className="flex flex-col items-center text-gray-700  ">
//               <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
//                 <FiShoppingCart className="text-xl text-orange-600" />
//               </div>
//               <span className="text-sm mt-2">My Orders</span>
//             </button>
//             <button className="flex flex-col items-center text-gray-700  ">
//               <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
//                 <AiOutlineHeart className="text-xl text-orange-600" />
//               </div>
//               <span className="text-sm mt-2">Wishlist</span>
//             </button>
//             <button className="flex flex-col items-center text-gray-700  ">
//               <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
//                 <AiOutlineGift className="text-xl text-purple-600" />
//               </div>
//               <span className="text-sm mt-2">Rewards</span>
//             </button>
//             <button className="flex flex-col items-center text-gray-700  ">
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                 <RiWalletLine className="text-xl text-green-500" />
//               </div>
//               <span className="text-sm mt-2">Wallet</span>
//             </button>
//           </div>
//         </div>

//         {/* Account Settings */}

//         <div className=" p-4 bg-white my-2">
//           <h3 className="text-md font-semibold text-gray-800 mb-4">
//             Account Settings
//           </h3>
//           <button className="w-full flex items-center p-3 bg-white rounded-lg text-gray-700 hover:bg-gray-100 mb-2">
//             <span className="w-5 h-5 mr-4 text-gray-600 flex items-center justify-center">
//               <GoPerson className="w-full h-full " />
//             </span>
//             <span className="font-medium">Personal Information</span>
//             <span className="ml-auto text-gray-400">
//               <FaAngleRight />
//             </span>
//           </button>
//           <button className="w-full flex items-center p-3 bg-white rounded-lg text-gray-700 hover:bg-gray-100 mb-2">
//             <span className="w-5 h-5 mr-4 text-gray-500 flex items-center justify-center">
//               <LuMapPin className="w-full h-full" />
//             </span>
//            <span className="font-medium">Delivery Addresses</span>
//             <span className="ml-auto text-gray-400">
//               <FaAngleRight />
//             </span>
//           </button>
//           <button className="w-full flex items-center p-3 bg-white rounded-lg text-gray-700 hover:bg-gray-100 mb-2">
//             <span className="w-5 h-5 mr-4 text-gray-500 flex items-center justify-center">
//               <RiWalletLine className="w-full h-full" />
//             </span>
//            <span className="font-medium">Payment Methods</span>
//             <span className="ml-auto text-gray-400">
//               <FaAngleRight />
//             </span>
//           </button>
//           <button className="w-full flex items-center p-3 bg-white rounded-lg text-gray-700 hover:bg-gray-100">
//             <span className="w-5 h-5 mr-4 text-gray-500 flex items-center justify-center">
//               <RiNotification2Line className="w-full h-full" />
//             </span>
//            <span className="font-medium">Notifications</span>
//             <span className="ml-auto text-gray-400">
//               <FaAngleRight />
//             </span>
//           </button>
//         </div>

//         {/* Support & Help */}
//         <div className=" p-4 bg-white my-2">
//           <h3 className="text-md font-semibold text-gray-800 mb-4">
//             Support & Help
//           </h3>
//           <button className="w-full flex items-center p-3 bg-white rounded-lg text-gray-700 hover:bg-gray-100 mb-2">
//             <span className="w-5 h-5 mr-4 text-gray-500 flex items-center justify-center">
//               <MdOutlineHeadsetMic className="w-full h-full" />
//             </span>
//            <span className="font-medium">Customer Support</span>
//             <span className="ml-auto text-gray-400">
//               <FaAngleRight />
//             </span>
//           </button>
//           <button className="w-full flex items-center p-3 bg-white rounded-lg text-gray-700 hover:bg-gray-100 mb-2">
//             <span className="w-5 h-5 mr-4 text-gray-500 flex items-center justify-center">
//               <BsQuestionCircle className="w-full h-full" />
//             </span>
//            <span className="font-medium">FAQ</span>
//             <span className="ml-auto text-gray-400">
//               <FaAngleRight />
//             </span>
//           </button>
//           <button className="w-full flex items-center p-3 bg-white rounded-lg text-gray-700 hover:bg-gray-100 mb-2">
//             <span className="w-5 h-5 mr-4 text-gray-500 flex items-center justify-center">
//               <IoMdStarOutline className="w-full h-full" />
//             </span>
//            <span className="font-medium">Rate App</span>
//             <span className="ml-auto text-gray-400">
//               <FaAngleRight />
//             </span>
//           </button>
//           <button className="w-full flex items-center p-3 bg-white rounded-lg text-gray-700 hover:bg-gray-100">
//             <span className="w-5 h-5 mr-4 text-gray-500 flex items-center justify-center">
//               <IoIosInformationCircleOutline className="w-full h-full" />
//             </span>
//            <span className="font-medium">About Us</span>
//             <span className="ml-auto text-gray-400">
//               <FaAngleRight />
//             </span>
//           </button>
//         </div>

//         <div className=" p-4 bg-white my-2">
//           <div className="bg-purple-50 p-4 rounded-lg mb-4 shadow-sm">
//             <div className="flex justify-between items-center">
//               <div className="flex flex-col gap-1">
//                 <h3 className="text-md font-semibold text-gray-800 mb-2 leading-tight">
//                   Premium Membership
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-0 leading-tight">
//                   Get exclusive benefits and offers
//                 </p>
//               </div>
//               <span className="w-10 h-10 flex items-center justify-center rounded-full  bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//                 <LuCrown />
//               </span>
//             </div>

//             <ul className="grid grid-cols-2 gap-4 text-sm list-none mb-4 mt-4">
//               <li className="flex items-center">
//                 <IoMdCheckmark className="mr-2 text-green-600" /> Free delivery
//               </li>
//               <li className="flex items-center">
//                 <IoMdCheckmark className="mr-2 text-green-600" /> Early access
//               </li>
//               <li className="flex items-center">
//                 <IoMdCheckmark className="mr-2 text-green-600" /> Extra rewards
//               </li>
//               <li className="flex items-center">
//                 <IoMdCheckmark className="mr-2 text-green-600" /> Priority
//                 support
//               </li>
//             </ul>
//             <button className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-purple-800">
//               Upgrade Now
//             </button>
//           </div>
//         </div>

//         {/* Recent Orders */}
//         <div className=" p-4 bg-white my-2">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-md font-semibold text-gray-800">
//               Recent Orders
//             </h3>
//             <a href="#" className="text-sm text-orange-500 ">
//               View All
//             </a>
//           </div>

//           <div className="flex items-center justify-between mb-4 ">
//             <div className="flex items-center">
//               <div className="w-10 h-10 rounded-xl mr-2 overflow-hidden">
//                 <Image
//                   src="/images/image.png" // replace with your image path
//                   alt="Profile"
//                   width={40}
//                   height={40}
//                   layout="responsive"
//                   objectFit="cover"
//                 />
//               </div>
//               <div className="font-semibold">
//                 <p className="text-sm text-gray-800">Luxury Foundation</p>
//                 <p className="text-xs text-gray-500 ">Order #RP2044001</p>
//                 <p className="text-xs text-green-600 ">Delivered</p>
//               </div>
//             </div>
//             <div className="flex flex-col items-center">
//               <span className="text-sm font-bold  mb-2">₹1,299</span>
//               <span className="text-orange-500 text-xs">Reorder</span>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="w-10 h-10 rounded-xl mr-2 overflow-hidden">
//                 <Image
//                   src="/images/image.png" // replace with your image path
//                   alt="Profile"
//                   width={40}
//                   height={40}
//                   layout="responsive"
//                   objectFit="cover"
//                 />
//               </div>
//               <div className="font-semibold">
//                 <p className="text-sm text-gray-800 ">Matte Lipstick</p>
//                 <p className="text-xs text-gray-500">Order #RP2044002</p>
//                 <p className="text-xs text-orange-600">In Transit</p>
//               </div>
//             </div>
//             <div className="flex flex-col items-center">
//               <span className="text-sm font-bold  mb-2">₹700</span>
//               <span className="text-orange-500 text-xs">Track</span>
//             </div>
//           </div>
//         </div>

//         <div className=" p-4 bg-white my-2">
//           <h3 className="text-md font-semibold text-gray-800 mb-4">
//             App Settings
//           </h3>
//           <button className="w-full flex items-center p-3 bg-white rounded-lg text-gray-700 hover:bg-gray-100 mb-2">
//             <span className="w-5 h-5 mr-4 text-gray-500 flex items-center justify-center">
//               <CiGlobe className="w-full h-full" />
//             </span>
//            <span className="font-medium">Language</span>
//             <span className="ml-auto flex items-center text-gray-400 gap-1">
//               English
//               <FaAngleRight />
//             </span>
//           </button>

//           <button className="w-full flex items-center p-3 bg-white rounded-lg text-gray-700 hover:bg-gray-100 mb-2">
//             <span className="w-5 h-5 mr-4 text-gray-500 flex items-center justify-center">
//               <CgDarkMode className="w-full h-full" />
//             </span>
//            <span className="font-medium">Dark Mode</span>
//             <span className="ml-auto">
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input type="checkbox" className="sr-only peer" />
//                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
//               </label>
//             </span>
//           </button>
//           <button className="w-full flex items-center p-3 bg-white rounded-lg text-gray-700 hover:bg-gray-100 mb-2">
//             <span className="w-5 h-5 mr-4 text-gray-500 flex items-center justify-center">
//               <LuShieldCheck className="w-full h-full" />
//             </span>
//            <span className="font-medium">Privacy Settings</span>
//             <span className="ml-auto text-gray-400">
//               <FaAngleRight />
//             </span>
//           </button>
//         </div>

//         <div className=" p-4 bg-white my-2">
//           <button className="w-full flex items-center justify-center gap-2 py-3 bg-white text-orange rounded-lg text-orange-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
//             <RiLogoutBoxLine className="text-lg" />
//             <span className="font-semibold">Logout</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

