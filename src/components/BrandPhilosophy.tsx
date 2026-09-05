import React from 'react';
import { STORE_INFO } from '../data/mockData';
import { CheckCircle2, HeartHandshake, Sparkles, Store, UtensilsCrossed } from 'lucide-react';

export const BrandPhilosophy: React.FC = () => {
  return (
    <section id="brand-story" className="py-20 bg-[#F2EFE9] border-b border-[#2D2D2D]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-[#C84B31] text-white text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STORY & PHILOSOPHY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2D2D2D] tracking-tight">
            닭 하나에 진심을 담은 <br />
            <span className="text-[#C84B31] underline underline-offset-4">‘{STORE_INFO.name}’</span>의 원칙
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#2D2D2D] opacity-80 leading-relaxed">
            전남 순천시 연향동에서 시작된 정직한 닭요리. 
            손님들께서 “이 맛 그대로 집에서도 끓여 먹고 싶다”고 하신 수많은 요청 끝에 
            매장 맛 그대로 드실 수 있게 소스와 신선한 100% 국내산 닭을 한 봉에 정성껏 담았습니다.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STORE_INFO.features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-[#2D2D2D]/5 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#C84B31]/10 text-[#C84B31] flex items-center justify-center mb-5 font-black text-sm">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-[#2D2D2D] mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#2D2D2D] opacity-70 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2D2D2D]/5 flex items-center gap-2 text-xs font-bold text-[#C84B31]">
                <CheckCircle2 className="w-4 h-4 text-[#C84B31]" />
                <span>엄격한 품질 관리</span>
              </div>
            </div>
          ))}
        </div>

        {/* Offline to Online Continuity Highlight Banner */}
        <div className="mt-12 bg-[#2D2D2D] text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6 border border-[#2D2D2D]/10">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-13 h-13 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
              <Store className="w-6 h-6 text-[#FFA94D]" />
            </div>
            <div>
              <div className="inline-block bg-[#C84B31] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-xs uppercase tracking-wider mb-1">
                OFFLINE TO ONLINE
              </div>
              <h4 className="text-xl sm:text-2xl font-bold tracking-tight">
                순천시 연향동 오프라인 매장 맛 그대로!
              </h4>
              <p className="text-xs sm:text-sm text-[#E0DDD7] mt-1 opacity-90">
                직접 방문해 주시는 손님들의 입맛을 사로잡은 비법 레시피. 이제 주문 즉시 냉장 포장되어 전국의 가정과 캠핑장으로 배송됩니다.
              </p>
            </div>
          </div>

          <a
            href="#offline-store"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-[#C84B31] hover:bg-[#A93C25] text-white font-bold text-xs sm:text-sm transition-colors shadow-sm flex items-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>연향동 매장 안내 보기</span>
          </a>
        </div>

      </div>
    </section>
  );
};
