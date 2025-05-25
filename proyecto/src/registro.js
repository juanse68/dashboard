import { supabase } from './supabase.js';

/**
 * Renderiza el formulario de registro en un contenedor dado.
 * @param {HTMLElement} container – Elemento donde se inserta el HTML.
 */
export function showRegistro(container) {
  container.innerHTML = `
    <h2>Regístrate</h2>
    <form id="form-registro">
      <input type="email" id="reg-email" placeholder="Email" required />
      <input type="password" id="reg-pass" placeholder="Contraseña" required />
      <button type="submit">Crear cuenta</button>
      <p>¿Ya tienes cuenta? <a href="#" id="to-login">Ingresa</a></p>
    </form>
  `;

  // Envío del formulario de registro
  document.getElementById('form-registro').addEventListener('submit', async e => {
    e.preventDefault();
    const email = e.target['reg-email'].value;
    const pass  = e.target['reg-pass'].value;

    const { user, error } = await supabase.auth.signUp({ email, password: pass });
    if (error) {
      return alert(`Error: ${error.message}`);
    }
    alert('Revisa tu email para confirmar la cuenta.');
  });

  // Enlace a pantalla de login
  document.getElementById('to-login').addEventListener('click', e => {
    e.preventDefault();
    import('./login.js').then(m => m.showLogin(container));
  });
}
