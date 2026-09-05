import { Link } from "react-router-dom";

export function LandingFooter() {
  return (
    <footer className="bg-surface rounded-t-[40px] mt-20 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-fixed/5 blob-1 -z-10"></div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8 py-16 max-w-7xl mx-auto border-t border-primary/5">
        <div>
          <div className="text-2xl font-black text-primary mb-6">TrustHire</div>
          <p className="text-primary/60 text-sm leading-relaxed max-w-xs font-body">
            © 2024 TrustHire.<br/>
            Human-centric hiring for a better India.
          </p>
        </div>
        
        <div>
          <h5 className="font-bold text-primary mb-4 uppercase tracking-widest text-xs font-label">For Workers</h5>
          <ul className="space-y-2 text-primary/60 text-sm font-body">
            <li><Link className="hover:text-primary transition-colors" to="/find-jobs">Find Jobs</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/safety">Safety Rules</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/guide">Hindi Guide</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/calculator">Salary Calculator</Link></li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-bold text-primary mb-4 uppercase tracking-widest text-xs font-label">Company</h5>
          <ul className="space-y-2 text-primary/60 text-sm font-body">
            <li><Link className="hover:text-primary transition-colors" to="/about">About</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/impact">Impact Report</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-bold text-primary mb-4 uppercase tracking-widest text-xs font-label">Settings</h5>
          <div className="bg-surface-container-high rounded-xl p-3 inline-block shadow-sm">
            <select className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer">
              <option>English</option>
              <option>हिन्दी (Hindi)</option>
              <option>ಕನ್ನಡ (Kannada)</option>
              <option>తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="border-t border-primary/5 py-8 text-center px-8">
        <p className="text-primary/40 text-[12px] font-bold uppercase tracking-wider">Building Trust, One Job at a Time.</p>
      </div>
    </footer>
  );
}
