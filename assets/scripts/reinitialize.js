(() => {
  document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("htmx:afterSwap", () => {
      // Reinitialize logic here
      MathJax?.typesetPromise();
    });
  });
})();
