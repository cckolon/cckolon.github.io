(() => {
  document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("htmx:afterSwap", () => {
      MathJax?.typesetPromise();
    });
  });
})();
