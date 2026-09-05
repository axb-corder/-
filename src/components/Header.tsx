import React from 'react';
import { ShoppingBag, Phone, MapPin, Utensils, CalendarCheck, Sparkles } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
  onOpenOrderLookup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenReservation,
  onOpenOrderLookup,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FCF9F4]/95 backdrop-blur-md border-b border-[#2D2D2D]/10">
      {/* Top Notice Bar */}
      <div className="bg-[#2D2D2D] text-[#FCF9F4] px-4 py-2 text-xs md:text-sm font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#C84B31] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
              공지
            </span>
            <span className="truncate opacity-90">
              {STORE_INFO.facilityNotice}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-xs font-semibold">
            <a
              href={`tel:${STORE_INFO.phone}`}
              className="flex items-center gap-1.5 hover:text-[#FFA94D] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C84B31]" />
              <span>{STORE_INFO.phone}</span>
            </a>
            <span className="opacity-30">|</span>
            <span className="opacity-80">{STORE_INFO.bannerPhrase}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-22 flex items-center justify-between">
        {/* Logo with Artistic Flair Display Typography */}
        <a href="#" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-2xl bg-[#C84B31] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
            <Utensils className="w-5 h-5 text-[#FCF9F4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-[#C84B31] leading-none whitespace-nowrap">
                {STORE_INFO.name}
              </span>
              <span className="text-[10px] bg-[#C84B31]/10 text-[#C84B31] font-bold px-2 py-0.5 rounded-sm shrink-0">
                100% 국내산
              </span>
            </div>
            <p className="text-[11px] uppercase tracking-widest font-semibold opacity-60 text-[#2D2D2D] mt-1 whitespace-nowrap">
              Fresh Domestic Chicken Specialty Restaurant
            </p>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-bold text-[#2D2D2D]">
          <a
            href="#brand-story"
            className="hover:text-[#C84B31] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#C84B31] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            브랜드 스토리
          </a>
          <a
            href="#mealkit-menu"
            className="hover:text-[#C84B31] transition-colors py-1 flex items-center gap-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#C84B31] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            밀키트 메뉴 (3종)
            <span className="w-1.5 h-1.5 rounded-full bg-[#C84B31]"></span>
          </a>
          <a
            href="#offline-store"
            className="hover:text-[#C84B31] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#C84B31] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            오프라인 매장
          </a>
          <button
            onClick={onOpenReservation}
            className="hover:text-[#C84B31] transition-colors py-1 flex items-center gap-1.5 font-bold"
          >
            <CalendarCheck className="w-4 h-4 text-[#C84B31]" />
            <span>예약 & 단체 문의</span>
          </button>
          <button
            onClick={onOpenOrderLookup}
            className="text-xs font-semibold opacity-60 hover:opacity-100 underline underline-offset-4 decoration-[#2D2D2D]/30"
          >
            주문 내역 조회
          </button>
        </nav>

        {/* Action Controls & Contact Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Reservation / Phone Widget */}
          <div className="hidden lg:block text-right">
            <p className="text-[11px] font-bold opacity-60">예약 및 단체 문의</p>
            <a
              href={`tel:${STORE_INFO.phone}`}
              className="text-xl font-black tracking-tight text-[#2D2D2D] hover:text-[#C84B31] transition-colors"
            >
              {STORE_INFO.phone}
            </a>
          </div>

          {/* Reservation Button (Mobile) */}
          <button
            onClick={onOpenReservation}
            className="inline-flex md:hidden items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#C84B31] bg-[#C84B31]/10 rounded-xl hover:bg-[#C84B31]/15 transition-colors"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>예약</span>
          </button>

          {/* Cart Trigger Button */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-4 py-2.5 bg-[#2D2D2D] hover:bg-[#C84B31] text-white rounded-xl font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all active:scale-95"
            aria-label="장바구니 열기"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">장바구니</span>
            {cartCount > 0 && (
              <span className="bg-[#C84B31] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center -mr-1">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
