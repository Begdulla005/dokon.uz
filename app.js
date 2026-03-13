let products = JSON.parse(localStorage.getItem('dokon_pro_db')) || [
    { id: 1, name: "iPhone 15 Pro Max", price: 18500000, oldPrice: 20000000, category: "Telefon", image: "https://vsc-store.uz/wp-content/uploads/2023/10/iphone-15-pro-finish-select-202309-6-7-inch-natural-titanium.webp" }
];
let cart = JSON.parse(localStorage.getItem('dokon_cart')) || [];
let userLoggedIn = localStorage.getItem('user_phone') ? true : false;
let currentPhone = localStorage.getItem('user_phone') || "";

// --- SMS VA LOGIN ---
window.toggleLogin = () => document.getElementById('login-modal').classList.toggle('hidden');

window.sendSmsCode = function() {
    const phone = document.getElementById('user-phone').value;
    if(phone.length < 9) return alert("Raqamni to'liq kiriting!");
    
    currentPhone = phone;
    document.getElementById('step-phone').classList.add('hidden');
    document.getElementById('step-code').classList.remove('hidden');
    
    // Haqiqiy SMS xizmati bo'lmagani uchun demo kod: 7777
    console.log("Sizning tasdiqlash kodingiz: 7777");
    alert("Sizga tasdiqlash kodi yuborildi! (Demo kod: 7777)");
};

window.verifyCode = function() {
    const code = document.getElementById('sms-code').value;
    if(code === "7777") {
        userLoggedIn = true;
        localStorage.setItem('user_phone', currentPhone);
        alert("Ro'yxatdan o'tdingiz! Endi buyurtma berishingiz mumkin. ✅");
        toggleLogin();
        updateUI();
    } else {
        alert("Kod xato!");
    }
};

// --- TELEGRAM BUYURTMA ---
window.checkoutToTelegram = function() {
    if(cart.length === 0) return alert("Savat bo'sh!");
    
    // Ruxsatni tekshirish
    if(!userLoggedIn) {
        alert("Buyurtma berish uchun avval ro'yxatdan o'ting!");
        toggleLogin();
        return;
    }

    const botToken = "8626121351:AAG0DsSYyPHDoFerOMgRcv_W04Wc3_umaFI";
    const chatId = "5579963983";
    
    let text = `🛍 YANGI BUYURTMA!\n\n`;
    text += `👤 Mijoz: +998 ${currentPhone}\n`;
    text += `📱 Telegram Username: @${currentPhone} (Identifikator)\n`;
    text += `━━━━━━━━━━━━━━━\n`;
    cart.forEach(i => text += `🔹 ${i.name} (${i.qty} ta)\n`);
    text += `━━━━━━━━━━━━━━━\n`;
    text += `💰 JAMI: ${document.getElementById('cart-total').innerText}\n`;
    text += `✅ Holati: Ro'yxatdan o'tgan mijoz`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`)
    .then(() => {
        alert("Buyurtmangiz qabul qilindi! ✅");
        cart = [];
        localStorage.setItem('dokon_cart', JSON.stringify(cart));
        toggleCartModal();
        updateUI();
    });
};

// --- QIDIRUV VA UI ---
window.smartSearch = function(val) {
    const dropdown = document.getElementById('search-dropdown');
    const input = val.toLowerCase().trim();
    if (input.length < 2) { dropdown.classList.add('hidden'); return; }

    const results = products.filter(p => p.name.toLowerCase().includes(input)).slice(0, 5);
    if (results.length > 0) {
        dropdown.classList.remove('hidden');
        dropdown.innerHTML = results.map(p => `
            <div onclick="quickView(${p.id})" class="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b">
                <img src="${p.image}" class="w-10 h-10 rounded-lg object-cover">
                <div class="flex-1 text-xs font-bold">${p.name}</div>
            </div>
        `).join('') + `<p class="p-2 text-center text-[9px] text-purple-400 italic">AI Search ✨</p>`;
    }
};

window.quickView = (id) => {
    const p = products.find(x => x.id === id);
    render([p]);
    document.getElementById('search-dropdown').classList.add('hidden');
    scrollToProducts();
};

function render(displayItems = null) {
    const grid = document.getElementById('product-grid');
    const catBar = document.getElementById('category-bar');
    const items = displayItems || products;

    const cats = ["Barchasi", ...new Set(products.map(p => p.category))];
    catBar.innerHTML = cats.map(c => `<button onclick="filterBy('${c}')" class="px-5 py-2 rounded-2xl text-xs font-black bg-white shadow-sm">${c}</button>`).join('');

    grid.innerHTML = items.map(p => `
        <div class="bg-white rounded-[24px] p-3 hover:shadow-xl transition-all">
            <img src="${p.image}" class="h-32 w-full object-cover rounded-xl mb-2">
            <h3 class="text-[10px] font-bold h-7 line-clamp-2">${p.name}</h3>
            <p class="text-xs font-black text-gray-900 mt-2">${parseInt(p.price).toLocaleString()} so'm</p>
            <button onclick="addToCart(${p.id})" class="w-full mt-3 py-2 rounded-xl border border-[#7000ff] text-[#7000ff] text-[10px] font-bold hover:bg-[#7000ff] hover:text-white">Savatga</button>
        </div>
    `).join('');
    updateUI();
}

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
    if(userLoggedIn) document.getElementById('login-text').innerText = "Profil";
    
    document.getElementById('cart-items').innerHTML = cart.map((c, i) => `
        <div class="flex gap-4 items-center bg-gray-50 p-3 rounded-2xl">
            <img src="${c.image}" class="w-12 h-12 rounded-xl object-cover">
            <div class="flex-1 text-[11px] font-bold">${c.name}<br><span class="text-gray-400 font-normal">${c.qty} ta</span></div>
            <button onclick="removeFromCart(${i})" class="text-red-400">✕</button>
        </div>
    `).join('');
}

window.removeFromCart = (i) => { cart.splice(i, 1); localStorage.setItem('dokon_cart', JSON.stringify(cart)); updateUI(); };
window.toggleCartModal = () => document.getElementById('cart-modal').classList.toggle('hidden');
window.scrollToProducts = () => document.getElementById('product-grid').scrollIntoView({behavior:'smooth'});
window.filterBy = (c) => render(c === "Barchasi" ? products : products.filter(p => p.category === c));

render();