function switchPage(pageId) {
    // 1. Hamma sahifalarni yashirish
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });

    // 2. Tanlangan sahifani ko'rsatish
    const activePage = document.getElementById('page-' + pageId);
    if (activePage) {
        activePage.classList.remove('hidden');
    }

    // 3. Sarlavhani o'zgartirish
    document.getElementById('current-page-title').innerText = pageId.charAt(0).toUpperCase() + pageId.slice(1);

    // 4. Sidebar tugmalarini rangini to'g'irlash
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(pageId.toLowerCase())) {
            btn.classList.add('active');
        }
    });
}