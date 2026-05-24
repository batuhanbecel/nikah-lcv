export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-background text-foreground">
      <div className="text-center">
        <p className="font-serif text-5xl">B & B</p>
        <div className="mx-auto mt-5 h-px w-40 animate-pulse bg-purple" />
      </div>
    </div>
  );
}
