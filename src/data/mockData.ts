import { MealKitProduct, ProductOption } from '../types';
import ganjangJjimdakImg from '../assets/images/ganjang_jjimdak_1788664518535.jpg';
import dakbokkeumtangImg from '../assets/images/dakbokkeumtang_1788664534103.jpg';
import suncheonHotdogImg from '../assets/images/suncheon_hotdog_1788664552243.jpg';
import dakjobgoRetroInteriorImg from '../assets/images/dakjobgo_retro_interior_1788666901010.jpg';

export const PRODUCT_IMAGE_CANDIDATES: Record<string, string[]> = {
  'ganjang-jjimdak': [
    '/간장찜닭.png',
    '/images/간장찜닭.png',
    '/images/ganjang.png',
    '/ganjang.png',
    ganjangJjimdakImg,
  ],
  'spicy-dakbokkeum': [
    '/매콤 닭볶음탕.png',
    '/매콤닭볶음탕.png',
    '/images/매콤 닭볶음탕.png',
    '/images/매콤닭볶음탕.png',
    '/images/dakbokkeum.png',
    '/dakbokkeum.png',
    dakbokkeumtangImg,
  ],
  'suncheon-hotdog': [
    '/순천만가든닭.png',
    '/images/순천만가든닭.png',
    '/images/hotdog.png',
    '/hotdog.png',
    suncheonHotdogImg,
  ],
};

export const HERO_IMAGE_CANDIDATES: string[] = [
  '/메인.png',
  '/images/메인.png',
  '/images/main.png',
  '/main.png',
  dakbokkeumtangImg,
];

export const STORE_IMAGE_CANDIDATES: string[] = [
  '/매장내부.jpg',
  '/images/매장내부.jpg',
  '/images/store-interior.jpg',
  '/store-interior.jpg',
  dakjobgoRetroInteriorImg,
];

export const STORE_INFO = {
  name: '닭잡고오리발',
  concept: '신선한 100% 국내산 닭으로 정성을 다해 요리한 프리미엄 닭요리전문점',
  address: '전남 순천시 연향상가6길 7 (1층)',
  addressDetail: '순천시 연향동 동성공원 인근 연향상가 골목 1층',
  phone: '061-721-9292',
  businessHours: '월요일~토요일 16:00 ~ 익일 00:30 (매주 일요일 정기휴무)',
  breakTime: '브레이크타임 없음',
  facilityNotice: '순천시 연향동에 닭잡고오리발 오프라인 매장을 운영 중이며, 매장에서 드셨던 감동의 맛 그대로 온라인에서도 편리하게 신선 배송으로 구매하실 수 있습니다.',
  bannerPhrase: '예약 및 단체 주문 문의를 언제나 환영합니다.',
  offlineCapacity: '단체석 최대 100인 완비 / 프라이빗 룸 / 인근 공영주차장 이용 가능',
  smartstoreUrl: 'https://smartstore.naver.com/dak_jap_o',
  instagramUrl: 'https://www.instagram.com/dak_jap_o',
  instagramHandle: '@dak_jap_o',
  kakaoChannelUrl: 'https://open.kakao.com/o/sHTA0iMi', // 카카오톡 오픈채팅 상담 링크
  kakaoChannelName: '닭잡고오리발',
  features: [
    { title: '100% 신선 국내산(하림) 닭고기', desc: '믿을 수 있는 100% 국내산 하림 닭고기만 엄선하여 잡내 없이 부드럽고 쫄깃한 육질을 자랑합니다.' },
    { title: '입맛 당기는 매콤함, 매콤달달 특제소스', desc: '화학조미료의 인위적인 맛을 배제하고 과일과 천연 재료로 숙성한 특제 비법 양념을 사용합니다.' },
    { title: '매장 손맛 그대로 초간편 밀키트', desc: '야채, 당면, 소스까지 정성껏 손질 포장하여 냄비에 넣고 끓이기만 하면 15분 만에 완성됩니다.' },
    { title: '신선 콜드체인 전국 택배', desc: '친환경 아이스박스와 보냉백으로 산지의 신선함을 고객님의 식탁까지 고스란히 배송합니다.' }
  ]
};

export const EXTRA_OPTIONS: ProductOption[] = [
  { id: 'opt_glass_noodles', name: '쫄깃 납작당면 사리 (150g)', price: 2000 },
  { id: 'opt_cheese_rice_cake', name: '모짜렐라 치즈떡 사리 (10개)', price: 2500 },
  { id: 'opt_ramen', name: '라면사리 (1봉)', price: 1500 },
  { id: 'opt_fried_rice_kit', name: '김가루 & 참기름 볶음밥 키트 (2인)', price: 3000 },
  { id: 'opt_ice_extra', name: '보냉팩 & 아이스젤 추가', price: 1000 },
];

