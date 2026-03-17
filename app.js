// XODIMLAR MA'LUMOTLAR BAZASI
const STAFF = [
    { phone: "905040811", role: "ADMIN", name: "Begdulla" }, //
    { phone: "500755904", role: "MENEJER", name: "G'olib" },
    { phone: "954512804", role: "HISOBCHI", name: "Shavkat" }
];

let products = [
    { id: 1, name: "iPhone 15 Pro Max", price: 18500000, image: "https://vsc-store.uz/wp-content/uploads/2023/10/iphone-15-pro-finish-select-202309-6-7-inch-natural-titanium.webp" },
    { id: 2, name: "Samsung A 10", price: 900000, image: "https://images.uzum.uz/cl05k7l6sfhsc0um2m4g/original.jpg" }
];

// LOGIN FUNKSIYASI
window.openStaffLogin = () => document.getElementById('staff-login-modal').classList.remove('hidden');
window.closeStaffLogin = () => document.getElementById('staff-login-modal').classList.add('hidden');

window.loginAsStaff = () => {
    const phone = document.getElementById('staff-phone').value;
    const worker = STAFF.find(s => s.phone === phone);

    if (worker) {
        alert(`Xush kelibsiz, ${worker.name}! (${worker.role})`);
        document.getElementById('staff-login-modal').classList.add('hidden');
        openAdminPanel(worker);
    } else {
        alert("Bunday raqamli xodim topilmadi! ❌");
    }
};

function openAdminPanel(worker) {
    const panel = document.getElementById('admin-panel');
    panel.classList.remove('hidden');
    // Panel ichidagi UI-ni rolga qarab render qilish (Avvalgi yozgan kodimizdagidek)
}

// SAYTNI RENDER QILISH
function renderSite() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(p => `
        <div class="bg-white p-4 rounded-[25px] shadow-sm hover:shadow-lg transition">
            <img src="${p.image}" class="h-40 w-full object-contain mb-4">
            <h3 class="text-xs font-bold h-10 line-clamp-2">${p.name}</h3>
            <p class="text-[#7000ff] font-black mt-2 text-sm">${p.price.toLocaleString()} so'm</p>
            <button class="w-full mt-4 py-2 border-2 border-[#7000ff] text-[#7000ff] rounded-xl font-black text-[10px] hover:bg-[#7000ff] hover:text-white transition">SAVATGA</button>
        </div>
    `).join('');
}

renderSite();