// ========== DANH SÁCH SẢN PHẨM ==========
const products = [
  { id: 1, title: "Nước mắm 584 30°N (500ml)", price: 35000, img: "images/30n.jpg", desc: "Ngon đậm vị, thích hợp chấm và nấu." },
  { id: 2, title: "Nước mắm 584 35°N (500ml)", price: 45000, img: "images/35n.jpg", desc: "Đậm đà vị cá cơm truyền thống." },
  { id: 3, title: "Nước mắm nhĩ đặc biệt 40°N (500ml)-Bán chạy", price: 75000, img: "images/40n.jpg", desc: "Tinh túy giọt nhĩ đầu tiên." },
  { id: 4, title: "Nước mắm 584 Gold 60°N (200ml)", price: 60000, img: "images/60n.jpg", desc: "Dành cho bữa ăn sang trọng." },
  { id: 5, title: "Nước mắm 584 đại chúng 12°N (5l)-Đã hết", price: 50000, img: "images/12n.jpg", desc: "Cá cơm là đây." },
  { id: 6, title: "Nước mắm nhĩ thượng hạng 60°N (200ml)-Đang nhập hàng", price: 65000, img: "images/60db.jpg", desc: "Dành cho người sành ăn, vị mặn mà tự nhiên." },
  { id: 7, title: "Nước mắm 584 truyền thống 20°N (500ml)", price: 25000, img: "images/20n.jpg", desc: "Hương vị nhẹ, phù hợp nấu ăn hàng ngày." }
];

let cart = {};

// ========== HIỂN THỊ SẢN PHẨM ==========
function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <p><strong>${p.price.toLocaleString()}₫</strong></p>
      <button onclick="addToCart(${p.id})">Thêm vào giỏ</button>
    </div>
  `).join("");
}

// ========== GIỎ HÀNG WEB ==========
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  updateBadge();
  updateCartPopup();
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
    total += p.price * cart[k];
    return `
      <div class="cart-item">
        <strong>${p.title}</strong>
        <div>
          <span>Số lượng: ${cart[k]}</span>
          <button onclick="removeItem(${p.id})">Xóa</button>
        </div>
      </div>`;
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

// ========== GIỎ HÀNG MOBILE ==========
function toggleCart() {
  const popup = document.getElementById("cart-popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
  updateCartPopup();
}

function closeCart() {
  document.getElementById("cart-popup").style.display = "none";
}

function updateCartPopup() {
  const list = document.getElementById("cart-popup-items");
  const totalDisplay = document.getElementById("cart-popup-total");

  const ids = Object.keys(cart);
  if (ids.length === 0) {
    list.innerHTML = "<li>Chưa có sản phẩm</li>";
    totalDisplay.textContent = "0₫";
    return;
  }

  let total = 0;
  list.innerHTML = ids.map(k => {
    const p = products.find(x => x.id == k);
    total += p.price * cart[k];
    return `
      <li class="cart-item">
        <div>
          <strong>${p.title}</strong><br>
          <span>Số lượng: ${cart[k]}</span>
        </div>
        <button onclick="removeItem(${p.id})">Xóa</button>
      </li>`;
  }).join("");

  totalDisplay.textContent = total.toLocaleString() + "₫";
}

// ========== THANH TOÁN ==========
function openCheckout() {
  const ids = Object.keys(cart);
  if (ids.length === 0) return alert("Giỏ hàng trống!");
  document.getElementById("checkout-modal").style.display = "block";
}

function closeCheckout() {
  document.getElementById("checkout-modal").style.display = "none";
}

function confirmCheckout() {
  const name = document.getElementById("recipient-name").value.trim();
  const phone = document.getElementById("recipient-phone").value.trim();
  const address = document.getElementById("recipient-address").value.trim();

  if (!name || !phone || !address) {
    alert("⚠️ Vui lòng nhập đầy đủ thông tin giao hàng!");
    return;
  }

  alert(`✅ Cảm ơn ${name}! Đơn hàng của bạn sẽ được giao tới:\n${address}`);
  closeCheckout();
  clearCart();
}

// ========== KHỞI ĐỘNG ==========
function scrollToTop(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  updateBadge();
  updateCartPopup();
  document.getElementById("year").textContent = new Date().getFullYear();
});
