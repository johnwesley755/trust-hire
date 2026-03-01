import { SignIn } from "@clerk/clerk-react";

export const SignInPage = () => {
  return (
    <div className="min-h-screen bg-primary-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <SignIn 
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: "w-full mx-auto",
              card: "bg-primary-900 border border-white/10 shadow-2xl rounded-3xl",
              headerTitle: "text-white text-2xl font-bold",
              headerSubtitle: "text-white/60",
              socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3",
              formFieldLabel: "text-white/80",
              formFieldInput: "bg-white/5 border border-white/10 text-white",
              footerActionLink: "text-indigo-400 hover:text-indigo-300",
              identityPreviewText: "text-white",
              identityPreviewEditButtonIcon: "text-indigo-400"
            }
          }}
        />
      </div>
    </div>
  );
};
