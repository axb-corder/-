import React, { useState } from 'react';
import { STORE_INFO } from '../data/mockData';
import { X, MessageCircle, Phone, Copy, Check, ExternalLink, HelpCircle, ArrowRight } from 'lucide-react';

interface KakaoHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KakaoHelpModal: React.FC<KakaoHelpModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customLink, setCustomLink] = useState(() => {
    return localStorage.getItem('dakjobgo_custom_kakao_url') || '';
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const currentKakaoUrl = customLink || STORE_INFO.kakaoChannelUrl;

  const handleCopyId = () => {
    navigator.clipboard.writeText(STORE_INFO.kakaoChannelName);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentKakaoUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLink.trim()) {
      localStorage.setItem('dakjobgo_custom_kakao_url', customLink.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      window.dispatchEvent(new CustomEvent('dakjobgo-kakao-url-updated', { detail: { url: customLink.trim() } }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#2D2D2D]/10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FEE500] flex items-center justify-between text-[#191919]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#191919] text-[#FEE500] flex items-center justify-center font-black shadow-xs">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight leading-none">
                카카오톡 문의 및 상담 안내
              </h3>
              <p className="text-xs font-semibold opacity-75 mt-1">
                공식 오픈채팅방 연결 및 참여 방법
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#2D2D2D]">
          
          {/* Active Connection Status Box */}
          <div className="p-4 rounded-2xl bg-[#E8F8F0] border border-emerald-300 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>공식 오픈채팅방 연결 완료 (정상 동작 중)</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              <strong>닭잡고오리발</strong> 카카오톡 공식 오픈채팅(
              <a 
                href={STORE_INFO.kakaoChannelUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline font-mono text-[11px] font-bold text-emerald-950"
              >
                {STORE_INFO.kakaoChannelUrl}
              </a>
              )이 정상적으로 연동되어 있습니다.
            </p>
            <div className="text-[11px] text-emerald-800/90 pt-1 border-t border-emerald-200/80 space-y-1">
              <div>• <strong>스마트폰(모바일)</strong>: 링크 클릭 시 카카오톡 앱이 즉시 실행되며 채팅방으로 바로 입장됩니다.</div>
              <div>• <strong>컴퓨터(PC)</strong>: 카카오 안내 페이지에서 [오픈채팅 참여하기]를 누르시거나 [QR 코드]를 폰 카메라로 찍어 참여하실 수 있습니다.</div>
            </div>
          </div>

          {/* Direct Link Action Box */}
          <div className="p-4 rounded-2xl bg-[#FCF9F4] border border-[#2D2D2D]/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#2D2D2D] uppercase tracking-wider">
                오픈채팅 바로가기 & 주소 복사
              </span>
              <span className="text-[11px] text-[#C84B31] font-black">
                실시간 상담 가능
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={currentKakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-[#191919]" />
                <span>오픈채팅방 바로 입장하기</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-0.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="py-3 px-3.5 rounded-xl border border-[#2D2D2D]/15 hover:bg-white text-xs font-bold transition-colors flex items-center gap-1 text-[#2D2D2D] shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>링크 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Method 1: Search by Kakao ID */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#2D2D2D] uppercase tracking-wider">
                방법 1. 카카오톡 앱에서 직접 검색하기 (가장 확실함)
              </h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                권장
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FCF9F4] border border-[#2D2D2D]/10 space-y-2.5">
              <ol className="text-xs space-y-1.5 list-decimal list-inside opacity-90 leading-relaxed">
                <li>스마트폰에서 <strong>카카오톡 앱</strong>을 실행합니다.</li>
                <li>친구 탭 상단의 <strong>돋보기(검색)</strong> 아이콘을 누릅니다.</li>
                <li>검색창에 아래 검색어를 입력 후 채널 1:1 채팅을 시작하세요.</li>
              </ol>

              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#2D2D2D]/10">
                <div>
                  <span className="text-[10px] opacity-60 block font-semibold">채널 검색어</span>
                  <span className="text-sm font-black text-[#C84B31]">
                    {STORE_INFO.kakaoChannelName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="px-3 py-1.5 rounded-lg bg-[#2D2D2D] hover:bg-[#C84B31] text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>복사됨!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>이름 복사</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Method 2: Open current link or Openchat */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-[#2D2D2D] uppercase tracking-wider">
              방법 2. 오픈채팅 또는 채널 링크 바로 열기 / 변경
            </h4>
            <div className="p-4 rounded-2xl bg-[#FCF9F4] border border-[#2D2D2D]/10 space-y-3">
              <p className="text-xs opacity-80 leading-relaxed">
                사장님의 카카오톡 <strong>오픈채팅방 링크</strong> (<span className="font-mono text-[11px]">open.kakao.com/o/...</span>) 또는 정확한 <strong>채널 링크</strong>를 아래에 등록하시면 웹사이트 전체 문의 버튼이 즉시 그 링크로 연결됩니다.
              </p>

              <form onSubmit={handleSaveCustomLink} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://open.kakao.com/o/ 또는 pf.kakao.com/..."
                    value={customLink}
                    onChange={(e) => setCustomLink(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#2D2D2D]/15 bg-white text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#C84B31]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-[#2D2D2D] hover:bg-[#C84B31] text-white text-xs font-bold shrink-0 transition-colors"
                  >
                    링크 적용
                  </button>
                </div>
                {saveSuccess && (
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    새로운 카카오톡 링크가 사이트에 즉시 반영되었습니다!
                  </p>
                )}
              </form>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={currentKakaoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4 fill-[#191919]" />
                  <span>현재 링크로 열어보기</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 rounded-xl border border-[#2D2D2D]/15 hover:bg-white text-xs font-bold transition-colors flex items-center gap-1 text-[#2D2D2D]"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? '복사됨' : '링크 복사'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Method 3: Direct Phone Call */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#2D2D2D]/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C84B31]/10 text-[#C84B31] flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] opacity-60 block font-semibold">급한 문의는 전화 상담</span>
                <span className="text-sm font-black text-[#2D2D2D]">{STORE_INFO.phone}</span>
              </div>
            </div>
            <a
              href={`tel:${STORE_INFO.phone}`}
              className="px-3.5 py-2 rounded-xl bg-[#2D2D2D] hover:bg-[#C84B31] text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>전화 연결</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FCF9F4] border-t border-[#2D2D2D]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2D2D2D] text-white text-xs font-bold hover:bg-[#C84B31] transition-colors"
          >
            확인 및 닫기
          </button>
        </div>

      </div>
    </div>
  );
};
