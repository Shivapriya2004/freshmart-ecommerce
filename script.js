/* ============================================
   FreshMart — script.js
   Simple, beginner-friendly JavaScript
   ============================================ */

/* ---------- 1. Product catalog ---------- */
/* Each product has its own unique image so no two products repeat an image. */
const PRODUCTS = [
  { id: 1,  name: "Apple",          price: 120, unit: "kg",    category: "Fruit",     image: "https://delivisor.com/wp-content/uploads/2024/12/apple-harvest-in-the-garden-selective-focus-2023-11-27-04-53-15-utc-1536x966.jpg" },
  { id: 2,  name: "Banana",         price: 60,  unit: "dozen", category: "Fruit",     image: "https://morningchores.com/wp-content/uploads/2020/12/growing-bananas.jpg" },
  { id: 3,  name: "Orange",         price: 90,  unit: "kg",    category: "Fruit",     image: "https://falstaff.b-cdn.net/storage/2023/01/Header_Seville_Orange.jpg" },
  { id: 4,  name: "Mango",          price: 140, unit: "kg",    category: "Fruit",     image: "https://buyfreshindianmangoes.com/wp-content/uploads/2024/03/Alphonso-Mangoes-1.jpeg" },
  { id: 5,  name: "Grapes",         price: 100, unit: "kg",    category: "Fruit",     image: "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?cs=srgb&dl=bunch-cluster-delicious-708777.jpg&fm=jpg" },
  { id: 6,  name: "Pomegranate",    price: 160, unit: "kg",    category: "Fruit",     image: "https://www.oneindia.com/vegetables-price/vegatableimages/Pomegranate.jpg" },
  { id: 7,  name: "Tomato",         price: 50,  unit: "kg",    category: "Vegetable", image: "https://longfellowsgreenhouses.com/wp-content/uploads/cache/2018/05/Red-Ripe-Tomatoes-on-Vine/151774242.jpg" },
  { id: 8,  name: "Potato",         price: 45,  unit: "kg",    category: "Vegetable", image: "https://www.cuisinefiend.com/RecipeImages/Crushed%20new%20potatoes/jerseys-1.jpg" },
  { id: 9,  name: "Carrot",         price: 70,  unit: "kg",    category: "Vegetable", image: "https://static.vecteezy.com/system/resources/previews/021/812/357/non_2x/carrot-on-ground-fresh-carrots-growing-in-carrot-field-vegetable-grows-in-the-garden-in-the-soil-organic-farm-harvest-agricultural-product-nature-free-photo.JPG" },
  { id: 10, name: "Onion",          price: 55,  unit: "kg",    category: "Vegetable", image: "https://cdn.britannica.com/08/187208-050-E4233521/onions.jpg" },
  { id: 11, name: "Spinach",        price: 30,  unit: "bunch", category: "Vegetable", image: "https://graciouslynourished.com/wp-content/uploads/2022/05/fresh-spinach.jpg" },
  { id: 12, name: "Green Beans",    price: 80,  unit: "kg",    category: "Vegetable", image: "https://www.offthegridnews.com/wp-content/uploads/2016/11/green-beans-public-domain-pictures.jpg" },
  { id: 13, name: "Foxtail Millet", price: 120, unit: "kg",    category: "Millet",    image: "https://tse2.mm.bing.net/th/id/OIP.puvj2dullT2Ek56SkIWgeAHaEK?r=0&pid=Api&h=220&P=0" },
  { id: 14, name: "Finger Millet",  price: 90,  unit: "kg",    category: "Millet",    image: "https://5.imimg.com/data5/SELLER/Default/2024/4/414679580/ZZ/WJ/BK/31885049/51pdiw05kql-ac-uf1000-1000-ql80-dpweblab-1000x1000.jpg" },
  { id: 15, name: "Little Millet",  price: 130, unit: "kg",    category: "Millet",    image: "https://naturallyyours.in/cdn/shop/articles/little_millet.jpg?v=1651737375" }
];

/* ---------- 2. Cart state (persisted in localStorage) ---------- */
let cart = loadCart();

function loadCart() {
  const saved = localStorage.getItem("freshmart_cart");
  return saved ? JSON.parse(saved) : [];
}

function saveCart() {
  localStorage.setItem("freshmart_cart", JSON.stringify(cart));
}

/* ---------- 3. Render product grid ---------- */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  let html = "";
  PRODUCTS.forEach((p) => {
    html += `
      <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
        <div class="card product-card">
          <div class="product-img-wrap">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
          </div>
          <div class="card-body">
            <span class="category-pill">${p.category}</span>
            <h5 class="product-name">${p.name}</h5>
            <p class="mb-3">
              <span class="product-price">₹${p.price}</span>
              <span class="product-unit">/ ${p.unit}</span>
            </p>
            <button class="btn btn-add w-100" onclick="addToCart(${p.id})">+ Add</button>
          </div>
        </div>
      </div>
    `;
  });
  grid.innerHTML = html;
}

