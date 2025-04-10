// Seleccionar los emojis y el contenedor

const emojis = document.querySelectorAll(".emoji-list button");
const container = document.querySelector(".emoji-container");

// Verificar si los elementos existen
if (!emojis.length || !container) {
  console.error("No se encontraron emojis o contenedor");
} else {
  // Agregar eventos de clic a cada emoji
  emojis.forEach((emoji) => emoji.addEventListener("click", handleEmojiClick));
}

// Función para manejar el clic en un emoji
function handleEmojiClick(e) {
  // Crear un nuevo elemento para el emoji
  const emojiEl = document.createElement("button");
  emojiEl.classList.add("emoji-animate");

  // Obtener el emoji clicado
  const { innerHTML } = e.target;
  emojiEl.innerHTML = innerHTML;

  // Obtener posiciones dinámicas del botón clicado
  const { top, left, width } = e.target.getBoundingClientRect();
  const { left: containerLeft } = container.getBoundingClientRect();

  // Ajustar la posición inicial del emoji en el contenedor
  emojiEl.style.top = `${top}px`; // Centrar verticalmente
  emojiEl.style.left = `${left - containerLeft + width / 2}px`; // Centrar horizontalmente

  // Agregar el emoji al contenedor
  container.appendChild(emojiEl);

  // Animación
  const animation = emojiEl.animate(
    [
      {
        opacity: 1,
        transform: `translate(-50%, -50%) scale(1)`, // Posición inicial
      },
      {
        opacity: 0,
        transform: `translate(-50%, -700px) scale(0.7)`, // Mover hacia arriba y reducir tamaño
      },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(.47,.48,.44,.86)", // Curva de aceleración
    }
  );

  // Eliminar el elemento al finalizar la animación
  animation.onfinish = () => emojiEl.remove();
  animation.oncancel = () => emojiEl.remove(); // Manejar cancelaciones
}
