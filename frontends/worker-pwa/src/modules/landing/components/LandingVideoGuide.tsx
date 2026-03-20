import { Link } from "react-router-dom";

export function LandingVideoGuide() {
  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
      <div className="absolute -left-20 top-0 w-96 h-96 bg-white/5 blob-3 -z-0"></div>
      <div className="absolute bottom-0 right-0 w-1/4 h-full bg-primary-fixed/5 blob-4 -z-0"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-[42px] md:text-[52px] font-extrabold text-white text-heavy mb-6 leading-tight">Watch How to Get Hired</h2>
            <p className="text-xl text-white/70 mb-8 max-w-lg">In just 2 minutes, see how simple it is to create your profile, get verified with Aadhaar, and receive your first job offer.</p>
            
            <ul className="space-y-6">
              <li className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">1</span>
                <span className="text-lg">Upload your photo & skills</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">2</span>
                <span className="text-lg">Fast 30-second Aadhaar check</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">3</span>
                <span className="text-lg">Get job offers on your phone</span>
              </li>
            </ul>
            
            <div className="mt-12 flex gap-4">
              <Link to="/sign-up" className="bg-primary-fixed text-primary px-8 py-4 rounded-[12px] font-bold uppercase shadow-xl hover:scale-105 transition-transform">Register Now</Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <div className="relative group cursor-pointer aspect-video bg-surface-variant/20 rounded-[40px] flex items-center justify-center border-4 border-white/10 overflow-hidden shadow-2xl">
              <img 
                alt="Indian worker being hired video preview" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1N6HAxgSeSUx0jzpDPVill6_I29Ns9j7t0MDqWlXZAyffvv6PUx59OR5FNa5-VtIbBZvT5mDVvq5g4KZMWaQzjwa9k5NBgFXKaFsDXvWjp9RJqthiH2sGj5PTdL0M7RmzI8uFj41lASyf9u3fWvjCH-IOUV6oP0lp8UvwhFafYEPMS4V6JgbeyUALurLqojtWCsHnCX47vAeSDC2HE9rYN0KLGpziOaHVMUntm-xrmh2IM9SxJXgLhr67pdTX6MxbySfmcHmmRWw" 
              />
              <div className="relative z-10 w-24 h-24 bg-primary-fixed text-primary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-5xl font-bold">play_arrow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
