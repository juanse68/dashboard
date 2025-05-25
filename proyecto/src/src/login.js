import { supabase } from './supabase.js';

/**
 * Renderiza el formulario de login en un contenedor dado.
 * @param {HTMLElement} container – Elemento donde se inserta el HTML.
 */
export function showLogin(container) {
  container.innerHTML = `
    <h2>Iniciar Sesión</h2>
    <form id="form-login">
      <input type="email" id="login-email" placeholder="Email" required />
      <input type="password" id="login-pass" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
      <p>¿No tienes cuenta? <a href="#" id="to-registro">Regístrate</a></p>
    </form>
  `;

  // Envío del formulario de login
  document.getElementById('form-login').addEventListener('submit', async e => {
    e.preventDefault();
    const email = e.target['login-email'].value;
    const pass  = e.target['login-pass'].value;

    const { session, error } = await supabase.auth.signIn({ email, password: pass });
    if (error) {
      return alert(`Error: ${error.message}`);
    }
    alert('¡Sesión iniciada con éxito!');
  });

  // Enlace a pantalla de registro
  document.getElementById('to-registro').addEventListener('click', e => {
    e.preventDefault();
    import('./registro.js').then(m => m.showRegistro(container));
  });
}
