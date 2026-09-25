/* La Torre dell'Alchimista — interazioni di base */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".nav__links a")
  );

  /* --- anno nel footer --- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* --- nav opaca dopo lo scroll --- */
  function onScroll() {
    nav.classList.toggle("is-stuck", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- menu mobile --- */
  function closeMenu() {
    menu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Apri il menu");
  }

  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
  });

  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------------------------------------------------------
     Comparsa allo scroll, reversibile

     L'elemento entra quando sale oltre il bordo inferiore e si
     richiude quando ci ritorna sotto: scorrendo avanti e indietro
     la scena si ricompone ogni volta.

     Chi esce dal BORDO SUPERIORE resta invece visibile. Toglierlo
     lì vorrebbe dire far sparire un testo che si sta ancora
     leggendo, mentre esce dall'alto da solo: è il bordo sbagliato.
     Il segno di boundingClientRect.top distingue i due casi.

     Il ritardo di ognuno sta nella variabile --d nell'HTML, quindi
     qui basta aggiungere e togliere la classe.
     --------------------------------------------------------- */
  var reveal = document.querySelectorAll("[data-reveal]");

  /* margine inferiore: l'elemento deve entrare di un po' prima di
     accendersi — lo stesso valore serve al paracadute qui sotto */
  var SOGLIA = 0.08;

  if ("IntersectionObserver" in window && reveal.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
          } else if (e.boundingClientRect.top > 0) {
            /* è finito sotto al bordo inferiore: si sta tornando
               indietro, quindi si richiude */
            e.target.classList.remove("is-in");
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -" + SOGLIA * 100 + "% 0px" }
    );

    reveal.forEach(function (el) {
      io.observe(el);
    });

    /* Paracadute non invasivo: dopo 2,5s accende solo ciò che è già
       in vista, nel caso l'osservatore non fosse partito. Usa la
       stessa soglia, altrimenti accenderebbe elementi che
       l'osservatore spegnerebbe subito dopo. */
    setTimeout(function () {
      var limite = window.innerHeight * (1 - SOGLIA);
      reveal.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < limite && r.bottom > 0) el.classList.add("is-in");
      });
    }, 2500);
  } else {
    reveal.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* ---------------------------------------------------------
     Voce di menu attiva

     Le sezioni sono position:sticky, quindi più d'una può trovarsi
     contemporaneamente incollata in cima allo schermo: un
     IntersectionObserver ne vedrebbe diverse "in vista" insieme e
     la voce attiva ballerebbe. Si guarda invece la posizione dello
     scroll contro le posizioni di flusso delle sezioni, misurate a
     pagina ferma e rimisurate al ridimensionamento.
     --------------------------------------------------------- */
  var sections = links
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  if (sections.length) {
    var main = document.querySelector("main");
    var punti = [];

    /* Le posizioni si accumulano sommando le altezze: offsetTop e
       getBoundingClientRect di una sezione sticky riportano la posizione
       *incollata*, non quella di flusso, e darebbero risultati diversi a
       seconda di dove ci si trova quando si misura. offsetHeight no. */
    function misura() {
      var y = main.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
      punti = sections.map(function (s) {
        var p = { id: s.id, y: y };
        y += s.offsetHeight;
        return p;
      });
    }

    function attiva() {
      var mira = (window.scrollY || window.pageYOffset) + window.innerHeight / 2;
      var corrente = punti[0];
      for (var i = 0; i < punti.length; i++) {
        if (punti[i].y <= mira) corrente = punti[i];
      }
      links.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + corrente.id);
      });
    }

    /* a pagina appena caricata nulla è ancora incollato: è il momento
       giusto per leggere le posizioni di flusso */
    misura();
    attiva();
    window.addEventListener("scroll", attiva, { passive: true });
    window.addEventListener("resize", function () {
      misura();
      attiva();
    });
    window.addEventListener("load", function () {
      misura();
      attiva();
    });
  }
})();
