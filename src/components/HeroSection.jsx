const HeroSection = () => (
  <div className="relative min-h-[440px] md:min-h-[500px] rounded-[2.5rem] mb-12 overflow-hidden bg-slate-900 flex items-center justify-center px-6 sm:px-12 text-center shadow-2xl shadow-slate-900/10">
    
    {/* Background Image with Parallax-like positioning */}
    <div 
      className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000"
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')",
      }}
    />

    {/* Creative Gradient Overlays for High Contrast and Modern Depth */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/30"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/20 via-transparent to-slate-950/20"></div>

    {/* Subtle Vector Tech/Grid Pattern Overlay for a Modern Clean Tech-Agri Look */}
    <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]"></div>

    {/* Content Container */}
    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
      
      {/* Decorative Minimal Tag */}
      <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-400/20 px-4 py-1.5 rounded-full backdrop-blur-md">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">
          Pure Organic Agriculture
        </span>
      </div>

      {/* Main Heading with Typography treatments */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.25] sm:leading-[1.2]">
        ផលិតផលកសិកម្ម
        <span className="block mt-2 bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-200 bg-clip-text text-transparent">
          ស្រស់ៗធម្មជាតិ
        </span>
      </h1>

      {/* Structured Subtitle Description */}
      <p className="text-slate-300/90 text-base sm:text-lg max-w-lg mx-auto font-medium leading-relaxed">
        បម្រើជូននូវកសិផលខ្មែរដែលមានគុណភាពខ្ពស់ ធម្មជាតិពិតៗ គ្មានសារធាតុគីមី ផ្ដល់សុខភាពល្អដល់ក្រុមគ្រួសារអ្នក។
      </p>

      {/* Call to Action Interactive Buttons Divider */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-sm px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20">
          ទិញទំនិញឥឡូវនេះ
        </button>
        <button className="w-full sm:w-auto bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white font-bold text-sm px-8 py-3.5 rounded-xl border border-white/10 backdrop-blur-md transition-all duration-200">
          ស្វែងយល់បន្ថែម
        </button>
      </div>

    </div>

    {/* Bottom Elegant Shade Blend */}
    <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-slate-50 to-transparent opacity-10"></div>
  </div>
);

export default HeroSection;