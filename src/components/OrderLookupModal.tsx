import React, { useState } from 'react';
import { OrderInfo } from '../types';
import { STORE_INFO } from '../data/mockData';
import { X, Search, Package, Phone, Truck, Store } from 'lucide-react';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderInfo[];
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (!query.trim()) return true;
    const cleanQ = query.trim().toLowerCase();
    return (
      o.orderId.toLowerCase().includes(cleanQ) ||
      o.phoneNumber.replace(/[^0-9]/g, '').includes(cleanQ.replace(/[^0-9]/g, '')) ||
      o.recipientName.toLowerCase().includes(cleanQ)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2D2D]/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FCF9F4] rounded-3xl shadow-2xl border border-[#2D2D2D]/10 overflow-hidden my-6 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#2D2D2D]/10 flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white bg-[#C84B31] px-2.5 py-0.5 rounded-xs inline-block mb-1">
              ORDER LOOKUP
            </span>
            <h2 className="text-xl font-black text-[#2D2D2D] tracking-tight">
              주문 내역 및 배송 조회
            </h2>
            <p className="text-xs opacity-60 mt-0.5">
              주문번호, 주문자명, 또는 휴대폰 번호로 주문 상태를 조회하실 수 있습니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#FCF9F4] text-[#2D2D2D] hover:bg-[#F2EFE9] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 opacity-40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="주문번호 (DK-...) 또는 휴대폰 번호 입력"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2D2D2D]/15 bg-white text-sm text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#C84B31]"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 opacity-60 space-y-3">
              <Package className="w-10 h-10 mx-auto stroke-1 opacity-40" />
              <p className="text-sm font-bold">조회된 주문 내역이 없습니다.</p>
              <p className="text-xs opacity-70">
                주문하신 연락처나 주문번호를 다시 한번 확인해 주세요.
              </p>
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.orderId}
                className="bg-white p-5 rounded-2xl border border-[#2D2D2D]/5 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#2D2D2D]/5 pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#C84B31] bg-[#C84B31]/10 px-2 py-0.5 rounded-xs mr-2">
                      {ord.orderId}
                    </span>
                    <span className="text-xs opacity-50">{ord.orderDate}</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    ord.status === '결제완료' ? 'bg-emerald-500/10 text-emerald-800' :
                    ord.status === '수령대기' ? 'bg-amber-500/10 text-amber-800' :
                    'bg-sky-500/10 text-sky-800'
                  }`}>
                    {ord.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#2D2D2D]">
                  <div className="flex items-center gap-2">
                    {ord.deliveryMethod === 'delivery' ? (
                      <span className="flex items-center gap-1 font-bold text-[#C84B31]">
                        <Truck className="w-3.5 h-3.5" /> 택배 배송
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-bold text-amber-700">
                        <Store className="w-3.5 h-3.5" /> 매장 픽업
                      </span>
                    )}
                    <span className="opacity-40">|</span>
                    <span>수령인: <strong>{ord.recipientName}</strong> ({ord.phoneNumber})</span>
                  </div>

                  <div className="opacity-70 truncate">
                    {ord.deliveryMethod === 'pickup' ? '수령처' : '주소'}: {ord.address} {ord.detailAddress}
                  </div>

                  {ord.requestedDate && (
                    <div className="text-[11px] font-semibold text-[#C84B31] bg-[#C84B31]/5 px-2 py-1 rounded-lg inline-block border border-[#C84B31]/15">
                      {ord.deliveryMethod === 'pickup' ? '📍 픽업 예약 일시' : '🚚 희망 출고일'}: {ord.requestedDate}
                    </div>
                  )}

                  {/* Payment & Notification Info */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px]">
                    <span className="bg-[#FCF9F4] px-2 py-0.5 rounded border border-[#2D2D2D]/10">
                      결제: {ord.paymentMethod === 'card' ? '신용/체크카드' : ord.paymentMethod === 'toss' ? '토스페이' : ord.paymentMethod === 'kakao' ? '카카오페이' : ord.paymentMethod === 'naver' ? '네이버페이' : ord.paymentMethod === 'nice' ? '나이스페이' : '무통장 입금'}
                    </span>
                    {ord.paymentId && (
                      <span className="font-mono opacity-60 text-[10px]">
                        승인: {ord.paymentId}
                      </span>
                    )}
                    {ord.notificationStatus?.kakaoSent && (
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold text-[10px] border border-emerald-200">
                        ✓ 사장님 알림톡 접수완료
                      </span>
                    )}
                  </div>

                  {/* Items */}
                  <div className="bg-[#FCF9F4] p-2.5 rounded-xl border border-[#2D2D2D]/5 space-y-1 mt-2">
                    {ord.items.map((it) => (
                      <div key={it.cartId} className="flex justify-between text-xs">
                        <span>
                          • {it.product.name} × {it.quantity}
                        </span>
                        <span className="font-bold text-[#2D2D2D]">{it.totalPrice.toLocaleString()}원</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs font-bold text-[#2D2D2D]">
                  <span>총 결제 금액</span>
                  <span className="text-base font-black text-[#C84B31]">
                    {ord.totalAmount.toLocaleString()}원
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Support Info */}
        <div className="p-4 bg-white border-t border-[#2D2D2D]/10 text-xs text-center opacity-75 flex items-center justify-center gap-2">
          <Phone className="w-3.5 h-3.5 text-[#C84B31]" />
          <span>주문 변경 및 취소 문의: <strong>{STORE_INFO.phone}</strong></span>
        </div>

      </div>
    </div>
  );
};
