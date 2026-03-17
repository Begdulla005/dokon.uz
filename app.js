// Fake mahsulotlar bazasi
const products = [
  { id:1, name:"Samsung A55", price:5200000 },
  { id:2, name:"AirPods Pro", price:4200000 },
  { id:3, name:"iPhone 15", price:14800000 },
  { id:4, name:"Power Bank 20000", price:950000 },
];

let cart = [];

// DOM elementlari
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('nav a');

// Sahifa o'zgartirish
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const pageId = link.getAttribute('data-page');
    
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    // Agar dashboard bo'lsa grafikni chizish
    if (pageId === 'dashboard') drawChart();
  });
});

// Dashboard grafik
function drawChart() {
  const ctx = document.getElementById('salesChart')?.getContext('2d');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Du','Se','Cho','Pa','Ju','Sha','Ya'],
      datasets: [{
        label: 'Savdo (so\'m)',
        data: [3200000, 5800000, 4100000, 9200000, 11500000, 6800000, 8900000],
        borderColor: '#a78bfa',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(167,139,250,0.2)'
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

// Kassa funksiyalari
const productInput = document.getElementById('product-input');
const addBtn = document.getElementById('add-btn');
const cartItems = document.getElementById('cart-items');
const totalSum = document.getElementById('total-sum');
const finishBtn = document.getElementById('finish-btn');
const datalist = document.getElementById('product-list');

// Mahsulotlarni yuklash
function loadProducts() {
  datalist.innerHTML = '';
  products.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.name;
    datalist.appendChild(opt);
  });
}

function renderCart() {
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Savat bo\'sh</p>';
  } else {
    cart.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div>${item.name} × ${item.quantity}</div>
        <div>${(item.price * item.quantity).toLocaleString('uz-UZ')} so'm</div>
      `;
      cartItems.appendChild(div);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalSum.textContent = total.toLocaleString('uz-UZ') + " so'm";
}

addBtn.addEventListener('click', () => {
  const name = productInput.value.trim();
  const found = products.find(p => p.name === name);
  if (!found) return alert("Mahsulot topilmadi!");

  const exist = cart.find(c => c.id === found.id);
  if (exist) exist.quantity++;
  else cart.push({ ...found, quantity: 1 });

  productInput.value = '';
  renderCart();
});

finishBtn.addEventListener('click', () => {
  if (cart.length === 0) return alert("Savat bo'sh!");
  alert("Sotuv yakunlandi! Jami: " + totalSum.textContent);
  cart = [];
  renderCart();
});

// Boshlash
loadProducts();
renderCart();
if (document.getElementById('salesChart')) drawChart();