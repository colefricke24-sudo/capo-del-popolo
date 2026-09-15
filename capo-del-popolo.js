const vipGate = document.querySelector('#cdp-vip-gate');
const vipForm = document.querySelector('#cdp-vip-form');
const vipCode = document.querySelector('#cdp-vip-code');
const vipMessage = document.querySelector('#cdp-vip-message');
const vipPasswordToggle = document.querySelector('#cdp-show-password');
const gateEmailForm = document.querySelector('#cdp-gate-email-form');
const joinedClub = new URLSearchParams(window.location.search).get('joined') === '1';
const unlockSite = () => {
  document.body.classList.remove('cdp-locked');
  vipGate.setAttribute('aria-hidden', 'true');
  window.sessionStorage.setItem('capoVipAccess', 'granted');
};
if (window.sessionStorage.getItem('capoVipAccess') === 'granted') unlockSite();
else window.requestAnimationFrame(() => document.querySelector('#cdp-gate-email').focus());
if (joinedClub) vipMessage.textContent = 'You’re on the list. Watch your inbox for future access.';
vipPasswordToggle.addEventListener('click', () => {
  const passwordForm = document.querySelector('#cdp-vip-form');
  const willOpen = passwordForm.hidden;
  passwordForm.hidden = !willOpen;
  gateEmailForm.hidden = willOpen;
  vipPasswordToggle.setAttribute('aria-expanded', String(willOpen));
  vipPasswordToggle.textContent = willOpen ? 'Use email instead' : 'I have a password';
  if (willOpen) vipCode.focus();
  else document.querySelector('#cdp-gate-email').focus();
});
vipForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (vipCode.value.trim().toUpperCase() === 'CAPOVIP1') {
    unlockSite();
    return;
  }
  vipForm.classList.add('error');
  vipMessage.textContent = 'That passcode is not recognized.';
  vipCode.value = '';
  vipCode.focus();
});

