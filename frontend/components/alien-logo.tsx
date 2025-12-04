export function AlienLogo({ className = "w-8 h-8" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <circle cx="50" cy="35" r="25" fill="white" />
      
      {/* Left Eye */}
      <ellipse cx="35" cy="28" rx="8" ry="12" fill="#8BF500" />
      
      {/* Right Eye */}
      <ellipse cx="65" cy="28" rx="8" ry="12" fill="#8BF500" />
      
      {/* Body */}
      <ellipse cx="50" cy="70" r="20" fill="white" />
    </svg>
  );
}
