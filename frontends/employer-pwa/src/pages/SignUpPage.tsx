import { SignUp } from "@clerk/clerk-react";

export const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <SignUp 
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in"
          appearance={{
            elements: {
              rootBox: "w-full mx-auto",
              card: "bg-slate-900 border border-white/10 shadow-2xl rounded-3xl",
              headerTitle: "text-white text-2xl font-bold",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-500 text-white font-bold py-3",
              formFieldLabel: "text-slate-300",
              formFieldInput: "bg-white/5 border border-white/10 text-white",
              footerActionLink: "text-blue-400 hover:text-blue-300",
              identityPreviewText: "text-white",
              identityPreviewEditButtonIcon: "text-blue-400"
            }
          }}
        />
      </div>
    </div>
  );
};
