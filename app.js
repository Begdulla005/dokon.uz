let products = JSON.parse(localStorage.getItem('uzum_db_vfinal')) || [];
let cart = JSON.parse(localStorage.getItem('uzum_cart')) || [];
let currentFilter = "Barchasi";

// 1. BANNER TUGMASI UCHUN SKROLL FUNKSIYASI
window.scrollToProducts = function() {
    document.getElementById('product-section').scrollIntoView({ behavior: 'smooth' });
};

// 2. RENDER - MAHSULOTLARNI CHIQARISH
function render(displayProducts = null) {
    const grid = document.getElementById('product-grid');
    const catBar = document.getElementById('category-bar');
    
    if (!displayProducts) {
        displayProducts = currentFilter === "Barchasi" ? products : products.filter(p => p.category === currentFilter);
    }

    // Kategoriyalar (Uzum Market kabi filtrlar)
    const cats = ["Barchasi", ...new Set(products.map(p => p.category))];
    catBar.innerHTML = cats.map(c => `
        <button onclick="filterBy('${c}')" class="px-6 py-2.5 rounded-2xl text-[13px] font-bold transition-all whitespace-nowrap ${currentFilter === c ? 'bg-[#7000ff] text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100 hover:border-purple-200'}">
            ${c}
        </button>
    `).join('');

    // Mahsulot kartalari dizayni
    grid.innerHTML = displayProducts.map(p => {
        const skidka = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
        return `
        <div class="bg-white rounded-[32px] p-4 border border-transparent hover:border-purple-100 hover:shadow-2xl transition-all group relative cursor-pointer">
            ${skidka > 0 ? `<span class="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">-${skidka}%</span>` : ''}
            <div class="h-48 rounded-[24px] overflow-hidden bg-gray-50 mb-4">
                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" onerror="this.src='https://placehold.co/400x400?text=Rasm+Mavjud+Emas'">
            </div>
            <h3 class="text-[13px] font-semibold text-gray-800 h-10 line-clamp-2 mb-3 leading-snug">${p.name}</h3>
            <div class="flex flex-col mb-4">
                ${p.oldPrice ? `<span class="text-[11px] text-gray-400 line-through">${parseInt(p.oldPrice).toLocaleString()} so'm</span>` : ''}
                <span class="text-lg font-black text-gray-900">${parseInt(p.price).toLocaleString()} so'm</span>
            </div>
            <button onclick="addToCart(${p.id})" class="w-full bg-gray-50 text-gray-900 py-3 rounded-2xl font-black text-[11px] hover:bg-[#7000ff] hover:text-white transition-all active:scale-95 shadow-sm">
                Savatga
            </button>
        </div>
        `;
    }).join('');

    updateCartUI();
}

// 3. SAVAT VA BOT BILAN ISHLASH
window.addToCart = function(id) {
    const item = products.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) { existing.qty += 1; } else { cart.push({ ...item, qty: 1 }); }
    localStorage.setItem('uzum_cart', JSON.stringify(cart));
    updateCartUI();
};

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.reduce((s, i) => s + i.qty, 0);
    const cartItemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');

    let total = 0;
    cartItemsDiv.innerHTML = cart.length === 0 ? '<div class="text-center text-gray-400 py-10">Savat hali bo\'sh...</div>' : cart.map((item, index) => {
        total += item.price * item.qty;
        return `
            <div class="flex gap-4 items-center bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <img src="${item.image}" class="w-14 h-14 rounded-xl object-cover">
                <div class="flex-1">
                    <p class="text-[11px] font-bold line-clamp-1 text-gray-600">${item.name}</p>
                    <p class="text-sm font-black text-[#7000ff]">${parseInt(item.price).toLocaleString()} x ${item.qty}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-gray-300 hover:text-red-500 transition">✕</button>
            </div>
        `;
    }).join('');
    totalSpan.innerText = total.toLocaleString() + " so'm";
}

window.checkoutToTelegram = function() {
    if (cart.length === 0) return alert("Savat bo'sh!");
    const botToken = "8626121351:AAG0DsSYyPHDoFerOMgRcv_W04Wc3_umaFI"; 
    const chatId = "5300585671"; 

    let msg = `🚀 YANGI BUYURTMA!\n\n`;
    cart.forEach(p => msg += `📦 ${p.name}\n🔢 ${p.qty} ta — ${parseInt(p.price*p.qty).toLocaleString()} so'm\n\n`);
    msg += `💰 JAMI: ${cart.reduce((s, p) => s + (p.price*p.qty), 0).toLocaleString()} so'm`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(msg)}`)
    .then(() => {
        alert("Buyurtma qabul qilindi! ✅");
        cart = [];
        localStorage.setItem('uzum_cart', JSON.stringify(cart));
        toggleCartModal();
        updateCartUI();
    });
};

// 4. ADMIN FUNKSIYALARI
window.saveProduct = function() {
    const fields = {
        name: document.getElementById('p-name'),
        old: document.getElementById('p-old-price'),
        price: document.getElementById('p-price'),
        cat: document.getElementById('p-category'),
        img: document.getElementById('p-image')
    };

    if(!fields.name.value || !fields.price.value) return alert("Nom va narx shart!");

    products.push({ 
        id: Date.now(), 
        name: fields.name.value, 
        oldPrice: fields.old.value,
        price: fields.price.value, 
        category: fields.cat.value, 
        image: fields.img.value 
    });

    localStorage.setItem('uzum_db_vfinal', JSON.stringify(products));
    Object.values(fields).forEach(i => i.value = ""); // TOZALASH
    render();
    toggleAdmin();
};

window.filterBy = (c) => { currentFilter = c; render(); };
window.toggleCartModal = () => document.getElementById('cart-modal').classList.toggle('hidden');
window.toggleAdmin = () => document.getElementById('admin-panel').classList.toggle('hidden');
window.removeFromCart = (i) => { cart.splice(i, 1); localStorage.setItem('uzum_cart', JSON.stringify(cart)); updateCartUI(); };

document.addEventListener('DOMContentLoaded', render);