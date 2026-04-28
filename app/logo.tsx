export const LogoIcon = ({ className }: { className: string }) => (
  <svg className={className} width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="50%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
  </defs>

  <path d="M32 16 V96 Q32 112 48 112 H96" 
        stroke="url(#grad)" 
        stroke-width="12" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>

  <path d="M72 40 
           Q82 44 84 54 
           Q86 64 80 72 
           Q76 78 68 80 
           Q74 70 70 60 
           Q68 52 72 40 Z" 
        fill="url(#grad)"/>

  <circle cx="96" cy="40" r="2" fill="#8B5CF6"/>
  <circle cx="104" cy="48" r="1.5" fill="#EC4899"/>
  <circle cx="92" cy="52" r="1.5" fill="#3B82F6"/>
</svg>
)