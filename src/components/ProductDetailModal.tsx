import React, { useState, useEffect } from 'react';
import { MealKitProduct, ProductOption } from '../types';
import { EXTRA_OPTIONS, STORE_INFO } from '../data/mockData';
import { X, Check, Plus, Minus, ChefHat, Package, Award, ShieldAlert, AlertTriangle, Lightbulb, ExternalLink } from 'lucide-react';

interface ProductDetailModalProps {
  product: MealKitProduct | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  const [selectedOptions, setSelectedOptions] = useState<ProductOption[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedOptions([]);
    setQuantity(1);
  }, [product?.id]);

  const toggleOption = (option: ProductOption) => {
    if (selectedOptions.some((o) => o.id === option.id)) {
      setSelectedOptions(selectedOptions.filter((o) => o.id !== option.id));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const optionsTotalPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const unitPrice = product.price + optionsTotalPrice;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#2D2D2D]/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FCF9F4] rounded-3xl shadow-2xl border border-[#2D2D2D]/10 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2D2D2D]/10 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-black bg-[#C84B31] text-white uppercase tracking-widest">
              MEAL KIT DETAIL
            </span>
            <h3 className="text-xl font-black text-[#2D2D2D] tracking-tight truncate">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#FCF9F4] hover:bg-[#F2EFE9] text-[#2D2D2D] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Main Hero Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            <div className="sm:col-span-5 rounded-2xl overflow-hidden shadow-xs border border-[#2D2D2D]/10 aspect-4/3 bg-[#2D2D2D] relative">
              {(() => {
                const customImg = localStorage.getItem(`dakjobgo_custom_${product.id}`);
                const fallbackImg = product.id === 'spicy-dakbokkeum'
                  ? 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=80'
                  : product.imageUrl;
                const displayImg = customImg || (product.id === 'spicy-dakbokkeum' ? '/dakbokkeum-mealkit.png' : product.imageUrl);

                return (
                  <img
                    src={displayImg}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== fallbackImg) {
                        target.src = fallbackImg;
                      }
                    }}
                  />
                );
              })()}
            </div>

            <div className="sm:col-span-7 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] font-bold text-[#C84B31] bg-[#C84B31]/10 px-2 py-0.5 rounded-xs">
                    #{t}
                  </span>
                ))}
              </div>
              <h4 className="text-2xl font-black text-[#2D2D2D] tracking-tight">
                {product.name}
              </h4>
              <p className="text-xs opacity-60">
                {product.subtitle}
              </p>
              <p className="text-sm opacity-80 leading-relaxed pt-1 text-[#2D2D2D]">
                {product.description}
              </p>

              {/* Specs Badge Bar */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#2D2D2D]/10 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-[#2D2D2D]/5 text-center">
                  <span className="opacity-50 block text-[10px] font-semibold">소요 시간</span>
                  <strong className="text-[#2D2D2D] font-bold">{product.cookingTime}</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#2D2D2D]/5 text-center">
                  <span className="opacity-50 block text-[10px] font-semibold">권장 인원</span>
                  <strong className="text-[#2D2D2D] font-bold">{product.servings}</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#2D2D2D]/5 text-center">
                  <span className="opacity-50 block text-[10px] font-semibold">중량</span>
                  <strong className="text-[#2D2D2D] font-bold">{product.weight}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Component Package List */}
          <div className="bg-white p-6 rounded-2xl border border-[#2D2D2D]/5 space-y-4">
            <h5 className="text-base font-black text-[#2D2D2D] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#C84B31]" />
              밀키트 동봉 구성품
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.components.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-[#2D2D2D] bg-[#FCF9F4] p-2.5 rounded-xl border border-[#2D2D2D]/5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Cooking Guide */}
          <div className="bg-white p-6 rounded-2xl border border-[#2D2D2D]/5 space-y-4">
            <h5 className="text-base font-black text-[#2D2D2D] flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-[#C84B31]" />
              초간편 비법 레시피 조리 순서
            </h5>
            <div className="space-y-3">
              {product.cookingSteps.map((step) => (
                <div key={step.step} className="flex items-start gap-3.5 p-3 rounded-xl bg-[#FCF9F4] border border-[#2D2D2D]/5">
                  <span className="w-6 h-6 rounded-full bg-[#C84B31] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {step.step}
                  </span>
                  <div className="flex-1">
                    <h6 className="text-xs sm:text-sm font-bold text-[#2D2D2D]">
                      {step.title}
                    </h6>
                    <p className="text-xs opacity-75 mt-0.5 leading-relaxed text-[#2D2D2D]">
                      {step.desc}
                    </p>
                    {step.tip && (
                      <div className="mt-1.5 inline-block text-[11px] font-semibold text-[#C84B31] bg-[#C84B31]/10 px-2 py-0.5 rounded-md">
                        💡 꿀팁: {step.tip}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Card if available */}
          {product.tips && product.tips.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-black text-amber-950 text-sm">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>맛있게 즐기는 꿀팁!</span>
              </div>
              <ul className="space-y-1.5">
                {product.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-amber-950 font-medium">
                    <span className="text-[#C84B31] font-bold shrink-0">✔</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Caution Alert Card if available */}
          {product.caution && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-950 text-xs flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-red-900 mb-0.5">! 주의사항 및 보관 권장 !</strong>
                <p className="leading-relaxed opacity-90">{product.caution}</p>
              </div>
            </div>
          )}

          {/* Origin and Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Award className="w-4 h-4 text-amber-700" />
                원산지 표기 (안심 먹거리)
              </div>
              <p className="leading-relaxed opacity-90">{product.origin}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                보관 및 취급 요령
              </div>
              <p className="leading-relaxed opacity-90">{product.storage}</p>
            </div>
          </div>

          {/* Configuration Selection Area */}
          <div className="bg-[#F2EFE9] p-6 rounded-2xl border border-[#2D2D2D]/10 space-y-5">
            {/* Additional Toppings / Addons (Excluded for Hotdog) */}
            {product.id !== 'suncheon-hotdog' && (
              <div>
                <label className="block text-xs font-bold text-[#2D2D2D] mb-2">
                  추가 사리 & 사이드 선택 (선택 사항)
                </label>
                <div className="space-y-2">
                  {EXTRA_OPTIONS.map((opt) => {
                    const isChecked = selectedOptions.some((o) => o.id === opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleOption(opt)}
                        className={`w-full p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-[#C84B31]/10 border-[#C84B31] text-[#C84B31] font-bold'
                            : 'bg-white border-[#2D2D2D]/10 text-[#2D2D2D] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-xs border flex items-center justify-center ${isChecked ? 'bg-[#C84B31] border-[#C84B31] text-white' : 'border-[#2D2D2D]/30'}`}>
                            {isChecked && <Check className="w-3 h-3 stroke-3" />}
                          </div>
                          <span>{opt.name}</span>
                        </div>
                        <span className="font-bold">+{opt.price.toLocaleString()}원</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-[#2D2D2D]">수량 선택</span>
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-[#2D2D2D]/10">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-6 h-6 rounded-md bg-[#FCF9F4] text-[#2D2D2D] flex items-center justify-center hover:bg-[#EAE2D8]"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-bold text-[#2D2D2D] min-w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-6 h-6 rounded-md bg-[#FCF9F4] text-[#2D2D2D] flex items-center justify-center hover:bg-[#EAE2D8]"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Bar */}
        <div className="p-6 bg-white border-t border-[#2D2D2D]/10 flex items-center justify-between gap-4 sticky bottom-0 z-10">
          <div>
            <div className="text-xs opacity-60">총 결제 금액</div>
            <div className="text-2xl font-black text-[#C84B31]">
              {totalPrice.toLocaleString()}
              <span className="text-sm font-bold text-[#2D2D2D] ml-0.5">원</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-4 sm:px-5 py-3 rounded-xl border border-[#2D2D2D]/15 text-[#2D2D2D] text-xs sm:text-sm font-bold hover:bg-[#FCF9F4]"
            >
              닫기
            </button>
            <a
              href={STORE_INFO.smartstoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 sm:px-7 py-3 rounded-xl bg-[#03C75A] hover:bg-[#02b150] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              title="네이버 스마트스토어에서 구매"
            >
              <span className="font-black text-[13px] bg-white text-[#03C75A] w-5 h-5 rounded-xs flex items-center justify-center">N</span>
              <span>스마트스토어로 구매하기</span>
              <ExternalLink className="w-4 h-4 opacity-90 ml-0.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
