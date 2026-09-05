import React, { useState } from 'react';
import { ReservationInquiry } from '../types';
import { STORE_INFO } from '../data/mockData';
import { X, CheckCircle2, AlertCircle, Utensils, Package, Phone, MessageCircle, ExternalLink, Instagram } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitInquiry: (inquiry: ReservationInquiry) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  onSubmitInquiry,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<'store_table' | 'group_order' | 'catering'>('store_table');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('18:30');
  const [guestsCount, setGuestsCount] = useState(4);
  const [menuInterest, setMenuInterest] = useState('단짠단짠 간장찜닭 & 매콤달달 닭볶음탕');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    if (val.length > 7) {
      val = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7)}`;
    } else if (val.length > 3) {
      val = `${val.slice(0, 3)}-${val.slice(3)}`;
    }
    setPhone(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('예약자 성함을 입력해주세요.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('연락처(휴대폰 번호)를 정확히 입력해주세요.');
      return;
    }

    const newInquiry: ReservationInquiry = {
      id: `RSV-${Date.now().toString().slice(-6)}`,
      type,
      name,
      phone,
      date,
      time,
      guestsCount,
      menuInterest,
      specialRequests,
      createdAt: new Date().toLocaleString('ko-KR'),
    };

    onSubmitInquiry(newInquiry);
    setIsDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2D2D]/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FCF9F4] rounded-3xl shadow-2xl border border-[#2D2D2D]/10 overflow-hidden my-6 p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-xl bg-[#FCF9F4] text-[#2D2D2D] hover:bg-[#F2EFE9] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isDone ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-700/10 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-[#2D2D2D] tracking-tight">
              예약 및 문의가 접수되었습니다
            </h3>
            <p className="text-sm opacity-80 leading-relaxed max-w-sm mx-auto text-[#2D2D2D]">
              <strong>{name}</strong> 고객님({phone}), 입력해주신 내용 확인 후 매장 담당자가 신속히 확인 전화를 드리겠습니다.
            </p>
            <div className="p-3 bg-white rounded-xl border border-[#2D2D2D]/5 text-xs opacity-75">
              직통 전화 문의: <strong>{STORE_INFO.phone}</strong>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-4">
              <a
                href={STORE_INFO.kakaoChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-[#191919]" />
                <span>카카오톡으로 문의하기</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <button
                onClick={() => {
                  setIsDone(false);
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#2D2D2D] hover:bg-[#C84B31] text-white font-bold text-xs shadow-xs transition-colors"
              >
                확인 완료
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white bg-[#C84B31] px-2.5 py-0.5 rounded-xs inline-block mb-1">
                RESERVATION & INQUIRY
              </span>
              <h2 className="text-2xl font-black text-[#2D2D2D] tracking-tight">
                {STORE_INFO.name} 예약 & 단체 문의
              </h2>
              <p className="text-xs opacity-60 mt-0.5">
                매장 단체석(최대 100인 완비 / 프라이빗 룸) 예약 및 단체 주문 문의를 신속하게 처리해 드립니다.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Type selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'store_table', label: '매장 식사 예약', icon: <Utensils className="w-3.5 h-3.5" /> },
                { id: 'group_order', label: '밀키트 단체 주문', icon: <Package className="w-3.5 h-3.5" /> },
                { id: 'catering', label: '행사/포장 문의', icon: <Phone className="w-3.5 h-3.5" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id as any)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                    type === item.id
                      ? 'bg-white border-[#C84B31] text-[#C84B31] shadow-xs ring-2 ring-[#C84B31]/15'
                      : 'bg-white border-[#2D2D2D]/10 text-[#2D2D2D] opacity-70 hover:opacity-100 hover:bg-[#FAF8F5]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Form Fields */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#2D2D2D]/5 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2D2D2D] mb-1">
                    예약자/담당자 성함 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="성함 입력"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#C84B31]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D2D2D] mb-1">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={handlePhone}
                    className="w-full px-3 py-2 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#C84B31]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2D2D2D] mb-1">
                    희망 일자
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] text-xs text-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D2D2D] mb-1">
                    희망 시간
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] text-xs text-[#2D2D2D]"
                  >
                    <option value="16:00">16:00 (오픈)</option>
                    <option value="16:30">16:30</option>
                    <option value="17:00">17:00</option>
                    <option value="17:30">17:30</option>
                    <option value="18:00">18:00 (저녁)</option>
                    <option value="18:30">18:30 (저녁 피크)</option>
                    <option value="19:00">19:00 (저녁 피크)</option>
                    <option value="19:30">19:30</option>
                    <option value="20:00">20:00 (2차/회식)</option>
                    <option value="20:30">20:30</option>
                    <option value="21:00">21:00</option>
                    <option value="21:30">21:30</option>
                    <option value="22:00">22:00 (심야)</option>
                    <option value="22:30">22:30 (심야)</option>
                    <option value="23:00">23:00 (심야)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D2D2D] mb-1">
                    인원 / 수량 (최대 100인)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] text-xs text-[#2D2D2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2D2D] mb-1">
                  선호 메뉴 / 관심 품목
                </label>
                <input
                  type="text"
                  value={menuInterest}
                  onChange={(e) => setMenuInterest(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] text-xs text-[#2D2D2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2D2D] mb-1">
                  추가 요청 사항 (선택)
                </label>
                <textarea
                  rows={2}
                  placeholder="예: 룸으로 부탁드립니다 / 핫도그 20개 단체 포장 문의입니다"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#2D2D2D]/15 bg-[#FCF9F4] text-xs text-[#2D2D2D]"
                />
              </div>
            </div>

            {/* Direct call note */}
            <div className="flex items-center justify-between text-xs opacity-70 px-1">
              <span>빠른 유선 문의:</span>
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="font-bold text-[#C84B31] hover:underline"
              >
                {STORE_INFO.phone} 바로걸기
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#2D2D2D] hover:bg-[#C84B31] text-white font-bold text-sm shadow-xs transition-colors active:scale-98"
            >
              예약 및 단체 문의 접수하기
            </button>

            <div className="pt-1">
              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2D2D2D]/10"></div>
                </div>
                <span className="relative px-3 bg-[#FCF9F4] text-[11px] font-bold text-[#2D2D2D] opacity-60">
                  또는 실시간 1:1 상담
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={STORE_INFO.kakaoChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-3.5 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
                  title="카카오톡 채널 1:1 상담 열기"
                >
                  <MessageCircle className="w-4 h-4 fill-[#191919]" />
                  <span>카카오톡 문의</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                </a>

                <a
                  href={STORE_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-3.5 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
                  title="인스타그램 공식 계정 열기"
                >
                  <Instagram className="w-4 h-4" />
                  <span>인스타그램 DM</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80 ml-0.5" />
                </a>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
