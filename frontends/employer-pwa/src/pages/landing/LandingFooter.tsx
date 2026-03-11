import { ShieldCheck } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-indigo-600 w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              TrustHire
            </span>
          </div>
          <p className="text-slate-500 font-medium text-center md:text-left">
            Building the global standard for <br /> verified, professional
            labor.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-12">
          <div className="space-y-4 text-center md:text-left">
            <h6 className="font-bold text-slate-900 uppercase text-xs tracking-[0.2em]">
              Product
            </h6>
            <ul className="space-y-2 text-slate-500 font-medium">
              <li>
                <a href="#" className="hover:text-indigo-600">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600">
                  Verification
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4 text-center md:text-left">
            <h6 className="font-bold text-slate-900 uppercase text-xs tracking-[0.2em]">
              Support
            </h6>
            <ul className="space-y-2 text-slate-500 font-medium">
              <li>
                <a href="#" className="hover:text-indigo-600">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600">
                  Safety
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-sm font-medium">
          © 2026 TrustHire Technologies Inc. Built with love for professional
          business owners.
        </p>
      </div>
    </footer>
  );
}
