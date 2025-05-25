// Importamos módulos claveimport { supabase }                  from './supabase.js';
import { showLogin }                 from './login.js';
import { showRegistro }              from './registro.js';
import { loadProducts, renderProductList } from './usuario.js';
import { showCart }                  from './admin.js';
import { updateCartCount }           from './usuario.js';

// Elementos del DOM
const app = document.getElementById('app');
const tabs = document.querySelectorAll('.bottom-nav button');
let currentPage = 'home';

// Configurar botones de navegación
tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    // Marcar pestaña activa
    tabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Navegar a la sección correspondiente
    navigate(btn.dataset.page);
  });
});

/**
 * Enrutador simple basado en "page IDs".
 * @param {string} page – 'home' | 'cart' | 'profile' | 'categories'
 */
async function navigate(page) {
  currentPage = page;
  app.innerHTML = ''; // limpiamos vista actual

  if (page === 'home') {
    // Lista de productos
    const products = await loadProducts();
    renderProductList(products, app);
  }

  if (page === 'cart') {
    // Vista de carrito con JOIN a productos
    await showCart(app);
  }

  if (page === 'profile') {
    // Perfil o login si no hay sesión
    const user = supabase.auth.user();
    if (user) {
      app.innerHTML = `<h2>Bienvenido, ${user.email}</h2>`;
    } else {
      showLogin(app);
    }
  }

  if (page === 'categories') {
    // Placeholder de categorías
    app.innerHTML = `<h2>Categorías</h2><p>Próximamente…</p>`;
  }
}

// Inicialización al cargar la página
window.addEventListener('load', async () => {
  // Ocultar el splash (si existe)
  const splash = document.getElementById('splash');
  if (splash) splash.style.display = 'none';

  // Escuchar cambios de sesión para actualizar carrito/perfil
  supabase.auth.onAuthStateChange(() => {
    updateCartCount();
    if (!supabase.auth.user() && currentPage === 'profile') {
      app.innerHTML = '';
      showLogin(app);
    }
  });

  // Contador de carrito y arranque en "home"
  updateCartCount();
  navigate('home');
});
