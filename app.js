// 1. XODIMLAR VA ROLLAR BAZASI
const STAFF = [
    { phone: "905040811", role: "ADMIN", name: "Siz" },
    { phone: "954512804", role: "HISOBCHI", name: "Shavkat" },
    { phone: "931533405", role: "OMBORCHI", name: "Samandar" }
];

let ordersDB = JSON.parse(localStorage.getItem('company_orders_db')) || [];
let productsDB = JSON.parse(localStorage.getItem('company_products_db')) || [];

// 2. PANELNI OCHISH VA ROLGA QARAB FILTRLASH
window.toggleAdminPanel = () => {
    const userPhone = localStorage.getItem('user_phone');
    const staffMember = STAFF.find(s => s.phone === userPhone);

    if (!staffMember) return alert("Siz xodimlar ro'yxatida yo'qsiz");

    const panel = document.getElementById('admin-panel');
    panel.classList.toggle('hidden');
    
    document.getElementById('user-role-display').innerText = `${staffMember.role}: ${staffMember.name}`;

    // --- ROLGA QARAB ELEMENTLARNI KO'RSATISH ---
    const stats = document.getElementById('section-stats');
    const addProd = document.getElementById('section-add-product');

    // ADMIN hamma narsani ko'radi
    if (staffMember.role === "ADMIN") {
        stats.classList.remove('hidden');
        addProd.classList.remove('hidden');
        renderFullLog();
    } 
    // HISOBCHI faqat pulni ko'radi
    else if (staffMember.role === "HISOBCHI") {
        stats.classList.remove('hidden');
        addProd.classList.add('hidden');
        renderFinanceLog();
    }
    // MENEJER faqat mahsulot qo'shadi
    else if (staffMember.role === "MENEJER") {
        stats.classList.add('hidden');
        addProd.classList.remove('hidden');
        renderOrderLog();
    }
};

// 3. MAHSULOTNI BAZAGA SAQLASH
window.saveProduct = () => {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const cat = document.getElementById('p-category').value;

    if(!name || !price) return alert("Ma'lumot to'liq emas!");

    const newProd = { id: Date.now(), name, price: parseInt(price), category: cat };
    productsDB.push(newProd);
    localStorage.setItem('company_products_db', JSON.stringify(productsDB));
    
    alert("Mahsulot menejer tomonidan bazaga qo'shildi!");
    location.reload();
};

// 4. BAZADAGI MA'LUMOTLARNI RENDER QILISH
function renderFullLog() {
    const log = document.getElementById('db-log-list');
    const total = ordersDB.reduce((s, o) => s + o.total, 0);
    
    document.getElementById('stat-income').innerText = total.toLocaleString() + " so'm";
    document.getElementById('stat-profit').innerText = (total * 0.15).toLocaleString() + " so'm"; // 15% foyda

    log.innerHTML = ordersDB.map(o => `
        <div class="bg-white p-6 rounded-[30px] shadow-sm flex justify-between items-center border-l-8 border-purple-500">
            <div>
                <p class="text-[10px] font-black text-gray-400">${o.date}</p>
                <h5 class="font-bold">Mijoz: +998 ${o.user}</h5>
                <p class="text-xs text-gray-500">Sotib oldi: ${o.items}</p>
            </div>
            <div class="text-right">
                <p class="font-black text-lg">${o.total.toLocaleString()} so'm</p>
                <span class="text-[9px] bg-green-100 text-green-600 px-2 py-1 rounded font-bold">BAZAGA YOZILDI</span>
            </div>
        </div>
    `).join('');
}

// Xarid funksiyasi (Avvalgi kodlarga qo'shiladi)
window.completePurchase = (cart, phone) => {
    const order = {
        id: Date.now(),
        user: phone,
        items: cart.map(i => i.name).join(', '),
        total: cart.reduce((s, i) => s + i.price, 0),
        date: new Date().toLocaleString()
    };
    ordersDB.unshift(order);
    localStorage.setItem('company_orders_db', JSON.stringify(ordersDB));
};