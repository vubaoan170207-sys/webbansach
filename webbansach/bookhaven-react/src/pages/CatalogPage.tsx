import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useStore } from '../context/StoreContext';
import { categoryMeta } from '../data/books';

export function CatalogPage() {
  const { books, addToCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultCategory = searchParams.get('category') ?? 'all';
  const defaultQuery = searchParams.get('q') ?? '';
  const [sortBy, setSortBy] = useState('featured');

  const filteredBooks = useMemo(() => {
    const selectedCategory = defaultCategory === 'all' ? 'all' : defaultCategory;
    const query = defaultQuery.trim().toLowerCase();

    const result = books.filter((book) => {
      const nameMatches = !query || book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
      const categoryMatches = selectedCategory === 'all' || book.category === selectedCategory;
      return nameMatches && categoryMatches;
    });

    switch (sortBy) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating);
      default:
        return result;
    }
  }, [books, defaultCategory, defaultQuery, sortBy]);

  const updateFilters = (nextCategory: string, nextQuery: string) => {
    const params: Record<string, string> = {};
    if (nextQuery) {
      params.q = nextQuery;
    }
    if (nextCategory !== 'all') {
      params.category = nextCategory;
    }
    setSearchParams(params);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-900 p-8 text-white shadow-lg">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-300">BookHaven</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Tất cả danh mục sách</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Tìm kiếm</label>
              <input
                type="search"
                value={defaultQuery}
                onChange={(event) => updateFilters(defaultCategory, event.target.value)}
                placeholder="Nhập tên sách hoặc tác giả"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-500"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">Thể loại</p>
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => updateFilters('all', defaultQuery)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                    defaultCategory === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>Tất cả</span>
                  <span>{books.length}</span>
                </button>

                {Object.entries(categoryMeta).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateFilters(key, defaultQuery)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                      defaultCategory === key ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{value.label}</span>
                    <span>{value.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <p className="text-sm text-slate-600">
              Hiển thị <span className="font-semibold text-slate-800">{filteredBooks.length}</span> cuốn sách
            </p>
            <label className="flex items-center gap-3 text-sm text-slate-600">
              Sắp xếp
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-indigo-500"
              >
                <option value="featured">Nổi bật</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </label>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              Không tìm thấy sách phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredBooks.map((book) => (
                <article key={book.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <img src={book.image} alt={book.title} className="h-60 w-full object-cover" />
                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-indigo-700">
                        {book.badge}
                      </span>
                      <span className="text-xs text-slate-500">⭐ {book.rating}</span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{book.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{book.author}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-indigo-600">{book.price.toLocaleString('vi-VN')}đ</span>
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
          )}
        </div>
      </div>
    </div>
  );
}
