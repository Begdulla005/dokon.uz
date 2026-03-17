// XODIMLAR VA ROLLAR
const STAFF_LIST = [
    { phone: "905040811", role: "ADMIN", name: "Admin" }, //
    { phone: "500755904", role: "MENEJER", name: "Sotuv menejeri" },
    { phone: "954512804", role: "HISOBCHI", name: "Bosh hisobchi" }
];

let ordersDB = JSON.parse(localStorage.getItem('erp_orders_db')) || [];
let productsDB = JSON.parse(localStorage.getItem('erp_products_db')) || [];
let currentUPhone = localStorage.getItem('user_phone') || "905040811"; // Test uchun

function initDashboard() {
    const user = STAFF_LIST.find(s => s.phone === currentUPhone);
    if (!user) {
        alert("Xodim aniqlanmadi!");
        return;
    }

    // Rolga qarab UI-ni moslash
    document.getElementById('user-role-display').innerText = `${user.role}: ${user.name}`;
    
    const statsSec = document.getElementById('section-stats');
    const addSec = document.getElementById('section-add');

    if (user.role === "HISOBCHI") {
        addSec.style.display = 'none'; // Hisobchi mahsulot qo'sholmaydi
    } else if (user.role === "MENEJER") {
        statsSec.style.display = 'none'; // Menejer pulni ko'rolmaydi
    }

    renderLogs();
}

window.saveProductToDB = () => {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    if(!name || !price) return alert("Ma'lumotlar to'liq emas!");

    productsDB.push({ id: Date.now(), name, price: parseInt(price) });
    localStorage.setItem('erp_products_db', JSON.stringify(productsDB));
    alert("Mahsulot bazaga muvaffaqiyatli qo'shildi! ✅");
};

function renderLogs() {
    const list = document.getElementById('db-log-list');
    const income = ordersDB.reduce((s, o) => s + o.total, 0);

    document.getElementById('stat-income').innerText = income.toLocaleString() + " so'm";
    document.getElementById('stat-profit').innerText = (income * 0.15).toLocaleString() + " so'm";

    if(ordersDB.length === 0) {
        list.innerHTML = `<div class="p-20 text-center text-gray-300 font-bold border-2 border-dashed rounded-[30px]">Hozircha xaridlar yo'q</div>`;
        return;
    }

    list.innerHTML = ordersDB.map(o => `
        <div class="bg-white p-6 rounded-[28px] shadow-sm border-l-8 border-purple-500 flex justify-between items-center transition-all hover:shadow-md">
            <div>
                <span class="text-[9px] font-black text-purple-300 uppercase">${o.date}</span>
                <h5 class="font-bold text-gray-800">Mijoz: +998 ${o.user}</h5>
                <p class="text-[10px] text-gray-400 mt-1 italic">${o.items}</p>
            </div>
            <div class="text-right">
                <p class="font-black text-gray-900 text-lg">${o.total.toLocaleString()} so'm</p>
                <span class="text-[8px] bg-green-50 text-green-500 px-2 py-0.5 rounded font-black uppercase">To'landi ✅</span>
            </div>
        </div>
    `).join('');
}

initDashboard();