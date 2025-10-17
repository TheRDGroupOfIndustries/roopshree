"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Share2,
  User,
  MapPin,
  Bell,
  Globe,
  Moon,
  Headphones,
  Check,
  HelpCircle,
  Star,
  Info,
  LogOut,
  ChevronRight,
  LucideIcon,
  Crown,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/Components/LoadingSpinner";
import RecentOrdersSection from "@/Components/RecentOrdersSection";

// --- Type Definitions ---

interface ProfileStat {
  label: string;
  value: number;
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
  right?: React.ReactNode;
  hasToggle?: boolean;
  onClick?: () => void;
  info?: string;
  link?: string;
}
interface QuickActionProps extends QuickAction {}

// --- Component Helpers ---

const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = "",
}) => (
  <div className={`p-4 sm:p-6  my-2 ${className}`}>
    {title && (
      <h3 className="text-base sm:text-lg font-semibold   mb-4">{title}</h3>
    )}
    <div className="space-y-1">{children}</div>
  </div>
);

const SettingButton: React.FC<SettingButtonProps> = ({
  icon: Icon,
  label,
  right,
  hasToggle,
  info,
  onClick,
  link,
}) => {
  const content = (
    <button
      onClick={onClick}
      className="w-full  flex items-center p-3 sm:p-4  rounded-lg  "
    >
      <span className="w-5 h-5 mr-3 sm:mr-4   flex items-center justify-center flex-shrink-0">
        <Icon size={20} />
      </span>
      <div className="flex-1 text-left">
        <span className="font-medium text-sm sm:text-base block">{label}</span>
        {info && <span className="text-xs   block mt-0.5">{info}</span>}
      </div>
      <span className="ml-auto   flex items-center gap-2">
        {hasToggle ? (
          <ToggleSwitch label={label} />
        ) : (
          <>
            {right && <span className="text-sm ">{right}</span>}
            <ChevronRight size={18} />
          </>
        )}
      </span>
    </button>
  );

  return link ? (
    <Link href={link} className="block hover:opacity-90 transition">
      {content}
    </Link>
  ) : (
    content
  );
};

// Sub-component for Dark Mode Toggle
const ToggleSwitch: React.FC<{ label: string }> = () => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const handleToggle = () => {
    // setTheme(isDark ? "light" : "dark");
  };

  return (
    <label
      className="relative inline-flex items-center cursor-pointer"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={isDark}
        onChange={handleToggle}
        className="sr-only peer"
      />
      <div className="w-11 h-6  rounded-full peer bg-gray-300 peer-checked:bg-orange-500 transition-colors after:content-['']  border-black after:absolute after:top-[2px] after:left-[2px] after:bg-gray-800 after:border-gray-800 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
    </label>
  );
};

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
    <div className="flex flex-col items-center text-gray-800 relative">
      <div
        className={`px-8 h-12  ${bg} rounded-full flex items-center justify-center gap-2 relative shadow-sm`}
      >
        <Icon className={`text-base ${iconColor}`} />
        <span className="text-sm font-medium text-gray-800 dark:text-black  dark:rounded">
          {label}
        </span>

        {count && (
          <span className="absolute -top-1 -right-1 bg-[var(--color-brand)]  text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 z-10">
            {count}
          </span>
        )}
      </div>

      {badge && (
        <span className="text-[10px] sm:text-xs text-gray-500 mt-1 text-center">
          {badge}
        </span>
      )}
    </div>
  </Link>
);

