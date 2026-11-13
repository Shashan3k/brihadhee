/* Brihadhee — small progressive enhancements. No dependencies (the quote message
   builder is shared with the server, from src/lib/lead.js). */
import { quoteWhatsAppText } from "../lib/lead.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- Hero perspective showcase ---------------- */
const heroShowcase = document.querySelector("[data-hero-showcase]");
const heroSection = heroShowcase?.closest(".hero");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

if (heroShowcase && heroSection && finePointer.matches && !reducedMotionPreference.matches) {
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;

  const updateShowcase = () => {
    heroShowcase.style.setProperty("--tilt-x", `${(pointerY * -10).toFixed(2)}deg`);
    heroShowcase.style.setProperty("--tilt-y", `${(pointerX * 10).toFixed(2)}deg`);
    heroShowcase.style.setProperty("--badge-x", `${(pointerX * 9).toFixed(1)}px`);
    heroShowcase.style.setProperty("--badge-y", `${(pointerY * 8).toFixed(1)}px`);
    frame = 0;
  };

  heroSection.addEventListener("pointermove", (event) => {
    const bounds = heroSection.getBoundingClientRect();
    pointerX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
    pointerY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
    if (!frame) frame = requestAnimationFrame(updateShowcase);
  }, { passive: true });

  heroSection.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
    if (!frame) frame = requestAnimationFrame(updateShowcase);
  });
}

/* ---------------- Hero slideshow (Hero.astro) ----------------
 * Cross-fades the hero photos every SLIDE_MS. Pauses while the pointer is over the
 * photo, while a control has focus and while the tab is hidden; the pause button
 * stops it for good (WCAG 2.2.2). With reduced motion it starts paused. Without
 * JavaScript the first photo shows alone and the controls stay hidden. */
const heroSlides = document.querySelector("[data-hero-slides]");
const slideItems = heroSlides ? [...heroSlides.querySelectorAll("[data-hero-slide]")] : [];
const slideControls = document.querySelector("[data-hero-slides-controls]");

if (heroSlides && slideControls && slideItems.length > 1) {
  const SLIDE_MS = 2300; // client direction 2026-11-13: a new photo every 2.3 s
  const stage = heroSlides.closest("[data-hero-showcase]") ?? heroSlides;
  const track = heroSlides.querySelector(".hero-slides__track");
  const dots = [...slideControls.querySelectorAll("[data-slide-to]")];
  const toggle = slideControls.querySelector("[data-slide-toggle]");
  let current = 0;
  let timer = 0;
  let paused = reducedMotion; // set by the pause button
  let hovering = false;
  let focused = false;

  const show = (index) => {
    current = (index + slideItems.length) % slideItems.length;
    slideItems.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle("is-active", active);
      if (active) slide.removeAttribute("aria-hidden");
      else slide.setAttribute("aria-hidden", "true");
    });
    dots.forEach((dot, i) => {
      if (i === current) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  };

  const stop = () => {
    clearInterval(timer);
    timer = 0;
  };
  const start = () => {
    stop();
    if (paused || hovering || focused || document.hidden) return;
    timer = setInterval(() => show(current + 1), SLIDE_MS);
  };

  const syncToggle = () => {
    toggle?.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
    toggle?.setAttribute("data-state", paused ? "paused" : "playing");
    // Announce slide changes only when the visitor is driving them.
    track?.setAttribute("aria-live", paused ? "polite" : "off");
  };

  slideControls.querySelector("[data-slide-prev]")?.addEventListener("click", () => {
    show(current - 1);
    start();
  });
  slideControls.querySelector("[data-slide-next]")?.addEventListener("click", () => {
    show(current + 1);
    start();
  });
  dots.forEach((dot) =>
    dot.addEventListener("click", () => {
      show(Number(dot.dataset.slideTo));
      start();
    })
  );
  toggle?.addEventListener("click", () => {
    paused = !paused;
    syncToggle();
    start();
  });

  stage.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") return;
    hovering = true;
    stop();
  });
  stage.addEventListener("pointerleave", () => {
    hovering = false;
    start();
  });
  stage.addEventListener("focusin", () => {
    focused = true;
    stop();
  });
  stage.addEventListener("focusout", (event) => {
    if (stage.contains(event.relatedTarget)) return;
    focused = false;
    start();
  });
  document.addEventListener("visibilitychange", start);

  // Swipe on touch screens.
  let swipeX = null;
  heroSlides.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") swipeX = event.clientX;
  }, { passive: true });
  heroSlides.addEventListener("pointerup", (event) => {
    if (swipeX === null) return;
    const dx = event.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) < 40) return;
    show(current + (dx < 0 ? 1 : -1));
    start();
  }, { passive: true });
  heroSlides.addEventListener("pointercancel", () => {
    swipeX = null;
  });

  slideControls.hidden = false;
  syncToggle();
  start();
}

