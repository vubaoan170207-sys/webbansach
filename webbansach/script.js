/* =========================================================
   BOOKHAVEN JAVASCRIPT - MAIN CONTROLLER & STORE ENGINE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initFloatingBackground();
    initChatbot();
    initCartSystem();
    initGlobalSearch();
    initMobileNav();

    // Khởi tạo các trang đặc thù
    if (document.getElementById('cart-items-container')) {
        renderCartPage();
    }
    if (document.getElementById('flash-countdown')) {
        initFlashSaleCountdown();
    }
    if (document.getElementById('catalog-books-grid')) {
        initCatalogPage();
    }
    if (document.getElementById('tracking-result')) {
        initTrackingPage();
    }
    if (document.getElementById('auth-form-container')) {
        initAuthPage();
    }
});

/* =========================================
   1. BACKGROUND ĐỘNG (Dynamic Colorful Aurora & Floating Books)
   ========================================= */
function initFloatingBackground() {
    const bgContainer = document.getElementById('animated-bg');
    if (!bgContainer) return;

    // Tạo các quả cầu phát sáng chuyển động (Aurora Glow Orbs)
    bgContainer.innerHTML = `
        <div class="ambient-orb orb-1"></div>
        <div class="ambient-orb orb-2"></div>
        <div class="ambient-orb orb-3"></div>
        <div class="ambient-orb orb-4"></div>
    `;

    const icons = [
        'fa-book', 'fa-book-open', 'fa-file-alt', 'fa-bookmark', 
        'fa-scroll', 'fa-star', 'fa-feather-alt', 'fa-wand-magic-sparkles'
    ];

    const gradients = [
        'linear-gradient(135deg, #3b82f6, #8b5cf6)', // Xanh dương - Tím
        'linear-gradient(135deg, #ec4899, #f43f5e)', // Hồng sen - Đỏ san hô
        'linear-gradient(135deg, #f59e0b, #ef4444)', // Vàng cam - Đỏ cam
        'linear-gradient(135deg, #10b981, #06b6d4)', // Xanh ngọc - Xanh lam
        'linear-gradient(135deg, #6366f1, #a855f7)', // Indigo - Tím thạch anh
        'linear-gradient(135deg, #14b8a6, #3b82f6)'  // Teal - Lam
    ];

    const shadows = [
        'rgba(99, 102, 241, 0.35)',
        'rgba(236, 72, 153, 0.35)',
        'rgba(245, 158, 11, 0.35)',
        'rgba(16, 185, 129, 0.35)',
        'rgba(168, 85, 247, 0.35)'
    ];

    const numberOfBooks = 22;

    for (let i = 0; i < numberOfBooks; i++) {
        let iconEl = document.createElement('i');
        let randomIcon = icons[Math.floor(Math.random() * icons.length)];
        let randomGrad = gradients[Math.floor(Math.random() * gradients.length)];
        let randomShadow = shadows[Math.floor(Math.random() * shadows.length)];

        iconEl.className = `fas ${randomIcon} floating-book`;

        let leftPos = Math.random() * 96 + 2; // 2% đến 98%
        let size = Math.random() * 1.5 + 1.2; // 1.2rem - 2.7rem
        let duration = Math.random() * 10 + 14; // 14s - 24s
        let delay = Math.random() * 12; // 0s - 12s
        let opacity = Math.random() * 0.3 + 0.35; // 0.35 - 0.65 (màu sắc rõ nét và sinh động)

        iconEl.style.left = `${leftPos}vw`;
        iconEl.style.fontSize = `${size}rem`;
        iconEl.style.animationDuration = `${duration}s`;
        iconEl.style.animationDelay = `-${delay}s`;
        iconEl.style.background = randomGrad;
        iconEl.style.webkitBackgroundClip = 'text';
        iconEl.style.webkitTextFillColor = 'transparent';
        iconEl.style.opacity = `${opacity}`;
        iconEl.style.filter = `drop-shadow(0 4px 10px ${randomShadow})`;

        bgContainer.appendChild(iconEl);
    }

    // Hiệu ứng tương tác chuột nhẹ nhàng (Parallax nhẹ trên các quầng sáng)
    window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
        const orbs = bgContainer.querySelectorAll('.ambient-orb');
        orbs.forEach((orb, idx) => {
            const factor = (idx + 1) * 0.6;
            orb.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
        });
    });
}

