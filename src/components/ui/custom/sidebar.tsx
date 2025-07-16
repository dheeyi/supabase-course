import { cn } from "@/lib/utils"
import { Instagram, Dribbble, PartyPopper, LogOut } from "lucide-react"
import { signOut } from "@/app/login/actions"

const navItems = [
  "HOME",
  "ABOUT",
  "SERVICES",
  "WORKS",
  "BLOGS",
  "CONTACT",
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#111] text-white flex flex-col justify-between py-8 px-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">Jac.</h1>
      </div>

      <nav className="flex flex-col gap-5 mt-10">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className={cn(
              "text-white font-light tracking-wide text-sm relative",
              item === "HOME" &&
              "font-bold before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:h-0.5 before:w-5 before:bg-gradient-to-r before:from-pink-500 before:to-yellow-500"
            )}
          >
            {item}
          </a>
        ))}
        <button
          onClick={signOut}
          className="text-white font-light tracking-wide text-sm relative flex items-center gap-2"
        >
          <LogOut size={18} />
          LOGOUT
        </button>
      </nav>

      <div className="flex flex-col items-start gap-4">
        {[Instagram, Dribbble, PartyPopper].map((Icon, i) => (
          <div
            key={i}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center"
          >
            <Icon size={18} />
          </div>
        ))}
      </div>

      <p className="text-xs text-white/70 mt-10 text-center">
        Copyright ©2023 Jacob Jones. All rights reserved.
      </p>
    </aside>
  )
}