/* ---------- 4. Cart functions ---------- */
function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      qty: 1
    });
  }

  saveCart();
  updateCart();
}

function increaseQuantity(productId) {
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.qty += 1;
    saveCart();
    updateCart();
  }
}

function decreaseQuantity(productId) {
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.qty -= 1;
    if (item.qty <= 0) {
      removeItem(productId);
      return;
    }
    saveCart();
    updateCart();
  }
}

function removeItem(productId) {
  cart = cart.filter((i) => i.id !== productId);
  saveCart();
  updateCart();
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

/* Refresh the navbar badge + offcanvas cart contents */
function updateCart() {
  const badgeEls = document.querySelectorAll(".cart-count");
  badgeEls.forEach((el) => (el.textContent = getCartCount()));

  const cartItemsWrap = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  if (!cartItemsWrap) return;

  if (cart.length === 0) {
    cartItemsWrap.innerHTML = `
      <div class="cart-empty">
        <div style="font-size:2.2rem;">🛒</div>
        <p class="mb-0">Your cart is empty.</p>
        <p class="mb-0">Add some fresh products!</p>
      </div>
    `;
  } else {
    let html = "";
    cart.forEach((item) => {
      html += `
        <div class="cart-item">
          <div class="d-flex align-items-center">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div>
              <div class="fw-bold">${item.name}</div>
              <div class="product-unit">₹${item.price} / ${item.unit}</div>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <button class="qty-btn" onclick="decreaseQuantity(${item.id})">-</button>
            <span class="mx-2">${item.qty}</span>
            <button class="qty-btn" onclick="increaseQuantity(${item.id})">+</button>
            <button class="btn btn-sm text-danger ms-2" onclick="removeItem(${item.id})" title="Remove">&times;</button>
          </div>
        </div>
      `;
    });
    cartItemsWrap.innerHTML = html;
  }

  if (cartTotalEl) {
    cartTotalEl.textContent = "₹" + calculateTotal();
  }
}

/* ---------- 5. Order form ---------- */
function submitOrder(event) {
  event.preventDefault();

  const form = document.getElementById("orderForm");
  const name = document.getElementById("fullName");
  const phone = document.getElementById("phoneNumber");
  const email = document.getElementById("emailAddress");
  const details = document.getElementById("orderDetails");
  const address = document.getElementById("deliveryAddress");

  let isValid = true;
  [name, phone, email, details, address].forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add("is-invalid");
      isValid = false;
    } else {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
    }
  });

  if (!isValid) return;

  const submitBtn = document.getElementById("orderSubmitBtn");
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Submitting Order...`;

  const orderData = {
    name: name.value.trim(),
    phone: phone.value.trim(),
    email: email.value.trim(),
    details: details.value.trim(),
    address: address.value.trim()
  };

  setTimeout(() => {
    localStorage.setItem("freshmart_order", JSON.stringify(orderData));

    // Clear the cart after a successful order
    cart = [];
    saveCart();

    form.reset();
    [name, phone, email, details, address].forEach((field) => field.classList.remove("is-valid"));
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

    window.location.href = "order-success.html";
  }, 1200);
}

function submitFeedback(event) {
  event.preventDefault();

  const form = document.getElementById("feedbackForm");
  const name = document.getElementById("feedbackName");
  const rating = document.getElementById("feedbackRating");
  const message = document.getElementById("feedbackMessage");

  let isValid = true;
  [name, rating, message].forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add("is-invalid");
      isValid = false;
    } else {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
    }
  });

  const successAlert = document.getElementById("feedbackSuccessAlert");
  if (!isValid) {
    successAlert.classList.add("d-none");
    return;
  }

  successAlert.textContent = "Thank you for your feedback!";
  successAlert.classList.remove("d-none");

  form.reset();
  [name, rating, message].forEach((field) => field.classList.remove("is-valid"));
}

function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail");
  const password = document.getElementById("loginPassword");
  const messageEl = document.getElementById("loginMessage");
  const loginBtn = document.getElementById("loginBtn");

  let isValid = true;
  [email, password].forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add("is-invalid");
      isValid = false;
    } else {
      field.classList.remove("is-invalid");
    }
  });

  if (!isValid) {
    messageEl.textContent = "Please fill all fields.";
    messageEl.className = "alert alert-danger mt-3";
    messageEl.classList.remove("d-none");
    return;
  }

  messageEl.classList.add("d-none");
  loginBtn.disabled = true;
  loginBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Logging in...`;

  setTimeout(() => {
    localStorage.setItem("freshmart_login_email", email.value.trim());

    messageEl.textContent = "Login Successful!";
    messageEl.className = "alert alert-success mt-3";
    messageEl.classList.remove("d-none");

    setTimeout(() => {
      window.location.href = "account.html";
    }, 700);
  }, 1500);
}

function logoutUser() {
  localStorage.removeItem("freshmart_login_email");
  window.location.href = "index.html#login";
}
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCart();
});
