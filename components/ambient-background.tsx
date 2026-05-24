export function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-purple/10 blur-3xl" />
      <div className="absolute -right-28 bottom-20 h-96 w-96 rounded-full bg-purple/12 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-purple-soft/40 to-transparent" />
    </div>
  );
}
