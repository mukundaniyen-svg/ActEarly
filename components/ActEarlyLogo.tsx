import React from "react";

const ActEarlyLogo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`${className} text-teal-600 dark:text-teal-400`}
  >
    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
    <path d="M12 2 a10 10 0 0 1 10 10" />
    <path d="M12 2 v2" />
    <path d="M6 12h2l2-4 4 8 2-4h2" />
  </svg>
);

export default ActEarlyLogo;