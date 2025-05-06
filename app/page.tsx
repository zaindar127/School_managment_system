import { redirect } from "next/navigation"

export default function Home() {
  // In Next.js App Router, redirect should be called during rendering, not inside useEffect
  // This is a server component, so we can use redirect directly
  redirect("/login")
}
