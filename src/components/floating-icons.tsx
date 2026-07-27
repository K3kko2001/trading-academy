import type { LucideIcon } from "lucide-react";

type FloatingIcon = {
  icon: LucideIcon;
  className: string;
  duration?: number;
  delay?: number;
  rotate?: number;
  size?: number;
};

export default function FloatingIcons({ items }: { items: FloatingIcon[] }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {items.map(({ icon: Icon, className, duration = 6, delay = 0, rotate = 0, size = 22 }, i) => (
        <div
          key={i}
          className={`animate-float absolute flex items-center justify-center rounded-2xl border border-white/10 bg-card/90 shadow-xl shadow-black/30 ${className}`}
          style={
            {
              "--float-duration": `${duration}s`,
              "--float-delay": `${delay}s`,
              "--float-rot": `${rotate}deg`,
              width: size * 2,
              height: size * 2,
            } as React.CSSProperties
          }
        >
          <Icon size={size} className="text-accent" strokeWidth={1.75} />
        </div>
      ))}
    </div>
  );
}
