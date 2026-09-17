import React from 'react';

interface CharacterAvatarProps {
  characterId: string | null | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showNameBadge?: boolean;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  size = 'md',
  className = '',
  showNameBadge = false,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-20 h-20 text-base',
    xl: 'w-32 h-32 text-xl',
    '2xl': 'w-48 h-48 text-2xl',
  };

  const containerSize = sizeMap[size] || sizeMap.md;

  if (!characterId) {
    return (
      <div
        className={`${containerSize} rounded-2xl bg-slate-900/80 border border-dashed border-slate-700 flex items-center justify-center text-slate-500 select-none shadow-inner ${className}`}
        title="캐릭터 미선택"
      >
        <span className="font-semibold">?</span>
      </div>
    );
  }

  // Common wrapper for consistent dark card aesthetic
  const renderContainer = (
    badgeText: string,
    accentBorder: string,
    glowBg: string,
    svgContent: React.ReactNode
  ) => {
    return (
      <div
        className={`relative flex flex-col items-center justify-center ${containerSize} rounded-2xl ${glowBg} border ${accentBorder} p-1.5 shadow-md transition-transform duration-200 hover:scale-105 group select-none overflow-hidden ${className}`}
      >
        {showNameBadge && (
          <div className="absolute top-1 z-10 px-2 py-0.5 rounded-full bg-white border-2 border-rose-400 text-slate-800 text-[10px] font-extrabold tracking-tight shadow-xs">
            {badgeText}
          </div>
        )}
        <div className="w-full h-full flex items-center justify-center">{svgContent}</div>
      </div>
    );
  };

  switch (characterId) {
    case 'scoleon': // 스콜레온 (카멜레온 / 열대 기후)
      return renderContainer(
        '스콜레온',
        'border-emerald-500/40 hover:border-emerald-400',
        'bg-gradient-to-b from-slate-900/90 to-emerald-950/40',
        <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
          {/* Chameleon Curled Tail */}
          <path
            d="M 68 98 C 88 98, 102 85, 96 68 C 92 56, 80 58, 80 66 C 80 72, 86 73, 86 69"
            fill="none"
            stroke="#1e293b"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 68 98 C 88 98, 102 85, 96 68 C 92 56, 80 58, 80 66 C 80 72, 86 73, 86 69"
            fill="none"
            stroke="#477366"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="86" cy="69" r="2" fill="#c4e7ab" />

          {/* Body */}
          <ellipse cx="56" cy="84" rx="24" ry="24" fill="#477366" stroke="#1e293b" strokeWidth="4" />
          
          {/* Belly light stripes */}
          <path d="M 40 76 Q 52 80 64 76" stroke="#d6e9dc" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 39 84 Q 52 88 65 84" stroke="#d6e9dc" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 42 92 Q 52 96 63 92" stroke="#d6e9dc" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Left Hand (3 fingers) */}
          <path
            d="M 36 78 C 30 76, 24 74, 22 75 C 20 73 20 71 22 71 C 24 71 28 73 34 74"
            fill="#477366"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Right Hand (3 fingers) */}
          <path
            d="M 76 78 C 82 76, 88 74, 90 75 C 92 73 92 71 90 71 C 88 71 84 73 78 74"
            fill="#477366"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Left Foot (3 toes) */}
          <path
            d="M 42 104 L 38 114 C 36 117 48 117 46 104 Z"
            fill="#477366"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Right Foot (3 toes) */}
          <path
            d="M 64 104 L 62 114 C 60 117 72 117 68 104 Z"
            fill="#477366"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Head base (light pastel green) */}
          <ellipse cx="56" cy="52" rx="30" ry="24" fill="#c2e8a6" stroke="#1e293b" strokeWidth="4" />
          {/* Head crest dome */}
          <path d="M 42 35 Q 56 22 68 35 Z" fill="#9dc882" stroke="#1e293b" strokeWidth="3" />

          {/* Cheek Freckles / spots */}
          <circle cx="36" cy="58" r="2.5" fill="#8cb974" />
          <circle cx="42" cy="62" r="2" fill="#8cb974" />
          <circle cx="34" cy="66" r="1.8" fill="#8cb974" />
          <circle cx="76" cy="58" r="2.5" fill="#8cb974" />
          <circle cx="70" cy="62" r="2" fill="#8cb974" />
          <circle cx="78" cy="66" r="1.8" fill="#8cb974" />

          {/* Nostrils */}
          <circle cx="53" cy="54" r="1.3" fill="#1e293b" />
          <circle cx="58" cy="54" r="1.3" fill="#1e293b" />

          {/* Wavy mouth (w-shape / chameleon cat mouth) */}
          <path
            d="M 48 60 Q 52 64 56 60 Q 60 64 64 60"
            fill="none"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Huge bulging cartoon eyes */}
          {/* Left Eye */}
          <circle cx="40" cy="42" r="16" fill="#ffffff" stroke="#1e293b" strokeWidth="4" />
          <circle cx="43" cy="43" r="3.8" fill="#1e293b" />

          {/* Right Eye */}
          <circle cx="70" cy="42" r="16" fill="#ffffff" stroke="#1e293b" strokeWidth="4" />
          <circle cx="67" cy="43" r="3.8" fill="#1e293b" />
        </svg>
      );

    case 'qanat': // 카나트 (흙덩이 상자 / 건조 기후)
      return renderContainer(
        '카나트',
        'border-amber-500/40 hover:border-amber-400',
        'bg-gradient-to-b from-slate-900/90 to-amber-950/40',
        <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
          {/* Flowing Keffiyeh / Ghutra Headscarf on back */}
          <path
            d="M 44 26 C 36 24, 76 16, 88 28 C 96 38, 98 48, 92 56 C 88 60, 84 54, 82 46"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Scarf folds hanging down behind */}
          <path
            d="M 78 40 C 94 44, 98 56, 86 64 C 80 68, 76 60, 76 54"
            fill="#faf8f5"
            stroke="#1e293b"
            strokeWidth="3"
          />
          {/* Black agal cord */}
          <path d="M 64 28 C 74 24, 84 26, 84 32" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Robe / Dishdasha (flowing white body) */}
          <path
            d="M 44 74 L 38 112 C 48 116, 72 116, 80 112 L 74 74 Z"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Collar slit with 3 buttons */}
          <path d="M 59 74 L 59 90" stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="62" cy="78" r="1.5" fill="#1e293b" />
          <circle cx="62" cy="83" r="1.5" fill="#1e293b" />
          <circle cx="62" cy="88" r="1.5" fill="#1e293b" />

          {/* Sleeves draped down */}
          <path
            d="M 44 74 C 40 82, 38 92, 42 98 C 45 102, 50 102, 52 98 L 50 78"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="3.5"
          />
          <path
            d="M 74 74 C 78 82, 80 92, 76 98 C 73 102, 68 102, 66 98 L 68 78"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="3.5"
          />
          {/* Hands holding downward */}
          <ellipse cx="48" cy="100" rx="3.5" ry="2.5" fill="#d99b65" stroke="#1e293b" strokeWidth="2.5" />
          <ellipse cx="70" cy="100" rx="3.5" ry="2.5" fill="#d99b65" stroke="#1e293b" strokeWidth="2.5" />

          {/* Little Shoes */}
          <ellipse cx="49" cy="116" rx="4" ry="2.5" fill="#1e293b" />
          <ellipse cx="69" cy="116" rx="4" ry="2.5" fill="#1e293b" />

          {/* Cardboard Box Cube Head (3D Isometric-ish) */}
          {/* Top Face */}
          <polygon points="40,38 68,34 82,42 54,46" fill="#e8b484" stroke="#1e293b" strokeWidth="3.5" />
          {/* Right Face (shaded) */}
          <polygon points="68,34 82,42 78,74 65,68" fill="#bc7e4c" stroke="#1e293b" strokeWidth="3.5" />
          {/* Front Face */}
          <polygon points="36,44 66,42 64,74 34,74" fill="#d99b65" stroke="#1e293b" strokeWidth="4" />

          {/* Facial features on the box */}
          {/* Eyes: two dots */}
          <circle cx="47" cy="54" r="2.2" fill="#1e293b" />
          <circle cx="57" cy="53" r="2.2" fill="#1e293b" />
          {/* Vertical nose line */}
          <path d="M 52 53 L 52 59" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          {/* Round surprised mouth 'o' */}
          <circle cx="52" cy="65" r="4.5" fill="#5c381c" stroke="#1e293b" strokeWidth="3" />
        </svg>
      );

    case 'olivi': // 올리비 (온대 기후 / 인간 지성체)
      return renderContainer(
        '올리비',
        'border-lime-500/40 hover:border-lime-400',
        'bg-gradient-to-b from-slate-900/90 to-lime-950/40',
        <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
          {/* Round Body (Sky Blue) */}
          <path
            d="M 44 94 C 44 114, 76 114, 76 94 Z"
            fill="#88d5e8"
            stroke="#1e293b"
            strokeWidth="3.5"
          />
          {/* Stubby Feet */}
          <path d="M 48 112 L 48 118" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          <path d="M 72 112 L 72 118" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />

          {/* Left Arm holding flower leaf stem */}
          <path d="M 38 82 C 26 80, 20 74, 18 70" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Flower / Leaf Stem */}
          <path d="M 18 70 L 22 58" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="16" cy="68" rx="6" ry="3.5" fill="#a3e635" stroke="#1e293b" strokeWidth="2.5" transform="rotate(-30 16 68)" />
          {/* Yellow fan flower */}
          <path d="M 22 58 Q 30 52 30 46 Q 16 46 22 58 Z" fill="#facc15" stroke="#1e293b" strokeWidth="2.5" />

          {/* Crossbody Bag Strap */}
          <path d="M 66 82 L 42 98" stroke="#1e293b" strokeWidth="3" />
          {/* Red Apple Pouch */}
          <circle cx="74" cy="98" r="7" fill="#ef4444" stroke="#1e293b" strokeWidth="3" />
          <path d="M 74 91 Q 76 87 73 85" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="72" cy="89" rx="2.5" ry="1.5" fill="#84cc16" stroke="#1e293b" strokeWidth="1.5" />

          {/* Big Round Head */}
          <g>
            <circle cx="60" cy="52" r="32" fill="#88d5e8" stroke="#1e293b" strokeWidth="4" />
            
            {/* Brown Parted Hair (Top Section) */}
            <path
              d="M 29 46 C 30 26, 44 20, 60 20 C 76 20, 91 26, 91 48 C 84 56, 72 62, 54 50 C 44 44, 34 44, 29 46 Z"
              fill="#966e57"
              stroke="#1e293b"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Three slanted hair notches */}
            <path d="M 68 38 L 74 44" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 74 38 L 80 44" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 80 39 L 86 44" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />

            {/* Golden Wheat / Olive Wreath in hair */}
            <path d="M 38 52 Q 44 38 54 32" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Olive / Wheat grains */}
            <ellipse cx="40" cy="46" rx="3.5" ry="2" fill="#facc15" stroke="#1e293b" strokeWidth="2" transform="rotate(-30 40 46)" />
            <ellipse cx="44" cy="41" rx="3.5" ry="2" fill="#facc15" stroke="#1e293b" strokeWidth="2" transform="rotate(-30 44 41)" />
            <ellipse cx="48" cy="36" rx="3.5" ry="2" fill="#facc15" stroke="#1e293b" strokeWidth="2" transform="rotate(-20 48 36)" />
            <ellipse cx="53" cy="33" rx="3.5" ry="2" fill="#facc15" stroke="#1e293b" strokeWidth="2" transform="rotate(-10 53 33)" />
            <ellipse cx="42" cy="42" rx="3" ry="2" fill="#fef08a" stroke="#1e293b" strokeWidth="1.5" />
            <ellipse cx="47" cy="38" rx="3" ry="2" fill="#fef08a" stroke="#1e293b" strokeWidth="1.5" />

            {/* Eyes */}
            <circle cx="50" cy="62" r="2.2" fill="#1e293b" />
            <circle cx="68" cy="62" r="2.2" fill="#1e293b" />
            {/* Nose line */}
            <path d="M 59 60 L 59 65" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            {/* Cute open triangle smiling mouth */}
            <path d="M 55 70 L 63 70 L 59 77 Z" fill="#1e293b" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 57 73 Q 59 75 61 73" fill="#f43f5e" />
          </g>
        </svg>
      );

    case 'taiga': // 타이가 (침엽수 / 냉대 기후)
      return renderContainer(
        '타이가',
        'border-teal-500/40 hover:border-teal-400',
        'bg-gradient-to-b from-slate-900/90 to-teal-950/40',
        <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
          {/* Tree Trunk Legs */}
          <rect x="44" y="98" width="10" height="20" fill="#785340" stroke="#1e293b" strokeWidth="3" rx="2" />
          <rect x="62" y="98" width="10" height="20" fill="#785340" stroke="#1e293b" strokeWidth="3" rx="2" />

          {/* Dark Green Jagged Needle Cuffs/Skirt */}
          <path
            d="M 40 98 L 44 92 L 48 98 L 52 92 L 56 98 L 40 98 Z"
            fill="#274337"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 58 98 L 62 92 L 66 98 L 70 92 L 74 98 L 58 98 Z"
            fill="#274337"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Twig Arm Left (waving down/sideways) */}
          <path d="M 40 76 L 30 84" stroke="#ad7a5c" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 30 84 L 26 80" stroke="#ad7a5c" strokeWidth="3" strokeLinecap="round" />
          <path d="M 30 84 L 25 87" stroke="#ad7a5c" strokeWidth="3" strokeLinecap="round" />

          {/* Twig Arm Right (waving up) */}
          <path d="M 76 76 L 86 70" stroke="#ad7a5c" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 86 70 L 91 66" stroke="#ad7a5c" strokeWidth="3" strokeLinecap="round" />
          <path d="M 86 70 L 90 75" stroke="#ad7a5c" strokeWidth="3" strokeLinecap="round" />

          {/* Evergreen Tree Silhouette (3 tiers of rounded wavy scalloped foliage) */}
          <path
            d="
              M 58 22 
              C 54 22, 48 34, 44 42
              C 41 47, 36 50, 42 54
              C 38 60, 32 64, 38 72
              C 33 78, 24 82, 32 94
              C 40 96, 76 96, 84 94
              C 92 82, 83 78, 78 72
              C 84 64, 78 60, 74 54
              C 80 50, 75 47, 72 42
              C 68 34, 62 22, 58 22
              Z
            "
            fill="#527b6c"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Minimalist Cute Face in Center */}
          <circle cx="51" cy="68" r="2.2" fill="#1e293b" />
          <circle cx="65" cy="68" r="2.2" fill="#1e293b" />
          <path d="M 58 66 L 58 72" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'jangbogo': // 장보고 (순록 / 한대 기후)
      return renderContainer(
        '장보고',
        'border-sky-500/40 hover:border-sky-400',
        'bg-gradient-to-b from-slate-900/90 to-sky-950/40',
        <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
          {/* Antlers on Top (Beige with 3 rounded prongs each) */}
          {/* Left Antler */}
          <path
            d="M 45 36 C 42 22, 34 18, 30 14 C 34 20, 38 22, 36 28 M 32 18 C 24 16, 22 22, 28 26"
            fill="#faeedd"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Right Antler */}
          <path
            d="M 71 36 C 74 22, 82 18, 86 14 C 82 20, 78 22, 80 28 M 84 18 C 92 16, 94 22, 88 26"
            fill="#faeedd"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Reindeer Body */}
          <path
            d="M 44 80 C 38 92, 38 108, 48 116 L 54 116 C 54 110, 62 110, 62 116 L 68 116 C 78 108, 78 92, 72 80 Z"
            fill="#9c7764"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Hooves */}
          <path d="M 46 114 L 54 114" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          <path d="M 62 114 L 70 114" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />

          {/* Little Arms with Hooves */}
          <path d="M 38 82 L 32 94" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="32" cy="94" r="2.5" fill="#1e293b" />
          <path d="M 78 82 L 84 94" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="84" cy="94" r="2.5" fill="#1e293b" />

          {/* Fluffy White Chest Fur / Bib */}
          <path
            d="M 46 90 Q 58 84 70 90 Q 72 100 66 102 Q 58 106 50 102 Q 44 100 46 90 Z"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Reindeer Head */}
          <ellipse cx="58" cy="52" rx="22" ry="20" fill="#9c7764" stroke="#1e293b" strokeWidth="4" />

          {/* Droopy Ears */}
          <ellipse cx="36" cy="46" rx="6" ry="3.5" fill="#9c7764" stroke="#1e293b" strokeWidth="3" transform="rotate(-30 36 46)" />
          <ellipse cx="80" cy="46" rx="6" ry="3.5" fill="#9c7764" stroke="#1e293b" strokeWidth="3" transform="rotate(30 80 46)" />

          {/* Eyes: two tiny dots */}
          <circle cx="51" cy="47" r="2" fill="#1e293b" />
          <circle cx="65" cy="47" r="2" fill="#1e293b" />

          {/* Big Beige/Cream Snout Oval */}
          <ellipse cx="58" cy="62" rx="14" ry="11" fill="#faeedd" stroke="#1e293b" strokeWidth="3.5" />

          {/* Black Nose and Inverted T Mouth */}
          <ellipse cx="58" cy="57" rx="3.5" ry="2.5" fill="#1e293b" />
          <path d="M 58 59.5 L 58 66" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <path d="M 54 68 Q 58 66 62 68" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );

    default:
      return (
        <div
          className={`${containerSize} rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 font-bold ${className}`}
        >
          {characterId.slice(0, 2)}
        </div>
      );
  }
};
