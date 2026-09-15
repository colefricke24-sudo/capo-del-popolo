const productImages = {
  front: new URL('./assets/capo-camo-zip-hoodie-front.webp', import.meta.url).href,
  back: new URL('./assets/capo-camo-zip-hoodie-back.webp', import.meta.url).href
};
const product = { name: 'Camo / Grey Zip Hoodie', price: 88, image: productImages.front };
const cart = [];
const money = (value) => `$${value.toFixed(2)}`;
const drawer = document.querySelector('#cdp-cart');
const overlay = document.querySelector('#cdp-overlay');
const cartItems = document.querySelector('#cdp-cart-items');
const checkoutButton = document.querySelector('#cdp-checkout');
const dialog = document.querySelector('#cdp-checkout-dialog');
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
document.querySelectorAll('.cdp-gallery-thumb').forEach((button) => button.addEventListener('click', () => { const image = document.querySelector('#cdp-product-image'); image.src = productImages[button.dataset.view]; image.alt = button.dataset.alt; document.querySelectorAll('.cdp-gallery-thumb').forEach((item) => item.classList.toggle('active', item === button)); }));
document.querySelectorAll('.cdp-size-picker button').forEach((button) => button.addEventListener('click', () => { const picker = button.closest('.cdp-size-picker'); picker.dataset.selected = button.dataset.size; picker.querySelectorAll('button').forEach((item) => item.classList.toggle('selected', item === button)); }));
document.querySelector('#cdp-add-to-bag').addEventListener('click', () => { const selectedSize = document.querySelector('#cdp-hoodie-card .cdp-size-picker').dataset.selected; if (!selectedSize) { showToast('Select a size first.'); return; } cart.push({ ...product, size: selectedSize }); renderCart(); openCart(); showToast('Added to your bag.'); });
document.querySelectorAll('.cdp-add-tee').forEach((button) => button.addEventListener('click', () => { const card = button.closest('.cdp-tee-card'); const selectedSize = card.querySelector('.cdp-size-picker').dataset.selected; if (!selectedSize) { showToast('Select a size first.'); return; } cart.push({ name: card.dataset.productName, price: Number(card.dataset.price), image: card.querySelector('img').currentSrc, size: selectedSize }); renderCart(); openCart(); showToast('Added to your bag.'); }));
document.querySelector('#cdp-open-cart').addEventListener('click', openCart);
document.querySelector('#cdp-close-cart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
checkoutButton.addEventListener('click', () => { closeCart(); document.querySelector('#cdp-checkout-product').innerHTML = cart.map((item) => `<div class="cdp-order-item"><span>${item.name}<small>Size ${item.size}</small></span><span>${money(item.price)}</span></div>`).join(''); document.querySelector('#cdp-checkout-total').textContent = money(total()); dialog.showModal(); });
document.querySelector('#cdp-close-checkout').addEventListener('click', () => dialog.close());
document.querySelector('#cdp-checkout-form').addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('#cdp-payment-notice').textContent = 'Live payment processing is ready for merchant credentials and a secure server connection.'; });
document.querySelector('#cdp-email-form').addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('#cdp-email').value = ''; document.querySelector('#cdp-email-message').textContent = 'Welcome to the family.'; });
renderCart();
