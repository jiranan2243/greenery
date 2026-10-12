// สถานะตะกร้าสินค้า
let cart = [];

// 1. ฟังก์ชันเปลี่ยนหน้า
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active');
    window.scrollTo(0, 0);

    if(pageId === 'cart') renderCart();
}

// 2. ฟังก์ชันกรองหมวดหมู่สินค้า
function filterCategory(category) {
    // จัดการปุ่มให้เปลี่ยนสี
    const buttons = document.querySelectorAll('.category-filters .btn-outline');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // กรองสินค้า
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// ----------------------------------------------------
// ส่วนอัปเกรดระบบตะกร้าสินค้า (รองรับจำนวนและปุ่มลบ)
// ----------------------------------------------------

// 3. ฟังก์ชันเพิ่มสินค้าลงตะกร้า (เช็กว่ามีสินค้าเดิมไหม ถ้ามีบวกจำนวนเพิ่ม)
function addToCart(productName, price) {
    // ค้นหาว่ามีสินค้านี้ในตะกร้าหรือยัง
    let existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.qty += 1; // ถ้ามีแล้วให้เพิ่มจำนวน
    } else {
        // ถ้ายังไม่มีให้เพิ่มเป็นรายการใหม่ พร้อมกำหนด qty = 1
        cart.push({ name: productName, price: price, qty: 1 });
    }
    
    updateCartBadge();
    alert(`เพิ่ม "${productName}" ลงตะกร้าเรียบร้อยแล้ว!`);
}

// อัปเดตตัวเลขบนไอคอนตะกร้า (นับจากจำนวนชิ้นทั้งหมด)
function updateCartBadge() {
    let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cartCount').innerText = `(${totalItems})`;
}

// 4. ฟังก์ชันแสดงรายการในตะกร้า (เพิ่มปุ่ม +, -, ช่องกรอกตัวเลข และปุ่มลบ)
function renderCart() {
    const cartList = document.getElementById('cartItemsList');
    const cartTotal = document.getElementById('cartTotal');
    
    cartList.innerHTML = '';
    let total = 0;

    if(cart.length === 0) {
        cartList.innerHTML = '<li style="text-align:center; padding: 20px;">ยังไม่มีสินค้าในตะกร้า</li>';
    } else {
        cart.forEach((item, index) => {
            let itemTotalPrice = item.price * item.qty; // คำนวณราคารวมต่อชิ้น
            total += itemTotalPrice; // นำไปบวกยอดรวมทั้งหมด
            
            cartList.innerHTML += `
                <li class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span style="color:#666;">${item.price.toLocaleString()} บาท/ชิ้น</span>
                    </div>
                    
                    <div class="cart-item-actions">
                        <!-- ชุดปุ่มควบคุมจำนวน -->
                        <div class="qty-control">
                            <button class="qty-btn" onclick="updateCartQty(${index}, -1)">-</button>
                            <!-- พิมพ์ตัวเลขเองได้ และเมื่อพิมพ์เสร็จจะคำนวณใหม่ (onchange) -->
                            <input type="number" class="qty-input" value="${item.qty}" min="1" onchange="setCartQty(${index}, this.value)">
                            <button class="qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
                        </div>
                        
                        <!-- ราคารวมของสินค้านั้นๆ -->
                        <span class="item-total">${itemTotalPrice.toLocaleString()} บาท</span>
                        
                        <!-- ปุ่มลบ -->
                        <button class="btn-remove" onclick="removeCartItem(${index})">ลบ</button>
                    </div>
                </li>`;
        });
    }
    cartTotal.innerText = total.toLocaleString();
    updateCartBadge();
}

// ฟังก์ชันกดปุ่ม + หรือ -
function updateCartQty(index, change) {
    cart[index].qty += change;
    // ป้องกันไม่ให้จำนวนน้อยกว่า 1
    if(cart[index].qty < 1) {
        cart[index].qty = 1; 
    }
    renderCart(); // วาดตะกร้าใหม่เพื่ออัปเดตราคา
}

// ฟังก์ชันเมื่อผู้ใช้พิมพ์ตัวเลขจำนวนเอง
function setCartQty(index, value) {
    let val = parseInt(value);
    // ตรวจสอบว่าค่าที่พิมพ์มาเป็นตัวเลขและมากกว่า 0 หรือไม่
    if(isNaN(val) || val < 1) {
        val = 1;
    }
    cart[index].qty = val;
    renderCart();
}

// ฟังก์ชันลบสินค้าออกจากตะกร้า
function removeCartItem(index) {
    cart.splice(index, 1); // ตัดข้อมูลตำแหน่งนั้นออกจาก Array
    renderCart();
}

// 5. ฟังก์ชันดำเนินการชำระเงิน (คำนวณยอดจากจำนวนสินค้าทั้งหมด)
function proceedToCheckout() {
    if(cart.length === 0) {
        alert("กรุณาเลือกสินค้าลงตะกร้าก่อนทำการชำระเงิน");
        return;
    }
    
    // คำนวณยอดรวมใหม่ (ราคา x จำนวน)
    let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('checkoutTotal').innerText = total.toLocaleString();
    
    showPage('checkout');
}

