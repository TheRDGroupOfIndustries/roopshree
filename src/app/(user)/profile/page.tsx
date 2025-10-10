"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  Gift,
  ArrowLeft,
  Share2,
  User,
  MapPin,
  CreditCard,
  Bell,
  Globe,
  Moon,
  Shield,
  Headphones,
  Check,
  HelpCircle,
  Star,
  Info,
  LogOut,
  ChevronRight,
  Wallet,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Type Definitions
interface ProfileStat {
  label: string;
  value: string;
}
interface QuickAction {
  icon: LucideIcon;
  label: string;
  bg: string;
  iconColor: string;
  link: string;
  count?: number;
  badge?: string;
}
interface AccountSetting {
  icon: LucideIcon;
  label: string;
  link: string;
  info: string;
}
interface SupportHelp {
  icon: LucideIcon;
  label: string;
  info: string;
  link: string;
}
interface AppSetting {
  icon: LucideIcon;
  label: string;
  right?: string;
  link?: string;
  hasToggle?: boolean;
}
interface RecentOrder {
  name: string;
  order: string;
  status: string;
  price: string;
  statusColor: string;
  action: string;
  image: string;
}
interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}
interface SettingButtonProps {
  icon: LucideIcon;
  label: string;
  right?: string;
  hasToggle?: boolean;
  onClick?: () => void;
  info?: string;
}
interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  bg: string;
  iconColor: string;
  link: string;
  count?: number;
  badge?: string;
}
interface OrderCardProps {
  order: RecentOrder;
}

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const { logout, user } = useAuth();
  const router = useRouter();

   const cartCount = user?.cart?.length || 0;
  
  const handleLogout = () => {
    logout();
    router.push("/auth/signin");
    toast.success("Logged out successfully!");
  };

  const profileStats: ProfileStat[] = [
    { label: "Orders", value: "28" },
    { label: "Points", value: "156" },
    { label: "Saved", value: "₹12,480" },
  ];

  const quickActions: QuickAction[] = [
    {
      icon: ShoppingCart,
      label: "My Orders",
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
      link: "/my-cart",
      count: 28,
    },
    {
      icon: Heart,
      label: "Wishlist",
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
      link: "/Wishlist",
      count: 12,
    },
    {
      icon: Gift,
      label: "Rewards",
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
      link: "/rewards",
      badge: "156 pts",
    },
    {
      icon: Wallet,
      label: "Wallet",
      bg: "bg-green-100",
      iconColor: "text-green-600",
      link: "/wallet",
      badge: "₹2,450",
    },
  ];

  const accountSettings: AccountSetting[] = [
    {
      icon: User,
      label: "Personal Information",
      link: "/profile/personal",
      info: "priya.sharma@email.com",
    },
    {
      icon: MapPin,
      label: "Delivery Addresses",
      link: "/profile/addresses",
      info: "3 saved addresses",
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      link: "/profile/payments",
      info: "2 cards saved",
    },
    {
      icon: Bell,
      label: "Notifications",
      link: "/profile/notify",
      info: "All enabled",
    },
  ];

