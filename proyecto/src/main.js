// Módulos principales
import { supabase }             from './supabase.js';
import { showLogin }            from './login.js';
import { showRegistro }         from './registro.js';
import { loadProducts, renderProductList } from './usuario.js';
import { showCart, updateCartCount }       from './admin.js';

// Referencias al DOM
const app  = document.getElementById('app');
const tabs = document.querySelectorAll('.bottom-nav button');
let currentPage = 'home';

// Configuramos los listeners de las pestañas
tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    // Destacar pestaña activa
    tabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Navegar a la página seleccionada
    navigate(btn.dataset.page);
  });
});

/**
 * Función principal de enrutamiento
 * @param {string} page – Identificador de la "página" a mostrar
 */
async function navigate(page) {
  currentPage = page;
  app.innerHTML = ''; // Limpiar contenedor

  if (page === 'home') {
    // Cargar y renderizar productos
    const products = await loadProducts();
    renderProductList(products, app);
  }

  if (page === 'cart') {
    // Mostrar carrito de compras
    await showCart(app);
  }

  if (page === 'profile') {
    const user = supabase.auth.user();
    if (user) {
      // Mostrar perfil del usuario logueado
      app.innerHTML = `<h2>Bienvenido, ${user.email}</h2>`;
    } else {
      // Si no hay sesión, mostrar login
      showLogin(app);
    }
  }

  if (page === 'categories') {
    // Placeholder para categorías
    app.innerHTML = `<h2>Categorías</h2><p>Próximamente…</p>`;
  }
}

// Arranque de la aplicación
window.addEventListener('load', async () => {
  // Ocultar splash al cargarse
  document.getElementById('splash').style.display = 'none';

  // Monitoreo de cambios en la sesión de Supabase
  supabase.auth.onAuthStateChange(() => {
    updateCartCount();
    if (!supabase.auth.user() && currentPage === 'profile') {
      app.innerHTML = '';
      showLogin(app);
    }
  });

  // Actualizar contador de carrito e iniciar en "home"
  updateCartCount();
  navigate('home');
});
