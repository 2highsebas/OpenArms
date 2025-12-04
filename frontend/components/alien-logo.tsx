export function AlienLogo({ className = "w-8 h-8" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head - rounded */}
      <circle cx="50" cy="40" r="30" fill="white" />
      
      {/* Left Eye - large almond shape */}
      <ellipse cx="32" cy="35" rx="12" ry="16" fill="#8BF500" />
      <ellipse cx="32" cy="35" rx="10" ry="14" fill="#8BF500" opacity="0.9" />
      
      {/* Right Eye - large almond shape */}
      <ellipse cx="68" cy="35" rx="12" ry="16" fill="#8BF500" />
      <ellipse cx="68" cy="35" rx="10" ry="14" fill="#8BF500" opacity="0.9" />
      
      {/* Small nose area */}
      <circle cx="50" cy="50" r="2" fill="#8BF500" opacity="0.6" />
      
      {/* Body - larger rounded shape */}
      <ellipse cx="50" cy="75" r="22" fill="white" />
      <ellipse cx="50" cy="75" r="20" fill="white" opacity="0.95" />
    </svg>
  );
}
