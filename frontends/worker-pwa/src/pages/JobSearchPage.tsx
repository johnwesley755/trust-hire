import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { searchJobs, type JobSearch } from '../api/search.service';
import { jobService, type Job } from '../api/job.service';
import { applicationService } from '../api/application.service';
import { Search, MapPin, Briefcase, IndianRupee, Send, CheckCircle, Navigation } from 'lucide-react';

export default function JobSearchPage() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
  const [radius, setRadius] = useState(50);
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = () => {
    setIsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setLocation("Current Location (GPS Detected)");
          setIsDetecting(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setIsDetecting(false);
          alert("Could not detect location. Please type it manually.");
        }
      );
    } else {
        setIsDetecting(false);
        alert("Geolocation is not supported by this browser.");
    }
  };

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['jobSearch', query, location, coords, radius],
    queryFn: () => searchJobs(
        query, 
        '', 
        coords ? '' : location, 
        coords?.lat, 
        coords?.lon, 
        radius
    ),
    enabled: Boolean(query || coords || (location && location !== "Current Location (GPS Detected)")),
  });

  const { data: allJobs, isLoading: isLoadingAll } = useQuery({
    queryKey: ['allJobs'],
    queryFn: () => jobService.getAllJobs(),
    enabled: !query && !coords && (!location || location === "Current Location (GPS Detected)"),
  });

  const jobs = (query || coords || (location && location !== "Current Location (GPS Detected)")) ? searchResults : allJobs;
  const isLoading = isSearching || isLoadingAll;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="p-8 bg-indigo-50 border-b border-slate-200 sticky top-0 backdrop-blur-3xl z-40">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Find Better Work</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search jobs (e.g. Cleaning, Driver)" 
                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Location" 
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    value={location}
                    onChange={(e) => {
                        setLocation(e.target.value);
                        setCoords(null); // Clear coords if user types manually
                    }}
                  />
              </div>
              <button 
                  onClick={detectLocation}
                  disabled={isDetecting}
                  className="bg-white text-indigo-600 hover:bg-indigo-50 p-4 rounded-2xl transition-colors shadow-sm flex items-center justify-center border border-slate-200"
                  title="Detect Current Location"
              >
                  <Navigation className={`w-5 h-5 ${isDetecting ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6 bg-white/50 p-4 rounded-2xl border border-slate-200/50">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
              <Navigation className="w-4 h-4" />
              Radius: {radius}km
            </div>
            <input 
              type="range" 
              min="5" 
              max="200" 
              step="5"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8 space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs?.map((job) => (
              <JobCard key={'jobId' in job ? job.jobId : job.id} job={job} />
            ))}
            {jobs?.length === 0 && (
              <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl">
                <p className="text-slate-500 italic">No jobs found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function JobCard({ job }: { job: JobSearch | Job }) {
  const [applied, setApplied] = useState(false);
  const jobId = 'jobId' in job ? job.jobId : job.id;
  
  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof applicationService.applyForJob>[0]) => applicationService.applyForJob(data),
    onSuccess: () => setApplied(true)
  });

  const handleApply = () => {
    if (jobId) {
        mutation.mutate({ jobId: jobId, coverLetter: "Interested in this position." });
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl hover:border-indigo-400 transition-all group shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">{job.title}</h3>
          </div>
          <p className="text-slate-500 text-sm flex items-center gap-2">
            <MapPin className="w-3 h-3" /> {job.location} • {job.industry}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-emerald-400 font-black text-xl">
            <IndianRupee className="w-4 h-4" />
            {job.budget?.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">Estim. Budget</p>
        </div>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-8 h-10">
        {job.description}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-slate-100 text-[10px] font-bold uppercase tracking-tighter rounded-full border border-slate-200 text-slate-500">Immediate Start</span>
          <span className="px-3 py-1 bg-slate-100 text-[10px] font-bold uppercase tracking-tighter rounded-full border border-slate-200 text-slate-500">Verified Client</span>
        </div>
        
        <button 
          onClick={handleApply}
          disabled={applied || mutation.isPending}
          className={`px-8 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center gap-2 shadow-2xl ${
            applied 
            ? 'bg-emerald-50 text-emerald-600 cursor-default border border-emerald-100' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-lg'
          }`}
        >
          {applied ? <><CheckCircle className="w-4 h-4" /> Applied</> : mutation.isPending ? 'Applying...' : <><Send className="w-4 h-4" /> Apply Now</>}
        </button>
      </div>
    </div>
  );
}
