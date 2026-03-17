// BAZA
let products = JSON.parse(localStorage.getItem('dokon_p')) || [];
let sales = JSON.parse(localStorage.getItem('dokon_s')) || [];
let cart = [];

// 1. SAHIFALARNI ALMASHTIRISH (NAVIGATSIYA)
function switchTab(tabId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('nav-active'));
    
    document.getElementById('section-' + tabId).classList.remove('hidden');
    document.getElementById('btn-' + tabId).classList.add('nav-active');
    document.getElementById('page-title').innerText = tabId.toUpperCase();

    // Sahifa yuklanganda ma'lumotlarni yangilash
    if(tabId === 'dashboard') initDashboard();
    if(tabId === 'mahsulotlar') renderProducts();
    if(tabId === 'kassa') renderKassa();
    if(tabId === 'tarix') renderHistory();
    if(tabId === 'mijozlar') renderClients();
}

// 2. MAHSULOT QO'SHISH
function addNewProduct() {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    if(name && price) {
        products.push({ id: Date.now(), name, price: Number(price) });
        save();
        renderProducts();
        document.getElementById('p-name').value = '';
        document.getElementById('p-price').value = '';
    }
}

function renderProducts() {
    const list = document.getElementById('p-list');
    list.innerHTML = products.map(p => `
        <div class="bg-slate-800/40 p-5 rounded-2xl border border-white/5 flex justify-between items-center">
            <div><p class="font-bold text-white">${p.name}</p><p class="text-xs text-indigo-400 font-black">${p.price.toLocaleString()} so'm</p></div>
            <button onclick="delProduct(${p.id})" class="text-red-400 p-2 hover:bg-red-400/10 rounded-xl">🗑️</button>
        </div>
    `).join('');
}

function delProduct(id) {
    products = products.filter(p => p.id !== id);
    save();
    renderProducts();
}

// 3. KASSA MANTIQI
function renderKassa() {
    const select = document.getElementById('kassa-select');
    select.innerHTML = '<option value="">Mahsulotni tanlang...</option>' + 
        products.map(p => `<option value="${p.id}">${p.name} (${p.price} so'm)</option>`).join('');
}

function addToCart() {
    const id = document.getElementById('kassa-select').value;
    const product = products.find(p => p.id == id);
    if(product) {
        cart.push(product);
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const container = document.getElementById('kassa-cart');
    let total = 0;
    container.innerHTML = cart.map((p, i) => {
        total += p.price;
        return `<div class="bg-indigo-600/5 p-4 rounded-2xl border border-indigo-500/10 flex justify-between font-bold"><span>${p.name}</span><span class="text-indigo-400">${p.price.toLocaleString()}</span></div>`;
    }).join('');
    document.getElementById('kassa-total').innerText = total.toLocaleString();
}

function completeSale() {
    const client = document.getElementById('client-name').value || "Noma'lum";
    if(cart.length > 0) {
        const total = cart.reduce((sum, p) => sum + p.price, 0);
        sales.push({ id: Date.now(), client, total, date: new Date().toLocaleString(), items: cart.length });
        save();
        cart = [];
        updateCartDisplay();
        document.getElementById('client-name').value = '';
        alert("Sotuv muvaffaqiyatli bajarildi!");
    }
}

// 4. STATISTIKA VA CHART
function initDashboard() {
    document.getElementById('dash-total').innerText = sales.reduce((s, a) => s + a.total, 0).toLocaleString() + " so'm";
    document.getElementById('dash-sales').innerText = sales.length + " ta";
    document.getElementById('dash-products').innerText = products.length + " ta";
    document.getElementById('dash-clients').innerText = [...new Set(sales.map(s => s.client))].length + " ta";
}

function renderHistory() {
    document.getElementById('history-list').innerHTML = sales.map(s => `
        <div class="p-4 bg-slate-800/20 rounded-2xl border border-white/5 flex justify-between">
            <span><b>${s.client}</b> (${s.date})</span><span class="text-emerald-400 font-black">+${s.total.toLocaleString()}</span>
        </div>
    `).join('');
}

function save() {
    localStorage.setItem('dokon_p', JSON.stringify(products));
    localStorage.setItem('dokon_s', JSON.stringify(sales));
}

// CHART
const ctx = document.getElementById('mainChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Yak'], // Yakshanba qo'shildi!
        datasets: [{
            data: [20, 45, 28, 60, 42, 85, 110], // Statistikani sal "narmalniyroq" qildik
            borderColor: '#6366f1',
            borderWidth: 5,
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(99, 102, 241, 0.05)',
            pointRadius: 0
        }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }
});

// ILK YUKLANISH
initDashboard();