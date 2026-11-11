(function () {
  var TZ = "Australia/Brisbane";

  function storedTheme() {
    try {
      return localStorage.getItem("tridan-theme");
    } catch (e) {
      return null;
    }
  }
  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    try {
      localStorage.setItem("tridan-theme", theme === "dark" ? "dark" : "light");
    } catch (e) {}
  }
  var initial = storedTheme();
  applyTheme(initial === "dark" || initial === "light" ? initial : systemTheme());
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var now = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(now);
    });
  }

  function ymdInTz(date) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  }
  function addDays(ymd, days) {
    var p = ymd.split("-").map(Number);
    var dt = new Date(Date.UTC(p[0], p[1] - 1, p[2] + days));
    var y = dt.getUTCFullYear();
    var m = String(dt.getUTCMonth() + 1).padStart(2, "0");
    var d = String(dt.getUTCDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }
  function dow(ymd) {
    var p = ymd.split("-").map(Number);
    return new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay();
  }
  function dayParts(ymd) {
    var p = ymd.split("-").map(Number);
    var dt = new Date(Date.UTC(p[0], p[1] - 1, p[2], 12));
    return {
      weekday: new Intl.DateTimeFormat("en-AU", { weekday: "short", timeZone: "UTC" }).format(dt),
      day: new Intl.DateTimeFormat("en-AU", { day: "numeric", timeZone: "UTC" }).format(dt),
      month: new Intl.DateTimeFormat("en-AU", { month: "short", timeZone: "UTC" }).format(dt),
    };
  }

  function selectGroup(root, onChange) {
    if (!root) return;
    root.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn || !root.contains(btn) || btn.disabled) return;
      root.querySelectorAll("button").forEach(function (b) {
        b.classList.remove("is-on");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-on");
      btn.setAttribute("aria-pressed", "true");
      if (onChange) onChange();
    });
  }

  function fillDays(dayRoot) {
    var today = ymdInTz(new Date());
    var html = "";
    var firstOn = false;
    for (var i = 0; i < 14; i++) {
      var ymd = addDays(today, i);
      var w = dow(ymd);
      var parts = dayParts(ymd);
      var weekend = w === 0 || w === 6;
      var on = !weekend && !firstOn;
      if (on) firstOn = true;
      html +=
        '<button type="button" class="chip' +
        (on ? " is-on" : "") +
        '" data-date="' +
        ymd +
        '" data-label="' +
        parts.weekday +
        " " +
        parts.day +
        " " +
        parts.month +
        '" aria-pressed="' +
        (on ? "true" : "false") +
        '"' +
        (weekend ? " disabled" : "") +
        '><span class="dow">' +
        parts.weekday +
        '</span><span class="dom">' +
        parts.day +
        '</span><span class="mon">' +
        parts.month +
        "</span></button>";
    }
    dayRoot.innerHTML = html;
  }

  function bindBook(root) {
    var dayRoot = root.querySelector(".day-chips");
    var summaryEl = root.querySelector(".summary") || document.getElementById("book-summary");
    if (dayRoot) fillDays(dayRoot);
    function bookSummary() {
      var dayBtn = root.querySelector(".day-chips .is-on");
      var timeBtn = root.querySelector(".time-pills .is-on");
      var jobBtn = root.querySelector(".job-chips .is-on");
      var bits = [];
      if (dayBtn) bits.push(dayBtn.getAttribute("data-label"));
      if (timeBtn) bits.push(timeBtn.textContent.trim());
      if (jobBtn) bits.push(jobBtn.textContent.trim());
      var line = bits.join(" · ");
      if (summaryEl) summaryEl.textContent = line;
      return line;
    }
    selectGroup(dayRoot, bookSummary);
    selectGroup(root.querySelector(".time-pills"), bookSummary);
    selectGroup(root.querySelector(".job-chips"), bookSummary);
    bookSummary();
    root.addEventListener("submit", function (e) {
      e.preventDefault();
      var dayBtn = root.querySelector(".day-chips .is-on");
      var timeBtn = root.querySelector(".time-pills .is-on");
      var jobBtn = root.querySelector(".job-chips .is-on");
      var nameEl = root.querySelector("[name=bname], #b-name");
      var phoneEl = root.querySelector("[name=bphone], #b-phone");
      var name = (nameEl && nameEl.value) || "";
      var phone = (phoneEl && phoneEl.value) || "";
      var bookError = root.querySelector(".form-error") || document.getElementById("book-error");
      var bookSuccess = root.parentElement.querySelector("#book-success") || document.getElementById("book-success");
      if (!dayBtn || !timeBtn || !jobBtn || !name.trim() || !phone.trim()) {
        if (bookError) {
          bookError.style.display = "block";
          bookError.textContent = "Choose a day, a time window, and a job type, and add your name and phone.";
        }
        return;
      }
      if (bookError) bookError.style.display = "none";
      root.hidden = true;
      if (bookSuccess) {
        bookSuccess.classList.add("is-on");
        bookSuccess.hidden = false;
        var line = bookSuccess.querySelector("#book-success-line") || bookSuccess;
        if (line) line.textContent = "Visit request saved: " + bookSummary() + ".";
      }
    });
  }

  document.querySelectorAll(".book-form").forEach(bindBook);

  document.querySelectorAll(".quote-form").forEach(function (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      quoteForm.hidden = true;
      var quoteSuccess = quoteForm.parentElement.querySelector(".thanks") || document.getElementById("quote-success");
      if (quoteSuccess) {
        quoteSuccess.classList.add("is-on");
        quoteSuccess.hidden = false;
      }
    });
  });
})();