/* =========================================
   2. TOAST NOTIFICATION SYSTEM
   ========================================= */
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = '0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

/* =========================================
   3. GIỎ HÀNG (Cart Management with LocalStorage)
   ========================================= */
const DEFAULT_CART = [
    { title: "Đắc Nhân Tâm", price: 75000, qty: 1, img: "📖", author: "Dale Carnegie" },
    { title: "Nhà Giả Kim", price: 65000, qty: 1, img: "📘", author: "Paulo Coelho" },
    { title: "Sapiens: Lược Sử Loài Người", price: 150000, qty: 1, img: "📙", author: "Yuval Noah Harari" }
];

function getCart() {
    const saved = localStorage.getItem('bookhaven_cart');
    if (!saved) {
        localStorage.setItem('bookhaven_cart', JSON.stringify(DEFAULT_CART));
        return DEFAULT_CART;
    }
    try {
        return JSON.parse(saved);
    } catch (e) {
        return DEFAULT_CART;
    }
}

function saveCart(cart) {
    localStorage.setItem('bookhaven_cart', JSON.stringify(cart));
    updateCartBadges();
}

function updateCartBadges() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const badges = document.querySelectorAll('.header-utils .cart .badge');
    badges.forEach(b => {
        b.textContent = totalCount;
    });
}

function initCartSystem() {
    updateCartBadges();
}

function addToCart(title, price, img = '📖', author = 'Tác giả BookHaven') {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.title.trim().toLowerCase() === title.trim().toLowerCase());

    if (existingIndex > -1) {
        cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1;
    } else {
        cart.push({ title, price: Number(price), qty: 1, img, author });
    }

    saveCart(cart);
    showToast(`Đã thêm "${title}" vào giỏ hàng!`);
}

function updateCartItemQty(index, change) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].qty = (cart[index].qty || 1) + change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
        showToast("Đã xóa sách khỏi giỏ hàng", "info");
    }
    saveCart(cart);
    renderCartPage();
}

function removeCartItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    showToast("Đã bỏ sản phẩm khỏi giỏ hàng", "info");
    renderCartPage();
}

let discountPercent = 0;

function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    const cart = getCart();
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const shippingEl = document.getElementById('cart-shipping');
    const totalEl = document.getElementById('cart-total');

    if (cart.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px;">
                    <i class="fas fa-shopping-basket" style="font-size: 3rem; color: #cbd5e0; margin-bottom: 15px; display: block;"></i>
                    <p style="font-size: 1.1rem; color: #718096; margin-bottom: 15px;">Giỏ hàng của bạn đang trống!</p>
                    <a href="danh-muc.html" class="btn-primary" style="text-decoration: none; display: inline-block;">Tiếp tục mua sách</a>
                </td>
            </tr>
        `;
        if (subtotalEl) subtotalEl.textContent = '0đ';
        if (discountEl) discountEl.textContent = '0đ';
        if (totalEl) totalEl.textContent = '0đ';
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * (item.qty || 1);
        subtotal += itemTotal;
        return `
            <tr>
                <td>
                    <div class="cart-item-info">
                        <div class="cart-item-icon">${item.img || '📖'}</div>
                        <div>
                            <strong style="color: #2d3748; font-size: 0.95rem;">${item.title}</strong>
                            <div style="font-size: 0.8rem; color: #718096;">${item.author || 'Tác giả BookHaven'}</div>
                        </div>
                    </div>
                </td>
                <td style="font-weight: 600; color: #4a5568;">${item.price.toLocaleString('vi-VN')}đ</td>
                <td>
                    <div class="qty-control">
                        <button onclick="updateCartItemQty(${index}, -1)">-</button>
                        <input type="text" value="${item.qty || 1}" readonly>
                        <button onclick="updateCartItemQty(${index}, 1)">+</button>
                    </div>
                </td>
                <td style="font-weight: 700; color: #ed8936;">${itemTotal.toLocaleString('vi-VN')}đ</td>
                <td>
                    <button onclick="removeCartItem(${index})" style="background:none; border:none; color:#e53e3e; cursor:pointer; font-size:1.1rem;" title="Xóa">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    const discountAmount = Math.round(subtotal * (discountPercent / 100));
    const shipping = subtotal > 300000 || subtotal === 0 ? 0 : 25000;
    const finalTotal = subtotal - discountAmount + shipping;

    if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString('vi-VN')}đ`;
    if (discountEl) discountEl.textContent = `-${discountAmount.toLocaleString('vi-VN')}đ (${discountPercent}%)`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')}đ`;
    if (totalEl) totalEl.textContent = `${finalTotal.toLocaleString('vi-VN')}đ`;
}

