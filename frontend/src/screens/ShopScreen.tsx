import React, { useState, useCallback } from 'react';
import { Heart, ShoppingCart, Star, X, Plus, Minus, ChevronRight, Tag } from 'lucide-react';
import BottomTabBar from '../components/layout/BottomTabBar';
import Confetti from '../components/Confetti';
import { useShopStore, Product } from '../stores/shopStore';
import { useUserStore } from '../stores/userStore';
import { getRecommendations } from '../utils/getRecommendations';

const CATEGORIES = ['All', 'For My Skin', 'Serums', 'Cleansers', 'Moisturizers', 'SPF', 'Toners'];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={10}
          fill={s <= Math.round(rating) ? '#D4A843' : 'none'}
          style={{ color: '#D4A843' }}
        />
      ))}
      <span className="text-[10px] ml-0.5" style={{ color: '#6B6B8A' }}>{rating}</span>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  isRecommended: boolean;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (id: string) => void;
  onOpenDetail: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product, isWishlisted, isRecommended, onAddToCart, onToggleWishlist, onOpenDetail
}) => {
  const [heartAnim, setHeartAnim] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartAnim(true);
    onToggleWishlist(product.id);
    setTimeout(() => setHeartAnim(false), 300);
  };

  return (
    <div
      className="glass-card rounded-2xl overflow-hidden card-hover cursor-pointer"
      onClick={() => onOpenDetail(product)}
    >
      {/* Product image placeholder */}
      <div
        className={`h-28 bg-gradient-to-br ${product.gradient} flex items-center justify-center relative`}
      >
        <span className="text-4xl">{product.icon}</span>
        {product.isBestSeller && (
          <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: '#D4A843' }}>
            BEST SELLER
          </span>
        )}
        {product.discount > 0 && (
          <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: '#7B4BB7' }}>
            {product.discount}% OFF
          </span>
        )}
        <button
          onClick={handleWishlist}
          className={`absolute bottom-2 right-2 p-1.5 rounded-full ${heartAnim ? 'animate-heart-pop' : ''}`}
          style={{ background: 'rgba(255,255,255,0.9)' }}
        >
          <Heart
            size={14}
            fill={isWishlisted ? '#ef4444' : 'none'}
            style={{ color: isWishlisted ? '#ef4444' : '#6B6B8A' }}
          />
        </button>
      </div>

      <div className="p-3">
        {isRecommended && (
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full mb-1 inline-block" style={{ background: 'rgba(123,75,183,0.1)', color: '#7B4BB7' }}>
            ✨ For you
          </span>
        )}
        <p className="text-[10px] font-medium mb-0.5" style={{ color: '#6B6B8A' }}>{product.brand}</p>
        <p className="text-xs font-semibold leading-tight mb-1" style={{ color: '#111111' }}>{product.name}</p>
        <StarRating rating={product.rating} />
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-sm font-bold" style={{ color: '#111111' }}>₹{product.price}</span>
            {product.discount > 0 && (
              <span className="text-[10px] line-through ml-1" style={{ color: '#6B6B8A' }}>
                ₹{Math.round(product.price / (1 - product.discount / 100))}
              </span>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="text-[10px] font-semibold px-2 py-1.5 rounded-xl text-white transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)' }}
          >
            + Cart
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProductDetailModalProps {
  product: Product;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
  onToggleWishlist: (id: string) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product, isWishlisted, onClose, onAddToCart, onToggleWishlist
}) => {
  const [qty, setQty] = useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: 430, margin: '0 auto' }}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div className="relative w-full glass-card rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto no-scrollbar" style={{ background: 'rgba(255,255,255,0.97)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full" style={{ background: 'rgba(188,166,230,0.2)' }}>
          <X size={18} style={{ color: '#6B6B8A' }} />
        </button>

        <div className={`h-40 bg-gradient-to-br ${product.gradient} rounded-2xl flex items-center justify-center mb-4`}>
          <span className="text-6xl">{product.icon}</span>
        </div>

        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(123,75,183,0.1)', color: '#7B4BB7' }}>
            {product.brand}
          </span>
          {product.isBestSeller && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#D4A843' }}>BEST SELLER</span>
          )}
        </div>
        <h2 className="text-lg font-semibold mb-1" style={{ color: '#111111' }}>{product.name}</h2>
        <div className="flex items-center gap-3 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs" style={{ color: '#6B6B8A' }}>({product.reviewCount.toLocaleString()} reviews)</span>
        </div>

        <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B6B8A' }}>{product.description}</p>

        <div className="mb-4">
          <p className="text-xs font-semibold mb-2" style={{ color: '#111111' }}>Key Ingredients</p>
          <div className="flex flex-wrap gap-1.5">
            {product.ingredients.map((ing) => (
              <span key={ing} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(126,209,178,0.15)', color: '#5B8A5B' }}>
                {ing}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold mb-2" style={{ color: '#111111' }}>Reviews</p>
          {product.reviews.map((r, i) => (
            <div key={i} className="mb-2 p-3 rounded-2xl" style={{ background: 'rgba(248,245,255,0.8)' }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#7B4BB7' }}>
                  {r.user.charAt(0)}
                </div>
                <span className="text-xs font-medium" style={{ color: '#111111' }}>{r.user}</span>
                <div className="flex ml-auto">
                  {[1,2,3,4,5].map(s => <Star key={s} size={8} fill={s <= r.rating ? '#D4A843' : 'none'} style={{ color: '#D4A843' }} />)}
                </div>
              </div>
              <p className="text-xs" style={{ color: '#6B6B8A' }}>{r.comment}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 glass-card rounded-2xl px-3 py-2">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1">
              <Minus size={14} style={{ color: '#7B4BB7' }} />
            </button>
            <span className="text-sm font-semibold w-6 text-center" style={{ color: '#111111' }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="p-1">
              <Plus size={14} style={{ color: '#7B4BB7' }} />
            </button>
          </div>
          <div>
            <span className="text-xl font-bold" style={{ color: '#111111' }}>₹{product.price * qty}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onToggleWishlist(product.id)}
            className="p-3 rounded-2xl glass-card"
            style={{ border: isWishlisted ? '2px solid #ef4444' : '1px solid rgba(188,166,230,0.4)' }}
          >
            <Heart size={20} fill={isWishlisted ? '#ef4444' : 'none'} style={{ color: isWishlisted ? '#ef4444' : '#6B6B8A' }} />
          </button>
          <button
            onClick={() => { onAddToCart(product, qty); onClose(); }}
            className="flex-1 py-3 rounded-2xl text-white font-semibold transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)' }}
          >
            Add to Cart 🛍️
          </button>
        </div>
      </div>
    </div>
  );
};

interface CartDrawerProps {
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ onClose, onCheckout }) => {
  const { cart, removeFromCart, updateQuantity } = useShopStore();
  const { glowPoints } = useUserStore();
  const [applyPoints, setApplyPoints] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const pointsDiscount = applyPoints ? Math.min(Math.floor(glowPoints / 10) * 10, subtotal * 0.1) : 0;
  const total = subtotal - pointsDiscount;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: 430, margin: '0 auto' }}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div className="relative w-full rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto no-scrollbar" style={{ background: 'rgba(255,255,255,0.97)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: '#111111' }}>🛍️ Your Cart</h2>
          <button onClick={onClose} className="p-2 rounded-full" style={{ background: 'rgba(188,166,230,0.2)' }}>
            <X size={18} style={{ color: '#6B6B8A' }} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-2">🛒</p>
            <p className="text-sm" style={{ color: '#6B6B8A' }}>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'rgba(248,245,255,0.8)' }}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.product.gradient} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-xl">{item.product.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: '#111111' }}>{item.product.name}</p>
                    <p className="text-xs" style={{ color: '#6B6B8A' }}>₹{item.product.price}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(188,166,230,0.3)' }}>
                      <Minus size={10} style={{ color: '#7B4BB7' }} />
                    </button>
                    <span className="text-xs font-semibold w-5 text-center" style={{ color: '#111111' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(188,166,230,0.3)' }}>
                      <Plus size={10} style={{ color: '#7B4BB7' }} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)}>
                    <X size={14} style={{ color: '#6B6B8A' }} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl mb-4" style={{ background: 'rgba(123,75,183,0.06)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#111111' }}>Apply GlowPoints</p>
                  <p className="text-xs" style={{ color: '#6B6B8A' }}>You have {glowPoints} points</p>
                </div>
                <button
                  onClick={() => setApplyPoints(!applyPoints)}
                  className="w-12 h-6 rounded-full transition-all relative"
                  style={{ background: applyPoints ? '#7B4BB7' : 'rgba(188,166,230,0.4)' }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                    style={{ left: applyPoints ? '26px' : '2px' }}
                  />
                </button>
              </div>
              {applyPoints && pointsDiscount > 0 && (
                <p className="text-xs mt-1" style={{ color: '#7ED1B2' }}>-₹{pointsDiscount} discount applied!</p>
              )}
            </div>

            <div className="mb-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span style={{ color: '#6B6B8A' }}>Subtotal</span>
                <span style={{ color: '#111111' }}>₹{subtotal}</span>
              </div>
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#7ED1B2' }}>GlowPoints Discount</span>
                  <span style={{ color: '#7ED1B2' }}>-₹{pointsDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold">
                <span style={{ color: '#111111' }}>Total</span>
                <span style={{ color: '#7B4BB7' }}>₹{total}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-4 rounded-2xl text-white font-semibold transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)' }}
            >
              Proceed to Checkout →
            </button>
          </>
        )}
      </div>
    </div>
  );
};

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onSuccess }) => {
  const { cart } = useShopStore();
  const [payment, setPayment] = useState('UPI');
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handlePlace = () => {
    setPlacing(true);
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: 430, margin: '0 auto' }}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div className="relative w-full rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto no-scrollbar" style={{ background: 'rgba(255,255,255,0.97)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: '#111111' }}>Checkout 🛍️</h2>
          <button onClick={onClose} className="p-2 rounded-full" style={{ background: 'rgba(188,166,230,0.2)' }}>
            <X size={18} style={{ color: '#6B6B8A' }} />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block" style={{ color: '#111111' }}>Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address..."
            rows={3}
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
            style={{
              background: 'rgba(248,245,255,0.8)',
              border: '1px solid rgba(188,166,230,0.4)',
              color: '#111111',
              fontFamily: 'Poppins, sans-serif',
            }}
          />
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium mb-2" style={{ color: '#111111' }}>Payment Method</p>
          <div className="flex gap-2">
            {['Card', 'UPI', 'COD'].map((method) => (
              <button
                key={method}
                onClick={() => setPayment(method)}
                className="flex-1 py-2.5 rounded-2xl text-sm font-medium transition-all"
                style={{
                  background: payment === method ? '#7B4BB7' : 'rgba(248,245,255,0.8)',
                  color: payment === method ? 'white' : '#111111',
                  border: payment === method ? 'none' : '1px solid rgba(188,166,230,0.4)',
                }}
              >
                {method === 'Card' ? '💳' : method === 'UPI' ? '📱' : '💵'} {method}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-2xl mb-4" style={{ background: 'rgba(248,245,255,0.8)' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#111111' }}>Order Summary</p>
          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between text-xs mb-1">
              <span style={{ color: '#6B6B8A' }}>{item.product.name} × {item.quantity}</span>
              <span style={{ color: '#111111' }}>₹{item.product.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 flex justify-between text-sm font-bold">
            <span style={{ color: '#111111' }}>Total</span>
            <span style={{ color: '#7B4BB7' }}>₹{total}</span>
          </div>
        </div>

        <button
          onClick={handlePlace}
          disabled={placing}
          className="w-full py-4 rounded-2xl text-white font-semibold transition-all active:scale-95 disabled:opacity-70"
          style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)' }}
        >
          {placing ? '⏳ Placing Order...' : 'Place Order ✨'}
        </button>
      </div>
    </div>
  );
};

const ShopScreen: React.FC = () => {
  const { products, cart, wishlist, addToCart, toggleWishlist, clearCart } = useShopStore();
  const { skinType, skinConcerns, glowPoints, addGlowPoints, hasFirstPurchase, setFirstPurchase } = useUserStore();

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const recommendations = getRecommendations(products, skinType, skinConcerns);
  const recommendedIds = new Set(recommendations.map((p) => p.id));

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'For My Skin') return recommendedIds.has(p.id);
    return p.category === activeCategory;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = useCallback((product: Product, qty = 1) => {
    for (let i = 0; i < qty; i++) addToCart(product);
  }, [addToCart]);

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setShowCart(false);
    if (!hasFirstPurchase) {
      addGlowPoints(25);
      setFirstPurchase();
    }
    clearCart();
    setOrderSuccess(true);
    setConfetti(true);
    setTimeout(() => setOrderSuccess(false), 4000);
  };

  return (
    <div className="mobile-container">
      <div className="screen-content overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="px-5 pt-12 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: '#111111' }}>Glow Shop 🛍️</h1>
            <p className="text-xs" style={{ color: '#6B6B8A' }}>Curated for your skin</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2.5 glass-card rounded-full"
            >
              <ShoppingCart size={20} style={{ color: '#7B4BB7' }} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-badge-bounce"
                  style={{ background: '#7B4BB7' }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Order Success Banner */}
        {orderSuccess && (
          <div className="mx-5 mb-4 p-4 rounded-2xl text-center" style={{ background: 'rgba(126,209,178,0.2)', border: '1px solid rgba(126,209,178,0.4)' }}>
            <p className="text-sm font-semibold" style={{ color: '#5B8A5B' }}>🎉 Order placed successfully! +25 GlowPoints earned!</p>
          </div>
        )}

        {/* Filter chips */}
        <div className="px-5 mb-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: activeCategory === cat ? '#7B4BB7' : 'rgba(255,255,255,0.75)',
                  color: activeCategory === cat ? 'white' : '#111111',
                  border: activeCategory === cat ? 'none' : '1px solid rgba(188,166,230,0.4)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Personalized Banner */}
        {skinType && (
          <div className="mx-5 mb-4 rounded-3xl p-4 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, rgba(123,75,183,0.12), rgba(188,166,230,0.2))' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#7B4BB7' }}>✨ Personalized for you</p>
            <p className="text-xs mb-3" style={{ color: '#6B6B8A' }}>
              Based on your <strong>{skinType}</strong> skin{skinConcerns.length > 0 ? ` & ${skinConcerns[0]}` : ''}
            </p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {recommendations.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="flex-shrink-0 glass-card rounded-2xl p-3 cursor-pointer"
                  style={{ width: 120 }}
                >
                  <div className={`h-16 bg-gradient-to-br ${p.gradient} rounded-xl flex items-center justify-center mb-2`}>
                    <span className="text-2xl">{p.icon}</span>
                  </div>
                  <p className="text-[10px] font-semibold truncate" style={{ color: '#111111' }}>{p.name}</p>
                  <p className="text-[10px]" style={{ color: '#7B4BB7' }}>₹{p.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="px-5 mb-6">
          <p className="text-sm font-semibold mb-3" style={{ color: '#111111' }}>
            {activeCategory === 'All' ? 'All Products' : activeCategory} ({filteredProducts.length})
          </p>
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                isRecommended={recommendedIds.has(product.id)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={toggleWishlist}
                onOpenDetail={setSelectedProduct}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, qty) => handleAddToCart(p, qty)}
          onToggleWishlist={toggleWishlist}
        />
      )}

      {showCart && !showCheckout && (
        <CartDrawer
          onClose={() => setShowCart(false)}
          onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      <Confetti trigger={confetti} onComplete={() => setConfetti(false)} />
      <BottomTabBar />
    </div>
  );
};

export default ShopScreen;
