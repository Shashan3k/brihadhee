/* Brihadhee — small progressive enhancements. No dependencies. */

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

/* ---------------- Header + mobile menu ---------------- */
const header = document.getElementById("site-header");
const callbar = document.getElementById("callbar");
const navToggle = document.getElementById("nav-toggle");
const navPanel = document.getElementById("nav-panel");

const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 8);
  callbar?.classList.toggle("is-visible", y > 420);
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
    image.alt = item.dataset.alt || "";
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

/* ---------------- Enquiry form ---------------- */
const enquiryForm = document.getElementById("enquiry-form");

if (enquiryForm) {
  const status = enquiryForm.querySelector(".form__status");
  const inquiryType = enquiryForm.elements.namedItem("inquiryType");
  const eventFields = [...enquiryForm.querySelectorAll(".enquiry-event-field")];
  const setInquiryType = (type) => {
    if (!inquiryType) return;
    inquiryType.value = type;
    eventFields.forEach((field) => {
      field.hidden = type !== "event";
    });
  };

  setInquiryType(enquiryForm.dataset.defaultInquiry || "general");
  inquiryType?.addEventListener("change", () => setInquiryType(inquiryType.value));
  document.querySelectorAll("[data-inquiry]").forEach((link) => {
    link.addEventListener("click", () => {
      setInquiryType(link.dataset.inquiry);
      enquiryForm.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      enquiryForm.querySelector("#enquiry-type")?.focus({ preventScroll: true });
    });
  });

  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;

    const data = new FormData(enquiryForm);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();
    const typeLabel = {
      general: "General enquiry",
    }[String(data.get("inquiryType") || "general")];
    const eventDate = String(data.get("eventDate") || "").trim();
    const guestCount = String(data.get("guestCount") || "").trim();
    const details = [
      typeLabel,
      eventDate && `Event date: ${eventDate}`,
      guestCount && `Estimated guests: ${guestCount}`,
    ].filter(Boolean).join("\n");
    const text = `Enquiry from ${name}${phone ? ` (${phone})` : ""}\n${details}\n\n${message}`;

    if (enquiryForm.dataset.channel === "whatsapp" && enquiryForm.dataset.whatsapp) {
      const url = `https://wa.me/${enquiryForm.dataset.whatsapp}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener");
      if (status) status.textContent = "Opening WhatsApp — press send there.";
    } else if (enquiryForm.dataset.email) {
      const url = `mailto:${enquiryForm.dataset.email}?subject=${encodeURIComponent(
        `Website enquiry from ${name}`
      )}&body=${encodeURIComponent(text)}`;
      window.location.href = url;
      if (status) status.textContent = "Opening your email app…";
    }
  });
}

/* ---------------- Analytics (GA4 and Meta Pixel, each only when its ID is set) ----------------
 * One delegated listener. An explicit data-event="name" wins; otherwise the
 * event is inferred from the link: tel: -> call_click, wa.me -> whatsapp_click,
 * Google Maps -> directions_click, booking partners -> book_click, delivery
 * apps -> order_click. Forms with data-event fire that event on submit.
 * Menu tabs carry data-event="menu_filter_use". No personal data is sent.
 *
 * The same names map to Meta standard events (META_EVENTS) so ads can optimise
 * for them. Events without a mapping (menu_filter_use) are not sent to Meta.
 */
const META_EVENTS = {
  call_click: ["Contact", { content_name: "call" }],
  whatsapp_click: ["Contact", { content_name: "whatsapp" }],
  directions_click: ["FindLocation", {}],
  book_click: ["Schedule", {}],
  order_click: ["Contact", { content_name: "order" }],
  enquiry_submit: ["Lead", { content_name: "website enquiry form" }],
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
  // Fires only after the browser's own validation passes (the form uses reportValidity on submit).
  enquiryForm?.addEventListener("submit", () => {
    if (enquiryForm.checkValidity()) trackMeta(enquiryForm.dataset.event || "");
  });
}
function inferEvent(el) {
  if (el.dataset.event) return el.dataset.event;
  const href = el.getAttribute("href") || "";
  if (href.startsWith("tel:")) return "call_click";
  if (/wa\.me|api\.whatsapp\.com/.test(href)) return "whatsapp_click";
  if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/.test(href)) return "directions_click";
  if (/eazydiner\.com|\/dineout|district\.in/.test(href)) return "book_click";
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
  document.addEventListener("submit", (e) => {
    const form = e.target;
    if (form instanceof HTMLFormElement && form.dataset.event) window.gtag("event", form.dataset.event, { page_path: location.pathname });
  });
}