const SupportHelps: SupportHelp[] = [
  {
    icon: Headphones,
    label: "Customer Support",
    link: "/profile/support",
    info: "24/7 assistance",
  },
  {
    icon: HelpCircle,
    label: "FAQ",
    link: "/profile/faq",
    info: "Common questions",
  },
  {
    icon: Star,
    label: "Rate App",
    link: "/profile/rateapp",
    info: "Share feedback",
  },
  {
    icon: Info,
    label: "About Us",
    link: "/profile/aboutus",
    info: "Know our story",
  },
];
  const recentOrders: RecentOrder[] = [
    {
      name: "Luxury Foundation",
      order: "#RP2044001",
      status: "Delivered",
      price: "₹1,299",
      statusColor: "text-green-600",
      action: "Reorder",
      image: "/images/image.png",
    },
    {
      name: "Matte Lipstick",
      order: "#RP2044002",
      status: "In Transit",
      price: "₹700",
      statusColor: "text-orange-600",
      action: "Track",
      image: "/images/image.png",
    },
  ];

  const appSettings: AppSetting[] = [
    {
      icon: Globe,
      label: "Language",
      right: "English",
      link: "/settings/language",
    },
    { icon: Moon, label: "Dark Mode", hasToggle: true },
    { icon: Shield, label: "Privacy Settings", link: "/settings/privacy" },
  ];

  const Section: React.FC<SectionProps> = ({
    title,
    children,
    className = "",
  }) => (
    <div className={`p-4 sm:p-6 bg-white my-2 ${className}`}>
      {title && (
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );

  const SettingButton: React.FC<SettingButtonProps> = ({
    icon: Icon,
    label,
    right,
    hasToggle,
    info,
    onClick,
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center p-3 sm:p-4 bg-white rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mb-2 active:bg-gray-100"
    >
      <span className="w-5 h-5 mr-3 sm:mr-4 text-gray-500 flex items-center justify-center flex-shrink-0">
        <Icon size={20} />
      </span>
      <div className="flex-1 text-left">
        <span className="font-medium text-sm sm:text-base block">{label}</span>
        {info && (
          <span className="text-xs text-gray-500 block mt-0.5">{info}</span>
        )}
      </div>
      <span className="ml-auto text-gray-400 flex items-center gap-2">
        {hasToggle ? (
          <label
            className="relative inline-flex items-center cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        ) : (
          <>
            {right && <span className="text-sm">{right}</span>}
            <ChevronRight size={18} />
          </>
        )}
      </span>
    </button>
  );

  const QuickAction: React.FC<QuickActionProps> = ({
    icon: Icon,
    label,
    bg,
    iconColor,
    link,
    count,
    badge,
  }) => (
    <Link href={link}>
      <div className="flex flex-col items-center text-gray-700 hover:opacity-80 transition-opacity active:scale-95 relative">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 ${bg} rounded-full flex items-center justify-center relative`}
        >
          <Icon className={`text-xl sm:text-2xl ${iconColor}`} />
          {count && (
            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {count}
            </span>
          )}
        </div>
        <span className="text-xs sm:text-sm mt-2 text-center font-medium">
          {label}
        </span>
        {badge && (
          <span className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );

  const OrderCard: React.FC<OrderCardProps> = ({ order }) => (
    <div className="flex items-center justify-between mb-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center flex-1">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl mr-3 overflow-hidden bg-gray-200 flex-shrink-0 relative">
          <Image
            src={order.image}
            alt={order.name}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base text-gray-800 font-semibold truncate">
            {order.name}
          </p>
          <p className="text-xs text-gray-500">{order.order}</p>
          <p className={`text-xs sm:text-sm font-medium ${order.statusColor}`}>
            {order.status}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end ml-4">
        <span className="text-sm sm:text-base font-bold mb-2 whitespace-nowrap">
          {order.price}
        </span>
        <button className="text-orange-600 text-xs sm:text-sm font-medium hover:text-orange-700">
          {order.action}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      {/* Header */}
      <header className="sticky top-0 bg-white flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 shadow-sm z-20">
        <button className="text-gray-600 text-xl hover:text-gray-800 transition-colors p-1" onClick={()=>window.history.back()}>
          <ArrowLeft size={24}  />
        </button>
        <h2 className="font-semibold text-lg sm:text-xl flex-1 text-center">
          Profile
        </h2>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button className="text-gray-600 hover:text-orange-500 p-1">
            <Share2 size={22} />
          </button>
          <Link
            href="/my-cart"
            className="relative text-gray-600 hover:text-orange-500 p-1"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] font-bold text-white bg-orange-600 rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Profile Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/image.png"
            alt="Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[var(--color-brand)]/30"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center py-6 sm:py-8 px-4 sm:px-6 text-white">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            <Image
              src={user?.profileImage || "/images/dummy_profile.png"}
              alt={
                user?.name
                  ? `Profile picture of ${user.name}`
                  : "Profile Picture"
              }
              fill
              className="rounded-full shadow-md object-cover"
            />{" "}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mt-3">
            {user?.name || "User"}
          </h1>
          <p className="text-sm sm:text-base">Premium Member</p>

          <div className="flex justify-between w-full max-w-md mt-6 gap-4">
            {profileStats.map((item, i) => (
              <div className="text-center flex-1" key={i}>
                <p className="text-xs sm:text-sm opacity-90">{item.label}</p>
                <p className="text-lg sm:text-xl font-semibold mt-1">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Section title="Quick Actions">
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, i) => (
            <QuickAction key={i} {...action} />
          ))}
        </div>
      </Section>

      {/* Account Settings */}
      <Section title="Account Settings">
        {accountSettings.map((setting, i) => (
          <Link key={i} href={setting.link}>
            <SettingButton
              icon={setting.icon}
              label={setting.label}
              info={setting.info}
            />
          </Link>
        ))}
      </Section>

      <Section title="Support & Help">
        {SupportHelps.map((Support, i) => (
          <Link key={i} href={Support.link}>
            <SettingButton
              icon={Support.icon}
              label={Support.label}
              info={Support.info}
            />
          </Link>
        ))}
      </Section>

      {/* permium section */}
      <Section>
  <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100 w-full">
    {/* Header */}
    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-5 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
          Premium Membership
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Unlock exclusive benefits and special rewards
        </p>
      </div>

      <div className="relative bg-white p-4 md:p-5 rounded-full shadow-lg">
        <span className="absolute inset-0 bg-gradient-to-tr from-purple-400 via-pink-400 to-yellow-400 opacity-20 rounded-full blur-md"></span>
        <ShoppingCart className="w-7 h-7 text-purple-600 relative z-10" />
      </div>
    </div>

    {/* Benefits List */}
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      {[
        "Free express delivery on all orders",
        "Early access to sales & new launches",
        "Double reward points on every purchase",
        "Priority customer support 24/7",
      ].map((benefit, index) => (
        <li
          key={index}
          className="flex items-center gap-3 bg-white/60 backdrop-blur-md rounded-xl p-3 shadow-sm hover:shadow-md transition-all border border-gray-100"
        >
          <div className="bg-green-100 p-1.5 rounded-full">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-gray-700 font-medium">{benefit}</span>
        </li>
      ))}
    </ul>

    {/* Upgrade Button */}
    <Link href="/profile/upgrade">
      <button className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 active:scale-95">
        Upgrade Now ✨
      </button>
    </Link>
  </div>
</Section>


      {/* Recent Orders */}
      <Section title="Recent Orders">
        {recentOrders.map((order) => (
          <OrderCard key={order.order} order={order} />
        ))}
      </Section>

      {/* App Settings */}
      <Section title="App Settings">
        {appSettings.map((setting, i) => (
          <SettingButton
            key={i}
            icon={setting.icon}
            label={setting.label}
            right={setting.right}
            hasToggle={setting.hasToggle}
          />
        ))}
      </Section>

      {/* Logout */}
      <Section>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-semibold"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </Section>
    </div>
  );
}