function applyVoucherCode() {
    const input = document.getElementById('coupon-input');
    if (!input) return;
    const code = input.value.trim().toUpperCase();

    if (code === 'BOOKHAVEN10' || code === 'BOOK10') {
        discountPercent = 10;
        showToast("Áp dụng mã giảm 10% thành công!");
    } else if (code === 'VIP20') {
        discountPercent = 20;
        showToast("Áp dụng mã VIP giảm 20% thành công!");
    } else if (code === 'FREESHIP') {
        discountPercent = 5;
        showToast("Áp dụng mã Freeship thành công!");
    } else {
        showToast("Mã giảm giá không hợp lệ hoặc đã hết hạn", "error");
        return;
    }
    renderCartPage();
}

function handleCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast("Giỏ hàng rỗng, vui lòng chọn sách trước!", "error");
        return;
    }
    showToast("Đặt hàng thành công! Mã đơn của bạn là: BH" + Math.floor(100000 + Math.random() * 900000));
    localStorage.removeItem('bookhaven_cart');
    setTimeout(() => {
        window.location.href = "tra-cuu-don-hang.html";
    }, 1500);
}

/* =========================================
   4. TÌM KIẾM TOÀN TRANG (Global Search)
   ========================================= */
function initGlobalSearch() {
    const searchBars = document.querySelectorAll('.search-bar');
    searchBars.forEach(bar => {
        const input = bar.querySelector('input');
        const button = bar.querySelector('button');

        const doSearch = () => {
            const query = input.value.trim();
            if (query) {
                window.location.href = `danh-muc.html?search=${encodeURIComponent(query)}`;
            }
        };

        if (button) button.addEventListener('click', (e) => {
            e.preventDefault();
            doSearch();
        });

        if (input) input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                doSearch();
            }
        });
    });
}

/* =========================================
   5. MOBILE NAVIGATION TOGGLE
   ========================================= */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.main-nav .menu');
    if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('show');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
}

/* =========================================
   6. CAROUSEL SLIDER (Trang Chủ)
   ========================================= */
function slideLeft(sliderId) {
    const slider = document.getElementById(sliderId);
    if (slider) slider.scrollBy({ left: -250, behavior: 'smooth' });
}

function slideRight(sliderId) {
    const slider = document.getElementById(sliderId);
    if (slider) slider.scrollBy({ left: 250, behavior: 'smooth' });
}

/* =========================================
   7. AI CHATBOT LỰA CHỌN SÁCH
   ========================================= */
const chatWidget = document.getElementById('chatbot');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const chatToggleIcon = document.getElementById('chat-toggle-icon');
let isChatOpen = false;

function initChatbot() {
    if (!chatWidget) return;
    chatWidget.classList.add('collapsed');

    setTimeout(() => {
        if (!isChatOpen) {
            toggleChat();
            appendMessage('bot', 'Xin chào! Tôi là trợ lý AI BookHaven. Bạn muốn tìm sách thể loại nào hay cần tư vấn sách hay hôm nay?');
        }
    }, 2500);
}

