import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchWorkers, type WorkerSearch } from '../api/search.service';
import { Search, MapPin, Award, UserCheck, ShieldCheck, Star, Briefcase } from 'lucide-react';

export const WorkerSearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [level, setLevel] = useState('');
  const [radius, setRadius] = useState('5');
  const [skills, setSkills] = useState('');

  const { data: results, isLoading } = useQuery({
    queryKey: ['workerSearch', query, location, level, radius, skills],
    queryFn: () => searchWorkers(query, location, level, radius, skills),
    enabled: true
  });

  return (
    <div className="min-h-screen bg-primary-950 text-white">
      {/* Header / Search Bar Section */}
      <div className="bg-primary-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10 px-4 py-6 md:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-white">Find Professional Workers</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name (e.g. Ramesh)"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Skills (e.g. Cook)"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-5 w-5" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="5" className="bg-primary-950">5 km radius</option>
              <option value="10" className="bg-primary-950">10 km radius</option>
              <option value="25" className="bg-primary-950">25 km radius</option>
              <option value="50" className="bg-primary-950">50 km radius</option>
            </select>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="" className="bg-primary-950">Expertise Level (All)</option>
              <option value="L4" className="bg-primary-950">Master (L4)</option>
              <option value="L3" className="bg-primary-950">Expert (L3)</option>
              <option value="L2" className="bg-primary-950">Skilled (L2)</option>
              <option value="L1" className="bg-primary-950">Beginner (L1)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results?.map((worker: WorkerSearch) => (
              <div key={worker.clerkId} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-white/10 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShieldCheck className="h-20 w-20 text-emerald-400" />
                </div>
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-14 w-14 rounded-xl bg-linear-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20">
                    {worker.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{worker.name}</h3>
                      {worker.isVerified && <UserCheck className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <p className="text-white/40 text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {worker.location}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-white/70 line-clamp-2 mb-4 h-10">
                  {worker.bio || "No professional bio provided."}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {worker.skills.split(',').slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-md">
                      {skill.trim()}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">Level {worker.level}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/worker/${worker.clerkId}`)}
                    className="text-sm font-bold bg-white text-primary-950 px-4 py-2 rounded-lg hover:bg-blue-400 hover:text-white transition-all"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
            {results?.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-white/40 text-lg italic">No workers matching your criteria were found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
