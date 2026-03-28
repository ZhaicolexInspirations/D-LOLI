function buscarPerfume() {
  const input = document.getElementById("searchInput");
  const filtro = input.value.toLowerCase();
  const items = document.querySelectorAll(".cart-item");
  const mensaje = document.getElementById("noResults");

  let encontrados = 0;

  items.forEach((item) => {
    const textoCompleto = item.innerText.toLowerCase();

    if (textoCompleto.includes(filtro)) {
      item.style.display = "";
      encontrados++;
    } else {
      item.style.display = "none";
    }
  });

  if (encontrados === 0) {
    mensaje.style.display = "block";
  } else {
    mensaje.style.display = "none";
  }
}
// =============================
// SISTEMA DE SESIÓN Y CARRITO
// =============================

let sessionId = "";

// Generar ID de sesión único
function generateSessionId() {
  return (
    "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  );
}

// Obtener o crear ID de sesión
function getSessionId() {
  // Buscar en sessionStorage (se borra al cerrar navegador/pestaña)
  let session = sessionStorage.getItem("zhaicolezSessionId");

  if (!session) {
    // Crear nueva sesión
    session = generateSessionId();
    sessionStorage.setItem("zhaicolezSessionId", session);
    console.log("Nueva sesión creada:", session);
  } else {
    console.log("Sesión existente:", session);
  }

  return session;
}

// Inicializar sesión al cargar página
sessionId = getSessionId();

// =============================
// FUNCIONES DEL CARRITO
// =============================

// Función para agregar botones a todos los productos
function addCartButtons() {
  const cartItems = document.querySelectorAll(".cart-item");

  cartItems.forEach((item, itemIndex) => {
    // Verificar si ya tiene botón
    if (item.querySelector(".add-to-cart-btn")) return;

    const cartInfo = item.querySelector(".cart-info");
    const brand =
      cartInfo.querySelector("p:nth-child(1) strong")?.textContent || "Marca";
    const name =
      cartInfo.querySelector("p:nth-child(2)")?.textContent || "Producto";
    const type =
      cartInfo.querySelector("p:nth-child(3)")?.textContent || "Perfume";
    const image = item.querySelector("img")?.src || "";

    // Crear botón
    const button = document.createElement("button");
    button.className = "add-to-cart-btn";
    button.textContent = "🛒 Agregar al carrito";
    button.onclick = function () {
      // Obtener la opción seleccionada
      const selectedOption = item.querySelector('input[type="radio"]:checked');
      if (selectedOption) {
        const size = selectedOption
          .closest(".price-option")
          .querySelector(".size").innerText;

        let priceText = selectedOption
          .closest(".price-option")
          .querySelector(".price").innerText;

        // Limpiar texto "$14.000" → 14000
        const price = parseInt(priceText.replace(/\D/g, ""));
        addToCart(brand, name, type, size, price, image);
      } else {
        // Resaltar las opciones con animación
        const priceOptions = item.querySelector(".price-options");
        priceOptions.style.animation = "shake 0.5s";
        setTimeout(() => {
          priceOptions.style.animation = "";
        }, 500);
        showNotification("⚠️ Por favor selecciona un tamaño primero");
      }
    };

    cartInfo.appendChild(button);
  });
}

// Función para agregar al carrito con sesión
function addToCart(brand, name, type, size, price, image) {
  // 🔑 Obtener o crear sessionId
  let sessionId = sessionStorage.getItem("zhaicolezSessionId");

  if (!sessionId) {
    sessionId =
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

    sessionStorage.setItem("zhaicolezSessionId", sessionId);
  }

  // 🛒 Clave del carrito
  const cartKey = "zhaicolezCart_" + sessionId;

  // 📦 Obtener carrito actual
  let cart = [];
  const savedCart = localStorage.getItem(cartKey);

  if (savedCart) {
    cart = JSON.parse(savedCart);
  }

  // 🔍 Buscar si ya existe
  const existingIndex = cart.findIndex(
    (item) => item.brand === brand && item.name === name && item.size === size
  );

  // ➕ Agregar o sumar cantidad
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      brand,
      name,
      type,
      size,
      price,
      image,
      quantity: 1,
    });
  }

  // 💾 Guardar carrito
  localStorage.setItem(cartKey, JSON.stringify(cart));

  console.log("Producto agregado:", cart);

  // 🔔 Notificación
  showNotification("¡Producto agregado al carrito!");

  // 🔢 Actualizar contador
  updateCartBadge();
}
function addToCart(brand, name, type, size, price, image) {
  // 🔑 Obtener o crear sessionId
  let sessionId = sessionStorage.getItem("zhaicolezSessionId");

  if (!sessionId) {
    sessionId =
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

    sessionStorage.setItem("zhaicolezSessionId", sessionId);
  }

  // 🛒 Clave del carrito
  const cartKey = "zhaicolezCart_" + sessionId;

  // 📦 Obtener carrito actual
  let cart = [];
  const savedCart = localStorage.getItem(cartKey);

  if (savedCart) {
    cart = JSON.parse(savedCart);
  }

  // 🔍 Buscar si ya existe
  const existingIndex = cart.findIndex(
    (item) => item.brand === brand && item.name === name && item.size === size
  );

  // ➕ Agregar o sumar cantidad
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      brand,
      name,
      type,
      size,
      price,
      image,
      quantity: 1,
    });
  }

  // 💾 Guardar carrito
  localStorage.setItem(cartKey, JSON.stringify(cart));

  console.log("Producto agregado:", cart);

  // 🔔 Notificación
  showNotification("¡Producto agregado al carrito!");

  // 🔢 Actualizar contador
  updateCartBadge();
}

// Mostrar notificación
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #000;
      color: #fff;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Actualizar badge del carrito
function updateCartBadge() {
  const cartKey = "zhaicolezCart_" + sessionId;
  const savedCart = localStorage.getItem(cartKey);
  let badge = document.querySelector(".cart-badge");

  if (savedCart) {
    const cart = JSON.parse(savedCart);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems > 0) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "cart-badge";
        const cartLink = document.querySelector(
          ".header-icons span:last-child"
        );
        if (cartLink) {
          cartLink.style.position = "relative";
          cartLink.appendChild(badge);
        }
      }
      badge.textContent = totalItems;
    } else if (badge) {
      badge.remove();
    }
  }
}

// Limpiar carritos antiguos (más de 7 días)
function cleanOldCarts() {
  const now = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("zhaicolezCart_session_")) {
      try {
        const timestamp = parseInt(key.split("_")[2]);
        if (now - timestamp > maxAge) {
          localStorage.removeItem(key);
          console.log("Carrito antiguo eliminado:", key);
        }
      } catch (e) {
        console.log("Error al limpiar:", e);
      }
    }
  }
}

// =============================
// ESTILOS Y ANIMACIONES
// =============================

// Agregar animaciones CSS
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
    
    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #000;
      color: #fff;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }
  `;
document.head.appendChild(style);

// =============================
// INICIALIZACIÓN
// =============================

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  addCartButtons();
  updateCartBadge();
  cleanOldCarts();

  console.log("Sesión activa:", sessionId);
  console.log("Para nueva sesión, cierra el navegador completamente");
});

// También ejecutar después de que el buscador filtre productos
const originalBuscar = window.buscarPerfume;
window.buscarPerfume = function () {
  if (originalBuscar) originalBuscar();
  setTimeout(addCartButtons, 100);
};
function irArriba() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