/* ---------------- Header + mobile menu ---------------- */
const header = document.getElementById("site-header");
const navToggle = document.getElementById("nav-toggle");
const navPanel = document.getElementById("nav-panel");

const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 8);
};
requestAnimationFrame(onScroll); // first check after the first frame, so it does not force an early layout
window.addEventListener("scroll", onScroll, { passive: true });

if (navToggle && navPanel) {
  const label = navToggle.querySelector(".visually-hidden");

  const setMenuOpen = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    navPanel.hidden = !open;
    if (label) label.textContent = open ? "Close menu" : "Open menu";
  };

  navToggle.addEventListener("click", () => {
    setMenuOpen(navToggle.getAttribute("aria-expanded") !== "true");
  });

  navPanel.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  // A tap outside the open drawer (on the dimmed page) closes it.
  document.addEventListener("click", (event) => {
    if (navPanel.hidden || navPanel.contains(event.target) || navToggle.contains(event.target)) return;
    setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !navPanel.hidden) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });

  window
    .matchMedia("(min-width: 900px)")
    .addEventListener("change", (event) => {
      if (event.matches) setMenuOpen(false);
    });
}

/* ---------------- Scroll spy ---------------- */
const navLinks = [...document.querySelectorAll(".nav__links a[href^='#']")];
const spiedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (spiedSections.length && "IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  spiedSections.forEach((section) => spy.observe(section));
}

/* ---------------- Menu tabs ---------------- */
const menuWidget = document.getElementById("menu-widget");

if (menuWidget) {
  const tabs = [...menuWidget.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) =>
    document.getElementById(tab.getAttribute("aria-controls"))
  );

  const selectTab = (index, moveFocus = false) => {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (panels[i]) panels[i].hidden = !selected;
    });
    if (moveFocus) tabs[index].focus();
  };

  if (tabs.length) {
    menuWidget.dataset.enhanced = "true";
    selectTab(0);

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => selectTab(i));
      tab.addEventListener("keydown", (event) => {
        const last = tabs.length - 1;
        let next = null;
        if (event.key === "ArrowRight") next = i === last ? 0 : i + 1;
        else if (event.key === "ArrowLeft") next = i === 0 ? last : i - 1;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = last;
        if (next !== null) {
          event.preventDefault();
          selectTab(next, true);
        }
      });
    });
  }
}

/* ---------------- Lightbox ---------------- */
const lightbox = document.getElementById("lightbox");
const galleryItems = [...document.querySelectorAll("[data-gallery-item]")];

if (lightbox && galleryItems.length) {
  const image = document.getElementById("lightbox-image");
  const caption = document.getElementById("lightbox-caption");
  const closeBtn = lightbox.querySelector("[data-lightbox-close]");
  const prevBtn = lightbox.querySelector("[data-lightbox-prev]");
  const nextBtn = lightbox.querySelector("[data-lightbox-next]");
  let current = 0;
  let opener = null;

  const show = (index) => {
    current = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[current];
    image.src = item.dataset.src || "";
    image.alt = item.dataset.alt || "Enlarged photo from the Brihadhee gallery";
    caption.textContent = item.dataset.caption || "";
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      opener = item;
      show(index);
      if (typeof lightbox.showModal === "function") lightbox.showModal();
    });
  });

  closeBtn?.addEventListener("click", () => lightbox.close());
  prevBtn?.addEventListener("click", () => show(current - 1));
  nextBtn?.addEventListener("click", () => show(current + 1));

  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(current + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(current - 1);
    }
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener("close", () => {
    image.removeAttribute("src");
    setTimeout(() => {
      if (opener && typeof opener.focus === "function") opener.focus();
    }, 0);
  });
}

/* ---------------- Opening hours ---------------- */
const statusEl = document.getElementById("open-status");
const hoursData = document.getElementById("hours-data");

