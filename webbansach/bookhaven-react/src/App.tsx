import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';

import { StoreProvider, useStore } from './context/StoreContext';
import { CartPage } from './pages/CartPage';
import { CatalogPage } from './pages/CatalogPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';

function AppLayout() {
  const { cartCount } = useStore();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3 text-xl font-bold text-slate-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-lg text-white">B</span>
            BookHaven
          </NavLink>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-slate-600 transition hover:text-slate-800'}`}>
              Trang chủ
            </NavLink>
            <NavLink to="/catalog" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-slate-600 transition hover:text-slate-800'}`}>
              Danh mục
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-slate-600 transition hover:text-slate-800'}`}>
              Giỏ hàng
            </NavLink>
          </nav>

          <NavLink to="/cart" className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
            🛒 Giỏ hàng
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{cartCount}</span>
          </NavLink>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:bookId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800">BookHaven</h3>
            <p className="mt-2">Hệ thống nhà sách trực tuyến hiện đại, giúp bạn tiếp cận tri thức dễ dàng, nhanh chóng và đáng tin cậy.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Liên kết</h4>
            <ul className="mt-3 space-y-2">
              <li>Về chúng tôi</li>
              <li>Chính sách đổi trả</li>
              <li>Blog độc giả</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Hỗ trợ</h4>
            <ul className="mt-3 space-y-2">
              <li>Hotline: 1900 1234</li>
              <li>Email: support@bookhaven.vn</li>
              <li>Địa chỉ: Hà Nội, Đà Nẵng, TP.HCM</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </StoreProvider>
  );
}
