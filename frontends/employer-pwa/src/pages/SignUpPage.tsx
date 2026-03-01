import { SignUp } from "@clerk/clerk-react";

export const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <SignUp 
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in"
          appearance={{
            elements: {
              rootBox: "w-full mx-auto",
              card: "bg-white border border-slate-200 shadow-xl rounded-3xl",
              headerTitle: "text-slate-900 text-2xl font-bold",
              headerSubtitle: "text-slate-500",
              socialButtonsBlockButton: "bg-white border border-slate-200 text-slate-900 hover:bg-slate-50",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3",
              formFieldLabel: "text-slate-700",
              formFieldInput: "bg-white border border-slate-200 text-slate-900",
              footerActionLink: "text-indigo-600 hover:text-indigo-700",
              identityPreviewText: "text-slate-900",
              identityPreviewEditButtonIcon: "text-indigo-600"
            }
          }}
        />
      </div>
    </div>
  );
};
