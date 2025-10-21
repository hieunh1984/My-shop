// ================== DỮ LIỆU SẢN PHẨM ==================
const products = [
  { id: 1, title: "Nước mắm 584 30°N", price: 35000, img: "img/nuocmam30.jpg", desc: "Đậm đà vị cá cơm truyền thống." },
  { id: 2, title: "Nước mắm 584 35°N", price: 45000, img: "img/nuocmam35.jpg", desc: "Ngon đậm vị, thích hợp chấm và nấu." },
  { id: 3, title: "Nước mắm nhĩ đặc biệt 40°N", price: 60000, img: "img/nuocmam40.jpg", desc: "Tinh túy giọt nhĩ đầu tiên." }
];

let cart = {}; // { id: quantity }

// ================== HIỂN THỊ SẢN PHẨM ==================
function renderProducts() {
  const list = document.getElementById("product-list");
  list.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <p><strong>${p.price.toLocaleString()}₫</strong></p>
      <button onclick="addToCart(${p.id})">Thêm vào giỏ</button>
    </div>
  `).join("");
}

// ================== GIỎ HÀNG (DESKTOP) ==================
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  updateBadge();
  updateCartPopup(); // ✅ cập nhật popup mobile
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    container.innerHTML = "<p>Chưa có sản phẩm trong giỏ.</p>";
    document.getElementById("cart-total").textContent = "0₫";
    return;
  }

  let total = 0;
  container.innerHTML = ids.map(k => {
    const p = products.find(x => x.id == k);
    const lineTotal = p.price * cart[k];
    total += lineTotal;
    return `
      <div class="cart-item">
        <div><strong>${p.title}</strong></div>
        <div class="cart-controls">
          <span>Số lượng: ${cart[k]}</span>
          <button onclick="removeItem(${p.id})">Xóa</button>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("cart-total").textContent = total.toLocaleString() + "₫";
}

function removeItem(id) {
  delete cart[id];
  renderCart();
  updateBadge();
  updateCartPopup();
}

function clearCart() {
  cart = {};
  renderCart();
  updateBadge();
  updateCartPopup();
}

function updateBadge() {
  const badge = document.querySelector(".cart-button .badge");
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);
}

// ================== GIỎ HÀNG MOBILE (POPUP) ==================
function toggleCart() {
  const popup = document.getElementById("cart-popup");
  const isVisible = popup.style.display === "block";
  popup.style.display = isVisible ? "none" : "block";
  updateCartPopup(); // ✅ luôn cập nhật khi mở
}

function closeCart() {
  document.getElementById("cart-popup").style.display = "none";
}

function updateCartPopup() {
  const container = document.getElementById("cart-popup-items");
  if (!container) return;

  const ids = Object.keys(cart);
  if (ids.length === 0) {
    container.innerHTML = "<p>Chưa có sản phẩm trong giỏ.</p>";
    return;
  }

  let total = 0;
  container.innerHTML = ids.map(k => {
    const p = products.find(x => x.id == k);
    total += p.price * cart[k];
    return `
      <div class="cart-item">
        <strong>${p.title}</strong>
        <div class="cart-controls">
          <span>Số lượng: ${cart[k]}</span>
          <button onclick="removeItem(${p.id})">Xóa</button>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML += `
    <hr>
    <p><strong>Tổng tiền:</strong> ${total.toLocaleString()}₫</p>
    <button onclick="openCheckout()">Mua hàng</button>
    <button onclick="clearCart()">Xóa giỏ hàng</button>
  `;
}

// ================== THANH TOÁN ==================
function openCheckout() {
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }
  document.getElementById("checkout-modal").classList.remove("hidden");
}

function closeCheckout() {
  document.getElementById("checkout-modal").classList.add("hidden");
}

function confirmCheckout() {
  const name = document.getElementById("recipient-name").value.trim();
  const phone = document.getElementById("recipient-phone").value.trim();
  const address = document.getElementById("recipient-address").value.trim();
  const time = document.getElementById("delivery-time").value;

  if (!name || !phone || !address) {
    alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
    return;
  }

  alert(`✅ Cảm ơn ${name}!\nĐơn hàng của bạn sẽ được giao tới:\n${address}\nThời gian: ${time || 'Sớm nhất có thể.'}`);
  closeCheckout();
  clearCart();
}

// ================== CHI TIẾT SẢN PHẨM ==================
function openDetail(id) {
  const product = products.find(p => p.id === id);
  const body = document.getElementById("detail-body");
  body.innerHTML = `
    <img src="${product.img}" alt="${product.title}">
    <h2>${product.title}</h2>
    <p>${product.desc}</p>
    <p><strong>${product.price.toLocaleString()}₫</strong></p>
    <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
  `;
  document.getElementById("detail-modal").classList.remove("hidden");
}

function closeDetail() {
  document.getElementById("detail-modal").classList.add("hidden");
}

// ================== KHỞI ĐỘNG ==================
function scrollToTop(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  updateBadge();
  updateCartPopup();
  document.getElementById("year").textContent = new Date().getFullYear();
});
