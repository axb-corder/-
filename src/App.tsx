/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandPhilosophy } from './components/BrandPhilosophy';
import { MealKitList } from './components/MealKitList';
import { ProductDetailModal } from './components/ProductDetailModal';
import { StoreLocation } from './components/StoreLocation';
import { ReservationModal } from './components/ReservationModal';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { KakaoHelpModal } from './components/KakaoHelpModal';
import { MealKitProduct, ReservationInquiry } from './types';
import { STORE_INFO } from './data/mockData';
import { Phone, ArrowUp, MessageCircle, ExternalLink, HelpCircle } from 'lucide-react';

export default function App() {
  // Modals state
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isKakaoHelpOpen, setIsKakaoHelpOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<MealKitProduct | null>(null);

  // Clear any legacy custom kakao url to prevent stale deleted links
  useEffect(() => {
    localStorage.removeItem('dakjobgo_custom_kakao_url');
  }, []);

  const kakaoUrl = STORE_INFO.kakaoChannelUrl;

  const handleReservationInquiry = (inquiry: ReservationInquiry) => {
    try {
      const prevInquiries = JSON.parse(localStorage.getItem('dak_inquiries') || '[]');
      localStorage.setItem('dak_inquiries', JSON.stringify([inquiry, ...prevInquiries]));
    } catch {
      // ignore
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F4] text-[#2D2D2D]">
      {/* Header */}
      <Header
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenKakaoHelp={() => setIsKakaoHelpOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onReservationClick={() => setIsReservationOpen(true)}
          onOpenKakaoHelp={() => setIsKakaoHelpOpen(true)}
        />

        {/* Brand Story & 4 Commitments */}
        <BrandPhilosophy />

        {/* 3 Signature Meal-kit Menus with detail & SmartStore order */}
        <MealKitList
          onOpenDetail={(product) => setDetailProduct(product)}
        />

        {/* Customer Reviews Section */}
        <ReviewsSection />

        {/* Offline Store Section (순천시 연향동) */}
        <StoreLocation
          onOpenReservation={() => setIsReservationOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer onOpenKakaoHelp={() => setIsKakaoHelpOpen(true)} />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        {/* Quick SmartStore Button */}
        <a
          href={STORE_INFO.smartstoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#03C75A] hover:bg-[#02b150] text-white shadow-md hover:shadow-lg font-bold text-xs transition-all hover:scale-105 active:scale-95"
          title="네이버 스마트스토어 바로가기"
        >
          <span className="font-black text-[12px] bg-white text-[#03C75A] w-4 h-4 rounded-xs flex items-center justify-center">N</span>
          <span>스마트스토어 주문</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>

        {/* Quick KakaoTalk Chat Pill with Help Trigger */}
        <div className="flex items-center gap-1.5">
          <a
            href={kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] shadow-md hover:shadow-lg font-bold text-xs transition-all hover:scale-105 active:scale-95 border border-[#FEE500]"
            title="카카오톡 1:1 실시간 상담 바로가기"
          >
            <MessageCircle className="w-4 h-4 fill-[#191919]" />
            <span>카카오톡 문의</span>
          </a>
          <button
            type="button"
            onClick={() => setIsKakaoHelpOpen(true)}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#FEE500]/40 text-[#191919] border border-[#2D2D2D]/10 shadow-xs flex items-center justify-center text-xs font-bold transition-all"
            title="카카오톡 채널 안내 및 링크 설정"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Phone Call Pill */}
        <a
          href={`tel:${STORE_INFO.phone}`}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#2D2D2D] hover:text-[#C84B31] border border-[#2D2D2D]/10 shadow-md hover:shadow-lg font-bold text-xs transition-all hover:scale-105"
          title="매장 전화 바로걸기"
        >
          <Phone className="w-3.5 h-3.5 text-[#C84B31]" />
          <span>{STORE_INFO.phone} 전화</span>
        </a>

        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-white hover:bg-[#F2EFE9] text-[#2D2D2D] border border-[#2D2D2D]/10 shadow-xs flex items-center justify-center transition-all hover:text-[#C84B31]"
          title="맨 위로 가기"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>

      {/* Modals */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
      />

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        onSubmitInquiry={handleReservationInquiry}
        onOpenKakaoHelp={() => setIsKakaoHelpOpen(true)}
      />

      <KakaoHelpModal
        isOpen={isKakaoHelpOpen}
        onClose={() => setIsKakaoHelpOpen(false)}
      />
    </div>
  );
}
