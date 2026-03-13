// Baza va AI Sozlamalari
const aiKeywords = {
    "telefon": ["iphone", "smart", "tel", "aloqa", "pro", "max", "samsung", "mi"],
    "naushnik": ["quloqchin", "airpods", "pro", "buds", "sound", "musiqa"]
};

let products = JSON.parse(localStorage.getItem('dokon_pro_db')) || [
    { id: 1, name: "iPhone 15 Pro Max", price: 18500000, oldPrice: 20000000, category: "Telefon", image: "https://vsc-store.uz/wp-content/uploads/2023/10/iphone-15-pro-finish-select-202309-6-7-inch-natural-titanium.webp" }
];
let cart = JSON.parse(localStorage.getItem('dokon_cart')) || [];
let currentFilter = "Barchasi";

// --- QIDIRUV VA AI ---
window.smartSearch = function(val) {
    const dropdown = document.getElementById('search-dropdown');
    const input = val.toLowerCase().trim();
    if (input.length < 2) { dropdown.style.display = 'none'; return; }

    let relatedTerms = [input];
    for (let key in aiKeywords) {
        if (key.includes(input) || aiKeywords[key].some(t => t.includes(input))) {
            relatedTerms.push(key, ...aiKeywords[key]);
        }
    }

    const results = products.filter(p => {
        const n = p.name.toLowerCase();
        const c = p.category.toLowerCase();
        return relatedTerms.some(t => n.includes(t) || c.includes(t));
    }).slice(0, 5);

    if (results.length > 0) {
        dropdown.style.display = 'block';
        dropdown.innerHTML = results.map(p => `
            <div onclick="quickView(${p.id})" class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                <img src="${p.image}" class="w-10 h-10 rounded-lg object-cover">
                <div class="flex-1">
                    <p class="text-xs font-bold">${p.name}</p>
                    <p class="text-[10px] text-[#7000ff] font-bold">${parseInt(p.price).toLocaleString()} so'm</p>
                </div>
            </div>
        `).join('') + `<p class="p-2 text-[9px] text-center text-purple-400">AI qidiruv tizimi ✨</p>`;
    } else {
        dropdown.innerHTML = `<p class="p-4 text-center text-xs text-gray-400">Hech narsa topilmadi</p>`;
    }
};

window.quickView = (id) => {
    const p = products.find(x => x.id === id);
    document.getElementById('search-input').value = p.name;
    document.getElementById('search-dropdown').style.display = 'none';
    render([p]);
    scrollToProducts();
};

// --- RENDER VA FILTR ---
function render(displayItems = null) {
    const grid = document.getElementById('product-grid');
    const catBar = document.getElementById('category-bar');
    const items = displayItems || (currentFilter === "Barchasi" ? products : products.filter(p => p.category === currentFilter));

    const cats = ["Barchasi", ...new Set(products.map(p => p.category))];
    catBar.innerHTML = cats.map(c => `
        <button onclick="filterBy('${c}')" class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${currentFilter === c ? 'bg-[#7000ff] text-white' : 'bg-white text-gray-500'}">${c}</button>
    `).join('');

    grid.innerHTML = items.map(p => `
        <div class="bg-white rounded-2xl p-2 hover:shadow-lg transition group">
            <div class="h-32 rounded-xl overflow-hidden bg-gray-50 mb-2">
                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-105 transition">
            </div>
            <h3 class="text-[10px] font-bold h-7 line-clamp-2">${p.name}</h3>
            <div class="mb-2">
                ${p.oldPrice ? `<span class="text-[8px] text-gray-400 line-through">${parseInt(p.oldPrice).toLocaleString()}</span>` : ''}
                <p class="text-xs font-black text-gray-900">${parseInt(p.price).toLocaleString()} so'm</p>
            </div>
            <button onclick="addToCart(${p.id})" class="w-full py-2 rounded-xl border border-[#7000ff] text-[#7000ff] font-bold text-[10px] hover:bg-[#7000ff] hover:text-white transition">Savatga</button>
        </div>
    `).join('');
    updateUI();
}

// --- SAVATCHA VA BOT ---
window.addToCart = (id) => {
    const item = products.find(p => p.id === id);
    const has = cart.find(c => c.id === id);
    if(has) has.qty++; else cart.push({...item, qty: 1});
    localStorage.setItem('dokon_cart', JSON.stringify(cart));
    updateUI();
};

window.checkoutToTelegram = function() {
    if(cart.length === 0) return alert("Savat bo'sh!");
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

function updateUI() {
    document.getElementById('cart-count').innerText = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('cart-total').innerText = total.toLocaleString() + " so'm";
    
    document.getElementById('cart-items').innerHTML = cart.map((c, i) => `
        <div class="flex gap-3 items-center bg-gray-50 p-2 rounded-xl">
            <img src="${c.image}" class="w-10 h-10 rounded-lg object-cover">
            <div class="flex-1 text-[10px]"><p class="font-bold">${c.name}</p><p>${c.qty} x ${parseInt(c.price).toLocaleString()}</p></div>
            <button onclick="removeFromCart(${i})" class="text-red-400">✕</button>
        </div>
    `).join('');
}

// --- ADMIN VA LOGIN ---
window.saveProduct = function() {
    const n = document.getElementById('p-name').value, pr = document.getElementById('p-price').value, op = document.getElementById('p-old-price').value, cat = document.getElementById('p-category').value, img = document.getElementById('p-image').value;
    if(!n || !pr) return alert("Xato!");
    products.push({ id: Date.now(), name: n, price: pr, oldPrice: op, category: cat, image: img });
    localStorage.setItem('dokon_pro_db', JSON.stringify(products));
    ['p-name', 'p-price', 'p-old-price', 'p-category', 'p-image'].forEach(id => document.getElementById(id).value = "");
    render(); toggleAdmin();
};

window.sendCode = () => { 
    const p = document.getElementById('user-phone').value;
    if(p.length < 9) return alert("Raqam xato!");
    alert("Kod yuborildi! (Demo)"); toggleLogin();
};

window.toggleAdmin = () => document.getElementById('admin-panel').classList.toggle('hidden');
window.toggleCartModal = () => document.getElementById('cart-modal').classList.toggle('hidden');
window.toggleLogin = () => document.getElementById('login-modal').classList.toggle('hidden');
window.filterBy = (c) => { currentFilter = c; render(); };
window.scrollToProducts = () => document.getElementById('product-section').scrollIntoView({behavior:'smooth'});
window.removeFromCart = (i) => { cart.splice(i, 1); localStorage.setItem('dokon_cart', JSON.stringify(cart)); updateUI(); };

render();