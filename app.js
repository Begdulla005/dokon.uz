let products = JSON.parse(localStorage.getItem('p_data')) || [];
let sales = JSON.parse(localStorage.getItem('s_data')) || [];
let cart = [];

// SAHIFALARNI ALMASHTIRISH
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    
    document.getElementById('section-' + pageId).classList.remove('hidden');
    document.getElementById('btn-' + pageId).classList.add('active');
    document.getElementById('page-title').innerText = pageId.toUpperCase();

    if(pageId === 'dashboard') updateDashboard();
    if(pageId === 'mahsulotlar') renderProducts();
    if(pageId === 'kassa') renderKassa();
}

// MAHSULOTLAR
function addProduct() {
    const name = document.getElementById('new-p-name').value;
    const price = document.getElementById('new-p-price').value;
    if(name && price) {
        products.push({ id: Date.now(), name, price: Number(price) });
        save();
        renderProducts();
    }
}

function renderProducts() {
    const container = document.getElementById('product-list');
    container.innerHTML = products.map(p => `
        <div class="border p-4 rounded-2xl bg-gray-50 flex justify-between">
            <div><p class="font-bold">${p.name}</p><p class="text-purple-600 font-black">${p.price.toLocaleString()} so'm</p></div>
            <button onclick="delProd(${p.id})" class="text-red-400">🗑️</button>
        </div>
    `).join('');
}

// KASSA
function renderKassa() {
    const sel = document.getElementById('prod-select');
    sel.innerHTML = '<option value="">Mahsulotni tanlang...</option>' + 
        products.map(p => `<option value="${p.id}">${p.name} - ${p.price} so'm</option>`).join('');
}

function addToCart() {
    const id = document.getElementById('prod-select').value;
    const prod = products.find(p => p.id == id);
    if(prod) {
        cart.push(prod);
        updateCart();
    }
}

function updateCart() {
    const container = document.getElementById('cart-items');
    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price;
        return `<div class="p-3 bg-purple-50 rounded-lg flex justify-between font-semibold"><span>${item.name}</span><span>${item.price.toLocaleString()}</span></div>`;
    }).join('');
    document.getElementById('cart-total').innerText = total.toLocaleString() + " so'm";
}

function finishSale() {
    if(cart.length === 0) return alert("Savat bo'sh!");
    const total = cart.reduce((s, p) => s + p.price, 0);
    sales.push({ id: Date.now(), total, items: cart.length, date: new Date().toLocaleDateString() });
    save();
    cart = [];
    updateCart();
    alert("Sotuv bajarildi!");
    showPage('dashboard');
}

function updateDashboard() {
    const totalSum = sales.reduce((s, a) => s + a.total, 0);
    document.getElementById('stat-total').innerText = totalSum.toLocaleString() + " so'm";
    document.getElementById('stat-sales').innerText = sales.length + " ta";
}

function save() {
    localStorage.setItem('p_data', JSON.stringify(products));
    localStorage.setItem('s_data', JSON.stringify(sales));
}

// ILK YUKLANISH
updateDashboard();