function toggleChat() {
    if (!chatWidget) return;
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        chatWidget.classList.remove('collapsed');
        if (chatToggleIcon) {
            chatToggleIcon.classList.remove('fa-chevron-up');
            chatToggleIcon.classList.add('fa-chevron-down');
        }
    } else {
        chatWidget.classList.add('collapsed');
        if (chatToggleIcon) {
            chatToggleIcon.classList.remove('fa-chevron-down');
            chatToggleIcon.classList.add('fa-chevron-up');
        }
    }
}

function appendMessage(sender, text) {
    if (!chatBody) return;
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(sender === 'bot' ? 'bot-msg' : 'user-msg');
    msgDiv.textContent = text;

    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendMessage() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    chatInput.value = '';

    setTimeout(() => {
        const lower = text.toLowerCase();
        let reply = "Tôi có thể giúp bạn tìm thêm các sách hot! Hãy xem qua mục Sách mới hoặc Bán chạy trên thanh menu nhé.";

        if (lower.includes('kinh tế') || lower.includes('kinh doanh') || lower.includes('tiền')) {
            reply = "Về Kinh tế & Tài chính, BookHaven gợi ý: 'Nghĩ Giàu Làm Giàu', 'Tâm Lý Học Về Tiền', và 'Chiến Tranh Tiền Tệ'.";
        } else if (lower.includes('văn học') || lower.includes('tiểu thuyết')) {
            reply = "Văn học đỉnh cao: 'Nhà Giả Kim', 'Rừng Na Uy', 'Cây Cam Ngọt Của Tôi' đang được rất nhiều bạn đọc yêu thích!";
        } else if (lower.includes('kỹ năng') || lower.includes('bản thân')) {
            reply = "Sách phát triển bản thân: 'Đắc Nhân Tâm', 'Nguyên Lý 80/20', 'Tuổi Trẻ Đáng Giá Bao Nhiêu' là lựa chọn tuyệt vời!";
        } else if (lower.includes('giá') || lower.includes('khuyến mãi') || lower.includes('sale')) {
            reply = "Đừng bỏ lỡ trang 'Khuyến mãi / Flash Sale' đang có mã giảm giá tới 50% và freeship cho đơn từ 300k bạn nhé!";
        }
        appendMessage('bot', reply);
    }, 800);
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

/* =========================================
   8. FLASH SALE COUNTDOWN & VOUCHER COPY
   ========================================= */
function initFlashSaleCountdown() {
    let duration = 24 * 3600 + 45 * 60; // 24 giờ 45 phút đếm ngược
    const hoursEl = document.getElementById('flash-hours');
    const minsEl = document.getElementById('flash-mins');
    const secsEl = document.getElementById('flash-secs');

    setInterval(() => {
        if (duration <= 0) duration = 24 * 3600;
        duration--;

        const h = Math.floor(duration / 3600);
        const m = Math.floor((duration % 3600) / 60);
        const s = duration % 60;

        if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
    }, 1000);
}

function copyVoucher(code) {
    navigator.clipboard.writeText(code).then(() => {
        showToast(`Đã sao chép mã "${code}" thành công!`);
    }).catch(() => {
        showToast(`Mã giảm giá: ${code}`);
    });
}

/* =========================================
   9. CATALOG FILTER LOGIC (danh-muc.html)
   ========================================= */
function initCatalogPage() {
    const params = new URLSearchParams(window.location.search);
    const searchKeyword = params.get('search');
    const categoryFilter = params.get('cat');
    const originFilter = params.get('origin');
    const formatFilter = params.get('format');

    const heading = document.getElementById('catalog-title');
    if (searchKeyword && heading) {
        heading.textContent = `Kết quả tìm kiếm cho: "${searchKeyword}"`;
    } else if (categoryFilter && heading) {
        const catMap = {
            'van-hoc': 'Sách Văn Học',
            'kinh-te': 'Sách Kinh Tế & Kinh Doanh',
            'ky-nang-song': 'Sách Kỹ Năng Sống'
        };
        heading.textContent = catMap[categoryFilter] || 'Danh Mục Sách';
    }

    // Lắng nghe sự kiện đổi bộ lọc
    const checkboxes = document.querySelectorAll('.filter-option input');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', filterBooks);
    });

    const sortSelect = document.getElementById('sort-books');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortBooks);
    }
}

