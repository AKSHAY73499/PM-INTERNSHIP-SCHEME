import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"


export default function Header() {
  return (
    <>
      <div className="flex-1" />
      <ThemeToggle />
      <UserNav />
    </>
  )
}