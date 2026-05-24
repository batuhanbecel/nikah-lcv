export function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-purple/12 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-purple-dark/14 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(184,140,255,0.08)_42%,transparent_78%)]" />
    </div>
  );
}
