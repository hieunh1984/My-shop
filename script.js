// ================== DỮ LIỆU SẢN PHẨM ==================
const products = [
  { id: 1, code: "60N", price: 55, title: "Nước mắm 584 60°N", img: "https://picsum.photos/id/1025/600/400", desc: "Chai 300ml - Đậm đặc, phù hợp nấu ăn và chấm." },
  { id: 2, code: "40N", price: 60, title: "Nước mắm 584 40°N", img: "https://picsum.photos/id/1011/600/400", desc: "Chai 500ml - Hương vị cân bằng, dùng ăn hàng ngày." },
  { id: 3, code: "35N", price: 45, title: "Nước mắm 584 35°N", img: "https://picsum.photos/id/1015/600/400", desc: "Chai 500ml - Vị nhẹ, phù hợp gia đình trẻ." },
  { id: 4, code: "30N", price: 35, title: "Nước mắm 584 30°N", img: "https://picsum.photos/id/1020/600/400", desc: "Chai 500ml - Giá hợp lý, dùng nấu canh, kho." },
  { id: 5, code: "25N", price: 28, title: "Nước mắm 584 25°N", img: "https://picsum.photos/id/1027/600/400", desc: "Chai 500ml - Vị nhẹ, giá tiết kiệm." },
  { id: 6, code: "20N", price: 22, title: "Nước mắm 584 20°N", img: "https://picsum.photos/id/1035/600/400", desc: "Chai 500ml - Dành cho nấu ăn, tiết kiệm." }
];

const productListEl = document.getElementById("product-list");
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

let cart = {}; // { id: qty }

function formatVND(n) {
  return new Intl.NumberFormat('vi-VN').format(n * 1000) + "₫";
}

// ================== HIỂN THỊ DANH SÁCH SẢN PHẨM ==================
function renderProducts() {
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
      const item = document.createElement("div");
      item.className = "cart-item";
      const sub = p.price * qty;
      total += sub;
      item.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <div class="meta">
          <strong>${p.title}</strong>
          <small>${formatVND(p.price)} × ${qty} = ${formatVND(sub)}</small>
        </div>
        <div class="qty">
          <button onclick="changeQty(${id}, -1)">-</button>
          <div>${qty}</div>
          <button onclick="changeQty(${id}, 1)">+</button>
        </div>
      `;
      cartItemsEl.appendChild(item);
    });
  }

  cartTotalEl.textContent = formatVND(total);
  cartCountEl.textContent = ids.reduce((s, k) => s + cart[k], 0);

  // Cập nhật badge giỏ hàng (trên mobile)
const badge = document.getElementById("cart-count-badge");
const totalItems = ids.reduce((s, k) => s + cart[k], 0);
cartCountEl.textContent = totalItems;
if (badge) {
  if (totalItems > 0) {
    badge.textContent = totalItems;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}
}

// ================== XUẤT HOÁ ĐƠN (canh lề như Go) ==================
function checkout() {
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    alert("🛒 Giỏ hàng đang trống.");
    return;
  }

  let total = 0;
  let lines = [];
  lines.push("================== HOÁ ĐƠN NƯỚC MẮM 584 =================");
  lines.push("Thời gian: " + new Date().toLocaleString());
  lines.push("---------------------------------------------------------");
  lines.push("Tên sản phẩm                 Giá Số lượng Thành tiền");
  lines.push("---------------------------------------------------------");

  ids.forEach(k => {
    const id = Number(k);
    const qty = cart[k];
    const p = products.find(x => x.id === id);
    const sub = p.price * qty;
    total += sub;

    // canh lề tương tự fmt.Fprintf
    const name = p.title.padEnd(25, " ");
    const price = (p.price + "k").padStart(7, " ");
    const qtyStr = (qty + " chai").padStart(8, " ");
    const subStr = (sub + "k").padStart(10, " ");
    lines.push(`${name}${price}${qtyStr}${subStr}`);
  });

  lines.push("---------------------------------------------------------");
  const vat = total * 0.08;
  const totalLast = total + vat;
  lines.push(`Tổng`.padEnd(40) + `${total}k`.padStart(10));
  lines.push(`VAT (8%)`.padEnd(40) + `${vat.toFixed(0)}k`.padStart(10));
  lines.push(`Tổng cộng`.padEnd(40) + `${totalLast.toFixed(0)}k`.padStart(10));
  lines.push("---------------------------------------------------------");
  lines.push("Cảm ơn quý khách đã mua hàng ❤️");
  lines.push("=========================================================");

  const blob = new Blob([lines.join("\r\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hoadon584.txt";
  a.click();
  URL.revokeObjectURL(url);
}

// ================== KHỞI ĐỘNG ==================
renderProducts();
renderCart();
// Mở modal mua hàng
function openCheckout() {
  if(Object.keys(cart).length === 0) {
    alert("🛒 Giỏ hàng đang trống.");
    return;
  }
  document.getElementById("checkout-modal").classList.remove("hidden");
}

// Đóng modal
function closeCheckout(e) {
  if(e && e.target && e.target.classList.contains('modal')) {
    document.getElementById("checkout-modal").classList.add("hidden");
    return;
  }
  document.getElementById("checkout-modal").classList.add("hidden");
}

// Xác nhận mua hàng và xuất TXT
function confirmCheckout() {
  const name = document.getElementById("recipient-name").value.trim();
  const phone = document.getElementById("recipient-phone").value.trim();
  const address = document.getElementById("recipient-address").value.trim();
  const time = document.getElementById("delivery-time").value.trim();

  if(!name || !phone || !address || !time){
    alert("Vui lòng điền đầy đủ thông tin giao hàng!");
    return;
  }

  const ids = Object.keys(cart);
  let total = 0;
  let lines = [];
  lines.push("================== HOÁ ĐƠN NƯỚC MẮM 584 =================");
  lines.push("Thời gian đặt: " + new Date().toLocaleString());
  lines.push("---------------------------------------------------------");
  lines.push(`Người nhận: ${name}`);
  lines.push(`SĐT: ${phone}`);
  lines.push(`Địa chỉ: ${address}`);
  lines.push(`Thời gian giao: ${time}`);
  lines.push("---------------------------------------------------------");
  lines.push("Tên sản phẩm                 Giá Số lượng Thành tiền");
  lines.push("---------------------------------------------------------");

  ids.forEach(k => {
    const id = Number(k);
    const qty = cart[k];
    const p = products.find(x => x.id === id);
    const sub = p.price * qty;
    total += sub;

    const nameStr = p.title.padEnd(25," ");
    const priceStr = (p.price+"k").padStart(7," ");
    const qtyStr = (qty+" chai").padStart(8," ");
    const subStr = (sub+"k").padStart(10," ");
    lines.push(`${nameStr}${priceStr}${qtyStr}${subStr}`);
  });

  lines.push("---------------------------------------------------------");
  const vat = total * 0.08;
  const totalLast = total + vat;
  lines.push(`Tổng`.padEnd(40) + `${total}k`.padStart(10));
  lines.push(`VAT (8%)`.padEnd(40) + `${vat.toFixed(0)}k`.padStart(10));
  lines.push(`Tổng cộng`.padEnd(40) + `${totalLast.toFixed(0)}k`.padStart(10));
  lines.push("---------------------------------------------------------");
  lines.push("Cảm ơn quý khách đã mua hàng ❤️");
  lines.push("=========================================================");

  const blob = new Blob([lines.join("\r\n")], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hoadon584.txt";
  a.click();
  URL.revokeObjectURL(url);

  cart = {}; // reset giỏ
  renderCart();
  closeCheckout();
}