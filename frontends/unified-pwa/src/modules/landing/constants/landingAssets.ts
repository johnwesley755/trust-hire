/**
 * High-quality curated workforce & industrial talent photography for TrustHyre Technologies.
 * Sourced from verified high-resolution Unsplash CDN assets.
 */

export interface WorkforceAsset {
  src: string;
  alt: string;
  title: string;
  category: string;
}

export const LANDING_IMAGES = {
  // Hero Background Crossfade Sequence (4 Authentic Indian Workforce Sectors)
  heroBackgrounds: [
    {
      src: "/images/landing/indian_hero_team.webp",
      alt: "TrustHyre verified Indian workforce team across culinary, electrical, and logistics",
      label: "Verified Indian Workforce",
    },
    {
      src: "/images/landing/indian_chef.webp",
      alt: "Commercial culinary chef in Indian commercial restaurant kitchen",
      label: "Commercial Culinary & Hospitality",
    },
    {
      src: "/images/landing/indian_logistics.webp",
      alt: "Indian warehouse logistics & fulfillment specialist in distribution hub",
      label: "Warehouse & Fleet Logistics",
    },
    {
      src: "/images/landing/indian_electrician.webp",
      alt: "Certified Indian industrial electrician inspecting distribution panel",
      label: "Electrical & Engineering Systems",
    },
  ],

  // Primary Hero Static Fallback
  heroBg: {
    src: "/images/landing/indian_hero_team.webp",
    alt: "Skilled Indian technicians and specialists on site",
    title: "India's Verified Skilled Workforce",
    category: "Hero",
  },

  // Verified Member Avatar Card in Hero
  memberBadge: {
    src: "/images/landing/indian_engineer.webp",
    alt: "Verified Indian site engineer with safety helmet and blueprints",
    title: "Verified Field Specialist",
    category: "Talent",
  },

  // Commercial Culinary & Kitchens (Featured Sectors)
  culinary: {
    src: "/images/landing/indian_chef.webp",
    alt: "Professional Indian executive chef in restaurant kitchen",
    title: "Commercial Cooking & Culinary",
    category: "Culinary",
  },

  // Certified Electricians
  electrician: {
    src: "/images/landing/indian_electrician.webp",
    alt: "Certified Indian master electrician testing an industrial breaker panel",
    title: "Certified Electricians",
    category: "Electrical",
  },

  // Warehouse Logistics & Distribution
  warehouseLogistics: {
    src: "/images/landing/indian_logistics.webp",
    alt: "Indian logistics specialist managing fulfillment in modern warehouse",
    title: "Warehouse & Fleet Logistics",
    category: "Logistics",
  },

  // Civil, Structural & Mechanical Infrastructure
  cncMachinist: {
    src: "/images/landing/indian_engineer.webp",
    alt: "Indian site supervisor and infrastructure engineer",
    title: "Civil & Infrastructure Specialists",
    category: "Engineering",
  },

  // Commercial Plumbing & Pipefitting
  plumbing: {
    src: "/images/landing/indian_plumber.webp",
    alt: "Licensed Indian commercial plumber inspecting pipeline connections",
    title: "Plumbing & Mechanical Systems",
    category: "Plumbing",
  },

  // Trust Carousel Specialists (Authentic Indian Specialists)
  specialists: [
    {
      image: "/images/landing/indian_chef.webp",
      name: "Chef Rajesh Sharma",
      role: "Executive Culinary Lead, Delhi NCR",
      alt: "Chef Rajesh Sharma, Executive Head Chef with 14 years commercial kitchen experience in India",
      headline: ["CULINARY", "MASTERY", "PROVEN", "TALENT"],
    },
    {
      image: "/images/landing/indian_electrician.webp",
      name: "Rajesh K. Verma",
      role: "Industrial Wireman & Panel Master, Mumbai",
      alt: "Rajesh K. Verma, Industrial electrician certified with 12 years plant experience in India",
      headline: ["LICENSED", "POWER", "EXPERT", "CREWS"],
    },
    {
      image: "/images/landing/indian_engineer.webp",
      name: "Pooja Sundaram",
      role: "Site Operations & Safety Lead, Bengaluru",
      alt: "Pooja Sundaram, Civil site engineer and quality compliance lead",
      headline: ["SUPERVISED", "SAFETY", "VERIFIED", "SITES"],
    },
    {
      image: "/images/landing/indian_logistics.webp",
      name: "Vikramjit Singh",
      role: "Warehouse Operations Supervisor, Gurugram",
      alt: "Vikramjit Singh, Warehouse operations & logistics specialist",
      headline: ["VERIFIED", "DEPLOYMENTS", "START", "HERE"],
    },
  ],

  // Platform Verification Infrastructure Section
  siteInspectorThumbnail: {
    src: "/images/landing/indian_engineer.webp",
    alt: "Indian field safety inspector checking on-site compliance",
    title: "Integrity & Compliance",
    category: "Operations",
  },

  biometricGeofence: {
    src: "/images/landing/indian_biometric.webp",
    alt: "Indian field worker with verified biometric face-match scan",
    title: "Biometric Geofence Punch-In",
    category: "Security",
  },

  skillVerificationBadge: {
    src: "/images/landing/indian_plumber.webp",
    alt: "Indian commercial technician inspecting milestone installation",
    title: "Verified Skill & Work Verification",
    category: "Verification",
  },
} as const;
