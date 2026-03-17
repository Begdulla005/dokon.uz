// app.js

// Mahsulotlar bazasi (hozircha statik, keyin backenddan olamiz)
const products = [
  { id: 1, name: "Samsung Galaxy A55", price: 4500000, stock: 12 },
  { id: 2, name: "AirPods Pro 2", price: 3800000, stock: 8 },
  { id: 3, name: "iPhone 15 Pro", price: 14000000, stock: 5 },
  { id: 4, name: "Simsiz quvvatlagich", price: 450000, stock: 20 },
  { id: 5, name: "USB-C kabel 2m", price: 120000, stock: 50 },
  // O'zingizning mahsulotlaringizni qo'shing
];

let cart = []; // savat massivi

// DOM elementlarni olish
const productSelect = document.getElementById('product-select'); // <select> yoki <input>
const addButton = document.getElementById('add-to-cart');
const cartItemsContainer = document.getElementById('cart-items');
const totalAmount = document.getElementById('total-amount');
const finishButton = document.getElementById('finish-sale');
// davomi...

// Mahsulotlarni datalist ga yuklash (qidiruv uchun)
function loadProducts() {
  const datalist = document.getElementById('product-list');
  datalist.innerHTML = '';
  products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.name;
    option.dataset.id = product.id;
    option.dataset.price = product.price;
    datalist.appendChild(option);
  });
}

// Savatni yangilash
function updateCart() {
  const container = document.getElementById('cart-items');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart">Savat bo\'sh</p>';
  } else {
    cart.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <div class="item-info">
          <span>${item.name}</span>
          <small>${item.price.toLocaleString()} so'm × ${item.quantity}</small>
        </div>
        <div class="item-actions">
          <button onclick="changeQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${index}, 1)">+</button>
          <button class="btn-remove" onclick="removeFromCart(${index})">O'chirish</button>
        </div>
      `;
      container.appendChild(itemDiv);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalAmount.textContent = total.toLocaleString() + " so'm";
}

// Miqdor o'zgartirish
window.changeQuantity = function(index, delta) {
  const newQty = cart[index].quantity + delta;
  if (newQty >= 1) {
    cart[index].quantity = newQty;
  } else {
    cart.splice(index, 1);
  }
  updateCart();
}

// O'chirish
window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCart();
}

// Qo'shish tugmasi
addButton.addEventListener('click', () => {
  const input = document.getElementById('product-select');
  const selectedName = input.value.trim();

  const selected = products.find(p => p.name === selectedName);
  if (!selected) {
    alert("Bunday mahsulot topilmadi!");
    return;
  }

  const existing = cart.find(item => item.id === selected.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...selected, quantity: 1 });
  }

  input.value = '';
  updateCart();
});

// Yakunlash (hozircha oddiy alert)
finishButton.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Savat bo'sh!");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  alert(`Sotuv yakunlandi!\nJami: ${total.toLocaleString()} so'm\nRahmat!`);
  cart = [];
  updateCart();
});

// Dastlab yuklash
loadProducts();
updateCart();