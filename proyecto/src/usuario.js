import { supabase } from './supabase.js';

/**
 * Obtiene todos los productos desde Supabase.
 * @returns {Promise<Array>} – Arreglo de productos.
 */
export async function loadProducts() {
  const { data, error } = await supabase
    .from('productos')
    .select('*');
  if (error) console.error('Error cargando productos:', error);
  return data || [];
}

/**
 * Renderiza la lista de productos en un contenedor dado.
 * @param {Array} products – Lista de productos.
 * @param {HTMLElement} container – Elemento donde se inyecta la lista.
 */
export function renderProductList(products, container) {
  const list = document.createElement('div');
  list.className = 'product-list';

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.imagen_url}" alt="${p.nombre}" />
      <div class="card-body">
        <div class="card-title">${p.nombre}</div>
        <div>
          <span class="card-price">$${p.precio}</span>
          ${p.precio_antiguo ? `<span class="card-old-price">$${p.precio_antiguo}</span>` : ''}
        </div>
        ${p.descuento ? `<div class="card-discount">${p.descuento}% OFF</div>` : ''}
      </div>
    `;
    card.addEventListener('click', () => showDetail(p));
    list.appendChild(card);
  });

  container.appendChild(list);
}

/**
 * Muestra la vista detallada de un producto.
 * @param {Object} producto – Objeto producto.
 */
function showDetail(producto) {
  const detail = document.createElement('div');
  detail.className = 'page active';
  detail.innerHTML = `
    <button onclick="window.history.back()">← Volver</button>
    <img src="${producto.imagen_url}" alt="${producto.nombre}" style="width:100%" />
    <h3>${producto.nombre}</h3>
    <p>${producto.descripcion}</p>
    <div><strong>$${producto.precio}</strong></div>
    <button id="add-cart">¡Agregar al carrito!</button>
  `;

  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(detail);

  document.getElementById('add-cart')
    .addEventListener('click', () => addToCart(producto.id));
}

/**
 * Inserta un producto en la tabla "carrito" para el usuario logueado.
 * @param {number} productId – ID del producto.
 */
export async function addToCart(productId) {
  const user = supabase.auth.user();
  if (!user) {
    return alert('Debes iniciar sesión primero.');
  }

  const { error } = await supabase
    .from('carrito')
    .insert([{ user_id: user.id, product_id: productId, cantidad: 1 }]);

  if (error) {
    console.error('Error al añadir al carrito:', error);
    return;
  }

  updateCartCount();
  alert('Producto añadido al carrito.');
}

/**
 * Actualiza el contador de ítems en el carrito (botón nav).
 */
export async function updateCartCount() {
  const user = supabase.auth.user();
  if (!user) {
    document.getElementById('cart-count').innerText = '0';
    return;
  }

  const { count } = await supabase
    .from('carrito')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  document.getElementById('cart-count').innerText = count;
}