if (statusEl && hoursData) {
  try {
    const { timeZone, days } = JSON.parse(hoursData.textContent || "{}");
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date()).map((part) => [part.type, part.value])
    );
    const todayName = parts.weekday;
    const nowMinutes = Number(parts.hour) * 60 + Number(parts.minute);
    const toMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };
    const pretty = (time) => {
      const [h, m] = time.split(":").map(Number);
      const suffix = h >= 12 ? "pm" : "am";
      const hour = h % 12 === 0 ? 12 : h % 12;
      return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
    };

    const today = days.find((day) => day.day === todayName);
    let isOpen = false;

    if (today?.open && today?.close) {
      const opens = toMinutes(today.open);
      const closes = toMinutes(today.close);
      isOpen =
        closes > opens
          ? nowMinutes >= opens && nowMinutes < closes
          : nowMinutes >= opens || nowMinutes < closes;
    }

    // Yesterday's hours can roll past midnight.
    const todayIndex = days.findIndex((day) => day.day === todayName);
    const yesterday = days[(todayIndex - 1 + days.length) % days.length];
    if (!isOpen && yesterday?.open && yesterday?.close) {
      const yOpens = toMinutes(yesterday.open);
      const yCloses = toMinutes(yesterday.close);
      if (yCloses < yOpens && nowMinutes < yCloses) isOpen = true;
    }

    let message;
    if (isOpen) {
      message = `Open now · closes ${pretty(today.close)}`;
    } else if (today?.open && nowMinutes < toMinutes(today.open)) {
      message = `Closed · opens ${pretty(today.open)}`;
    } else {
      let next = null;
      let daysAhead = 0;
      for (let step = 1; step <= days.length; step += 1) {
        const day = days[(todayIndex + step) % days.length];
        if (day?.open) {
          next = day;
          daysAhead = step;
          break;
        }
      }
      message = next
        ? `Closed · opens ${daysAhead === 1 ? "tomorrow" : next.day} ${pretty(next.open)}`
        : "Closed";
    }

    statusEl.textContent = message;
    statusEl.classList.add(isOpen ? "status--open" : "status--closed");
    statusEl.hidden = false;

    document.querySelectorAll(".visit__row").forEach((row) => {
      row.classList.toggle("is-today", row.dataset.day === todayName);
    });
  } catch {
    statusEl.hidden = true;
  }
}

/* ---------------- Scroll reveals ---------------- */
const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-in"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    revealItems.forEach((item) => observer.observe(item));
  }
}

/* ---------------- Lead / quote forms (LeadForm.astro -> /api/lead) ----------------
 * Without JavaScript the form posts normally and the function redirects back with
 * ?lead=sent|invalid|error. With JavaScript it is sent with fetch and the result is
 * shown in place. catering_quote_submit fires only after the server accepts the lead.
 * No personal data is sent to analytics: only the form type and headcount band. */
const LEAD_MESSAGES = {
  sent: "Thank you. Your request has reached the Brihadhee team, and they will call you back.",
  whatsapp: "WhatsApp has opened with your details. Press send there to reach the Brihadhee catering team.",
  invalid: "Some details were missing or not valid. Please check the form and send it again.",
  error: "Sorry, the form could not be sent just now. Please call or WhatsApp us instead.",
};
const leadForms = [...document.querySelectorAll("form[data-lead-form]")];
const leadStatusFromUrl = new URLSearchParams(location.search).get("lead");

leadForms.forEach((form) => {
  const started = form.querySelector("[data-started-at]");
  if (started) started.value = String(Date.now());
  const status = form.querySelector("[data-lead-status]");
  const result = form.closest("section")?.querySelector("[data-lead-result]");
  const button = form.querySelector('button[type="submit"]');
  const show = (key) => {
    if (result) {
      result.textContent = LEAD_MESSAGES[key] || "";
      result.hidden = !result.textContent;
    }
    if (status) status.textContent = LEAD_MESSAGES[key] || "";
  };
  if (leadStatusFromUrl && LEAD_MESSAGES[leadStatusFromUrl]) show(leadStatusFromUrl);

  /* Quote builder: the 50-guest floor, shown inline while typing (QuoteBuilder.astro). */
  const minGuests = Number(form.dataset.minGuests || 0);
  const guestsInput = form.querySelector('input[name="guests"]');
  const guestsNote = form.querySelector("[data-guests-note]");
  if (minGuests && guestsInput) {
    const checkGuests = () => {
      const v = guestsInput.value.trim();
      const low = v !== "" && Number(v) < minGuests;
      if (guestsNote) guestsNote.hidden = !low;
      guestsInput.setCustomValidity(low ? `Brihadhee caters functions from ${minGuests} guests.` : "");
    };
    guestsInput.addEventListener("input", checkGuests);
    checkGuests();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));

    /* WhatsApp quote mode, only when ENABLE_LIVE_WHATSAPP_QUOTE_FORM is on (the
       attribute is rendered only then). Open WhatsApp inside the click, then post
       a copy to /api/lead in the background. */
    if (form.dataset.whatsappQuote) {
      const url = `https://wa.me/${form.dataset.whatsappQuote}?text=${encodeURIComponent(quoteWhatsAppText(data))}`;
      window.open(url, "_blank", "noopener");
      fetch(form.action, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      }).catch(() => {});
      show("whatsapp");
      track("catering_quote_whatsapp", { form_type: "quote", headcount: data.guests || "" });
      return;
    }

    if (button) button.disabled = true;
    if (status) status.textContent = "Sending…";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        show("sent");
        form.reset();
        if (started) started.value = String(Date.now());
        track("catering_quote_submit", { form_type: form.dataset.formType || "general", headcount: data.headcount || data.guests || "" });
      } else {
        show(res.status === 422 ? "invalid" : "error");
      }
    } catch {
      show("error");
    } finally {
      if (button) button.disabled = false;
    }
  });
});

