export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-6 text-center">
      <h1 className="text-[120px] font-black tracking-tighter text-[#d3427b] opacity-20 select-none">
        404
      </h1>

      <div className="space-y-4 -mt-12 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Lost in Space
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          We couldn&apos;t find the page you&apos;re looking for.
        </p>

        <div className="pt-8">
          <a href="/">
            <button className="px-8 py-4 bg-[#d3427b] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
              Return Home
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
