import React from 'react';
import { CUSTOMER_REVIEWS } from '../data/mockData';
import { Star, MessageSquareQuote, ThumbsUp, ShieldCheck } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#F2EFE9] border-b border-[#2D2D2D]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-[#C84B31] text-white text-xs font-bold uppercase tracking-widest mb-2">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>CUSTOMER REVIEWS</span>
            </div>
            <h2 className="text-3xl font-black text-[#2D2D2D] tracking-tight">
              매장 단골부터 전국 밀키트 고객님들의 솔직 후기
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-[#2D2D2D]/10 shadow-2xs">
            <div className="flex text-[#FFA94D]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-black text-[#2D2D2D]">4.9 / 5.0</span>
            <span className="text-xs opacity-60">(누적 리뷰 1,840+ 건)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-[#2D2D2D]/5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#FFA94D]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] opacity-40">{rev.date}</span>
                </div>

                <div className="inline-block bg-[#C84B31]/10 text-[#C84B31] text-[11px] font-bold px-2 py-0.5 rounded-xs">
                  구매 품목: {rev.menu}
                </div>

                <p className="text-sm text-[#2D2D2D] opacity-80 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#2D2D2D]/5 flex items-center justify-between text-xs opacity-70">
                <span className="font-bold text-[#2D2D2D]">{rev.author}</span>
                <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  실제 구매 인증
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
