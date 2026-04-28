document.addEventListener("click", (event) => {
  const lightboxLink = event.target.closest("a.lightbox");

  if (!lightboxLink) {
    return;
  }

  event.preventDefault();

  const sourceImage = lightboxLink.querySelector("img");
  const overlay = document.createElement("div");
  const closeButton = document.createElement("button");
  const image = document.createElement("img");

  overlay.className = "lightbox-overlay";
  closeButton.className = "lightbox-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close image");
  closeButton.textContent = "Close";
  image.src = lightboxLink.href;
  image.alt = sourceImage?.alt || "";
  const isFloatingPortrait = lightboxLink.classList.contains("projects-floating-portrait");

  if (isFloatingPortrait) {
    overlay.classList.add("lightbox-overlay--portrait");
    image.classList.add("lightbox-image--portrait");
  }

  if (!isFloatingPortrait) {
    overlay.append(closeButton);
  }

  overlay.append(image);
  document.body.appendChild(overlay);
  document.body.classList.add("lightbox-open");

  if (isFloatingPortrait) {
    document.body.classList.add("lightbox-open--portrait");
  }

  requestAnimationFrame(() => {
    overlay.classList.add("is-visible");

    if (isFloatingPortrait && sourceImage) {
      const sourceRect = lightboxLink.getBoundingClientRect();
      const sourceStyles = window.getComputedStyle(lightboxLink);
      const padding = Math.max(12, Math.min(window.innerWidth * 0.03, 28));
      const availableWidth = window.innerWidth - padding * 2;
      const availableHeight = window.innerHeight - 56;
      const naturalWidth = sourceImage.naturalWidth || sourceRect.width;
      const naturalHeight = sourceImage.naturalHeight || sourceRect.height;
      const fitScale = Math.min(
        availableWidth / naturalWidth,
        availableHeight / naturalHeight,
        1
      );
      const targetWidth = naturalWidth * fitScale;
      const targetHeight = naturalHeight * fitScale;
      const targetLeft = (window.innerWidth - targetWidth) / 2;
      const targetTop = (window.innerHeight - targetHeight) / 2;
      const startTransform =
        sourceStyles.transform && sourceStyles.transform !== "none"
          ? sourceStyles.transform
          : "rotate(4deg)";

      image.style.position = "fixed";
      image.style.top = `${sourceRect.top}px`;
      image.style.left = `${sourceRect.left}px`;
      image.style.width = `${sourceRect.width}px`;
      image.style.height = `${sourceRect.height}px`;
      image.style.maxWidth = "none";
      image.style.maxHeight = "none";
      image.style.margin = "0";
      image.style.transformOrigin = "bottom center";
      image.style.transform = startTransform;
      image.style.zIndex = "1001";

      const portraitAnimation = image.animate(
        [
          {
            top: `${sourceRect.top}px`,
            left: `${sourceRect.left}px`,
            width: `${sourceRect.width}px`,
            height: `${sourceRect.height}px`,
            transform: startTransform,
          },
          {
            top: `${targetTop}px`,
            left: `${targetLeft}px`,
            width: `${targetWidth}px`,
            height: `${targetHeight}px`,
            transform: "rotate(-3deg)",
          },
        ],
        {
          duration: 360,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }
      );

      portraitAnimation.addEventListener(
        "finish",
        () => {
          image.style.position = "";
          image.style.top = "";
          image.style.left = "";
          image.style.width = "";
          image.style.height = "";
          image.style.maxWidth = "";
          image.style.maxHeight = "";
          image.style.margin = "";
          image.style.transformOrigin = "";
          image.style.transform = "";
          image.style.zIndex = "";
        },
        { once: true }
      );
    }
  });

  const closeLightbox = () => {
    overlay.classList.remove("is-visible");
    document.body.classList.remove("lightbox-open");
    document.body.classList.remove("lightbox-open--portrait");
    document.removeEventListener("keydown", handleKeydown);

    overlay.addEventListener(
      "transitionend",
      () => {
        overlay.remove();
      },
      { once: true }
    );
  };

  function handleKeydown(keydownEvent) {
    if (keydownEvent.key === "Escape") {
      closeLightbox();
    }
  }

  overlay.addEventListener("click", (overlayEvent) => {
    if (overlayEvent.target === overlay || overlayEvent.target === closeButton) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", handleKeydown);
});
