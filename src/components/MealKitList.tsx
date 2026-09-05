import React, { useState, useRef } from 'react';
import { MealKitProduct } from '../types';
import { MEAL_KIT_PRODUCTS, STORE_INFO } from '../data/mockData';
import { Clock, Users, Flame, ShoppingBag, Eye, Check, Sparkles, Camera, RotateCcw, ExternalLink } from 'lucide-react';

interface MealKitListProps {
  onAddToCart: (product: MealKitProduct) => void;
  onOpenDetail: (product: MealKitProduct) => void;
}

export const MealKitList: React.FC<MealKitListProps> = ({ onAddToCart, onOpenDetail }) => {
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Custom user uploaded images stored in localStorage
  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    const images: Record<string, string> = {};
    MEAL_KIT_PRODUCTS.forEach((p) => {
      const saved = localStorage.getItem(`dakjobgo_custom_${p.id}`);
      if (saved) images[p.id] = saved;
    });
    return images;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeProductUploadRef = useRef<string | null>(null);

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const productId = activeProductUploadRef.current;
    if (file && productId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomImages((prev) => ({ ...prev, [productId]: result }));
          localStorage.setItem(`dakjobgo_custom_${productId}`, result);
          window.dispatchEvent(new CustomEvent('dakjobgo-product-image-updated', { detail: { productId, imageUrl: result } }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetProductImage = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem(`dakjobgo_custom_${productId}`);
    setCustomImages((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
    window.dispatchEvent(new CustomEvent('dakjobgo-product-image-updated', { detail: { productId, imageUrl: null } }));
  };

  const handleQuickAdd = (product: MealKitProduct) => {
    onAddToCart(product);
    setAddedNotice(product.id);
    setTimeout(() => {
      setAddedNotice(null);
    }, 1800);
  };

  return (
    <section id="mealkit-menu" className="py-20 bg-[#FCF9F4] border-b border-[#2D2D2D]/10">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProductImageChange}
        accept="image/*"
        className="hidden"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-[#C84B31] text-white text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIGNATURE MEAL KITS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2D2D2D] tracking-tight">
            {STORE_INFO.name} 대표 밀키트 3종
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#2D2D2D] opacity-80 leading-relaxed">
            신선한 100% 국내산 냉장육과 비법 소스로 완성된 시그니처 요리. <br className="hidden sm:inline" />
            매장에서 드시던 감동 그대로, 물만 붓고 끓이면 완벽한 한 상이 차려집니다.
          </p>
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 bg-[#03C75A]/10 border border-[#03C75A]/25 px-4 py-2 rounded-full text-xs font-bold text-[#028b3e]">
            <span className="bg-[#03C75A] text-white w-4 h-4 rounded-xs flex items-center justify-center text-[10px] font-black">N</span>
            <span>네이버 페이 구매를 원하시면 공식 스마트스토어에서도 간편하게 주문 가능합니다!</span>
            <a
              href={STORE_INFO.smartstoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-black text-[#03C75A] hover:text-[#028b3e] flex items-center gap-0.5 ml-1"
            >
              스마트스토어 바로가기
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 3 Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MEAL_KIT_PRODUCTS.map((product) => {
            const isAdded = addedNotice === product.id;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-[#2D2D2D]/5 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden group"
              >
                {/* Product Image Container (Clean & Unobstructed) */}
                <div
                  onClick={() => onOpenDetail(product)}
                  className="relative h-64 sm:h-72 overflow-hidden bg-[#F2EFE9] cursor-pointer"
                >
                  {(() => {
                    const customImg = customImages[product.id];
                    const fallbackImg = product.id === 'spicy-dakbokkeum'
                      ? 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=80'
                      : product.imageUrl;
                    const imgSrc = customImg || (product.id === 'spicy-dakbokkeum' ? '/dakbokkeum-mealkit.png' : product.imageUrl);

                    return (
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

                  {/* Discreet Top Right Photo Action Controls */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    {customImages[product.id] && (
                      <button
                        onClick={(e) => handleResetProductImage(product.id, e)}
                        className="w-7 h-7 rounded-lg bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs shadow-xs transition-transform hover:scale-105 cursor-pointer"
                        title="기본 이미지로 되돌리기"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        activeProductUploadRef.current = product.id;
                        fileInputRef.current?.click();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-[#C84B31] text-white flex items-center gap-1 backdrop-blur-xs text-[10px] font-bold shadow-xs transition-colors cursor-pointer"
                      title={`${product.name} 실제 사진 파일로 변경`}
                    >
                      <Camera className="w-3 h-3 text-[#FFA94D]" />
                      <span>사진 변경</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetail(product);
                      }}
                      className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-[#2D2D2D] hover:text-[#C84B31] flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer"
                      title="상세 조리법 및 정보 보기"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Clean Spec Strip below photo */}
                <div className="px-5 py-2.5 bg-[#FAF8F5] border-b border-[#2D2D2D]/5 flex items-center justify-between text-xs text-[#2D2D2D]">
                  <span className="flex items-center gap-1.5 font-bold text-[#C84B31]">
                    <Clock className="w-3.5 h-3.5 text-[#C84B31]" />
                    {product.cookingTime}
                  </span>
                  <span className="flex items-center gap-1 font-semibold opacity-80">
                    <Users className="w-3.5 h-3.5 text-[#FFA94D]" />
                    {product.servings}
                  </span>
                  <span className="text-[11px] opacity-60 font-medium truncate max-w-[130px]">
                    {product.weight}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Title & Subtitle */}
                    <div>
                      <h3
                        onClick={() => onOpenDetail(product)}
                        className="text-xl font-black text-[#2D2D2D] tracking-tight group-hover:text-[#C84B31] transition-colors cursor-pointer"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs opacity-60 mt-1 line-clamp-1">
                        {product.subtitle}
                      </p>
                    </div>

                    {/* Hashtags moved cleanly inside the card content */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {product.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold text-[#8B321D] bg-[#C84B31]/8 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                      {customImages[product.id] && (
                        <span className="text-[10px] font-bold text-white bg-[#C84B31] px-2 py-0.5 rounded-md">
                          실제 사진 적용됨
                        </span>
                      )}
                    </div>

                    {/* Brief description */}
                    <p className="text-xs sm:text-sm opacity-75 mt-3 line-clamp-2 leading-relaxed text-[#2D2D2D]">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action Area */}
                  <div className="pt-4 border-t border-[#2D2D2D]/5">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        {product.originalPrice && (
                          <span className="text-xs opacity-40 line-through mr-2">
                            {product.originalPrice.toLocaleString()}원
                          </span>
                        )}
                        <span className="text-2xl font-black text-[#2D2D2D]">
                          {product.price.toLocaleString()}
                        </span>
                        <span className="text-sm font-bold text-[#2D2D2D] ml-0.5">원</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#C84B31] bg-[#C84B31]/10 px-2 py-0.5 rounded-xs uppercase tracking-wider">
                        4만원 이상 무료배송
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenDetail(product)}
                        className="py-2.5 px-3 rounded-xl border border-[#2D2D2D]/15 hover:bg-[#F2EFE9] text-[#2D2D2D] text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>상세 설명</span>
                      </button>

                      <button
                        onClick={() => handleQuickAdd(product)}
                        className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#2D2D2D] hover:bg-[#C84B31] text-white active:scale-95'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>담김!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>장바구니 담기</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Meal Kit Quality Guarantee Footnote */}
        <div className="mt-12 bg-white rounded-2xl p-5 border border-[#2D2D2D]/10 text-center max-w-2xl mx-auto shadow-2xs space-y-2">
          <p className="text-xs sm:text-sm text-[#2D2D2D] opacity-80">
            💡 <strong className="text-[#2D2D2D] opacity-100 font-bold">안심 배송 안내:</strong> 전국 안심 콜드체인 신선 아이스박스에 담아 주문 익일 안전 출고됩니다. (순천 지역은 매장 직접 수령도 가능합니다.)
          </p>
          <p className="text-xs text-[#2D2D2D] opacity-75">
            🛒 네이버 페이 포인트 적립 및 간편 결제는{' '}
            <a
              href={STORE_INFO.smartstoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#03C75A] font-bold underline hover:text-[#028b3e] inline-flex items-center gap-0.5"
            >
              네이버 스마트스토어 공식몰
              <ExternalLink className="w-3 h-3" />
            </a>
            에서도 바로 이용하실 수 있습니다.
          </p>
        </div>

      </div>
    </section>
  );
};
