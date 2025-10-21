// ================== DỮ LIỆU SẢN PHẨM ==================
const products = [
  { id: 1, code: "60N", price: 55, title: "Nước mắm 584 60°N", img: "https://picsum.photos/id/1025/600/400", desc: "Chai 300ml - Đậm đặc, phù hợp nấu ăn và chấm." },
  { id: 2, code: "40N", price: 60, title: "Nước mắm 584 40°N", img: "https://picsum.photos/id/1011/600/400", desc: "Chai 500ml - Hương vị cân bằng, dùng ăn hàng ngày." },
  { id: 3, code: "35N", price: 45, title: "Nước mắm 584 35°N", img: "https://picsum.photos/id/1015/600/400", desc: "Chai 500ml - Vị nhẹ, phù hợp gia đình trẻ." },
  { id: 4, code: "30N", price: 35, title: "Nước mắm 584 30°N", img: "https://picsum.photos/id/1020/600/400", desc: "Chai 500ml - Giá hợp lý, dùng nấu canh, kho." },
  { id: 5, code: "25N", price: 28, title: "Nước mắm 584 25°N", img: "https://picsum.photos/id/1027/600/400", desc: "Chai 500ml - Vị nhẹ, giá tiết kiệm." },
  { id: 6, code: "20N", price: 22, title: "Nước mắm 584 20°N", img: "https://picsum.photos/id/1035/600/400", desc: "Chai 500ml - Dành cho nấu ăn, tiết kiệm." }
];

let cart = {}; // { id: qty }

function formatVND(n) {
  return new Intl.NumberFormat('vi-VN').format(n * 1000) + "₫";
}

// ================== HIỂN THỊ SẢN PHẨM ==================
function renderProducts() {
  const productListEl = document.getElementById("product-list");
  productListEl.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>Mã: <strong>${p.code}</strong></p>
      <p>Giá: <strong>${formatVND(p.price)}</strong></p>
      <div class="card-actions">
        <button class="button btn-detail" onclick="showDetail(${p.id})">Chi tiết</button>
        <button class="button btn-add" onclick="addToCart(event, ${p.id})">Thêm vào giỏ</button>
      </div>
    `;
    productListEl.appendChild(div);
  });
}

// ================== CHI TIẾT SẢN PHẨM ==================
function showDetail(id) {
  const p = products.find(x => x.id === id);
  const modal = document.getElementById("detail-modal");
  const body = document.getElementById("detail-body");
  body.innerHTML = `
    <div class="detail">
      <img src="${p.img}" alt="${p.title}">
      <div class="info">
        <h2>${p.title}</h2>
        <p><strong>Mã:</strong> ${p.code}</p>
        <p><strong>Giá:</strong> ${formatVND(p.price)}</p>
        <p>${p.desc}</p>
        <div style="margin-top:12px;">
          <input id="qty-${p.id}" type="number" min="1" value="1" style="width:80px;padding:6px;border-radius:6px;border:1px solid #ddd">
          <button class="button btn-add" onclick="addFromDetail(${p.id})">Thêm vào giỏ</button>
        </div>
      </div>
    </div>
  `;
  modal.classList.remove("hidden");
}

function closeDetail(e) {
  if (e && e.target && e.target.classList.contains('modal')) {
    document.getElementById("detail-modal").classList.add("hidden");
    return;
  }
  document.getElementById("detail-modal").classList.add("hidden");
}

function addFromDetail(id) {
  const qtyInput = document.getElementById(`qty-${id}`);
  const qty = parseInt(qtyInput.value) || 1;
  addToCart(null, id, qty);
  closeDetail();
}

// ================== GIỎ HÀNG ==================
function addToCart(event, id, qty = 1) {
  if (event) event.stopPropagation();
  cart[id] = (cart[id] || 0) + qty;
  renderCart();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

function clearCart() {
  cart = {};
  renderCart();
}

function renderCart() {
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  cartItemsEl.innerHTML = "";
  let total = 0;
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    cartItemsEl.innerHTML = "<p>Giỏ hàng trống.</p>";
  } else {
    ids.forEach(k => {
      const id = Number(k);
      const qty = cart[k];
      const p = products.find(x => x.id === id);
      const sub = p.price * qty;
      total += sub;

      const item = document.createElement("div");
      item.className = "cart-item";
      item.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <div class="meta">
          <strong>${p.title}</strong>
        </div>
        <div class="qty">
          <button onclick="changeQty(${id}, -1)">-</button>
          <div>${qty}</div>
          <button onclick="changeQty(${id}, 1)">+</button>
        </div>
        <div class="cart-actions">
          <button class="button btn-del" onclick="removeFromCart(${id})">Xóa</button>
        </div>
      `;
      cartItemsEl.appendChild(item);
    });
  }

  cartTotalEl.textContent = formatVND(total);
  updateCartCount();
}

function removeFromCart(id) {
  delete cart[id];
  renderCart();
}

function updateCartCount() {
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const badge = document.querySelector(".cart-icon-mobile .badge");
  if (badge) {
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }
}

// ================== THANH TOÁN ==================
function openCheckout() {
  if (Object.keys(cart).length === 0) {
    alert("🛒 Giỏ hàng đang trống.");
    return;
  }
  document.getElementById("checkout-modal").classList.remove("hidden");
}

function closeCheckout(e) {
  if (e && e.target && e.target.classList.contains('modal')) {
    document.getElementById("checkout-modal").classList.add("hidden");
    return;
  }
  document.getElementById("checkout-modal").classList.add("hidden");
}

function confirmCheckout() {
  const name = document.getElementById("recipient-name").value.trim();
  const phone = document.getElementById("recipient-phone").value.trim();
  const address = document.getElementById("recipient-address").value.trim();
  const time = document.getElementById("delivery-time").value.trim();

  if (!name || !phone || !address) {
    alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
    return;
  }

  alert(`✅ Cảm ơn ${name}!\nĐơn hàng của bạn sẽ được giao tới:\n${address}\nThời gian: ${time || 'Sớm nhất có thể.'}`);
  closeCheckout();
  clearCart();
}

// ================== NÚT GIỎ HÀNG NỔI ==================
function toggleCart() {
  const popup = document.getElementById("cart-popup");
  const list = document.getElementById("cart-popup-items");
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    list.innerHTML = "<li>Chưa có sản phẩm</li>";
  } else {
    list.innerHTML = ids.map(k => {
      const p = products.find(x => x.id == k);
      return `<li>${p.title} × ${cart[k]}</li>`;
    }).join("");
  }
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

function closeCart() {
  document.getElementById("cart-popup").style.display = "none";
}

// ================== KHỞI ĐỘNG ==================
function scrollToTop(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  document.getElementById("year").textContent = new Date().getFullYear();
});
