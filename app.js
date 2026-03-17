// Ma'lumotlar bazasi (Localdan olingan deb hisoblaymiz)
let orders = [
    { id: 1, name: "Sarvar", phone: "+998 90 123 12 12", prod: "iPhone 15 Pro", pay: "Naqd", status: "Yopilgan", time: "14.03.2026" },
    { id: 2, name: "Ozod", phone: "+998 91 777 32 09", prod: "MacBook Air M3", pay: "Plastik", status: "Kutilmoqda", time: "15.03.2026" },
    { id: 3, name: "Azim", phone: "+998 93 500 09 05", prod: "Apple Watch 9", pay: "Nasiya", status: "Yopilgan", time: "16.03.2026" }
];

function renderTable() {
    const tableBody = document.getElementById('orders-table');
    tableBody.innerHTML = orders.map((o, index) => `
        <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition">
            <td class="p-4 text-slate-500 font-bold">${index + 1}</td>
            <td class="p-4">
                <div class="font-bold text-slate-200">${o.name}</div>
                <div class="text-[10px] text-slate-500">${o.phone}</div>
            </td>
            <td class="p-4">
                <span class="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-[10px] font-bold">${o.prod}</span>
            </td>
            <td class="p-4">
                <span class="text-xs ${o.pay === 'Naqd' ? 'text-green-400' : 'text-orange-400'}">${o.pay}</span>
            </td>
            <td class="p-4">
                <span class="${o.status === 'Yopilgan' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'} px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                    ● ${o.status}
                </span>
            </td>
            <td class="p-4 flex justify-center gap-2">
                <button onclick="editOrder(${o.id})" class="p-2 bg-slate-700 hover:bg-blue-600 rounded-lg transition" title="Tahrirlash">✏️</button>
                <button onclick="deleteOrder(${o.id})" class="p-2 bg-slate-700 hover:bg-red-600 rounded-lg transition" title="O'chirish">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// O'CHIRISH FUNKSIYASI
window.deleteOrder = (id) => {
    if(confirm("Ushbu buyurtmani bazadan o'chirmoqchimisiz?")) {
        orders = orders.filter(o => o.id !== id);
        renderTable();
    }
};

// TAHRIRLASH FUNKSIYASI (Sodda variant)
window.editOrder = (id) => {
    const order = orders.find(o => o.id === id);
    const newName = prompt("Mijoz ismini o'zgartiring:", order.name);
    if(newName) {
        order.name = newName;
        renderTable();
    }
};

renderTable();