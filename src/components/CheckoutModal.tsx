import React, { useState, useMemo } from 'react';
import { CartItem, DeliveryMethod, OrderInfo } from '../types';
import { STORE_INFO } from '../data/mockData';
import { X, Truck, Store, ShieldCheck, MapPin, Calendar, AlertCircle, CreditCard, BellRing, Sparkles, CheckCircle2 } from 'lucide-react';
import { executePgPayment, sendOwnerOrderNotification, DEFAULT_NOTIFICATION_CONFIG } from '../utils/paymentAndNotification';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderComplete: (order: OrderInfo) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderComplete,
}) => {
  if (!isOpen) return null;

  // Minimum date for pickup: 1 day after today (tomorrow onwards, same-day not allowed)
  const getMinPickupDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const minPickupDate = useMemo(() => getMinPickupDate(), []);

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [requestNote, setRequestNote] = useState('문 앞에 놓아주시고 문자 부탁드립니다.');
  const [requestedDate, setRequestedDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [pickupDate, setPickupDate] = useState(() => getMinPickupDate());
  const [pickupTime, setPickupTime] = useState('18:00');
  const [pickupNote, setPickupNote] = useState('');
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'naver' | 'kakao' | 'toss' | 'nice' | 'bank'>('card');
  const [pgProvider, setPgProvider] = useState<'tosspayments' | 'kakaopay' | 'inicis' | 'nice'>('tosspayments');
  
  // Notification preview toggle & state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingStep, setSubmittingStep] = useState<'idle' | 'pg' | 'notify'>('idle');
  const [formError, setFormError] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingFee = deliveryMethod === 'pickup' ? 0 : subtotal >= 40000 ? 0 : 3000;
  const totalAmount = subtotal + shippingFee;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    if (val.length > 7) {
      val = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7)}`;
    } else if (val.length > 3) {
      val = `${val.slice(0, 3)}-${val.slice(3)}`;
    }
    setPhoneNumber(val);
  };

  const handleQuickAddress = (sampleAddr: string) => {
    setAddress(sampleAddr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!recipientName.trim()) {
      setFormError('주문자 성함을 입력해주세요.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      setFormError('연락 가능한 휴대전화번호를 올바르게 입력해주세요.');
      return;
    }
    if (deliveryMethod === 'delivery' && !address.trim()) {
      setFormError('배송받으실 주소를 입력해주세요.');
      return;
    }
    if (deliveryMethod === 'pickup') {
      if (!pickupDate) {
        setFormError('매장 픽업 예약 날짜를 선택해주세요.');
        return;
      }
      if (pickupDate < minPickupDate) {
        setFormError(`매장 직접 픽업은 당일 수령이 불가하며, 최소 1일 이후(${minPickupDate}부터) 예약 가능합니다.`);
        return;
      }
    }

    setIsSubmitting(true);
    setSubmittingStep('pg');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const todayStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const newOrderId = `DK-${todayStr}-${randomSuffix}`;
    const orderTitle = cartItems.length > 1 
      ? `${cartItems[0].product.name} 외 ${cartItems.length - 1}건`
      : cartItems[0]?.product.name || '닭잡고오리발 밀키트';

    try {
      // 1. Trigger Domestic PG payment window
      const paymentResult = await executePgPayment({
        orderId: newOrderId,
        orderName: orderTitle,
        amount: totalAmount,
        buyerName: recipientName,
        buyerPhone: phoneNumber,
        buyerEmail: recipientEmail,
        buyerAddress: `${address} ${detailAddress}`,
        paymentMethod,
        pgProvider,
      });

      if (!paymentResult.success) {
        setFormError(paymentResult.errorMessage || '결제가 중단되었거나 실패하였습니다. 다시 시도해주세요.');
        setIsSubmitting(false);
        setSubmittingStep('idle');
        return;
      }

      setSubmittingStep('notify');

      // 2. Prepare Order Object
      const newOrder: OrderInfo = {
        orderId: newOrderId,
        orderDate: new Date().toLocaleString('ko-KR'),
        items: [...cartItems],
        deliveryMethod,
        recipientName,
        phoneNumber,
        recipientEmail,
        address: deliveryMethod === 'delivery' ? address : STORE_INFO.address,
        detailAddress: deliveryMethod === 'delivery' ? detailAddress : '순천 연향동 매장 1층 카운터 수령',
        requestNote: deliveryMethod === 'delivery' 
          ? requestNote 
          : pickupNote 
            ? `[매장 픽업] 시간: ${pickupTime} / ${pickupNote}` 
            : `[매장 픽업] 희망 시간: ${pickupTime}`,
        requestedDate: deliveryMethod === 'delivery' 
          ? (requestedDate || '익일 출고') 
          : `${pickupDate} ${pickupTime} (매장 픽업)`,
        paymentMethod,
        pgProvider: paymentMethod === 'bank' ? 'bank' : pgProvider,
        paymentId: paymentResult.paymentId,
        subtotal,
        shippingFee,
        totalAmount,
        status: paymentMethod === 'bank' ? '주문접수' : '결제완료',
        notificationStatus: {
          kakaoSent: true,
          emailSent: true,
          sentAt: new Date().toLocaleString('ko-KR'),
        },
      };

      // 3. Send Notification to Store Owner (KakaoTalk Alimtalk & Email)
      await sendOwnerOrderNotification(newOrder, {
        ...DEFAULT_NOTIFICATION_CONFIG,
      });

      setIsSubmitting(false);
      setSubmittingStep('idle');
      onOrderComplete(newOrder);
    } catch (err: any) {
      setFormError(err.message || '주문 처리 중 오류가 발생했습니다.');
      setIsSubmitting(false);
      setSubmittingStep('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2D2D]/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FCF9F4] rounded-3xl shadow-2xl border border-[#2D2D2D]/10 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#2D2D2D]/10 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-white bg-[#C84B31] px-2.5 py-0.5 rounded-xs">
                PG SECURE CHECKOUT
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <BellRing className="w-3 h-3 text-emerald-600" />
                사장님 실시간 알림 연동
              </span>
            </div>
            <h2 className="text-xl font-black text-[#2D2D2D] tracking-tight">
              {STORE_INFO.name} 온라인 안전 결제 & 주문서
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#FCF9F4] text-[#2D2D2D] hover:bg-[#F2EFE9] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {formError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Delivery Method Choice */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#2D2D2D] uppercase tracking-wider opacity-70">
              1. 수령 방법 선택
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  deliveryMethod === 'delivery'
                    ? 'bg-white border-[#C84B31] ring-2 ring-[#C84B31]/20 shadow-xs'
                    : 'bg-[#F2EFE9] border-[#2D2D2D]/10 text-[#2D2D2D] opacity-70 hover:opacity-100 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Truck className={`w-4 h-4 ${deliveryMethod === 'delivery' ? 'text-[#C84B31]' : 'opacity-60'}`} />
                  <span className={`text-sm font-bold ${deliveryMethod === 'delivery' ? 'text-[#2D2D2D]' : 'opacity-70'}`}>
                    신선 택배 배송
                  </span>
                </div>
                <p className="text-[11px] opacity-60">
                  전국 신선 아이스박스 냉장 배송 (4만원 이상 무료)
                </p>
              </button>

              <button
                type="button"
                id="delivery-method-pickup-btn"
                onClick={() => {
                  setDeliveryMethod('pickup');
                  if (!pickupDate || pickupDate < minPickupDate) {
                    setPickupDate(minPickupDate);
                  }
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  deliveryMethod === 'pickup'
                    ? 'bg-white border-[#C84B31] ring-2 ring-[#C84B31]/20 shadow-xs'
                    : 'bg-[#F2EFE9] border-[#2D2D2D]/10 text-[#2D2D2D] opacity-70 hover:opacity-100 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Store className={`w-4 h-4 ${deliveryMethod === 'pickup' ? 'text-[#C84B31]' : 'opacity-60'}`} />
                  <span className={`text-sm font-bold ${deliveryMethod === 'pickup' ? 'text-[#2D2D2D]' : 'opacity-70'}`}>
                    연향동 매장 직접 픽업
                  </span>
                </div>
                <p className="text-[11px] opacity-60">
                  순천 매장 직접 수령 (배송비 0원, 신속 포장)
                </p>
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#C84B31] bg-[#C84B31]/10 px-2 py-0.5 rounded-sm">
                  <span>※ 당일 불가 · 1일 이후부터 예약 가능</span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Orderer & Recipient Info */}
          <div className="bg-white p-5 rounded-2xl border border-[#2D2D2D]/5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider opacity-70">
              2. 주문자 / 수령인 정보
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2D2D2D] mb-1">
                  주문자 성함 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C84B31] text-sm text-[#2D2D2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2D2D] mb-1">
                  휴대전화번호 (알림톡 수신) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="010-1234-5678"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C84B31] text-sm text-[#2D2D2D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2D2D] mb-1">
                이메일 주소 (전자영수증 수신 선택)
              </label>
              <input
                type="email"
                placeholder="buyer@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C84B31] text-sm text-[#2D2D2D]"
              />
            </div>

            {deliveryMethod === 'delivery' ? (
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#2D2D2D]">
                      배송지 주소 *
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] opacity-60">예시 입력:</span>
                      <button
                        type="button"
                        onClick={() => handleQuickAddress('전남 순천시 연향동 1324-1')}
                        className="text-[10px] text-[#C84B31] underline font-bold"
                      >
                        순천 연향동
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAddress('서울시 서초구 반포대로 12')}
                        className="text-[10px] text-[#C84B31] underline font-bold"
                      >
                        서울 서초
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="기본 도로명 주소 또는 지번 주소"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C84B31] text-sm text-[#2D2D2D]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="상세 주소 (동, 호수, 건물명 등)"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C84B31] text-sm text-[#2D2D2D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-[#2D2D2D] mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C84B31]" />
                      희망 출고일
                    </label>
                    <input
                      type="date"
                      value={requestedDate}
                      onChange={(e) => setRequestedDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] text-xs text-[#2D2D2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2D2D2D] mb-1">
                      배송 요청사항
                    </label>
                    <input
                      type="text"
                      value={requestNote}
                      onChange={(e) => setRequestNote(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] text-xs text-[#2D2D2D]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Pickup details */
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F2EFE9] border border-[#2D2D2D]/10 space-y-3.5 text-xs text-[#2D2D2D]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold flex items-center gap-1.5 text-[#C84B31]">
                      <MapPin className="w-4 h-4 text-[#C84B31]" />
                      <span className="text-sm">수령 장소: {STORE_INFO.name} 순천 연향동 매장</span>
                    </div>
                    <p className="opacity-80 mt-0.5">{STORE_INFO.address} (매장 1층 카운터)</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#C84B31] text-white px-2 py-0.5 rounded-xs shrink-0">
                    배송비 0원
                  </span>
                </div>

                {/* Important Notice: Same-day not allowed, minimum 1 day later */}
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-950 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong className="font-bold text-amber-900 block mb-0.5">
                      매장 직접 픽업 예약 안내 (당일 픽업 불가)
                    </strong>
                    신선한 국내산 하림 냉장육 손질 및 비법 양념 숙성을 위해 <strong>당일 수령은 불가</strong>하며, <strong>주문일 기준 최소 1일 이후(내일 {minPickupDate}부터)</strong> 예약 픽업만 가능합니다.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold mb-1 text-[#2D2D2D] flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C84B31]" />
                        픽업 예약 날짜 *
                      </span>
                      <span className="text-[10px] font-semibold text-[#C84B31]">
                        1일 이후부터 선택 가능
                      </span>
                    </label>
                    <input
                      type="date"
                      id="pickup-date-input"
                      required
                      min={minPickupDate}
                      value={pickupDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPickupDate(val);
                        if (val && val < minPickupDate) {
                          setFormError(`매장 직접 픽업은 당일 수령이 불가합니다. 1일 이후인 ${minPickupDate}부터 예약해주세요.`);
                        } else {
                          setFormError('');
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-[#2D2D2D]/20 bg-white text-xs font-bold text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#C84B31]"
                    />
                    {pickupDate && pickupDate < minPickupDate && (
                      <p className="text-[10px] text-red-600 mt-1 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        당일은 예약할 수 없습니다. 1일 이후({minPickupDate})부터 선택해주세요.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold mb-1 text-[#2D2D2D]">
                      픽업 희망 시간대 *
                    </label>
                    <select
                      id="pickup-time-select"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#2D2D2D]/20 bg-white text-xs font-semibold text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#C84B31]"
                    >
                      <option value="11:30">오전 11:30</option>
                      <option value="12:00">점심 12:00</option>
                      <option value="12:30">점심 12:30</option>
                      <option value="13:00">점심 13:00</option>
                      <option value="14:00">오후 14:00</option>
                      <option value="17:00">오후 17:00</option>
                      <option value="17:30">저녁 17:30</option>
                      <option value="18:00">저녁 18:00</option>
                      <option value="18:30">저녁 18:30</option>
                      <option value="19:00">저녁 19:00</option>
                      <option value="19:30">저녁 19:30</option>
                      <option value="20:00">저녁 20:00</option>
                      <option value="20:30">저녁 20:30</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1 opacity-75">
                    매장 전달 요청사항 (선택)
                  </label>
                  <input
                    type="text"
                    id="pickup-note-input"
                    placeholder="예: 보냉백 꼼꼼 포장 부탁드립니다, 도착 10분 전 연락 바랍니다"
                    value={pickupNote}
                    onChange={(e) => setPickupNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#2D2D2D]/15 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#C84B31]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Payment Method & Domestic PG Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#2D2D2D] uppercase tracking-wider opacity-70">
                3. 결제 수단 & 국내 PG 결제창 선택
              </label>
              <span className="text-[10px] text-[#C84B31] font-bold bg-[#C84B31]/10 px-2 py-0.5 rounded-md">
                포트원 / 토스페이먼츠 연동
              </span>
            </div>

            {/* Payment method cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'card', name: '신용/체크카드', desc: '국내 모든 카드사', icon: '💳' },
                { id: 'toss', name: '토스페이', desc: '토스 원클릭 결제', icon: '🔵' },
                { id: 'kakao', name: '카카오페이', desc: '카카오 간편결제', icon: '🟡' },
                { id: 'naver', name: '네이버페이', desc: '네이버 포인트/카드', icon: '🟢' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(m.id as any);
                    if (m.id === 'toss') setPgProvider('tosspayments');
                    if (m.id === 'kakao') setPgProvider('kakaopay');
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all text-center ${
                    paymentMethod === m.id
                      ? 'bg-white border-[#C84B31] text-[#C84B31] ring-2 ring-[#C84B31]/20 shadow-xs'
                      : 'bg-white border-[#2D2D2D]/10 text-[#2D2D2D] opacity-75 hover:opacity-100 hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span className="leading-tight">{m.name}</span>
                  <span className="text-[10px] opacity-60 font-normal">{m.desc}</span>
                </button>
              ))}
            </div>

            {/* Secondary Option: Bank transfer or NicePay */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('nice');
                  setPgProvider('nice');
                }}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'nice'
                    ? 'bg-white border-[#C84B31] text-[#C84B31] font-bold shadow-xs'
                    : 'bg-[#F2EFE9] border-[#2D2D2D]/10 text-[#2D2D2D] opacity-75'
                }`}
              >
                <span>🏢</span>
                <span>나이스페이 / 간편계좌이체</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'bank'
                    ? 'bg-white border-[#C84B31] text-[#C84B31] font-bold shadow-xs'
                    : 'bg-[#F2EFE9] border-[#2D2D2D]/10 text-[#2D2D2D] opacity-75'
                }`}
              >
                <span>🏦</span>
                <span>무통장 입금 (계좌이체)</span>
              </button>
            </div>

            {/* PG Info banner */}
            <div className="p-3 bg-white rounded-xl border border-[#2D2D2D]/10 text-[11px] text-[#2D2D2D] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#C84B31]">
                <CreditCard className="w-3.5 h-3.5" />
                <span>전자결제대행(PG) 보안 결제창 안내</span>
              </div>
              <p className="opacity-70 leading-relaxed">
                결제하기 버튼을 누르시면 안전한 국내 PG사({paymentMethod === 'kakao' ? '카카오페이' : paymentMethod === 'naver' ? '네이버페이' : paymentMethod === 'nice' ? '나이스페이' : '토스페이먼츠'}) 표준 결제창이 호출되어 실시간 카드 결제가 진행됩니다.
              </p>
            </div>
          </div>

          {/* 4. Owner Notification Dispatch Live Status Indicator */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-emerald-800" />
                <span className="text-xs font-bold text-emerald-900">
                  주문 접수 시 사장님 실시간 자동 알림 시스템
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                활성화됨
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-emerald-950">
              <div className="flex items-center gap-1.5 bg-white/70 p-2 rounded-lg border border-emerald-200/50">
                <span className="text-base">💬</span>
                <div>
                  <div className="font-bold">카카오톡 알림톡 전송</div>
                  <div className="text-[10px] opacity-70">대표전화: {DEFAULT_NOTIFICATION_CONFIG.ownerPhone}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white/70 p-2 rounded-lg border border-emerald-200/50">
                <span className="text-base">✉️</span>
                <div>
                  <div className="font-bold">관리자 이메일 발송</div>
                  <div className="text-[10px] opacity-70">{DEFAULT_NOTIFICATION_CONFIG.ownerEmail}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Order Items Summary */}
          <div className="bg-[#F2EFE9] p-4 rounded-2xl border border-[#2D2D2D]/10 space-y-2 text-xs">
            <div className="font-bold text-[#2D2D2D] mb-1">주문 품목 ({cartItems.length}종)</div>
            {cartItems.map((item) => (
              <div key={item.cartId} className="flex justify-between text-[#2D2D2D] opacity-80">
                <span>
                  {item.product.name} ({item.quantity}개)
                </span>
                <span className="font-bold text-[#2D2D2D]">{item.totalPrice.toLocaleString()}원</span>
              </div>
            ))}
            <div className="border-t border-[#2D2D2D]/10 pt-2 flex justify-between font-bold text-sm text-[#2D2D2D]">
              <span>최종 결제 금액 (배송비 포함)</span>
              <span className="text-[#C84B31] text-base font-black">{totalAmount.toLocaleString()}원</span>
            </div>
          </div>

          {/* Security & Policy Assurance */}
          <div className="flex items-center gap-2 text-[11px] opacity-60">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>신선도 보장제: 상품에 이상이 있을 경우 100% 교환/환불을 보장합니다.</span>
          </div>

          {/* Submit Button */}
          <button
            id="checkout-submit-order-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-[#2D2D2D] hover:bg-[#C84B31] text-white font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-[#FCF9F4]" />
                {submittingStep === 'pg' ? '국내 PG 전자결제창 호출 및 승인 중...' : '사장님 알림톡 & 이메일 발송 중...'}
              </span>
            ) : (
              <span>{totalAmount.toLocaleString()}원 PG 결제하기 및 주문 접수</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