const productCatalog = {
  hoodie: {
    name: 'Camo / Grey Zip Hoodie',
    color: 'Camo / Grey',
    price: 88,
    description: 'A heavyweight full-zip hoodie in heather grey with camo sleeves, hood, and pocket detail. Finished with the Capo Del Popolo mark.',
    images: {
      front: new URL('./assets/capo-camo-zip-hoodie-front.webp', import.meta.url).href,
      back: new URL('./assets/capo-camo-zip-hoodie-back.webp', import.meta.url).href
    }
  },
  'white-tee': {
    name: 'Signature Tee', color: 'Lucent White', price: 35,
    description: 'A clean everyday tee with the Capo Del Popolo signature mark across the chest.',
    images: { front: new URL('./assets/capo-signature-tee-white.png', import.meta.url).href }
  },
  'apricot-tee': {
    name: 'Signature Tee', color: 'Gray Apricot', price: 35,
    description: 'A soft neutral tee with the Capo Del Popolo signature mark across the chest.',
    images: { front: new URL('./assets/capo-signature-tee-gray-apricot.png', import.meta.url).href }
  }
};
let activeProduct = null;
const cart = [];
const money = (value) => `$${value.toFixed(2)}`;
const drawer = document.querySelector('#cdp-cart');
const overlay = document.querySelector('#cdp-overlay');
const cartItems = document.querySelector('#cdp-cart-items');
const checkoutButton = document.querySelector('#cdp-checkout');
const checkoutDialog = document.querySelector('#cdp-checkout-dialog');
const productDialog = document.querySelector('#cdp-product-dialog');
const detailImage = document.querySelector('#cdp-detail-image');
const detailSizes = document.querySelector('#cdp-detail-sizes');
const toast = document.querySelector('#cdp-toast');
function total() { return cart.reduce((sum, item) => sum + item.price, 0); }
function showToast(message) { toast.textContent = message; toast.classList.add('show'); window.setTimeout(() => toast.classList.remove('show'), 2200); }
function renderCart() {
  document.querySelector('#cdp-bag-count').textContent = cart.length;
  document.querySelector('#cdp-subtotal').textContent = money(total());
  checkoutButton.disabled = cart.length === 0;
  cartItems.innerHTML = cart.length ? cart.map((item, index) => `<article><img src="${item.image}" alt="${item.name}" /><div><h3>${item.name}</h3><p>Size ${item.size}</p><p>${money(item.price)}</p></div><button data-remove="${index}">Remove</button></article>`).join('') : '<p>Your bag is waiting.</p>';
  document.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => { cart.splice(Number(button.dataset.remove), 1); renderCart(); }));
}
function openCart() { drawer.classList.add('open'); overlay.classList.add('visible'); drawer.setAttribute('aria-hidden', 'false'); }
function closeCart() { drawer.classList.remove('open'); overlay.classList.remove('visible'); drawer.setAttribute('aria-hidden', 'true'); }
function showProduct(key) {
  activeProduct = productCatalog[key];
  detailImage.src = activeProduct.images.front;
  detailImage.alt = `${activeProduct.color} ${activeProduct.name}`;
  document.querySelector('#cdp-detail-color').textContent = activeProduct.color;
  document.querySelector('#cdp-detail-name').textContent = activeProduct.name;
  document.querySelector('#cdp-detail-price').textContent = money(activeProduct.price);
  document.querySelector('#cdp-detail-description').textContent = activeProduct.description;
  document.querySelector('#cdp-detail-button-price').textContent = money(activeProduct.price);
  document.querySelector('#cdp-detail-views').hidden = !activeProduct.images.back;
  detailSizes.dataset.selected = '';
  detailSizes.querySelectorAll('button').forEach((button) => button.classList.remove('selected'));
  document.querySelectorAll('#cdp-detail-views button').forEach((button) => button.classList.toggle('active', button.dataset.view === 'front'));
  productDialog.showModal();
}
document.querySelectorAll('.cdp-product-tile, .cdp-product-open').forEach((button) => button.addEventListener('click', () => showProduct(button.dataset.product)));
document.querySelector('#cdp-close-product').addEventListener('click', () => productDialog.close());
document.querySelectorAll('#cdp-detail-views button').forEach((button) => button.addEventListener('click', () => {
  detailImage.src = activeProduct.images[button.dataset.view];
  document.querySelectorAll('#cdp-detail-views button').forEach((item) => item.classList.toggle('active', item === button));
}));
detailSizes.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
  detailSizes.dataset.selected = button.dataset.size;
  detailSizes.querySelectorAll('button').forEach((item) => item.classList.toggle('selected', item === button));
}));
document.querySelector('#cdp-add-detail').addEventListener('click', () => {
  const selectedSize = detailSizes.dataset.selected;
  if (!selectedSize) { showToast('Select a size first.'); return; }
  cart.push({ name: `${activeProduct.color} ${activeProduct.name}`, price: activeProduct.price, image: activeProduct.images.front, size: selectedSize });
  renderCart();
  productDialog.close();
  openCart();
  showToast('Added to your bag.');
});
document.querySelector('#cdp-open-cart').addEventListener('click', openCart);
document.querySelector('#cdp-close-cart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
checkoutButton.addEventListener('click', () => { closeCart(); document.querySelector('#cdp-checkout-product').innerHTML = cart.map((item) => `<div class="cdp-order-item"><span>${item.name}<small>Size ${item.size}</small></span><span>${money(item.price)}</span></div>`).join(''); document.querySelector('#cdp-checkout-total').textContent = money(total()); checkoutDialog.showModal(); });
document.querySelector('#cdp-close-checkout').addEventListener('click', () => checkoutDialog.close());
document.querySelector('#cdp-checkout-form').addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('#cdp-payment-notice').textContent = 'Live payment processing is ready for merchant credentials and a secure server connection.'; });
if (joinedClub) {
  document.querySelector('#cdp-email-message').textContent = 'You’re in. Check your inbox for your welcome email.';
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.hash}`);
}
renderCart();
