import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    // Redirect to main app if logged in
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return null;
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-yellow-400 p-8">
      <h1 className="text-5xl font-extrabold mb-4 text-white drop-shadow-lg text-center">
        Welcome to CoinBuy Planner
      </h1>
      <p className="text-xl text-white/90 mb-8 text-center max-w-xl">
        Plan and track your crypto purchases. Register to securely save your
        coin buy plans, access them from anywhere, and never miss your
        investment goals. Sign up with Email, Google, or Facebook to get
        started!
      </p>
      <Link href="/api/auth/signin">
        <button className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold px-8 py-3 rounded-full text-xl shadow-lg transition">
          Get Started
        </button>
      </Link>
    </div>
  );
}
