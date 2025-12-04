"use client";

export default function CautionPopup() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-caution-slide-in pointer-events-auto px-4 w-full"> 
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 text- px-6 py-2 md:px-12 md:py-8 rounded-2xl shadow-2xl max-w-2xl mx-auto border-4 border-black transform transition-transform hover:scale-105">
          <div className="flex items-center justify-center gap-4 mb-1">
            <div className="text-4xl md:text-6xl"><img className="w-44" src="/images/Logo/OURTALA.png" alt="" /></div>
            <div className="text-4xl md:text-6xl"></div>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-center tracking-tight mb-2">
            ❗️ATTENTION❗️
          </h2>
          <p className="text-center text-lg md:text-xl font-bold tracking-wide">
          Ourtala Open Recruitment
          </p>
        </div>
      </div>
    </div>
  );
}