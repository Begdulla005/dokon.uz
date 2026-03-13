let products = JSON.parse(localStorage.getItem('dokon_pro_db')) || [
    { id: 1, name: "iPhone 15 Pro Max", price: 15000000, oldPrice: 17000000, category: "Telefonlar", image: "https://vsc-store.uz/wp-content/uploads/2023/10/iphone-15-pro-finish-select-202309-6-7-inch-natural-titanium.webp" }
];
let cart = JSON.parse(localStorage.getItem('dokon_cart')) || [];
let currentFilter = "Barchasi";

// 1. AQLLI QIDIRUV (AI MANTIQI)
window.smartSearch = function(val) {
    const dropdown = document.getElementById('search-dropdown');
    if (val.length < 2) { dropdown.style.display = 'none'; return; }

    // Ism yoki kategoriya bo'yicha qidirish
    const results = products.filter(p => 
        p.name.toLowerCase().includes(val.toLowerCase()) || 
        p.category.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 5); // Faqat top 5 natija

    if (results.length > 0) {
        dropdown.style.display = 'block';
        dropdown.innerHTML = results.map(p => `
            <div onclick="quickView(${p.id})" class="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition">
                <img src="${p.image}" class="w-10 h-10 rounded-lg object-cover">
                <div>
                    <p class="text-sm font-bold text-gray-800">${p.name}</p>
                    <p class="text-xs text-[#7000ff] font-bold">${parseInt(p.price).toLocaleString()} so'm</p>
                </div>
            </div>
        `).join('') + `<div class="p-3 text-center text-[10px] text-gray-400 uppercase font-bold">Barcha natijalarni ko'rish</div>`;
    } else {
        dropdown.innerHTML = `<div class="p-6 text-center text-gray-400 text-sm">Afsus, hech narsa topilmadi 😕</div>`;
    }
};

window.quickView = (id) => {
    const p = products.find(x => x.id === id);
    document.getElementById('search-input').value = p.name;
    document.getElementById('search-dropdown').style.display = 'none';
    render([p]); // Faqat o'sha mahsulotni ko'rsatish
};

// 2. MAHSULOTLARNI CHIQARISH
function render(displayItems = null) {
    const grid = document.getElementById('product-grid');
    const catBar = document.getElementById('category-bar');
    const items = displayItems || (currentFilter === "Barchasi" ? products : products.filter(p => p.category === currentFilter));

    // Kategoriya paneli
    const cats = ["Barchasi", ...new Set(products.map(p => p.category))];
    catBar.innerHTML = cats.map(c => `
        <button onclick="filterBy('${c}')" class="px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${currentFilter === c ? 'bg-[#7000ff] text-white' : 'bg-white text-gray-500 border border-gray-100'}">${c}</button>
    `).join('');

    // Mahsulot kartasi
    grid.innerHTML = items.map(p => `
        <div class="bg-white rounded-2xl p-3 border border-transparent hover:border-gray-200 hover:shadow-lg transition-all group">
            <div class="h-40 rounded-xl overflow-hidden bg-gray-50 mb-3 relative">
                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <button class="absolute top-2 right-2 bg-white/80 backdrop-blur w-8 h-8 rounded-full shadow text-sm">❤️</button>
            </div>
            <h3 class="text-xs font-medium h-8 line-clamp-2 mb-2">${p.name}</h3>
            <div class="flex flex-col mb-3">
                ${p.oldPrice ? `<span class="text-[10px] text-gray-400 line-through">${parseInt(p.oldPrice).toLocaleString()}</span>` : ''}
                <span class="text-sm font-black text-gray-900">${parseInt(p.price).toLocaleString()} so'm</span>
            </div>
            <button onclick="addToCart(${p.id})" class="w-full py-2 rounded-xl border border-[#7000ff] text-[#7000ff] font-bold text-[10px] hover:bg-[#7000ff] hover:text-white transition active:scale-95">Savatga</button>
        </div>
    `).join('');
    updateUI();
}

// 3. ADMIN: SAQLASH VA TOZALASH
window.saveProduct = function() {
    const n = document.getElementById('p-name').value;
    const pr = document.getElementById('p-price').value;
    const op = document.getElementById('p-old-price').value;
    const cat = document.getElementById('p-category').value;
    const img = document.getElementById('p-image').value;

    if(!n || !pr) return alert("Nom va narxni yozing!");

    products.push({ id: Date.now(), name: n, price: pr, oldPrice: op, category: cat, image: img });
    localStorage.setItem('dokon_pro_db', JSON.stringify(products));
    
    // Tozalash
    ['p-name', 'p-price', 'p-old-price', 'p-category', 'p-image'].forEach(id => document.getElementById(id).value = "");
    
    render();
    toggleAdmin();
};

// 4. BOT VA SAVAT
window.checkoutToTelegram = function() {
    if(cart.length === 0) return;
    const botToken = "8626121351:AAG0DsSYyPHDoFerOMgRcv_W04Wc3_umaFI";
    const chatId = "5579963983";

    let text = "🛍 YANGI BUYURTMA:\n\n";
    cart.forEach(i => text += `🔹 ${i.name} (${i.qty} ta)\n`);
    text += `\n💰 JAMI: ${document.getElementById('cart-total').innerText}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`)
    .then(() => {
        alert("Buyurtma yuborildi! ✅");
        cart = [];
        localStorage.setItem('dokon_cart', JSON.stringify(cart));
        toggleCartModal();
        updateUI();
    });
};

// Yordamchi funksiyalar
window.addToCart = (id) => {
    const item = products.find(p => p.id === id);
    const has = cart.find(c => c.id === id);
    if(has) has.qty++; else cart.push({...item, qty: 1});
    localStorage.setItem('dokon_cart', JSON.stringify(cart));
    updateUI();
};

function updateUI() {
    document.getElementById('cart-count').innerText = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('cart-total').innerText = total.toLocaleString() + " so'm";
    
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = cart.map((c, i) => `
        <div class="flex gap-4 items-center bg-gray-50 p-3 rounded-2xl">
            <img src="${c.image}" class="w-12 h-12 rounded-lg object-cover">
            <div class="flex-1 text-xs">
                <p class="font-bold">${c.name}</p>
                <p>${parseInt(c.price).toLocaleString()} x ${c.qty}</p>
            </div>
            <button onclick="removeFromCart(${i})" class="text-red-400">✕</button>
        </div>
    `).join('');
}

window.removeFromCart = (i) => { cart.splice(i, 1); localStorage.setItem('dokon_cart', JSON.stringify(cart)); updateUI(); };
window.toggleAdmin = () => document.getElementById('admin-panel').classList.toggle('hidden');
window.toggleCartModal = () => document.getElementById('cart-modal').classList.toggle('hidden');
window.filterBy = (c) => { currentFilter = c; render(); };
window.scrollToProducts = () => document.getElementById('product-section').scrollIntoView({behavior:'smooth'});

render();