export const MEAL_KIT_PRODUCTS: MealKitProduct[] = [
  {
    id: 'ganjang-jjimdak',
    name: '단짠단짠 간장찜닭',
    subtitle: '믿을 수 있는 국내산(하림) 닭고기만 사용한 비법 수제 밀키트',
    description: '남녀노소 누구나 사랑하는 닭잡고오리발의 대표 시그니처! 동봉된 간장베이스 소스에 신선한 국내산 하림 닭고기(45%), 포슬포슬 감자와 고구마, 쫄깃한 당면과 신선 채소가 듬뿍 들어간 든든한 2.3kg 대용량 일품 수제 요리입니다.',
    price: 24900,
    originalPrice: 33000,
    weight: '2.3kg (3~4인분, 닭고기 45% + 당면, 채소)',
    servings: '3~4인분',
    storage: '0~10℃ 냉장보관 (바로 조리하지 않을 경우 냉장보관하시고 3일 내에 드세요)',
    spicyOptions: ['단짠단짠 기본맛', '매콤칼칼맛'],
    tags: ['국내산하림닭', '단짠단짠', '닭고기45%', '2.3kg푸짐', '20분완성'],
    imageUrl: ganjangJjimdakImg,
    cookingTime: '20분 조리',
    difficulty: '쉬움',
    highlight: '국내산 하림 닭고기 45% + 비법 찜닭소스 + 감자/고구마/당근 + 쫄깃 당면 (2.3kg 대용량)',
    components: [
      '신선 손질 100% 국내산 하림 닭고기 (45%)',
      '잡내 제거용 월계수잎',
      '단짠단짠 비법 찜닭 양념 소스',
      '신선 뿌리채소팩 (감자, 고구마, 당근)',
      '신선 향채팩 (양파, 대파, 다진마늘)',
      '칼칼한 맛 고추팩 (고추 & 월남고추)',
      '쫄깃 찜닭 전용 당면 (작은 당면)',
      '고소한 마무리 참기름 팩'
    ],
    cookingSteps: [
      {
        step: 1,
        title: '닭고기 & 월계수잎 5분 데친 후 찬물 헹구기',
        desc: '닭과 월계수잎을 끓는 물에 넣어 5분간 데친 후 맑은 물과 찌꺼기를 버리고 닭을 찬물에 헹굽니다.',
        tip: '당면은 별도로 삶아 준비해 두세요.'
      },
      {
        step: 2,
        title: '물 1L, 소스, 감자·고구마·당근 넣고 센불 10분',
        desc: '데친 닭과 물 1L, 찜닭소스, 감자, 고구마, 당근을 넣고 뚜껑을 연 채 10분간 센불로 끓입니다.',
        tip: '맛술과 후추를 함께 넣으시면 잡내 없이 더욱 풍미가 깊어집니다.'
      },
      {
        step: 3,
        title: '나머지 야채·당면 넣고 졸인 후 참기름 마무리',
        desc: '나머지 재료(양파, 대파, 고추, 월남고추, 다진마늘, 작은 당면)를 넣고 한소끔 끓인 후 국물이 줄어들면 참기름을 두른 후 드세요.',
        tip: '국물이 자작하게 졸아들었을 때 불을 끄고 참기름을 둘러주시면 고소한 향이 극대화됩니다.'
      }
    ],
    origin: '닭고기(국내산 하림 100%), 감자(국내산), 고구마(국내산), 당근(국내산), 양파(국내산), 대파(국내산), 마늘(국내산)',
    caution: '바로 조리하지 않을 경우, 냉장보관하시고 3일 내에 드세요. (믿을 수 있는 국내산 하림 닭 사용!)',
    tips: [
      '당면은 별도로 삶아 준비해 두시면 국물이 텁텁해지지 않고 깔끔합니다.',
      '데친 닭을 끓일 때 맛술과 후추를 약간 넣으시면 더욱 풍미가 깊어집니다.',
      '국내산 하림 닭고기만 사용하여 안심하고 맛있게 드실 수 있습니다.'
    ]
  },
  {
    id: 'spicy-dakbokkeum',
    name: '매콤달달 닭볶음탕',
    subtitle: '신선한 국내산(하림) 닭고기로 매콤하고 달콤한 깊은 맛!',
    description: '집에서 간편하게 만나는 맛집의 맛! 신선한 100% 국내산 하림 닭고기와 감칠맛 넘치는 비법 매콤달달 소스로 누구나 쉽게 3단계(20분)로 완성하는 푸짐한 2kg 대용량 수제 닭볶음탕 밀키트입니다.',
    price: 21900,
    originalPrice: 30000,
    weight: '2kg (3~4인분, 닭고기 + 감자, 당근, 야채)',
    servings: '3~4인분',
    storage: '0~10℃ 냉장보관 (바로 조리하지 않을 경우 냉장보관하시고 3일 내에 드세요)',
    spicyOptions: ['매콤달달 기본맛', '칼칼한 매운맛', '화끈매운맛'],
    tags: ['국내산하림닭', '매콤달달', '3단계완성', '2kg푸짐', '20분완성'],
    imageUrl: dakbokkeumtangImg,
    cookingTime: '20분 조리',
    difficulty: '쉬움',
    highlight: '신선 100% 국내산 하림 닭고기 + 비법 매콤달달 특제소스 + 신선 채소 (2kg 푸짐한 한 그릇의 행복)',
    components: [
      '신선 손질 100% 국내산 하림 닭고기',
      '잡내 제거용 월계수잎',
      '순천의 맛 비법 매콤달달 닭볶음탕 소스',
      '신선 채소팩 (포슬포슬 감자, 당근)',
      '신선 향채팩 (양파, 대파, 청·홍고추, 다진마늘)',
      '고소한 마무리 통참깨 팩'
    ],
    cookingSteps: [
      {
        step: 1,
        title: '닭 데치기 (닭과 월계수잎 5분)',
        desc: '닭과 월계수잎을 끓는 물에 넣어 5분간 데친 후 물과 찌꺼기를 버리고 닭을 찬물에 헹굽니다.',
        tip: '찬물에 가볍게 헹궈내면 잡내와 불순물이 완전히 제거되어 깔끔합니다.'
      },
      {
        step: 2,
        title: '재료 넣고 끓이기 (물 1L + 소스 + 감자·당근)',
        desc: '데친 닭과 물 1L, 닭볶음탕소스, 감자, 당근을 넣고 뚜껑을 연 채 10분간 센 불로 끓입니다.',
        tip: '맛술, 후추도 함께 넣으시면 풍미가 훨씬 깊어집니다.'
      },
      {
        step: 3,
        title: '나머지 재료 넣고 완성! (야채 넣고 졸인 후 참깨)',
        desc: '나머지 재료(양파, 대파, 고추, 다진마늘)를 넣고 한소끔 끓인 후 국물이 줄어들면 참깨를 솔솔 뿌려 드세요.',
        tip: '국물이 자작하게 졸아들었을 때 불을 끄고 참깨를 뿌려주시면 고소함이 극대화됩니다.'
      }
    ],
    origin: '닭고기(국내산 하림 100%), 감자(국내산), 당근(국내산), 양파(국내산), 대파(국내산), 고추(청/홍고추 국내산), 마늘(국내산)',
    caution: '바로 조리하지 않을 경우, 냉장보관하시고 3일 내에 드세요. (맛있고 안전한 한 끼, 닭잡고오리발이 함께합니다! ♥)',
    tips: [
      '간이 부족하면 진간장으로 간을 맞추세요.',
      '소스가 기본적으로 매콤하니 소스는 다 넣지 않고 간을 보며 추가하세요.',
      '국내산 하림 닭이니 안심하고 드세요! ♥'
    ]
  },
  {
    id: 'suncheon-hotdog',
    name: '순천만 가든닭 핫도그',
    subtitle: '순천의 자연을 담은 맛있는 만남! 숯불 닭바베큐 & 미나리슬로우 수제 핫도그',
    description: '숯불 닭바베큐 전문점 닭잡고오리발의 특제 숯불 닭바베큐와 상큼한 미나리슬로우, 신선한 미나리살사소스, 매실/핫 BBQ소스가 어우러져 한 끼 식사로도 든든한 순천 로컬 시그니처 프리미엄 수제 핫도그입니다.',
    price: 14900,
    originalPrice: 20000,
    weight: '2인 세트 (핫도그빵 2개 + 숯불 닭바베큐 + 미나리슬로우 + 미나리살사 + 특제소스 2종)',
    servings: '2인분 (든든한 한 끼)',
    storage: '0~10℃ 냉장보관 (수령 후 가급적 빠른 시일 내 조리해 드세요)',
    spicyOptions: ['달콤 매실BBQ맛', '매콤 핫BBQ맛', '반반 세트'],
    tags: ['숯불닭바베큐', '미나리슬로우', '미나리살사', '매실BBQ', '5분완성', '순천특화'],
    imageUrl: suncheonHotdogImg,
    cookingTime: '5분 간편 조리',
    difficulty: '쉬움',
    highlight: '특제 숯불 닭바베큐 + 상큼 미나리슬로우 + 미나리살사소스 + 매실/핫 BBQ소스 (5분 완성)',
    components: [
      '부드러운 전용 핫도그빵 (2개)',
      '불향 가득 숯불 닭바베큐 (신선 국내산 닭고기)',
      '상큼하고 아삭한 특제 미나리슬로우',
      '신선한 채소 듬뿍 미나리살사소스',
      '달콤 감칠맛 매실BBQ소스',
      '알싸하고 화끈한 매콤 핫BBQ소스'
    ],
    cookingSteps: [
      {
        step: 1,
        title: '핫도그빵을 가운데 커팅 후 전자레인지 20초~30초 데우기',
        desc: '빵을 살짝 데우면 겉은 바삭, 속은 부드러워 더욱 맛있어요.',
        tip: '전자레인지에 20~30초 데우면 갓 구운 빵처럼 폭신하고 부드러워집니다.'
      },
      {
        step: 2,
        title: '닭바베큐를 전자레인지에 2~3분 데우기',
        desc: '닭바베큐를 충분히 데워 더욱 촉촉하고 맛있게 준비합니다.',
        tip: '따뜻하게 충분히 데워야 숯불 바베큐 특유의 깊은 불향과 육즙이 가득 살아납니다.'
      },
      {
        step: 3,
        title: '미나리슬로우 빵에 바르기',
        desc: '상큼한 미나리슬로우가 풍미를 더해줍니다.',
        tip: '데운 빵 안쪽에 고루 펴 발라주시면 향긋하고 아삭한 식감이 배가됩니다.'
      },
      {
        step: 4,
        title: '데운 닭바베큐를 올리기',
        desc: '푸짐하게 올려 든든한 한 끼 완성!',
        tip: '빵 사이에 따뜻한 닭바베큐를 듬뿍 채워 풍성한 비주얼과 든든한 포만감을 즐기세요.'
      },
      {
        step: 5,
        title: '핫BBQ소스 올리기 (매실BBQ소스, 미나리살사소스)',
        desc: '매실BBQ소스 또는 미나리살사소스로 맛의 풍미를 더해 마무리!',
        tip: '달콤한 매실BBQ소스와 알싸한 미나리살사소스를 취향껏 올려 화려하고 맛있는 핫도그를 완성하세요.'
      }
    ],
    origin: '닭고기(국내산 100%), 미나리(국내산 순천), 밀가루(국내 가공), 채소(국내산)',
    caution: '빵과 닭바베큐를 따뜻하게 충분히 데워 드시면 가장 촉촉하고 맛있는 상태로 즐기실 수 있습니다.',
    tips: [
      '빵과 닭바베큐를 따뜻하게 데우면 더 맛있어요!',
      '미나리슬로우와 미나리살사소스의 신선함이 맛의 포인트!',
      '매콤한 맛을 원하시면 핫BBQ소스로 더 풍부한 맛을 즐겨보세요!'
    ]
  }
];

