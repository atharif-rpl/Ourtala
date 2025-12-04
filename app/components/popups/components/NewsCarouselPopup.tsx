"use client";

import { useState } from "react";
import { NEWS_SLIDES } from "../data/newsSlides"; // Import data

interface NewsCarouselPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export default function NewsCarouselPopup({ isOpen, onClose, onNavigate }: NewsCarouselPopupProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === NEWS_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? NEWS_SLIDES.length - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      ></div>

      {/* Wrapper Popup */}
      <div className="relative w-full max-w-5xl flex items-center justify-center">
        
        {/* Main Popup Box */}
        <div className="relative w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 z-30 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-md transition-all border border-white/20"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          {/* Carousel Container */}
          <div className="relative w-full h-[75vh] md:h-[550px] overflow-hidden">
            
            {/* TRACK SLIDER */}
            <div 
              className="flex h-full transition-transform duration-700 ease-in-out will-change-transform"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {NEWS_SLIDES.map((slide) => (
                <div 
                  key={slide.id}
                  className="min-w-full h-full relative"
                >
                  {/* Image Background */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  >
                     {/* GRADIENT ADJUSTMENT: Fokus gelap hanya di bawah */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  </div>

                  {/* Text Content - ADJUSTED POSITION */}
                  {/* UBAH: px-6 (kiri kanan), pb-6 (bawah pendek), pt-20 (atas longgar) */}
                  <div className="absolute bottom-0 left-0 w-full px-6 pb-6 pt-24 md:px-12 md:pb-10 text-white flex flex-col items-start justify-end h-full pointer-events-none">
                    
                    {/* Title: Spacing dikurangi (mb-2) */}
                    <h2 className="text-2xl md:text-5xl font-bold mb-2 md:mb-3 drop-shadow-lg leading-tight pointer-events-auto">
                      {slide.title}
                    </h2>
                    
                    {/* Desc: Spacing dikurangi (mb-4) */}
                    <p className="text-sm md:text-lg text-gray-200 mb-4 md:mb-5 max-w-2xl drop-shadow-md line-clamp-2 md:line-clamp-3 pointer-events-auto">
                      {slide.desc}
                    </p>
                    
                    {/* Button */}
                    <button
                      onClick={() => onNavigate(slide.targetSectionId)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-6 md:py-3 md:px-8 text-sm md:text-base rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg pointer-events-auto"
                    >
                      {slide.ctaText}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {NEWS_SLIDES.length > 1 && (
              <>
                <button 
                  onClick={prevSlide}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/50 text-white p-3 md:p-4 rounded-full backdrop-blur-sm transition-all border border-white/10"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/50 text-white p-3 md:p-4 rounded-full backdrop-blur-sm transition-all border border-white/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </>
            )}

            {/* Dots Indicators - Dipindah lebih ke bawah juga */}
            <div className="absolute top-4 left-4 md:top-auto md:bottom-6 md:left-auto md:right-8 z-20 flex gap-2">
              {NEWS_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                    index === currentSlide ? "bg-green-500 w-8 md:w-10" : "bg-white/40 w-2 md:w-3 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}