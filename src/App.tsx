/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandPhilosophy } from './components/BrandPhilosophy';
import { MealKitList } from './components/MealKitList';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { StoreLocation } from './components/StoreLocation';
import { ReservationModal } from './components/ReservationModal';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { MealKitProduct, CartItem, ProductOption, OrderInfo, ReservationInquiry } from './types';
import { STORE_INFO, MEAL_KIT_PRODUCTS } from './data/mockData';
import { ShoppingBag, Phone, ArrowUp, CalendarCheck, Check, MessageCircle } from 'lucide-react';

export default function App() {
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dak_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state
  const [orders, setOrders] = useState<OrderInfo[]>(() => {
    try {
      const saved = localStorage.getItem('dak_orders');
      return saved ? JSON.parse(saved) : [
        {
          orderId: 'DK-260901-7192',
          orderDate: '2026. 9. 1. 오후 2:15:30',
          items: [
            {
              cartId: 'sample-1',
              product: MEAL_KIT_PRODUCTS[0],
              selectedOptions: [],
              quantity: 1,
              unitPrice: 24900,
              totalPrice: 24900
            }
          ],
          deliveryMethod: 'delivery',
          recipientName: '김민수',
          phoneNumber: '010-9876-5432',
          address: '전남 순천시 신대지구 매안로 15',
          detailAddress: '102동 405호',
          requestNote: '문 앞에 놓아주세요',
          requestedDate: '2026-09-02',
          paymentMethod: 'card',
          subtotal: 24900,
          shippingFee: 3000,
          totalAmount: 27900,
          status: '배송완료'
        }
      ];
    } catch {
      return [];
    }
  });

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<MealKitProduct | null>(null);
  const [latestOrder, setLatestOrder] = useState<OrderInfo | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dak_cart_items', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dak_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Cart operations
  const handleAddToCart = (
    product: MealKitProduct,
    options: ProductOption[] = [],
    quantity: number = 1
  ) => {
    const optionsKey = options.map((o) => o.id).sort().join('-');
    const cartId = `${product.id}_${optionsKey || 'standard'}`;
    const optionsTotal = options.reduce((sum, opt) => sum + opt.price, 0);
    const unitPrice = product.price + optionsTotal;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartId === cartId);
      if (existing) {
        return prev.map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * unitPrice,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          cartId,
          product,
          selectedOptions: options,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
        },
      ];
    });

    showToast(`'${product.name}' 상품을 장바구니에 담았습니다.`);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              totalPrice: nextQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = (newOrder: OrderInfo) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setLatestOrder(newOrder);
  };

  const handleReservationInquiry = (inquiry: ReservationInquiry) => {
    try {
      const prevInquiries = JSON.parse(localStorage.getItem('dak_inquiries') || '[]');
      localStorage.setItem('dak_inquiries', JSON.stringify([inquiry, ...prevInquiries]));
    } catch {
      // ignore
    }
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F4] text-[#2D2D2D]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#2D2D2D] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold border border-[#2D2D2D]/20 animate-fade-in">
          <Check className="w-4 h-4 text-[#C84B31]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenOrderLookup={() => setIsOrderLookupOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOrderClick={() => {
            const menuEl = document.getElementById('mealkit-menu');
            menuEl?.scrollIntoView({ behavior: 'smooth' });
          }}
          onReservationClick={() => setIsReservationOpen(true)}
        />

        {/* Brand Story & 4 Commitments */}
        <BrandPhilosophy />

        {/* 3 Signature Meal-kit Menus with detail & quick order */}
        <MealKitList
          onAddToCart={(product) => handleAddToCart(product)}
          onOpenDetail={(product) => setDetailProduct(product)}
        />

        {/* Customer Reviews Section */}
        <ReviewsSection />

        {/* Offline Store Section (순천시 연향동) */}
        <StoreLocation
          onOpenReservation={() => setIsReservationOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        {/* Quick KakaoTalk Chat Pill */}
        <a
          href={STORE_INFO.kakaoChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] shadow-md hover:shadow-lg font-bold text-xs transition-all hover:scale-105 active:scale-95 border border-[#FEE500]"
          title="카카오톡 1:1 실시간 상담 바로가기"
        >
          <MessageCircle className="w-4 h-4 fill-[#191919]" />
          <span>카카오톡 문의</span>
        </a>

        {/* Quick Phone Call Pill */}
        <a
          href={`tel:${STORE_INFO.phone}`}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#2D2D2D] hover:text-[#C84B31] border border-[#2D2D2D]/10 shadow-md hover:shadow-lg font-bold text-xs transition-all hover:scale-105"
          title="매장 전화 바로걸기"
        >
          <Phone className="w-3.5 h-3.5 text-[#C84B31]" />
          <span>{STORE_INFO.phone} 전화</span>
        </a>

        {/* Floating Cart Button if Cart has items */}
        {totalCartCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#2D2D2D] hover:bg-[#C84B31] text-white shadow-lg font-bold text-sm transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>장바구니 확인</span>
            <span className="bg-[#C84B31] text-white text-xs font-black px-2 py-0.5 rounded-full">
              {totalCartCount}
            </span>
          </button>
        )}

        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-white hover:bg-[#F2EFE9] text-[#2D2D2D] border border-[#2D2D2D]/10 shadow-xs flex items-center justify-center transition-all hover:text-[#C84B31]"
          title="맨 위로 가기"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={handleProceedCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderComplete={handleOrderComplete}
      />

      <OrderSuccessModal
        order={latestOrder}
        onClose={() => setLatestOrder(null)}
        onViewAllOrders={() => {
          setLatestOrder(null);
          setIsOrderLookupOpen(true);
        }}
      />

      <OrderLookupModal
        isOpen={isOrderLookupOpen}
        onClose={() => setIsOrderLookupOpen(false)}
        orders={orders}
      />

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        onSubmitInquiry={handleReservationInquiry}
      />
    </div>
  );
}
