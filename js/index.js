const DECISION_THRESHOLD = 100; // distancia mínima para considerar una decisión
let isAnimating = false;
let pullDeltax = 0; // distancia que la card se está moviendo
let startX = 0; // posición inicial del mouse o dedo
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".is-remove");
  if (button) {
    button.addEventListener("click", () => {
      // Deshabilitar el botón para evitar múltiples clics
      button.disabled = true;

      const cardsContainer = document.querySelector(".cards");

      // Seleccionar el último hijo que sea un <article>
      //array.from() convierte la colección de nodos en un array
      // y luego se invierte el orden para buscar de abajo hacia arriba
      // y se busca el primer elemento que sea un <article>
      const actualCard = Array.from(cardsContainer?.children)
        .reverse() // Invertir el orden para buscar de abajo hacia arriba
        .find((child) => child.tagName === "ARTICLE");

      if (actualCard) {
        actualCard.style.transition = "transform 0.5s ease";
        // Deslizar la tarjeta hacia la izquierda
        actualCard.classList.add("go-left");

        // Eliminar la tarjeta después de la animación
        actualCard.addEventListener(
          "transitionend",
          () => {
            actualCard.remove();
          },
          { once: true }
        );
      } else {
        console.log("No hay más tarjetas disponibles.");
      }

      // Volver a habilitar el botón después de 1 segundo
      setTimeout(() => {
        button.disabled = false;
      }, 500); // 1000 ms = 1 segundo
    });
  }
});

function startDrag(e) {
  if (isAnimating) return;

  // evento mas cercano al article
  const actualCard = e.target.closest("article");

  if (!actualCard) return; // Si no hay una card, salir

  // Posición inicial del mouse o dedo
  // si pageX no está disponible, se usa touches[0].pageX

  startX = e.pageX ?? (e.touches && e.touches[0]?.pageX); // Obtener posición inicial

  // Añadir eventos para mover y soltar
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);

  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });

  function onMove(e) {
    //coorderenadas del mouse o dedo
    const currentX = e.pageX ?? e.touches[0]?.pageX;
    pullDeltax = currentX - startX; // Calcular distancia movida

    if (pullDeltax === 0) return;

    isAnimating = true;

    // Calcular rotación y movimiento
    const deg = pullDeltax / 14;
    actualCard.style.transform = `translateX(${pullDeltax}px) rotate(${deg}deg)`;
    actualCard.style.cursor = "grabbing";

    // Calcular opacidad en función de la distancia movida
    const opacity = Math.min(Math.abs(pullDeltax) / 100, 1); // Limitar opacidad a un máximo de 1
    const isRigth = pullDeltax > 0;

    // Seleccionar el elemento de elección (like o nope)
    const choiceEL = isRigth
      ? actualCard.querySelector(".choice.like")
      : actualCard.querySelector(".choice.nope");

    if (choiceEL) {
      choiceEL.style.opacity = opacity; // Cambiar opacidad dinámicamente
    }
  }

  function onEnd(e) {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);

    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onEnd);

    // la decicison se toma si la distancia es mayor a DECISION_THRESHOLD
    const decisionMade = Math.abs(pullDeltax) >= DECISION_THRESHOLD;

    // Si se toma una decisión, se anima la card hacia la izquierda o derecha
    if (decisionMade) {
      const goRigth = pullDeltax >= 0;
      actualCard.classList.add(goRigth ? "go-right" : "go-left");

      //cuando se toma una desición, se oculta la card
      actualCard.addEventListener("transitionend", () => {
        actualCard.remove();
      });
    } else {
      // Si no se toma una decisión, regresa a su posición original
      actualCard.classList.add("reset");
      actualCard.classList.remove("go-left", "go-right");

      // Reinicia la opacidad de las opciones
      actualCard.querySelectorAll(".choice").forEach((el) => {
        el.style.transition = "opacity 0.3s ease"; // Asegura la transición
        el.style.opacity = 0; // Oculta las opciones suavemente
      });

      // Resetear variables y estilos al finalizar la transición
    }
    actualCard.addEventListener(
      "transitionend",
      () => {
        actualCard.removeAttribute("style");
        actualCard.classList.remove("reset");

        pullDeltax = 0;
        isAnimating = false;
      },
      { once: true }
    );
  }
}

// Detectar inicio del arrastre con mouse o toque
document.addEventListener("mousedown", startDrag);
document.addEventListener("touchstart", startDrag, { passive: true });