const LanguageSetting: React.FC<AppSetting> = ({ icon, label }) => {
  const LANGUAGES = ["English", "Hindi", "Spanish"];
  const [openLang, setOpenLang] = useState(false);
  const [language, setLanguage] = useState(LANGUAGES[0]);

  const handleSelectLanguage = useCallback((lang: string) => {
    setLanguage(lang);
    setOpenLang(false);
  }, []);

  return (
    <div className="relative">
      <SettingButton
        icon={icon}
        label={label}
        right={<span className="">{language}</span>}
        onClick={() => setOpenLang(!openLang)}
      />

      {openLang && (
        <div className="absolute right-4 top-full mt-2    rounded-xl shadow-lg overflow-hidden z-20 w-32 origin-top-right animate-in fade-in-0 zoom-in-95">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => handleSelectLanguage(lang)}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                language === lang
                  ? "bg-orange-50 text-orange-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {lang}
              {language === lang && (
                <Check size={14} className="inline ml-2 align-text-bottom" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Profile Page Component ---

export default function ProfilePage() {
  const { logout, user } = useAuth();
  const router = useRouter();

  if (!user) {
    return <LoadingSpinner message="Loading Profile..." />;
  }

  const cartCount = user?.cart?.items.length || 0;
  const orderCount = user?.orders?.length;
  const wishListCount = user?.wishlist?.length;

  const handleLogout = () => {
    logout();
    router.push("/auth/signin");
    toast.success("Logged out successfully!");
  };

  // --- Data Definitions ---

  const profileStats: ProfileStat[] = [
    { label: "Orders", value: orderCount as number },
    { label: "Points", value: 156 },
    { label: "Saved", value: "₹12,480" as any },
  ];

  const quickActions: QuickAction[] = [
    {
      icon: ShoppingCart,
      label: "My Orders",
      bg: "bg-[var(--color-brand)]/50",
      iconColor: "text-[var(--color-brand)]",
      link: "/my-orders",
      count: orderCount,
    },
    {
      icon: Heart,
      label: "Wishlist",
      bg: "bg-red-200",
      iconColor: "text-orange-600",
      link: "/my-wishlist",
      count: wishListCount,
    },
  ];

  const accountSettings: AccountSetting[] = [
    {
      icon: User,
      label: "Personal Information",
      link: `/profile/personal/${user.id}`,
      info: user.email || "Add email address",
    },
    {
      icon: MapPin,
      label: "Delivery Addresses",
      link: "/profile/addresses",
      info: " saved addresses",
    },
  ];

  const supportHelps: SupportHelp[] = [
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

  const appSettings: AppSetting[] = [
    {
      icon: Moon,
      label: "Dark Mode",
      hasToggle: true,
    },
  ];

  // --- Render ---

  return (
    <div className="min-h-screen  bg-white text-black flex flex-col pb-16">
      {/* Header */}
      <header className="sticky top-0 flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 z-30   shadow-md bg-white">
        <button className="  text-xl p-1" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-semibold text-lg sm:text-xl flex-1 text-center   ">
          Profile
        </h2>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button className=" p-1">
            <Share2 size={22} />
          </button>
          <Link href="/my-cart" className="relative   p-1">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] font-bold   bg-[var(--color-brand)] rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center z-10">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Profile Section */}
      <div className="relative overflow-hidden mb-2">
        <div className="absolute inset-0">
          <Image
            src="/images/image.png"
            alt="Profile Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[rgba(255,100,50,0.3)] backdrop-blur-sm "></div>
        </div>
        <div className="relative z-10 flex flex-col items-center py-6 sm:py-8 px-4 sm:px-6 ">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            <Image
              src={user.profileImage || "/images/dummy_profile.png"}
              alt={`Profile picture of ${user.name || "User"}`}
              fill
              className="rounded-full shadow-xl object-cover ring-4 ring-white/50"
              sizes="96px"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mt-3">
            {user.name || "Priya Sharma"}
          </h1>
          <p className="text-sm sm:text-base opacity-90">Premium Member</p>

          <div className="flex justify-between w-full max-w-md mt-6 gap-4 border-t border-white/30 pt-4">
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
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {quickActions.map((action, i) => (
            <QuickAction key={i} {...action} />
          ))}
        </div>
      </Section>

      {/* Account Settings */}
      <Section title="Account Settings">
        {accountSettings.map((setting, i) => (
          <SettingButton
            key={i}
            icon={setting.icon}
            label={setting.label}
            info={setting.info}
            link={setting.link}
          />
        ))}
      </Section>

      {/* Support & Help */}
      <Section title="Support & Help">
        {supportHelps.map((support, i) => (
          <SettingButton
            key={i}
            icon={support.icon}
            label={support.label}
            info={support.info}
            link={support.link}
          />
        ))}
      </Section>

      <div>
        <RecentOrdersSection />
      </div>

      {/* App Settings */}
      {/* <Section title="App Settings">
        {appSettings.map((setting, i) => {
          if (setting.label === "Language") {
            return <LanguageSetting key={i} {...setting} />;
          }

          if (setting.hasToggle) {
            return (
              <SettingButton
                key={i}
                icon={setting.icon}
                label={setting.label}
                hasToggle
              />
            );
          }

          if (setting.link) {
            return (
              <SettingButton
                key={i}
                icon={setting.icon}
                label={setting.label}
                link={setting.link}
                right={<span className="text-orange-500">Open</span>}
              />
            );
          }

          return (
            <SettingButton
              key={i}
              icon={setting.icon}
              label={setting.label}
              right={setting.right}
            />
          );
        })}
      </Section> */}

      {/* Logout */}
      <Section>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 text-orange-600  rounded-lg transition-colors font-semibold active:bg-orange-100"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </Section>
    </div>
  );
}
