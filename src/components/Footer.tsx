import React, { useState, useEffect } from 'react';
import { STORE_INFO } from '../data/mockData';
import { Utensils, Phone, MapPin, Clock, ShieldCheck, MessageCircle, ExternalLink, Instagram, HelpCircle } from 'lucide-react';

interface FooterProps {
  onOpenKakaoHelp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenKakaoHelp }) => {
  return (
    <footer className="bg-[#FCF9F4] text-[#2D2D2D] border-t border-[#2D2D2D]/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#2D2D2D]/10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#C84B31] text-white flex items-center justify-center">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-[#C84B31] tracking-tighter">
                {STORE_INFO.name}
              </span>
            </div>
            <p className="text-xs opacity-75 leading-relaxed">
              {STORE_INFO.concept}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#C84B31]/10 text-xs text-[#C84B31] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C84B31]" />
              <span>100% 신선 국내산 닭고기 보장</span>
            </div>
          </div>

          {/* Offline Store Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest opacity-60">
              OFFLINE STORE
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C84B31] shrink-0 mt-0.5" />
                <span className="font-semibold">{STORE_INFO.address} (연향동 1층)</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#C84B31] shrink-0 mt-0.5" />
                <span>{STORE_INFO.businessHours}</span>
              </div>
              <div className="opacity-60 pl-6">
                브레이크타임: {STORE_INFO.breakTime}
              </div>
            </div>
          </div>

          {/* Customer Service & Reservation */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest opacity-60">
              RESERVATIONS & ORDERS
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="text-2xl font-black text-[#2D2D2D] hover:text-[#C84B31] tracking-tight transition-colors block"
              >
                {STORE_INFO.phone}
              </a>
              <p className="text-xs opacity-80">
                {STORE_INFO.bannerPhrase}
              </p>
              <p className="text-[11px] opacity-60">
                상담시간: 월~토 16:00 ~ 24:00 (일요일 휴무)
              </p>
              <a
                href={STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 text-white font-bold text-xs shadow-xs transition-all active:scale-98"
                title="공식 인스타그램 (@dak_jap_o) 바로가기"
              >
                <Instagram className="w-4 h-4" />
                <span>공식 인스타그램 ({STORE_INFO.instagramHandle})</span>
                <ExternalLink className="w-3 h-3 opacity-80 ml-auto" />
              </a>
              <div className="mt-1.5 flex items-center gap-1.5">
                <a
                  href={STORE_INFO.kakaoChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold text-xs shadow-xs transition-all active:scale-98"
                  title="카카오톡 채널 1:1 상담 바로가기"
                >
                  <MessageCircle className="w-4 h-4 fill-[#191919]" />
                  <span>카카오톡으로 문의하기</span>
                  <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
                </a>
                {onOpenKakaoHelp && (
                  <button
                    type="button"
                    onClick={onOpenKakaoHelp}
                    className="p-2.5 rounded-xl bg-black/5 hover:bg-[#FEE500]/50 text-[#191919] text-xs font-bold transition-colors"
                    title="카톡 연결 안내 및 ID 복사"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
              <a
                href={STORE_INFO.smartstoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center justify-center gap-2 w-full py-2.5 px-3.5 rounded-xl bg-[#03C75A] hover:bg-[#02b150] text-white font-bold text-xs shadow-xs transition-all active:scale-98"
                title="네이버 스마트스토어 바로가기"
              >
                <span className="font-black text-[12px] bg-white text-[#03C75A] w-4 h-4 rounded-xs flex items-center justify-center">N</span>
                <span>네이버 스마트스토어 바로가기</span>
                <ExternalLink className="w-3 h-3 opacity-80 ml-auto" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest opacity-60">
              SIGNATURE MEAL KITS
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#mealkit-menu" className="hover:text-[#C84B31] transition-colors">
                  • 단짠단짠 간장찜닭 밀키트 (2.3kg)
                </a>
              </li>
              <li>
                <a href="#mealkit-menu" className="hover:text-[#C84B31] transition-colors">
                  • 매콤달달 닭볶음탕 밀키트 (2kg)
                </a>
              </li>
              <li>
                <a href="#mealkit-menu" className="hover:text-[#C84B31] transition-colors">
                  • 순천만 가든닭 핫도그 (숯불 닭바베큐 & 미나리슬로우)
                </a>
              </li>
              <li>
                <span className="opacity-60">• 전국 안심 콜드체인 아이스박스 익일 출고</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Artistic Flair Sub-footer bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-medium opacity-60 uppercase tracking-[0.2em] gap-3">
          <div>© {new Date().getFullYear()} DAKJAPGO ORIBAL. ALL RIGHTS RESERVED.</div>
          <div>전남 순천시 연향상가6길 7 | SUNCHEON KOREA</div>
        </div>

      </div>
    </footer>
  );
};