export const CUSTOMER_REVIEWS = [
  {
    id: 1,
    author: '김*현 (순천 연향동 주민)',
    menu: '단짠단짠 간장찜닭',
    rating: 5,
    date: '2026.08.28',
    comment: '매장에 자주 가던 단골인데 캠핑 갈 때 밀키트로 챙겨갔더니 친구들이 난리 났어요! 국물이 짜지 않고 감칠맛이 살아있어 아이들도 밥 두 공기 비웠습니다.'
  },
  {
    id: 2,
    author: '박*수 (서울 강남구 택배 주문)',
    menu: '매콤달달 닭볶음탕',
    rating: 5,
    date: '2026.08.25',
    comment: '전남 순천 여행 때 먹었던 맛이 그리워서 택배 주문했는데 아이스박스에 얼음 가득 신선하게 잘 왔어요. 닭이 진짜 야들야들하고 양념이 예술입니다.'
  },
  {
    id: 3,
    author: '이*영 (경기 성남시)',
    menu: '순천만 가든닭 핫도그',
    rating: 5,
    date: '2026.08.20',
    comment: '미나리슬로우랑 숯불 닭바베큐 조합이 진짜 신의 한 수예요! 빵이랑 닭고기 전자레인지에 데워서 차례대로 올렸더니 5분 만에 수제 전문점 핫도그가 완성됐어요.'
  }
];