// 6. ยืนยันการชำระเงิน
function confirmPayment() {
    alert("ระบบได้รับการแจ้งเตือนการชำระเงินของคุณแล้ว ขอบคุณที่ใช้บริการ!");
    cart = []; // ล้างตะกร้า
    document.getElementById('cartCount').innerText = `(0)`;
    showPage('home');
}

// ฟังก์ชัน Form ทั่วไป
function submitContact(event) {
    event.preventDefault();
    alert("ส่งข้อความเรียบร้อยแล้ว");
    event.target.reset();
}
function submitLogin(event) {
    event.preventDefault();
    alert("เข้าสู่ระบบสำเร็จ");
    showPage('home');
}
function submitRegister(event) {
    event.preventDefault();
    alert("สมัครสมาชิกสำเร็จ");
    showPage('login');
}
// ฐานข้อมูลสินค้าจำลองสำหรับสุ่มทำ Flash Sale
const allProductsPool = [
    { name: 'มอสสเปนนำเข้า', price: 4500, img: 'mosspan.jpg' },
    { name: 'เฟิร์นกีวีนิวซีแลนด์', price: 8000, img: 'gevi.jpg' },
    { name: 'บอนไซสนดำญี่ปุ่น', price: 150000, img: 'black pine.jpg' },
    { name: 'ต้นโอลีฟสเปน', price: 85000, img: 'olive span.jpg' },
    { name: 'ต้นเบาบับ มาดากัสการ์', price: 120000, img: 'baobab.jpg' },
    { name: 'มอนสเตอร่าด่างมิ้นต์', price: 120000, img: 'monsterra mint.jpg' },
    { name: 'ฟิโลเดนดรอน สปิริตัส ซังติ', price: 250000, img: 'fi.jpg' },
    { name: 'กล้วยด่างฟลอริดา', price: 85000, img: 'banana dang.jpg' }
];

let countdownInterval;

// ฟังก์ชันเริ่มโปรโมชัน Flash Sale
function startFlashSale() {
    // 1. สลับตำแหน่ง (Shuffle) และตัดมา 3 ชิ้นที่ไม่ซ้ำกัน
    let shuffled = [...allProductsPool].sort(() => 0.5 - Math.random());
    let selectedProducts = shuffled.slice(0, 5);

    // 2. ล้างข้อมูลเก่าและสร้างการ์ดสินค้าชุดใหม่
    const flashSaleGrid = document.getElementById('flashSaleGrid');
    if (!flashSaleGrid) return;
    
    flashSaleGrid.innerHTML = '';
    
    selectedProducts.forEach(product => {
        let discountPrice = product.price * 0.9; // คำนวณลด 10%
        flashSaleGrid.innerHTML += `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price" style="margin: 10px 0 20px 0;">
                    <span class="old-price">${product.price.toLocaleString()} ฿</span>
                    <br>
                    <span class="new-price">${discountPrice.toLocaleString()} ฿</span>
                </p>
                <button class="btn-solid" onclick="addToCart('${product.name} (ลด 10%)', ${discountPrice})">เพิ่มลงตะกร้า</button>
            </div>
        `;
    });

    // 3. เริ่มนับเวลาถอยหลัง 24 ชั่วโมง (24 ชั่วโมง = 86400 วินาที)
    let timeRemaining = 86400; 
    clearInterval(countdownInterval); 
    
    countdownInterval = setInterval(() => {
        timeRemaining--;
        
        let hours = Math.floor(timeRemaining / 3600);
        let minutes = Math.floor((timeRemaining % 3600) / 60);
        let seconds = timeRemaining % 60;
        
        // จัดรูปแบบตัวเลขให้เป็น 2 หลัก (เช่น 09:05:01)
        let hStr = String(hours).padStart(2, '0');
        let mStr = String(minutes).padStart(2, '0');
        let sStr = String(seconds).padStart(2, '0');
        
        document.getElementById('countdownTimer').innerText = `${hStr}:${mStr}:${sStr}`;
        
        // ถ้าเวลาหมด ให้เริ่มสุ่มใหม่ทันที
        if (timeRemaining <= 0) {
            startFlashSale(); 
        }
    }, 1000);
}

// สั่งให้ระบบ Flash Sale ทำงานทันทีที่เว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', startFlashSale);
// ฟังก์ชันลืมรหัสผ่าน
function forgotPassword() {
    const emailInput = document.getElementById('loginEmail').value;
    if(emailInput === "") {
        alert("กรุณากรอกอีเมลของคุณในช่องใส่อีเมลก่อนกดลืมรหัสผ่านครับ");
    } else {
        alert(`ระบบได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปที่อีเมล ${emailInput} เรียบร้อยแล้ว (จำลองการทำงาน)`);
    }
}