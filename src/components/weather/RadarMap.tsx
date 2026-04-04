export function RadarMap() {
  return (
    <div className="glass-darker w-full h-80 rounded-xl overflow-hidden relative group">
      {/* Map background image */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover opacity-60 grayscale-20 group-hover:scale-105 transition-transform duration-700"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIeWgH4-uqxrcjL7WezbRtXHCmtnAcvUy4vu6YA71aXeAf5HgE5qBwdZagWMfqw5SvyWkBWHrjCyVQdscoEvi5w42q_p4bY6oBHvh_zVMKx3CWTlkDF8Aaj6wt99UYw2eonSrcKXnIkgZiS1MtqVCcRt9rWW4Q9qTHRjT0I-IaTzaXDl_0H5v9Aq25dkUfHNKpZtEq-2XVbEXhGL3oyEtnpltLoCTIO0I85loE9hzQG0OOqFVIAp9wufH82VNZkEWUBCRqHXwPR4Wj"
          alt="Satellite meteorological map with terrain and precipitation data"
        />
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
      {/* Bottom labels */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
        <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full w-fit tracking-widest uppercase">
          Live Radar
        </span>
        <h4 className="text-2xl font-bold text-slate-900">Precipitation Map</h4>
      </div>
      {/* Fullscreen button */}
      <button className="absolute top-6 right-6 z-10 glass-darker p-3 rounded-full hover:bg-white transition-all shadow-xl cursor-pointer">
        <span className="material-symbols-outlined">fullscreen</span>
      </button>
    </div>
  );
}
