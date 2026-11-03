import { Link } from 'react-router-dom';

import { categoryMeta, books } from '../data/books';
import { useStore } from '../context/StoreContext';

export function HomePage() {
  const { addToCart } = useStore();
  const featuredBooks = books.slice(0, 6);

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-700 via-indigo-700 to-violet-700 p-8 text-white shadow-xl sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),transparent_40%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              Tuần lễ sách quốc tế
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Khám phá tri thức mới mỗi ngày</h1>
              <p className="max-w-xl text-base text-sky-100 sm:text-lg">
                Từ văn học, kinh tế đến kỹ năng sống và khoa học, BookHaven mang đến trải nghiệm đọc sách hiện đại, tiện lợi và đầy cảm hứng.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="rounded-full bg-white px-5 py-3 font-semibold text-sky-700 transition hover:bg-sky-50">
                Mua ngay
              </Link>
              <Link to="/catalog?category=kinh-te" className="rounded-full border border-white/40 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                Khám phá kinh tế
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredBooks.slice(0, 4).map((book) => (
              <div key={book.id} className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                <img src={book.image} alt={book.title} className="h-40 w-full rounded-xl object-cover" />
                <div className="mt-3">
                  <p className="text-sm text-sky-100">{book.author}</p>
                  <h2 className="mt-1 text-lg font-semibold text-white">{book.title}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Khám phá danh mục</h2>
          <Link to="/catalog" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Xem tất cả
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Object.entries(categoryMeta).map(([key, category]) => (
            <Link
              key={key}
              to={`/catalog?category=${key}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-indigo-400 hover:shadow-md"
            >
              <div className="mb-3 inline-flex rounded-xl bg-indigo-100 p-3 text-indigo-700">
                {key === 'van-hoc' && '📖'}
                {key === 'kinh-te' && '📈'}
                {key === 'ky-nang-song' && '🧠'}
                {key === 'khoa-hoc' && '🔬'}
                {key === 'trinh-tham' && '🕵️'}
                {key === 'thieu-nhi' && '🦄'}
              </div>
              <p className="font-semibold text-slate-800">{category.label}</p>
              <p className="mt-2 text-sm text-slate-500">{category.count} cuốn</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Sách nổi bật</h2>
          <Link to="/catalog" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Xem thêm
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredBooks.map((book) => (
            <article key={book.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img src={book.image} alt={book.title} className="h-64 w-full object-cover" />
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {book.badge}
                  </span>
                  <span className="text-sm font-medium text-slate-500">⭐ {book.rating}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{book.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{book.author}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-indigo-600">{book.price.toLocaleString('vi-VN')}đ</span>
                  <span className="text-sm text-slate-400 line-through">{book.oldPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/product/${book.id}`}
                    className="flex-1 rounded-full border border-indigo-600 px-4 py-2 text-center text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                  >
                    Chi tiết
                  </Link>
                  <button
                    type="button"
                    onClick={() => addToCart(book.id)}
                    className="flex-1 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    Thêm giỏ
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
