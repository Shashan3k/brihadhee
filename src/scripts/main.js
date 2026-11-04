/* Brihadhee — small progressive enhancements. No dependencies. */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
onScroll();
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
      corporate: "Corporate catering enquiry",
      event: "Event catering enquiry",
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
