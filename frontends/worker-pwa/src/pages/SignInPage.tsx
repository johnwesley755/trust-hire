import { SignIn } from "@clerk/clerk-react";

export const SignInPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <SignIn 
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: "w-full mx-auto",
              card: "bg-white border border-slate-200 shadow-xl rounded-3xl",
              headerTitle: "text-slate-900 text-2xl font-bold",
              headerSubtitle: "text-slate-500",
              socialButtonsBlockButton: "bg-slate-50 border border-slate-200 text-slate-900 hover:bg-slate-100",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 shadow-lg shadow-indigo-500/20",
              formFieldLabel: "text-slate-700 font-medium",
              formFieldInput: "bg-white border border-slate-200 text-slate-900 focus:border-indigo-500Transition",
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
