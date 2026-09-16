import React from 'react';

interface CharacterAvatarProps {
  characterId: string | null | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-20 h-20 text-base',
    xl: 'w-32 h-32 text-xl',
  };

  const containerSize = sizeMap[size] || sizeMap.md;

  if (!characterId) {
    return (
      <div
        className={`${containerSize} rounded-2xl bg-slate-800/80 border border-dashed border-slate-600 flex items-center justify-center text-slate-400 select-none shadow-inner ${className}`}
        title="캐릭터 미선택"
      >
        <span className="font-medium">?</span>
      </div>
    );
  }

  switch (characterId) {
    case 'scoleon': // 스콜레온 (카멜레온 / 열대)
      return (
        <div
          className={`${containerSize} rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-700/40 border border-emerald-400/50 flex items-center justify-center p-1.5 shadow-md shadow-emerald-950/40 relative overflow-hidden group ${className}`}
          title="스콜레온 (열대 기후 / 카멜레온)"
        >
          <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Chameleon Tail Coil */}
            <path
              d="M 60 75 C 75 75, 85 65, 82 50 C 80 38, 70 36, 68 45 C 67 50, 72 52, 73 48"
              fill="none"
              stroke="#059669"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Body */}
            <ellipse cx="45" cy="55" rx="26" ry="18" fill="#10b981" />
            <ellipse cx="45" cy="57" rx="22" ry="12" fill="#34d399" opacity="0.6" />
            {/* Crest/Head */}
            <circle cx="35" cy="42" r="16" fill="#10b981" />
            <path d="M 28 30 Q 36 22 46 29" fill="none" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
            {/* Big 360 eyes */}
            <circle cx="32" cy="38" r="9" fill="#ecfdf5" stroke="#065f46" strokeWidth="2.5" />
            <circle cx="34" cy="38" r="4.5" fill="#047857" />
            <circle cx="35.5" cy="36.5" r="1.5" fill="#ffffff" />
            {/* Smile / Tongue hint */}
            <path d="M 20 48 Q 26 53 34 50" fill="none" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" />
            {/* Front Leg */}
            <ellipse cx="28" cy="68" rx="6" ry="8" fill="#059669" transform="rotate(-15 28 68)" />
            {/* Back Leg */}
            <ellipse cx="56" cy="68" rx="6" ry="8" fill="#059669" transform="rotate(15 56 68)" />
            {/* Tropical leaf accent */}
            <circle cx="82" cy="20" r="3" fill="#10b981" opacity="0.8" />
          </svg>
        </div>
      );

    case 'qanat': // 카나트 (흙덩이 집 / 건조)
      return (
        <div
          className={`${containerSize} rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-800/40 border border-amber-400/50 flex items-center justify-center p-1.5 shadow-md shadow-amber-950/40 relative overflow-hidden group ${className}`}
          title="카나트 (건조 기후 / 흙덩이)"
        >
          <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Sun / heat rays background */}
            <circle cx="50" cy="46" r="38" fill="#fef3c7" opacity="0.15" />
            {/* Mud Dome House Body */}
            <path
              d="M 22 75 C 20 45, 32 25, 50 25 C 68 25, 80 45, 78 75 Z"
              fill="#d97706"
            />
            {/* Mud texture patches */}
            <ellipse cx="40" cy="48" rx="6" ry="4" fill="#b45309" opacity="0.5" />
            <ellipse cx="62" cy="58" rx="5" ry="3" fill="#b45309" opacity="0.5" />
            {/* Traditional Arch Doorway */}
            <path
              d="M 40 75 L 40 58 C 40 52, 60 52, 60 58 L 60 75 Z"
              fill="#78350f"
            />
            {/* Cute Eyes on the mud spirit */}
            <circle cx="38" cy="42" r="4.5" fill="#451a03" />
            <circle cx="39.5" cy="40.5" r="1.5" fill="#ffffff" />
            <circle cx="62" cy="42" r="4.5" fill="#451a03" />
            <circle cx="63.5" cy="40.5" r="1.5" fill="#ffffff" />
            {/* Warm blush */}
            <circle cx="31" cy="46" r="3.5" fill="#ea580c" opacity="0.6" />
            <circle cx="69" cy="46" r="3.5" fill="#ea580c" opacity="0.6" />
            {/* Desert sand base */}
            <path d="M 12 78 Q 50 72 88 78 L 88 84 L 12 84 Z" fill="#b45309" />
          </svg>
        </div>
      );

    case 'olivi': // 올리비 (온대 기후 / 인간 지성체)
      return (
        <div
          className={`${containerSize} rounded-2xl bg-gradient-to-br from-lime-500/20 to-teal-800/40 border border-lime-400/50 flex items-center justify-center p-1.5 shadow-md shadow-lime-950/40 relative overflow-hidden group ${className}`}
          title="올리비 (온대 기후 / 지성체)"
        >
          <div className="absolute inset-0 bg-lime-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Gentle temperate glow */}
            <circle cx="50" cy="50" r="36" fill="#ecfccb" opacity="0.15" />
            {/* Head */}
            <circle cx="50" cy="44" r="22" fill="#fed7aa" />
            {/* Olive Leaf Hair / Hat */}
            <path
              d="M 28 42 C 28 26, 42 18, 50 18 C 66 18, 72 26, 72 42 C 64 34, 56 36, 50 32 C 44 36, 36 34, 28 42 Z"
              fill="#65a30d"
            />
            {/* Olive Sprout on top */}
            <path d="M 50 18 Q 52 8 60 10 Q 56 18 50 18 Z" fill="#84cc16" />
            {/* Eyes */}
            <ellipse cx="42" cy="44" rx="3.5" ry="4" fill="#365314" />
            <circle cx="43.5" cy="42.5" r="1.2" fill="#ffffff" />
            <ellipse cx="58" cy="44" rx="3.5" ry="4" fill="#365314" />
            <circle cx="59.5" cy="42.5" r="1.2" fill="#ffffff" />
            {/* Rosy cheeks */}
            <circle cx="36" cy="49" r="4" fill="#f87171" opacity="0.6" />
            <circle cx="64" cy="49" r="4" fill="#f87171" opacity="0.6" />
            {/* Friendly Smile */}
            <path d="M 45 52 Q 50 57 55 52" fill="none" stroke="#365314" strokeWidth="2.5" strokeLinecap="round" />
            {/* Body / Overalls */}
            <path d="M 34 66 L 66 66 L 70 85 L 30 85 Z" fill="#0284c7" />
            <path d="M 42 66 L 42 85 M 58 66 L 58 85" stroke="#0369a1" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'taiga': // 타이가 (침엽수 / 냉대 기후)
      return (
        <div
          className={`${containerSize} rounded-2xl bg-gradient-to-br from-teal-500/20 to-slate-800/50 border border-teal-400/50 flex items-center justify-center p-1.5 shadow-md shadow-teal-950/40 relative overflow-hidden group ${className}`}
          title="타이가 (냉대 기후 / 침엽수)"
        >
          <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Conifer Tier 1 (Top) */}
            <polygon points="50,15 35,35 65,35" fill="#14b8a6" />
            {/* Conifer Tier 2 (Middle) */}
            <polygon points="50,28 28,52 72,52" fill="#0d9488" />
            {/* Conifer Tier 3 (Bottom) */}
            <polygon points="50,45 20,72 80,72" fill="#0f766e" />
            {/* Snow on needle tips */}
            <path d="M 46 15 Q 50 12 54 15 L 50 20 Z" fill="#f0fdfa" />
            <path d="M 35 35 Q 40 37 45 35" stroke="#f0fdfa" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 55 35 Q 60 37 65 35" stroke="#f0fdfa" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Tree Trunk */}
            <rect x="44" y="72" width="12" height="12" fill="#78350f" rx="2" />
            {/* Cute eyes on the tree */}
            <circle cx="43" cy="58" r="3.5" fill="#042f2e" />
            <circle cx="44.5" cy="56.5" r="1.2" fill="#ffffff" />
            <circle cx="57" cy="58" r="3.5" fill="#042f2e" />
            <circle cx="58.5" cy="56.5" r="1.2" fill="#ffffff" />
            {/* Smile */}
            <path d="M 47 64 Q 50 67 53 64" fill="none" stroke="#042f2e" strokeWidth="2" strokeLinecap="round" />
            {/* Snowboots */}
            <ellipse cx="40" cy="85" rx="6" ry="3.5" fill="#dc2626" />
            <ellipse cx="60" cy="85" rx="6" ry="3.5" fill="#dc2626" />
          </svg>
        </div>
      );

    case 'jangbogo': // 장보고 (순록 / 한대 기후)
      return (
        <div
          className={`${containerSize} rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-900/50 border border-sky-400/50 flex items-center justify-center p-1.5 shadow-md shadow-sky-950/40 relative overflow-hidden group ${className}`}
          title="장보고 (한대 기후 / 순록)"
        >
          <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Frost Aura */}
            <circle cx="50" cy="50" r="38" fill="#e0f2fe" opacity="0.12" />
            {/* Antlers */}
            {/* Left Antler */}
            <path
              d="M 38 32 C 34 22, 24 18, 22 12 M 28 20 C 22 22, 18 18, 16 14"
              fill="none"
              stroke="#92400e"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Right Antler */}
            <path
              d="M 62 32 C 66 22, 76 18, 78 12 M 72 20 C 78 22, 82 18, 84 14"
              fill="none"
              stroke="#92400e"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Reindeer Head */}
            <ellipse cx="50" cy="46" rx="20" ry="18" fill="#b45309" />
            {/* Snout */}
            <ellipse cx="50" cy="56" rx="13" ry="10" fill="#fef3c7" />
            {/* Glowing red nose (3% chance or signature) */}
            <circle cx="50" cy="53" r="5" fill="#ef4444" className="animate-pulse" />
            <circle cx="48.5" cy="51.5" r="1.5" fill="#ffffff" />
            {/* Ears */}
            <ellipse cx="28" cy="38" rx="6" ry="3" fill="#b45309" transform="rotate(-30 28 38)" />
            <ellipse cx="72" cy="38" rx="6" ry="3" fill="#b45309" transform="rotate(30 72 38)" />
            {/* Eyes */}
            <circle cx="41" cy="42" r="3.5" fill="#451a03" />
            <circle cx="42.5" cy="40.5" r="1" fill="#ffffff" />
            <circle cx="59" cy="42" r="3.5" fill="#451a03" />
            <circle cx="60.5" cy="40.5" r="1" fill="#ffffff" />
            {/* Warm Winter Scarf */}
            <path d="M 32 66 Q 50 72 68 66 Q 72 74 66 78 Q 50 82 34 78 Z" fill="#0284c7" />
            <rect x="54" y="74" width="8" height="12" fill="#0369a1" rx="2" />
          </svg>
        </div>
      );

    default:
      return (
        <div
          className={`${containerSize} rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold ${className}`}
        >
          {characterId.slice(0, 2)}
        </div>
      );
  }
};