/* ---------------- Analytics (GA4 and Meta Pixel, each only when its ID is set) ----------------
 * One delegated listener. An explicit data-event="name" wins; otherwise the
 * event is inferred from the link: tel: -> click_call, wa.me -> click_whatsapp,
 * Google Maps -> directions_click, booking partners and /book-a-table/ ->
 * book_table_click, delivery apps -> order_click. A lead form fires
 * catering_quote_submit only after /api/lead accepts it (see above).
 * Menu tabs carry data-event="menu_filter_use". No personal data is sent.
 *
 * The same names map to Meta standard events (META_EVENTS) so ads can optimise
 * for them. Events without a mapping (menu_filter_use) are not sent to Meta.
 */
const META_EVENTS = {
  click_call: ["Contact", { content_name: "call" }],
  click_whatsapp: ["Contact", { content_name: "whatsapp" }],
  directions_click: ["FindLocation", {}],
  book_table_click: ["Schedule", {}],
  order_click: ["Contact", { content_name: "order" }],
  catering_quote_submit: ["Lead", { content_name: "catering quote form" }],
};
function trackMeta(name) {
  const mapped = META_EVENTS[name];
  if (mapped && typeof window.fbq === "function") window.fbq("track", mapped[0], mapped[1]);
}
if (typeof window.fbq === "function") {
  document.addEventListener("click", (e) => {
    const el = e.target instanceof Element ? e.target.closest("a[href], [data-event]") : null;
    if (!el || el.tagName === "FORM") return;
    trackMeta(inferEvent(el));
  });
}
function inferEvent(el) {
  if (el.dataset.event) return el.dataset.event;
  const href = el.getAttribute("href") || "";
  if (href.startsWith("tel:")) return "click_call";
  if (/wa\.me|api\.whatsapp\.com/.test(href)) return "click_whatsapp";
  if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/.test(href)) return "directions_click";
  if (/eazydiner\.com|\/dineout|district\.in|\/book-a-table\/?(?:[#?]|$)/.test(href)) return "book_table_click";
  if (/swiggy\.com|zomato\.com/.test(href)) return "order_click";
  return "";
}
if (typeof window.gtag === "function") {
  document.addEventListener("click", (e) => {
    const el = e.target instanceof Element ? e.target.closest("a[href], [data-event]") : null;
    if (!el || el.tagName === "FORM") return;
    const name = inferEvent(el);
    if (name) window.gtag("event", name, { link_text: (el.textContent || "").trim().slice(0, 60), page_path: location.pathname });
  });
}

/** Send one named event to GA4 and Meta (each only when loaded). */
function track(name, params = {}) {
  if (typeof window.gtag === "function") window.gtag("event", name, { ...params, page_path: location.pathname });
  trackMeta(name);
}

/* ---------------- Nav dropdowns: Menu and Catering (Nav.astro <details>) ----------------
 * Desktop dropdowns and the mobile drawer's groups. They work without JavaScript;
 * this only closes them on outside click, on Escape, and when another group opens. */
const navGroups = [...document.querySelectorAll("[data-nav-group]")];
navGroups.forEach((g) =>
  g.addEventListener("toggle", () => {
    if (g.open) navGroups.forEach((o) => o !== g && (o.open = false));
  })
);
document.addEventListener("click", (e) => {
  navGroups.forEach((g) => g.open && !g.contains(e.target) && (g.open = false));
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  navGroups.forEach((g) => {
    if (g.open) {
      g.open = false;
      g.querySelector("summary")?.focus();
    }
  });
});

/* ---------------- Menu page category index (menu.astro) ----------------
 * Highlights the category being read and keeps its chip in view in the
 * horizontally scrolling index. Plain in-page links without JavaScript. */
const jumpLinks = [...document.querySelectorAll(".menu-page__jump a[href^='#']")];
const jumpTargets = jumpLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

if (jumpTargets.length && "IntersectionObserver" in window) {
  const list = jumpLinks[0].closest("ul");
  const mark = (id) => {
    jumpLinks.forEach((a) => {
      const on = a.getAttribute("href") === `#${id}`;
      if (on) {
        a.setAttribute("aria-current", "true");
        if (list) {
          const left = a.offsetLeft - (list.clientWidth - a.offsetWidth) / 2;
          list.scrollTo({ left, behavior: reducedMotion ? "auto" : "smooth" });
        }
      } else a.removeAttribute("aria-current");
    });
  };
  const watch = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && mark(e.target.id)),
    { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
  );
  jumpTargets.forEach((t) => watch.observe(t));
}
