import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  icon: string;
  iconContainerColor: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, suffix, icon, iconContainerColor, iconColor }) => (
  <div className={`bg-white p-6 rounded-2xl flex items-center justify-between group bento-card shadow-sm hover:shadow-md transition-all`}>
    <div>
      <p className="text-[0.65rem] font-bold text-[#414845] uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl md:text-3xl font-extrabold text-[#1F3F34]">
        {value}
        {suffix && <span className="text-sm font-bold text-[#414845]/50 ml-1">{suffix}</span>}
      </h3>
    </div>
    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${iconContainerColor} flex items-center justify-center ${iconColor} transition-transform group-hover:scale-110 duration-300`}>
      <span className="material-symbols-outlined text-2xl md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
    </div>
  </div>
);

export const StatsSection: React.FC<{ trustScore?: number; nearbyJobs?: number; earnings?: string }> = ({ 
  trustScore = 84, 
  nearbyJobs = 12, 
  earnings = "₹12,400" 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
      <StatCard 
        label="Trust Score"
        value={trustScore}
        suffix="/100"
        icon="verified"
        iconContainerColor="bg-[#c7ebdb]"
        iconColor="text-[#2d4d41]"
      />
      <StatCard 
        label="Nearby Jobs"
        value={nearbyJobs}
        icon="near_me"
        iconContainerColor="bg-[#ffe081]"
        iconColor="text-[#2d2300]"
      />
      <StatCard 
        label="Total Earnings"
        value={earnings}
        icon="payments"
        iconContainerColor="bg-[#ffdad6]"
        iconColor="text-[#301310]"
      />
    </div>
  );
};
