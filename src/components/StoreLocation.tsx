import React, { useState, useRef } from 'react';
import { STORE_INFO } from '../data/mockData';
import { MapPin, Phone, Clock, Users, Car, Check, Copy, ExternalLink, CalendarPlus, Utensils, Camera, Upload, RotateCcw, Instagram } from 'lucide-react';

interface StoreLocationProps {
  onOpenReservation: () => void;
}

export const StoreLocation: React.FC<StoreLocationProps> = ({ onOpenReservation }) => {
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom user image from localStorage if available, or try /store-interior.png
  const [customImage, setCustomImage] = useState<string | null>(() => {
    return localStorage.getItem('dakjobgo_custom_store_interior');
  });
  const [imageError, setImageError] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomImage(result);
          localStorage.setItem('dakjobgo_custom_store_interior', result);
          setImageError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('dakjobgo_custom_store_interior');
    setCustomImage(null);
    setImageError(false);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(STORE_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(STORE_INFO.address)}`;
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(STORE_INFO.address)}`;
  const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${STORE_INFO.address} ${STORE_INFO.name}`
  )}`;

  // Determine current image source: custom uploaded > /store-interior.png > default high-res retro interior
  const currentImageSrc = customImage
    ? customImage
    : imageError
    ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'
    : '/store-interior.png';

  return (
    <section id="offline-store" className="py-20 bg-[#FCF9F4] border-b border-[#2D2D2D]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-[#C84B31] text-white text-xs font-bold uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>OFFLINE STORE GUIDE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2D2D2D] tracking-tight">
            오프라인 직영 매장 안내
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#2D2D2D] opacity-80 leading-relaxed">
            전남 순천시 연향동에 위치한 <strong>‘{STORE_INFO.name}’</strong> 오프라인 매장입니다. <br className="hidden sm:inline" />
            현장에서 끓여드시는 갓 조리된 닭요리의 감동을 직접 경험해 보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Store Details & Info Cards */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            
            {/* Primary Address Card */}
            <div className="bg-white p-7 rounded-3xl border border-[#2D2D2D]/5 shadow-xs space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#C84B31]/10 text-[#C84B31] flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#C84B31] uppercase tracking-widest block">
                      STORE LOCATION
                    </span>
                    <h3 className="text-xl font-black text-[#2D2D2D] tracking-tight mt-0.5">
                      {STORE_INFO.name}
                    </h3>
                    <p className="text-sm font-bold text-[#2D2D2D] mt-1">
                      {STORE_INFO.address}
                    </p>
                    <p className="text-xs opacity-60 mt-0.5">
                      {STORE_INFO.addressDetail}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopyAddress}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FCF9F4] border border-[#2D2D2D]/15 text-xs font-bold text-[#2D2D2D] hover:bg-[#F2EFE9] transition-colors shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '복사됨' : '주소 복사'}</span>
                </button>
              </div>

              {/* Map Link Buttons (Google Maps, Naver, Kakao) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#2D2D2D]/5">
                <a
                  href={googleMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#4285F4]/10 hover:bg-[#4285F4]/15 text-[#1A73E8] border border-[#4285F4]/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>구글 맵 (Google Maps)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={naverMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#03C75A]/10 hover:bg-[#03C75A]/15 text-[#03C75A] border border-[#03C75A]/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>네이버 지도</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={kakaoMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#FEE500]/30 hover:bg-[#FEE500]/40 text-[#3C1E1E] border border-[#FEE500]/50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>카카오맵 길찾기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Operating Details Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Hours */}
              <div className="bg-white p-5 rounded-2xl border border-[#2D2D2D]/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C84B31]">
                  <Clock className="w-4 h-4" />
                  <span>영업 시간</span>
                </div>
                <div className="text-sm font-bold text-[#2D2D2D]">
                  {STORE_INFO.businessHours}
                </div>
                <div className="text-xs opacity-60">
                  {STORE_INFO.breakTime}
                </div>
              </div>

              {/* Phone & Inquiries */}
              <div className="bg-white p-5 rounded-2xl border border-[#2D2D2D]/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C84B31]">
                  <Phone className="w-4 h-4" />
                  <span>예약 및 단체 문의</span>
                </div>
                <a
                  href={`tel:${STORE_INFO.phone}`}
                  className="text-lg font-black text-[#2D2D2D] hover:text-[#C84B31] transition-colors block"
                >
                  {STORE_INFO.phone}
                </a>
                <div className="text-xs opacity-60">
                  {STORE_INFO.bannerPhrase}
                </div>
              </div>

            </div>

            {/* Hall and Capacity Details */}
            <div className="bg-white p-6 rounded-2xl border border-[#2D2D2D]/5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2D2D2D]">
                <Users className="w-4 h-4 text-[#C84B31]" />
                <span>시설 및 편의 제공</span>
              </div>
              <p className="text-xs sm:text-sm font-bold opacity-90 leading-relaxed text-[#2D2D2D]">
                {STORE_INFO.offlineCapacity}
              </p>
              <div className="flex items-center gap-2 text-xs opacity-60 pt-1">
                <Car className="w-3.5 h-3.5 text-[#C84B31]" />
                <span>인근 공영주차장 편리하게 이용 가능 (도보 1~2분 거리)</span>
              </div>
            </div>

            {/* Reservation Call-To-Action Banner */}
            <div className="bg-[#2D2D2D] text-white p-6 rounded-2xl shadow-sm flex items-center justify-between gap-4 border border-[#2D2D2D]/10">
              <div>
                <h4 className="text-base font-bold tracking-tight">
                  단체 회식 & 모임 사전 예약
                </h4>
                <p className="text-xs text-[#DDD8D0] mt-0.5 opacity-90">
                  회식, 동호회, 가족 모임 단체석 예약 및 대량 밀키트 주문을 환영합니다.
                </p>
              </div>
              <button
                onClick={onOpenReservation}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-[#C84B31] hover:bg-[#A93C25] text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>온라인 간편 예약</span>
              </button>
            </div>

            {/* Official Instagram Banner */}
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-gradient-to-r from-[#F58529]/10 via-[#DD2A7B]/10 to-[#8134AF]/10 border border-[#DD2A7B]/20 flex items-center justify-between gap-4 group hover:border-[#DD2A7B]/40 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#2D2D2D] tracking-tight">
                      닭잡고오리발 공식 인스타그램
                    </span>
                    <span className="text-[10px] font-bold text-[#DD2A7B] bg-white px-2 py-0.5 rounded-full shadow-2xs border border-[#DD2A7B]/15">
                      {STORE_INFO.instagramHandle}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#2D2D2D] opacity-70 mt-0.5">
                    매일의 신선 조리 소식과 고객 후기, 매장 일상을 확인해 보세요
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#DD2A7B] shrink-0 group-hover:translate-x-0.5 transition-transform">
                <span className="hidden sm:inline">피드 둘러보기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>

          </div>

          {/* Right Column: Visual Photo & Google Map Preview */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Restaurant Ambiance Photo Card with Direct Photo Upload */}
            <div className="relative rounded-3xl overflow-hidden shadow-xs border border-[#2D2D2D]/10 h-68 sm:h-76 bg-[#2D2D2D] group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                id="store-interior-upload"
              />

              <img
                src={currentImageSrc}
                alt={`${STORE_INFO.name} 매장 인테리어`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />

              {/* Top Controls: Upload / Reset Photo Buttons */}
              <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
                {customImage && (
                  <button
                    onClick={handleResetImage}
                    className="px-2.5 py-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white text-[11px] font-semibold flex items-center gap-1 backdrop-blur-md border border-white/15 transition-all shadow-xs"
                    title="기본 이미지로 되돌리기"
                  >
                    <RotateCcw className="w-3 h-3 text-white" />
                    <span>기본값</span>
                  </button>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-full bg-[#2D2D2D]/80 hover:bg-[#C84B31] text-white text-[11px] sm:text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/20 transition-all shadow-md active:scale-95 cursor-pointer"
                  title="내 컴퓨터/휴대폰의 매장 사진 파일로 변경하기"
                >
                  <Camera className="w-3.5 h-3.5 text-[#FFA94D]" />
                  <span>{customImage ? '사진 다시 변경' : '내 사진으로 변경'}</span>
                </button>
              </div>

              {/* Bottom Gradient Overlay & Description */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-6 pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[#FFA94D] uppercase tracking-wider">
                    순천 연향동 매장 내부
                  </span>
                  {customImage && (
                    <span className="text-[10px] font-bold bg-[#C84B31] text-white px-2 py-0.5 rounded-full">
                      실제 매장 사진 적용됨
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-bold text-white mt-0.5">
                  정겨운 레트로 감성 홀 & 단체석 100인 완비
                </h4>
                <p className="text-xs text-[#E5DCD4] mt-1 opacity-90 leading-relaxed">
                  원목 테이블 부스석, 정겨운 추억의 간판 인테리어, 대형 빔프로젝터와 테이블오더 완비
                </p>
              </div>
            </div>

            {/* Stylized Interactive Google Map Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#2D2D2D]/5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C84B31] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#C84B31]" />
                    <span>구글 맵 (Google Maps) 위치 안내</span>
                  </span>
                  <a
                    href={googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#1A73E8] hover:underline flex items-center gap-1"
                  >
                    <span>크게 보기</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                {/* Embedded Interactive Google Map */}
                <div className="relative h-56 sm:h-64 rounded-2xl bg-[#F2EFE9] border border-[#2D2D2D]/10 overflow-hidden shadow-2xs">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      `${STORE_INFO.address} ${STORE_INFO.name}`
                    )}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`구글 맵 - ${STORE_INFO.name}`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#2D2D2D]">
                  <span className="font-bold">{STORE_INFO.name}</span>
                  <span className="opacity-60">{STORE_INFO.address}</span>
                </div>
              </div>

              {/* Fast phone call button */}
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="w-full py-3.5 rounded-xl bg-[#2D2D2D] hover:bg-[#C84B31] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>매장 전화 연결 ({STORE_INFO.phone})</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
