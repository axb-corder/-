export type SpiceLevel =
  | '순한맛'
  | '기본맛'
  | '매콤칼칼맛'
  | '보통맛'
  | '매운맛'
  | '화끈매운맛'
  | '단짠단짠 기본맛'
  | '매콤달달 기본맛'
  | '칼칼한 매운맛'
  | '달콤 매실BBQ맛'
  | '매콤 핫BBQ맛'
  | '반반 세트'
  | string;

export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface MealKitProduct {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  weight: string;
  servings: string;
  storage: string;
  spicyOptions?: SpiceLevel[];
  tags: string[];
  imageUrl: string;
  cookingTime: string;
  difficulty: '쉬움' | '보통';
  highlight: string;
  components: string[];
  cookingSteps: { step: number; title: string; desc: string; tip?: string }[];
  origin: string;
  caution?: string;
  tips?: string[];
}

export interface CartItem {
  cartId: string;
  product: MealKitProduct;
  selectedSpice?: SpiceLevel;
  selectedOptions: ProductOption[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type DeliveryMethod = 'delivery' | 'pickup';

export interface OrderInfo {
  orderId: string;
  orderDate: string;
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  recipientName: string;
  phoneNumber: string;
  recipientEmail?: string;
  address?: string;
  detailAddress?: string;
  requestNote?: string;
  requestedDate?: string;
  paymentMethod: 'card' | 'naver' | 'kakao' | 'toss' | 'nice' | 'bank';
  pgProvider?: 'portone' | 'tosspayments' | 'kakaopay' | 'nice' | 'bank';
  paymentId?: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: '결제완료' | '주문접수' | '배송준비중' | '배송중' | '배송완료' | '수령대기';
  notificationStatus?: {
    kakaoSent: boolean;
    emailSent: boolean;
    sentAt: string;
  };
}

export interface ReservationInquiry {
  id: string;
  type: 'store_table' | 'group_order' | 'catering';
  name: string;
  phone: string;
  date: string;
  time: string;
  guestsCount: number;
  menuInterest: string;
  specialRequests: string;
  createdAt: string;
}
