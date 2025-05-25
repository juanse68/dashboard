import { supabase } from './supabase.js';

/**
 * Muestra el carrito completo con JOIN a productos.
 * @param {HTMLElement} container – Contenedor donde renderizar el carrito.
 */
export async function showCart(container) {
  const user = supabase.auth.user();
  if (!user) {
    container.innerHTML = '<p>Inicia sesión para ver tu carrito</p>';
    return;
  }

  // Obtenemos los ítems y sus datos de productos relacionados
  const { data, error } = await supabase
    .from('carrito')
    .select(`
      id,
      cantidad,
      productos (
        nombre,
        precio,
        imagen_url
      )
    `)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error al cargar carrito:', error);
    return;
  }

  container.innerHTML = '<h2>Tu Carrito</h2>';

  let total = 0;
  data.forEach(item => {
    total += item.productos.precio * item.cantidad;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.productos.imagen_url}" alt="${item.productos.nombre}" />
      <div class="cart-item-info">
        <div class="cart-item-title">${item.productos.nombre}</div>
        <div class="cart-item-price">$${item.productos.precio} x${item.cantidad}</div>
      </div>
      <button onclick="removeFromCart(${item.id})">🗑</button>
    `;
    container.appendChild(div);
  });

  // Mostrar total
  const totDiv = document.createElement('div');
  totDiv.id = 'cart-total';
  totDiv.innerText = `Total: $${total}`;
  container.appendChild(totDiv);
}

/**
 * Elimina un ítem del carrito y refresca la vista.
 * @param {number} id – ID de la fila en "carrito".
 */
export async function removeFromCart(id) {
  await supabase.from('carrito').delete().eq('id', id);
  updateCartCount();
  // Volver a cargar la página de carrito
  window.location.hash = '#cart';
}

/* ===== Funciones para Panel Admin (CRUD Productos) ===== */

/**
 * Carga la tabla de productos en modo administrador.
 * @param {HTMLElement} container – Contenedor para el panel.
 */
export async function loadAdminPanel(container) {
  const { data, error } = await supabase
    .from('productos')
    .select('*');
  if (error) console.error('Error admin productos:', error);

  // Construimos la tabla HTML
  let html = `
    <h2>Admin – Gestión de Productos</h2>
    <button id="new-product">+ Nuevo producto</button>
    <table>
      <tr><th>Nombre</th><th>Precio</th><th>Acciones</th></tr>
  `;
  data.forEach(p => {
    html += `
      <tr>
        <td>${p.nombre}</td>
        <td>$${p.precio}</td>
        <td>
          <button onclick="editProduct(${p.id})">✏️</button>
          <button onclick="deleteProduct(${p.id})">🗑️</button>
        </td>
      </tr>
    `;
  });
  html += `</table>`;

  container.innerHTML = html;

  // Botón para crear nuevo producto
  document.getElementById('new-product')
    .addEventListener('click', () => showProductForm(container));
}

/**
 * Muestra el formulario de creación/edición de producto.
 * @param {HTMLElement} container – Contenedor donde inyectar el formulario.
 * @param {Object=} producto – Datos para edición (omitido en creación).
 */
export function showProductForm(container, producto = {}) {
  container.innerHTML = `
    <h3>${producto.id ? 'Editar' : 'Nuevo'} Producto</h3>
    <form id="prod-form">
      <input name="nombre"      placeholder="Nombre"      value="${producto.nombre || ''}" required />
      <input name="precio" type="number" placeholder="Precio" value="${producto.precio || ''}" required />
      <input name="imagen_url"   placeholder="URL Imagen"  value="${producto.imagen_url||''}" required />
      <textarea name="descripcion" placeholder="Descripción">${producto.descripcion||''}</textarea>
      <button>${producto.id ? 'Actualizar' : 'Crear'}</button>
    </form>
  `;

  // Manejo de creación o actualización
  document.getElementById('prod-form')
    .addEventListener('submit', async e => {
      e.preventDefault();
      const fv = Object.fromEntries(new FormData(e.target));
      if (producto.id) {
        await supabase.from('productos').update(fv).eq('id', producto.id);
      } else {
        await supabase.from('productos').insert([fv]);
      }
      loadAdminPanel(container);
    });
}

/**
 * Carga datos de un producto y abre el formulario de edición.
 * @param {number} id – ID del producto.
 */
export async function editProduct(id) {
  const { data } = await supabase.from('productos').select('*').eq('id', id).single();
  showProductForm(document.getElementById('app'), data);
}

/**
 * Elimina un producto tras confirmación.
 * @param {number} id – ID del producto.
 */
export async function deleteProduct(id) {
  if (!confirm('¿Eliminar producto?')) return;
  await supabase.from('productos').delete().eq('id', id);
  loadAdminPanel(document.getElementById('app'));
}
