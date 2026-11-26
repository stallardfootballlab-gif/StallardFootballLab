(function () {
  const init = () => {
    document.querySelectorAll(".sfl-nav-toggle").forEach((toggle) => {
      if (toggle.dataset.navBound) return;
      toggle.dataset.navBound = "1";
      let root = toggle.parentElement;
      while (root && !root.querySelector(".sfl-nav-panel"))
        root = root.parentElement;
      const panel = root ? root.querySelector(".sfl-nav-panel") : null;
      if (!panel) return;
      const setOpen = (open) => {
        panel.classList.toggle("hidden", !open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute(
          "aria-label",
          open ? "Close menu" : "Open menu",
        );
      };
      toggle.addEventListener("click", () =>
                              setOpen(panel.classList.contains("hidden")),
                             );
      panel
        .querySelectorAll("a")
        .forEach((link) =>
                 link.addEventListener("click", () => setOpen(false)),
                );
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setOpen(false);
      });
    });

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!reduce && "IntersectionObserver" in window) {
      const items = document.querySelectorAll(
        ".sfl-reveal:not([data-reveal-bound])",
      );
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove("sfl-hidden");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );
      items.forEach((el) => {
        el.dataset.revealBound = "1";
        const siblings = el.parentElement
        ? Array.from(el.parentElement.children).filter((c) =>
                                                       c.classList.contains("sfl-reveal"),
                                                      )
        : [el];
        const index = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = index * 90 + "ms";
        el.classList.add("sfl-hidden");
        io.observe(el);
      });
    }

    document
      .querySelectorAll(".sfl-count:not([data-count-bound])")
      .forEach((el) => {
      el.dataset.countBound = "1";
      const target = parseInt(el.dataset.count, 10);
      if (
        reduce ||
        isNaN(target) ||
        !("IntersectionObserver" in window)
      )
        return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            obs.disconnect();
            const start = performance.now();
            const duration = 1200;
            const step = (now) => {
              const p = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              el.textContent = String(
                Math.round(target * eased),
              );
              if (p < 1) requestAnimationFrame(step);
            };
            el.textContent = "0";
            requestAnimationFrame(step);
          });
        },
        { threshold: 0.5 },
      );
      obs.observe(el);
    });

    document
      .querySelectorAll(".sfl-form:not([data-form-bound])")
      .forEach((form) => {
      form.dataset.formBound = "1";
      const note = form.querySelector(".sfl-form-note");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (note) note.classList.remove("hidden");
        form.reset();
      });
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
