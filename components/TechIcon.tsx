export default function TechIcon({ path, color = "currentColor", className }: { path: string; color?: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d={path} />
    </svg>
  );
}
