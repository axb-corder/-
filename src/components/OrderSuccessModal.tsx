import React, { useState } from 'react';
import { OrderInfo } from '../types';
import { STORE_INFO } from '../data/mockData';
import { CheckCircle2, Copy, Check, Phone, Truck, Calendar, Store } from 'lucide-react';

interface OrderSuccessModalProps {
  order: OrderInfo | null;
  onClose: () => void;
  onViewAllOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewAllOrders,
}) => {
  if (!order) return null;

  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2D2D]/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FCF9F4] rounded-3xl shadow-2xl border border-[#2D2D2D]/10 overflow-hidden my-6 p-6 sm:p-8 space-y-6">
        
        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-emerald-700/10 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest bg-[#C84B31] px-3 py-0.5 rounded-xs inline-block">
            ORDER CONFIRMED
          </span>
          <h2 className="text-2xl font-black text-[#2D2D2D] tracking-tight">
            감사합니다! 정성껏 준비하겠습니다.
          </h2>
          <p className="text-xs opacity-70">
            {order.recipientName} 고객님의 주문이 정상 접수되었습니다.
          </p>
        </div>

        {/* Order ID Box */}
        <div className="bg-white p-4 rounded-2xl border border-[#2D2D2D]/5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold opacity-50">주문 번호</div>
            <div className="text-base font-black text-[#2D2D2D] font-mono tracking-wider">
              {order.orderId}
            </div>
          </div>
          <button
            onClick={handleCopyOrderId}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FCF9F4] border border-[#2D2D2D]/15 text-xs font-bold text-[#2D2D2D] hover:bg-[#F2EFE9] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '복사됨' : '번호 복사'}</span>
          </button>
        </div>

        {/* Order Details List */}
        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-2 border-b border-[#2D2D2D]/5">
            <span className="opacity-60">수령 방식</span>
            <span className="font-bold text-[#2D2D2D] flex items-center gap-1">
              {order.deliveryMethod === 'delivery' ? (
                <>
                  <Truck className="w-3.5 h-3.5 text-[#C84B31]" />
                  전국 신선 택배 배송
                </>
              ) : (
                <>
                  <Store className="w-3.5 h-3.5 text-[#C84B31]" />
                  순천 연향동 매장 직접 픽업
                </>
              )}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#2D2D2D]/5">
            <span className="opacity-60">
              {order.deliveryMethod === 'pickup' ? '픽업 예약 일시' : '희망 일자'}
            </span>
            <span className="font-bold text-[#2D2D2D] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C84B31]" />
              {order.requestedDate || (order.deliveryMethod === 'pickup' ? '예약 날짜 미정' : '익일 출고')}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#2D2D2D]/5">
            <span className="opacity-60">수령인 및 연락처</span>
            <span className="font-bold text-[#2D2D2D]">
              {order.recipientName} ({order.phoneNumber})
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#2D2D2D]/5">
            <span className="opacity-60">결제 수단</span>
            <span className="font-bold text-[#2D2D2D]">
              {order.paymentMethod === 'card'
                ? '신용/체크카드 (PG 전자결제)'
                : order.paymentMethod === 'toss'
                ? '토스페이'
                : order.paymentMethod === 'kakao'
                ? '카카오페이'
                : order.paymentMethod === 'naver'
                ? '네이버페이'
                : order.paymentMethod === 'nice'
                ? '나이스페이'
                : '무통장 입금'}
            </span>
          </div>

          {order.paymentId && (
            <div className="flex justify-between py-2 border-b border-[#2D2D2D]/5">
              <span className="opacity-60">PG 승인번호</span>
              <span className="font-mono font-bold text-xs text-[#2D2D2D] opacity-80">
                {order.paymentId}
              </span>
            </div>
          )}

          <div className="flex justify-between py-2 border-b border-[#2D2D2D]/5">
            <span className="opacity-60">
              {order.deliveryMethod === 'delivery' ? '배송지' : '픽업 매장'}
            </span>
            <span className="font-bold text-[#2D2D2D] text-right max-w-xs truncate">
              {order.address} {order.detailAddress}
            </span>
          </div>

          {/* Items */}
          <div className="py-2 border-b border-[#2D2D2D]/5 space-y-1">
            <span className="opacity-60 block mb-1">주문 메뉴</span>
            {order.items.map((it) => (
              <div key={it.cartId} className="flex justify-between text-[#2D2D2D] opacity-80">
                <span>
                  • {it.product.name} × {it.quantity}
                </span>
                <span className="font-bold">{it.totalPrice.toLocaleString()}원</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-2 text-sm font-bold">
            <span className="text-[#2D2D2D]">결제 총액</span>
            <span className="text-xl font-black text-[#C84B31]">
              {order.totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Store pickup specific guidance */}
        {order.deliveryMethod === 'pickup' && (
          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-[#C84B31]">
              <Store className="w-4 h-4" />
              <span>매장 픽업 수령 안내</span>
            </div>
            <p className="text-[11px] opacity-85 leading-relaxed">
              선택하신 예약 일시(<strong>{order.requestedDate}</strong>)에 맞춰 매장(순천시 연향동 1324-1) 1층 카운터에 신선하게 준비해 두겠습니다. 방문 시 주문자 성함(<strong>{order.recipientName}</strong>)을 말씀해주세요.
            </p>
          </div>
        )}

        {/* Store inquiry call button */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between text-amber-900">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#C84B31]" />
            <span>배송 및 픽업 문의: <strong>{STORE_INFO.phone}</strong></span>
          </div>
          <a
            href={`tel:${STORE_INFO.phone}`}
            className="px-2.5 py-1 rounded-md bg-[#2D2D2D] text-white font-bold text-[11px] hover:bg-[#C84B31]"
          >
            전화 연결
          </a>
        </div>

        {/* Real-time Owner Notification Confirmation Badge */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>사장님 카카오톡 알림톡 & 이메일 즉시 전송 완료</span>
          </div>
          <p className="text-[11px] opacity-75">
            주문 내역이 매장 사장님({STORE_INFO.phone} / dak_jap_o@naver.com)에게 실시간으로 안전하게 전송되어 빠른 조리 및 출고 준비가 시작되었습니다.
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onViewAllOrders}
            className="py-3 px-4 rounded-xl border border-[#2D2D2D]/15 text-[#2D2D2D] font-bold text-xs sm:text-sm hover:bg-[#F2EFE9]"
          >
            내 주문 조회
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-[#2D2D2D] hover:bg-[#C84B31] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
          >
            확인 및 홈으로
          </button>
        </div>

      </div>
    </div>
  );
};