function filterBooks() {
    const selectedCats = Array.from(document.querySelectorAll('.filter-category:checked')).map(cb => cb.value);
    const selectedFormats = Array.from(document.querySelectorAll('.filter-format:checked')).map(cb => cb.value);
    const books = document.querySelectorAll('.catalog-book-item');

    let visibleCount = 0;
    books.forEach(card => {
        const cat = card.getAttribute('data-cat') || '';
        const format = card.getAttribute('data-format') || '';

        const catMatch = selectedCats.length === 0 || selectedCats.includes(cat);
        const formatMatch = selectedFormats.length === 0 || selectedFormats.includes(format);

        if (catMatch && formatMatch) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    const countEl = document.getElementById('books-count');
    if (countEl) countEl.textContent = `Hiển thị ${visibleCount} cuốn sách`;
}

function sortBooks() {
    const select = document.getElementById('sort-books');
    if (!select) return;
    const value = select.value;
    const grid = document.getElementById('catalog-books-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.catalog-book-item'));

    cards.sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price') || '0', 10);
        const priceB = parseInt(b.getAttribute('data-price') || '0', 10);
        const ratingA = parseFloat(a.getAttribute('data-rating') || '0');
        const ratingB = parseFloat(b.getAttribute('data-rating') || '0');

        if (value === 'price-asc') return priceA - priceB;
        if (value === 'price-desc') return priceB - priceA;
        if (value === 'rating') return ratingB - ratingA;
        return 0; // Mặc định
    });

    cards.forEach(card => grid.appendChild(card));
}

/* =========================================
   10. ORDER TRACKING LOGIC (tra-cuu-don-hang.html)
   ========================================= */
function initTrackingPage() {
    // Sẵn sàng nhận lệnh tra cứu
}

function lookupOrder() {
    const input = document.getElementById('order-search-input');
    const resultBox = document.getElementById('tracking-result');
    if (!input || !resultBox) return;

    const code = input.value.trim().toUpperCase();
    if (!code) {
        showToast("Vui lòng nhập mã đơn hàng hoặc số điện thoại!", "error");
        return;
    }

    resultBox.style.display = 'block';
    const codeDisplay = document.getElementById('display-order-code');
    if (codeDisplay) codeDisplay.textContent = code;

    showToast(`Đã tìm thấy đơn hàng: ${code}`);
}

/* =========================================
   11. AUTH CONTROLLER (tai-khoan.html)
   ========================================= */
function initAuthPage() {
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            if (loginForm) loginForm.style.display = 'block';
            if (registerForm) registerForm.style.display = 'none';
        });

        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'block';
        });
    }
}

function handleLogin(e) {
    if (e) e.preventDefault();
    const emailInput = document.getElementById('login-email');
    const email = emailInput ? emailInput.value : 'Khách hàng';
    showToast(`Chào mừng bạn trở lại, ${email}!`);
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1200);
}

function handleRegister(e) {
    if (e) e.preventDefault();
    showToast("Đăng ký tài khoản thành công! Bạn có thể mua hàng ngay bây giờ.");
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1200);
}

/* =========================================
   12. STORES & FAQ CONTROLLERS
   ========================================= */
function filterStores(city) {
    const cards = document.querySelectorAll('.store-card');
    const tabs = document.querySelectorAll('.city-tab-btn');

    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    cards.forEach(card => {
        if (city === 'all' || card.getAttribute('data-city') === city) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function toggleFaq(item) {
    const body = item.querySelector('.accordion-body');
    const icon = item.querySelector('.faq-icon');
    if (!body) return;

    const isOpen = body.style.display === 'block';
    body.style.display = isOpen ? 'none' : 'block';
    if (icon) {
        icon.className = isOpen ? 'fas fa-chevron-down faq-icon' : 'fas fa-chevron-up faq-icon';
    }
}