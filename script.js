// Danh sách sản phẩm
const products = [
  {
    id: 1,
    name: "Nước mắm 584 40°N",
    price: 95000,
    image: "https://i.imgur.com/twzK7Q5.jpg",
    desc: "Đậm đà vị truyền thống, cá cơm nguyên chất 40 độ đạm, hương thơm tự nhiên."
  },
  {
    id: 2,
    name: "Nước mắm 584 35°N",
    price: 75000,
    image: "https://i.imgur.com/tfFfVh4.jpg",
    desc: "Loại nước mắm phổ thông, thơm ngon, phù hợp mọi bữa ăn gia đình."
  },
  {
    id: 3,
    name: "Nước mắm 584 đặc biệt 45°N",
    price: 120000,
    image: "https://i.imgur.com/RMPsOMY.jpg",
    desc: "Được ủ chượp lâu năm, vị mặn mà, dùng chấm hải sản cực ngon."
  }
];

let cart = [];

// ========== HIỂN THỊ CHI TIẾT SẢN PHẨM ==========
function showDetail(id) {
  const product = products.find(p => p.id === id);
  const detailSection = document.getElementById("chitiet");
  const detailContent = document.getElementById("detail-content");

  detailContent.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p><strong>Giá:</strong> ${product.price.toLocaleString()}₫</p>
    <p>${product.desc}</p>
    <button onclick="addToCart(event, ${id})">Thêm vào giỏ</button>
  `;

  detailSection.classList.add("active");
  detailSection.classList.remove("hidden");
  window.scrollTo({ top: detailSection.offsetTop, behavior: "smooth" });
}

function closeDetail() {
  const detailSection = document.getElementById("chitiet");
  detailSection.classList.remove("active");
  detailSection.classList.add("hidden");
}

// ========== XỬ LÝ GIỎ HÀNG ==========
function addToCart(event, id) {
  event.stopPropagation(); // không mở chi tiết khi bấm nút
  const product = products.find(p => p.id === id);
  cart.push(product);
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    cartItems.innerHTML += `
      <div class="cart-item">
        <h4>${item.name}</h4>
        <p>${item.price.toLocaleString()}₫</p>
        <button onclick="removeFromCart(${index})">Xóa</button>
      </div>
    `;
  });

  cartCount.textContent = cart.length;
  cartTotal.textContent = `Tổng cộng: ${total.toLocaleString()}₫`;
}