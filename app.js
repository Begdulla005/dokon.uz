// ... oldingi products massivi saqlanadi ...

let cart = [];
let selectedPayment = 'naqd';

// DOM
const productInput = document.getElementById('product-input');
const addBtn = document.getElementById('add-btn');
const cartItemsDiv = document.getElementById('cart-items');
const totalSumEl = document.getElementById('total-sum');
const finishBtn = document.getElementById('finish-btn');
const discountInput = document.getElementById('discount-input');
const errorToast = document.getElementById('error-toast');
const errorMsg = document.getElementById('error-message');
const receiptModal = document.getElementById('receipt-modal');
const receiptContent = document.getElementById('receipt-content');
const receiptTotal = document.getElementById('receipt-total');
const closeReceipt = document.getElementById('close-receipt');

// ... loadProductsToDatalist() funksiyasi oldingidek ...

function renderCart() {
  cartItemsDiv.innerHTML = '';
  const emptyMsg = document.querySelector('.empty-message');

  if (cart.length === 0) {
    emptyMsg.classList.remove('hidden');
    totalSumEl.textContent = '0 so\'m';
    return;
  }

  emptyMsg.classList.add('hidden');

  let subtotal = 0;
  cart.forEach((item, i) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const div = document.createElement('div');
    div.className = 'cart-item flex justify-between items-center py-4 border-b border-gray-700/30 animate-fade-in';
    div.innerHTML = `
      <div>
        <div class="font-medium">${item.name}</div>
        <div class="text-sm text-gray-400">${item.price.toLocaleString('uz-UZ')} so'm × ${item.quantity}</div>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex gap-2">
          <button onclick="changeQty(${i}, -1)" class="w-9 h-9 bg-gray-700/70 rounded-lg hover:bg-gray-600 transition">-</button>
          <span class="w-10 text-center pt-1.5">${item.quantity}</span>
          <button onclick="changeQty(${i}, 1)" class="w-9 h-9 bg-gray-700/70 rounded-lg hover:bg-gray-600 transition">+</button>
        </div>
        <span class="font-medium w-28 text-right">${itemTotal.toLocaleString('uz-UZ')} so'm</span>
        <button onclick="removeItem(${i})" class="text-red-400 hover:text-red-300 transition">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });

  // Chegirma hisoblash
  let discountValue = 0;
  const discStr = discountInput.value.trim();
  if (discStr) {
    if (discStr.endsWith('%')) {
      const perc = parseFloat(discStr);
      if (!isNaN(perc)) discountValue = subtotal * (perc / 100);
    } else {
      const sum = parseFloat(discStr);
      if (!isNaN(sum)) discountValue = sum;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountValue);
  totalSumEl.textContent = finalTotal.toLocaleString('uz-UZ') + " so'm";
}

// ... changeQty, removeItem funksiyalari oldingidek, faqat renderCart() chaqirilsin ...

addBtn.addEventListener('click', addToCart);
productInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addToCart();
  }
});

function addToCart() {
  // ... oldingi logika ...
  if (found) {
    // ... qo'shish ...
    renderCart();
    productInput.value = '';
    productInput.focus();
  } else {
    showError("Mahsulot topilmadi yoki noto'g'ri yozilgan!");
  }
}

finishBtn.addEventListener('click', () => {
  if (cart.length === 0) return showError("Savat bo'sh!");

  const total = parseFloat(totalSumEl.textContent.replace(/[^\d]/g, '')) || 0;

  // Receipt yaratish
  receiptContent.innerHTML = cart.map(item => `
    <div class="flex justify-between text-lg">
      <span>${item.name} × ${item.quantity}</span>
      <span>${(item.price * item.quantity).toLocaleString('uz-UZ')} so'm</span>
    </div>
  `).join('');

  if (discountInput.value.trim()) {
    receiptContent.innerHTML += `<div class="flex justify-between text-lg text-yellow-300 mt-2">
      <span>Chegirma (${discountInput.value})</span>
      <span>- ${/* hisoblangan chegirma */ (/*...*/).toLocaleString('uz-UZ')} so'm</span>
    </div>`;
  }

  receiptTotal.textContent = total.toLocaleString('uz-UZ') + " so'm";
  receiptModal.classList.remove('hidden');
});

closeReceipt.addEventListener('click', () => {
  receiptModal.classList.add('hidden');
  cart = [];
  discountInput.value = '';
  renderCart();
});

function showError(msg) {
  errorMsg.textContent = msg;
  errorToast.classList.remove('translate-y-32');
  setTimeout(() => errorToast.classList.add('translate-y-32'), 3500);
}

// Boshlash
loadProductsToDatalist();
renderCart();