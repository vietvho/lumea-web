import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <SignUp appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "bg-zinc-900 border border-zinc-800 shadow-2xl",
          headerTitle: "text-white",
          headerSubtitle: "text-zinc-400",
          socialButtonsBlockButton: "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700",
          formButtonPrimary: "bg-white text-black hover:bg-zinc-200",
          footerActionText: "text-zinc-400",
          footerActionLink: "text-white hover:text-zinc-300",
          formFieldLabel: "text-zinc-300",
          formFieldInput: "bg-zinc-800 border-zinc-700 text-white focus:ring-zinc-600",
          dividerText: "text-zinc-500",
          dividerLine: "bg-zinc-800"
        }
      }} />
    </div>
  );
}
