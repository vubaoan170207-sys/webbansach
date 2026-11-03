import { Link, useParams } from 'react-router-dom';

import { useStore } from '../context/StoreContext';

export function ProductDetailPage() {
  const { bookId } = useParams();
  const { books, addToCart } = useStore();

  const book = books.find((entry) => entry.id === Number(bookId));

  if (!book) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
        Không tìm thấy sách này.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500">
        ← Quay lại danh mục
      </Link>

      <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_1.2fr]">
        <div className="overflow-hidden rounded-2xl">
          <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-6">
          <div>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {book.badge}
            </span>
            <h1 className="mt-4 text-3xl font-bold text-slate-800">{book.title}</h1>
            <p className="mt-2 text-lg text-slate-600">Tác giả: {book.author}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-indigo-600">{book.price.toLocaleString('vi-VN')}đ</span>
            <span className="text-lg text-slate-400 line-through">{book.oldPrice.toLocaleString('vi-VN')}đ</span>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">⭐ {book.rating}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{book.format}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{book.pages} trang</span>
          </div>

          <p className="text-base leading-7 text-slate-600">{book.description}</p>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => addToCart(book.id)}
              className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
            >
              Thêm vào giỏ hàng
            </button>
            <Link to="/catalog" className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
