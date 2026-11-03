import { Link } from 'react-router-dom';

import { useStore } from '../context/StoreContext';

export function CartPage() {
  const { cartItems, subtotal, updateQuantity, removeFromCart, clearCart } = useStore();

  if (cartItems.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Giỏ hàng của bạn đang trống</h1>
        <p className="mt-3 text-slate-500">Hãy chọn thêm sách yêu thích để tiếp tục mua sắm.</p>
        <Link to="/catalog" className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500">
          Tìm sách ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Giỏ hàng</h1>
        <button type="button" onClick={clearCart} className="text-sm font-semibold text-rose-600 hover:text-rose-500">
          Xóa tất cả
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.8fr_0.8fr]">
        <div className="space-y-4">
          {cartItems.map(({ book, quantity }) => (
            <div key={book.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
              <img src={book.image} alt={book.title} className="h-28 w-24 rounded-2xl object-cover" />

              <div className="flex-1">
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{book.title}</h2>
                    <p className="text-sm text-slate-500">{book.author}</p>
                  </div>
                  <button type="button" onClick={() => removeFromCart(book.id)} className="text-sm font-semibold text-rose-600 hover:text-rose-500">
                    Xóa
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(book.id, quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-lg text-slate-700 hover:bg-slate-100"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center font-semibold text-slate-800">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(book.id, quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-lg text-slate-700 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-xl font-bold text-indigo-600">
                    {(book.price * quantity).toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Tổng đơn hàng</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>0đ</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-800">
              <span>Tổng cộng</span>
              <span>{subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
          <button type="button" className="mt-6 w-full rounded-full bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500">
            Thanh toán
          </button>
        </aside>
      </div>
    </div>
  );
}
