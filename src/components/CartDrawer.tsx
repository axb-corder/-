import React from 'react';
import { CartItem } from '../types';
import { STORE_INFO } from '../data/mockData';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, ExternalLink } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const FREE_SHIPPING_THRESHOLD = 40000;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingFee = cartItems.length === 0 ? 0 : isFreeShipping ? 0 : 3000;
  const finalTotal = subtotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#2D2D2D]/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FCF9F4] shadow-2xl border-l border-[#2D2D2D]/10 flex flex-col">
          
          {/* Header */}
          <div className="p-6 bg-white border-b border-[#2D2D2D]/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C84B31]/10 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#C84B31]" />
              </div>
              <h2 className="text-lg font-black text-[#2D2D2D] tracking-tight">
                주문 장바구니
              </h2>
              <span className="bg-[#C84B31] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-[#FCF9F4] text-[#2D2D2D] hover:bg-[#F2EFE9] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cartItems.length > 0 && (
            <div className="bg-[#F2EFE9] px-6 py-3 border-b border-[#2D2D2D]/10 text-xs">
              <div className="flex items-center justify-between text-[#2D2D2D] font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#C84B31]" />
                  {isFreeShipping ? (
                    <strong className="text-emerald-700 font-bold">무료배송 혜택 적용 완료!</strong>
                  ) : (
                    <span>
                      <strong className="text-[#C84B31] font-bold">{amountToFreeShipping.toLocaleString()}원</strong> 더 담으면 무료배송
                    </span>
                  )}
                </span>
                <span className="text-[11px] opacity-70">{subtotal.toLocaleString()} / 40,000원</span>
              </div>
              <div className="w-full bg-[#2D2D2D]/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#C84B31] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#2D2D2D] opacity-60 space-y-3 py-16">
                <ShoppingBag className="w-12 h-12 stroke-1 opacity-40" />
                <p className="text-sm font-bold">장바구니가 비어 있습니다.</p>
                <p className="text-xs opacity-70 max-w-xs">
                  {STORE_INFO.name}의 신선한 100% 국내산 밀키트를 담아보세요!
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="bg-white p-4 rounded-2xl border border-[#2D2D2D]/5 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <img
                      src={localStorage.getItem(`dakjobgo_custom_${item.product.id}`) || item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#F2EFE9]"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== item.product.imageUrl) {
                          target.src = item.product.imageUrl;
                        }
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-[#2D2D2D] truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedOptions.length > 0 && (
                        <div className="text-[11px] opacity-70 mt-0.5">
                          추가: {item.selectedOptions.map((o) => o.name).join(', ')}
                        </div>
                      )}
                      <div className="text-xs font-black text-[#2D2D2D] mt-1">
                        {item.totalPrice.toLocaleString()}원
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.cartId)}
                      className="text-[#2D2D2D] opacity-40 hover:opacity-100 hover:text-[#C84B31] p-1 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#2D2D2D]/5">
                    <span className="text-xs opacity-60">수량 변경</span>
                    <div className="flex items-center gap-2 bg-[#FCF9F4] px-2 py-1 rounded-lg border border-[#2D2D2D]/10">
                      <button
                        onClick={() => onUpdateQuantity(item.cartId, -1)}
                        className="w-5 h-5 flex items-center justify-center opacity-70 hover:opacity-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#2D2D2D] w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartId, 1)}
                        className="w-5 h-5 flex items-center justify-center opacity-70 hover:opacity-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Trigger */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-[#2D2D2D]/10 space-y-4">
              <div className="space-y-1.5 text-xs text-[#2D2D2D]">
                <div className="flex justify-between opacity-80">
                  <span>상품 주문 금액</span>
                  <span className="font-bold">{subtotal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between opacity-80">
                  <span>배송비 (4만원 이상 무료)</span>
                  <span className="font-bold">
                    {shippingFee === 0 ? '무료 (0원)' : `+${shippingFee.toLocaleString()}원`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2D2D2D] pt-2 border-t border-[#2D2D2D]/10">
                  <span>최종 결제 예정 금액</span>
                  <span className="text-xl font-black text-[#C84B31]">
                    {finalTotal.toLocaleString()}원
                  </span>
                </div>
              </div>

              <button
                id="cart-checkout-proceed-btn"
                onClick={onProceedCheckout}
                className="w-full py-3.5 rounded-xl bg-[#2D2D2D] hover:bg-[#C84B31] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>PG 즉시 결제 및 주문서 작성</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <a
                  href={STORE_INFO.smartstoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#03C75A] hover:underline font-bold"
                >
                  <span className="font-extrabold text-[10px] bg-[#03C75A] text-white w-3.5 h-3.5 rounded-xs flex items-center justify-center">N</span>
                  <span>네이버 스마트스토어에서 결제하기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
