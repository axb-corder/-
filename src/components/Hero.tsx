import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Clock, MapPin, Phone, Truck, ExternalLink, Instagram } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

interface HeroProps {
  onOrderClick: () => void;
  onReservationClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick, onReservationClick }) => {
  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem('dakjobgo_custom_spicy-dakbokkeum') || '/dakbokkeum-mealkit.png';
  });

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.productId === 'spicy-dakbokkeum') {
        setHeroImage(customEvent.detail.imageUrl || '/dakbokkeum-mealkit.png');
      }
    };
    window.addEventListener('dakjobgo-product-image-updated', handleUpdate);
    return () => window.removeEventListener('dakjobgo-product-image-updated', handleUpdate);
  }, []);
  return (
    <section className="relative overflow-hidden bg-[#FCF9F4] text-[#2D2D2D] border-b border-[#2D2D2D]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Artistic Flair Headline & Brand Concept */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Brand Concept Label */}
            <div className="flex items-center gap-3">
              <span className="inline-block bg-[#C84B31] text-white px-3 py-1 text-xs font-black rounded-xs uppercase tracking-widest">
                BRAND CONCEPT
              </span>
              <span className="text-xs uppercase tracking-widest font-semibold opacity-60 text-[#2D2D2D]">
                Fresh Domestic Chicken Specialty
              </span>
            </div>

            {/* Headline with Artistic Flair Underline Accent */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-tight text-[#2D2D2D]">
                순천 연향동에서 <br />
                검증된 맛 그대로, <br />
                <span className="text-[#C84B31] underline underline-offset-8 decoration-4 decoration-[#C84B31]">
                  온라인 밀키트 출시
                </span>
              </h1>
              <p className="text-sm sm:text-base leading-relaxed opacity-80 max-w-xl text-[#2D2D2D]">
                신선한 100% 국내산 닭만을 고집하여 정성을 다해 요리합니다. 
                매장에서 느꼈던 그 깊은 풍미와 신선함을 이제 집과 캠핑장에서도 간편하게 즐기세요.
              </p>
            </div>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                id="hero-order-btn"
                onClick={onOrderClick}
                className="px-6 py-3.5 rounded-xl bg-[#C84B31] hover:bg-[#A93C25] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md flex items-center gap-2 transition-all transform active:scale-95"
              >
                <span>밀키트 메뉴 주문하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={STORE_INFO.smartstoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#03C75A] hover:bg-[#02b150] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md flex items-center gap-2 transition-all transform active:scale-95"
                title="네이버 스마트스토어에서 구매하기"
              >
                <span className="font-black text-[12px] bg-white text-[#03C75A] w-4 h-4 rounded-xs flex items-center justify-center">N</span>
                <span>스마트스토어로 구매</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <a
                href={STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md flex items-center gap-2 transition-all transform active:scale-95"
                title="공식 인스타그램 (@dak_jap_o) 바로가기"
              >
                <Instagram className="w-4 h-4" />
                <span>인스타그램</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                id="hero-reservation-btn"
                onClick={onReservationClick}
                className="px-6 py-3.5 rounded-xl bg-[#2D2D2D] hover:bg-black text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C84B31]" />
                <span>예약 및 단체 문의 ({STORE_INFO.phone})</span>
              </button>
            </div>

            {/* Offline Store Highlight Box (Artistic Flair Motif) */}
            <div className="bg-white/80 border border-[#2D2D2D]/10 p-6 rounded-2xl shadow-2xs space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase opacity-50 tracking-widest text-[#2D2D2D]">
                  OFFLINE STORE & PICKUP
                </h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">
                    Open for Dine-in & Pickup
                  </span>
                </div>
              </div>
              <p className="text-base font-black text-[#2D2D2D]">
                전남 순천시 연향상가6길 7, 1층 ({STORE_INFO.name})
              </p>
              <p className="text-xs opacity-70">
                순천시 연향동 오프라인 매장 상시 운영 중 | 매장 식사 & 즉시 포장 가능
              </p>
            </div>

            {/* Micro Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#2D2D2D]/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2D2D2D]/5 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#C84B31]" />
                </div>
                <div>
                  <div className="text-xs font-black">100% 국내산</div>
                  <div className="text-[10px] opacity-60">신선 냉장육 엄선</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2D2D2D]/5 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-[#C84B31]" />
                </div>
                <div>
                  <div className="text-xs font-black">비법 수제 양념</div>
                  <div className="text-[10px] opacity-60">인공 조미료 배제</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2D2D2D]/5 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-[#C84B31]" />
                </div>
                <div>
                  <div className="text-xs font-black">신선 콜드체인</div>
                  <div className="text-[10px] opacity-60">전국 익일 출고</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2D2D2D]/5 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#C84B31]" />
                </div>
                <div>
                  <div className="text-xs font-black">15분 초간편</div>
                  <div className="text-[10px] opacity-60">냄비 하나로 완성</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Curated Food Showcase with Artistic Flair */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none space-y-4">
              {/* Primary Dish Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#2D2D2D]/10 bg-white group">
                <img
                  src={heroImage}
                  alt={`${STORE_INFO.name} 대표 수제 닭볶음탕 & 찜닭 밀키트`}
                  className="w-full h-72 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1000&q=80';
                    if (target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                />
                <div className="p-6 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#C84B31] bg-[#C84B31]/10 px-2.5 py-1 rounded-sm">
                      SIGNATURE MEAL KIT
                    </span>
                    <span className="text-xs font-bold opacity-60">푸짐한 3~4인분 (2kg~2.3kg / 20분 조리)</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-[#2D2D2D]">
                    국내산 닭고기에 순천의 맛을 담은 수제 닭요리
                  </h3>
                  <p className="text-xs leading-relaxed opacity-70">
                    매콤달달 닭볶음탕 & 단짠단짠 간장찜닭. 순천시 인증 100% 국내산 신선육으로 완성한 프리미엄 밀키트
                  </p>
                </div>
              </div>

              {/* Floating Stat Chip */}
              <div className="bg-white border border-[#2D2D2D]/10 p-4 rounded-2xl shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C84B31] text-white flex items-center justify-center font-black text-sm">
                    3종
                  </div>
                  <div>
                    <div className="text-xs font-bold">간장찜닭 · 닭볶음탕 · 핫도그</div>
                    <div className="text-[11px] opacity-60">매장 포장 및 온라인 택배 상시 배송</div>
                  </div>
                </div>
                <button
                  onClick={onOrderClick}
                  className="text-xs font-bold text-[#C84B31] underline underline-offset-4 hover:opacity-80"
                >
                  주문하기
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
