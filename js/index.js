// ==========================================================================
// index.js
// --------------------------------------------------------------------------
// FEATURE 1: DARK MODE / LIGHT MODE
//
// How it works:
// - The website's dark mode is controlled by one single thing:
//   whether the <html> tag has a class called "dark" or not.
// - If the html tag HAS the class "dark", the page looks dark.
// - If the html tag does NOT have the class "dark", the page looks light.
// - The CSS file already knows how to style things differently
//   depending on whether "dark" is on the html tag or not.
// - Our job in JavaScript is just to add or remove that class,
//   and to remember the choice using localStorage.
// --------------------------------------------------------------------------

function setupDarkMode() {
  var htmlBtn = document.querySelector("html");
  var themeBtn = document.querySelector("#theme-toggle-button");

  themeBtn.addEventListener("click", function () {
    htmlBtn.classList.toggle("dark");
    if (htmlBtn.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
  // ! btnDarkMode local storage
  if (localStorage.getItem("theme") == "dark") {
    htmlBtn.classList.add("dark");
  } else {
    htmlBtn.classList.remove("dark");
  }
}

// --------------------------------------------------------------------------
// FEATURE 2: SETTINGS PANEL (open/close, change font, change colors)
// --------------------------------------------------------------------------

function setupSettingsPanel() {
  // find all the elements we need for the settings panel
  var settingsButton = document.getElementById("settings-toggle");
  var settingsSidebar = document.getElementById("settings-sidebar");
  var closeSettingsButton = document.getElementById("close-settings");
  var resetButton = document.getElementById("reset-settings");
  var colorsGrid = document.getElementById("theme-colors-grid");
  var fontButtons = document.querySelectorAll(".font-option");

  // if the sidebar is not on the page, there is nothing to set up
  if (!settingsSidebar) {
    return;
  }

  // ---------- OPEN AND CLOSE THE SIDEBAR ----------

  function openSettingsSidebar() {
    settingsSidebar.classList.remove("translate-x-full");
    settingsSidebar.classList.add("translate-x-0");
    settingsSidebar.setAttribute("aria-hidden", "false");
  }

  function closeSettingsSidebar() {
    settingsSidebar.classList.remove("translate-x-0");
    settingsSidebar.classList.add("translate-x-full");
    settingsSidebar.setAttribute("aria-hidden", "true");
  }

  // clicking the gear icon opens or closes the sidebar
  if (settingsButton) {
    settingsButton.addEventListener("click", function () {
      var sidebarIsClosed =
        settingsSidebar.classList.contains("translate-x-full");

      if (sidebarIsClosed) {
        openSettingsSidebar();
      } else {
        closeSettingsSidebar();
      }
    });
  }

  // clicking the X button always closes the sidebar
  if (closeSettingsButton) {
    closeSettingsButton.addEventListener("click", function () {
      closeSettingsSidebar();
    });
  }

  // clicking anywhere OUTSIDE the sidebar closes it too
  document.addEventListener("click", function (clickEvent) {
    var sidebarIsOpen = !settingsSidebar.classList.contains("translate-x-full");
    var clickWasInsideSidebar = settingsSidebar.contains(clickEvent.target);

    var clickWasOnSettingsButton = false;
    if (settingsButton) {
      clickWasOnSettingsButton = settingsButton.contains(clickEvent.target);
    }

    if (sidebarIsOpen && !clickWasInsideSidebar && !clickWasOnSettingsButton) {
      closeSettingsSidebar();
    }
  });

  // ---------- CHANGE THE FONT ----------

  function selectFont(fontName) {
    // remove any font class that might already be on the body
    document.body.classList.remove("font-alexandria");
    document.body.classList.remove("font-tajawal");
    document.body.classList.remove("font-cairo");

    // add the new font class to the body
    document.body.classList.add("font-" + fontName);

    // update every font button so only the chosen one looks "active"
    var i;
    for (i = 0; i < fontButtons.length; i = i + 1) {
      var currentButton = fontButtons[i];
      var thisButtonFont = currentButton.getAttribute("data-font");

      if (thisButtonFont === fontName) {
        currentButton.classList.add("active");
        currentButton.setAttribute("aria-checked", "true");
      } else {
        currentButton.classList.remove("active");
        currentButton.setAttribute("aria-checked", "false");
      }
    }

    // remember the chosen font for next time
    localStorage.setItem("selectedFont", fontName);
  }

  // add a click event to every font button
  var fontIndex;
  for (
    fontIndex = 0;
    fontIndex < fontButtons.length;
    fontIndex = fontIndex + 1
  ) {
    var oneFontButton = fontButtons[fontIndex];

    oneFontButton.addEventListener("click", function (event) {
      var chosenFont = event.target.getAttribute("data-font");
      selectFont(chosenFont);
    });
  }

  // ---------- CHANGE THE COLORS ----------

  // a small list of ready-made color combinations to choose from
  var colorChoices = [
    { primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7" }, // default purple
    { primary: "#0ea5e9", secondary: "#06b6d4", accent: "#14b8a6" }, // blue
    { primary: "#f97316", secondary: "#ef4444", accent: "#ec4899" }, // orange
    { primary: "#22c55e", secondary: "#16a34a", accent: "#84cc16" }, // green
    { primary: "#db2777", secondary: "#9333ea", accent: "#7c3aed" }, // pink
  ];

  function selectColor(colorIndex) {
    var chosenColors = colorChoices[colorIndex];

    // if this index does not exist in our list, stop here
    if (!chosenColors) {
      return;
    }

    // change the CSS variables used everywhere on the site
    document.documentElement.style.setProperty(
      "--color-primary",
      chosenColors.primary,
    );
    document.documentElement.style.setProperty(
      "--color-secondary",
      chosenColors.secondary,
    );
    document.documentElement.style.setProperty(
      "--color-accent",
      chosenColors.accent,
    );

    // put a white border around the color the user picked
    if (colorsGrid) {
      var allSwatches = colorsGrid.querySelectorAll("[data-color-index]");
      var s;
      for (s = 0; s < allSwatches.length; s = s + 1) {
        var swatchIndex = Number(
          allSwatches[s].getAttribute("data-color-index"),
        );

        if (swatchIndex === colorIndex) {
          allSwatches[s].style.borderColor = "white";
        } else {
          allSwatches[s].style.borderColor = "transparent";
        }
      }
    }

    // remember the chosen color for next time
    localStorage.setItem("selectedColor", colorIndex);
  }

  // build the little color squares inside the settings panel
  if (colorsGrid) {
    colorsGrid.innerHTML = "";

    var c;
    for (c = 0; c < colorChoices.length; c = c + 1) {
      var colors = colorChoices[c];

      var colorSquare = document.createElement("button");
      colorSquare.type = "button";
      colorSquare.className =
        "w-full h-12 rounded-xl border-2 border-transparent transition-all duration-300";
      colorSquare.style.background =
        "linear-gradient(135deg, " +
        colors.primary +
        ", " +
        colors.secondary +
        ", " +
        colors.accent +
        ")";
      colorSquare.setAttribute("data-color-index", c);

      colorSquare.addEventListener("click", function () {
        var clickedIndex = Number(this.getAttribute("data-color-index"));
        selectColor(clickedIndex);
      });

      colorsGrid.appendChild(colorSquare);
    }
  }

  // ---------- RESET BUTTON ----------

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      selectFont("tajawal");
      selectColor(0);
    });
  }

  // ---------- LOAD SAVED SETTINGS WHEN THE PAGE OPENS ----------

  var savedFont = localStorage.getItem("selectedFont");
  if (savedFont) {
    selectFont(savedFont);
  } else {
    selectFont("tajawal");
  }

  var savedColor = localStorage.getItem("selectedColor");
  if (savedColor !== null) {
    selectColor(Number(savedColor));
  } else {
    selectColor(0);
  }
}

// --------------------------------------------------------------------------
// FEATURE 3: NAVBAR (mobile menu, active link, smooth scroll)
// --------------------------------------------------------------------------

function setupNavbar() {
  var navLinksContainer = document.querySelector(".nav-links");



  // get every link inside the navbar that points to a section (like #about)
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  // ---------- SMOOTH SCROLL WHEN A LINK IS CLICKED ----------

  var linkIndex;
  for (linkIndex = 0; linkIndex < navLinks.length; linkIndex ++) {
    var oneLink = navLinks[linkIndex];

    oneLink.addEventListener("click", function (clickEvent) {
      var sectionId = clickEvent.target.getAttribute("href");
      var targetSection = document.querySelector(sectionId);

      if (targetSection) {
        // stop the browser from jumping instantly
        clickEvent.preventDefault();

        // scroll smoothly to the section instead
        targetSection.scrollIntoView({ behavior: "smooth" });

        
      }
    });
  }

  // ---------- HIGHLIGHT THE LINK FOR THE SECTION ON SCREEN ----------

  window.addEventListener("scroll", function () {
    var idOfSectionOnScreen = "";

    // go through every link and check if its section is near the top of the screen
    var i;
    for (i = 0; i < navLinks.length; i++) {
      var linkHref = navLinks[i].getAttribute("href");
      var section = document.querySelector(linkHref);

      if (section) {
        var sectionBox = section.getBoundingClientRect();

        // if the section's top is above 150px and its bottom is below 150px,
        // it means this section is currently near the top of the screen
        if (sectionBox.top <= 150 && sectionBox.bottom >= 150) {
          idOfSectionOnScreen = linkHref;
        }
      }
    }

    // now update the "active" class on the links
    var j;
    for (j = 0; j < navLinks.length; j = j + 1) {
      var thisLinkHref = navLinks[j].getAttribute("href");

      if (thisLinkHref === idOfSectionOnScreen) {
        navLinks[j].classList.add("active");
      } else {
        navLinks[j].classList.remove("active");
      }
    }
  });
}

// --------------------------------------------------------------------------
// FEATURE 4: PORTFOLIO FILTER BUTTONS (work like tabs)
// --------------------------------------------------------------------------

function setupPortfolioFilters() {
  var filterButtons = document.querySelectorAll(".portfolio-filter");
  var portfolioItems = document.querySelectorAll(".portfolio-item");

  // if there are no filter buttons on this page, stop here
  if (filterButtons.length === 0) {
    return;
  }

  // Tailwind classes for the "active" (colored) look
  var activeClasses = ["bg-gradient-to-l", "from-primary", "to-secondary", "text-white", "shadow-lg", "shadow-primary/50"];
  var inactiveClasses = ["bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300", "border", "border-slate-300", "dark:border-slate-700"];

  var i;
  for (i = 0; i < filterButtons.length; i++) {
    var oneFilterButton = filterButtons[i];

    oneFilterButton.addEventListener("click", function (event) {
      var chosenFilter = event.target.getAttribute("data-filter");

      // STEP 1: reset every button to its normal look
      var b;
      for (b = 0; b < filterButtons.length; b++) {
        filterButtons[b].classList.remove("active", ...activeClasses);
        filterButtons[b].classList.add(...inactiveClasses);
        filterButtons[b].setAttribute("aria-pressed", "false");
      }

      // STEP 2: give only the clicked button the colored look
      event.target.classList.remove(...inactiveClasses);
      event.target.classList.add("active", ...activeClasses);
      event.target.setAttribute("aria-pressed", "true");

      // STEP 3: show only the portfolio items that match the chosen filter
      var p;
      for (p = 0; p < portfolioItems.length; p++) {
        var itemCategory = portfolioItems[p].getAttribute("data-category");

        if (chosenFilter === "all" || itemCategory === chosenFilter) {
          portfolioItems[p].style.display = "";
        } else {
          portfolioItems[p].style.display = "none";
        }
      }
    });
  }
}

// --------------------------------------------------------------------------
// FEATURE 5: CUSTOM DROPDOWNS (project type / budget in the contact form)
// --------------------------------------------------------------------------

function setupCustomDropdowns() {
  var allDropdowns = document.querySelectorAll(".custom-select-wrapper");

  if (allDropdowns.length === 0) {
    return;
  }

  var i;
  for (i = 0; i < allDropdowns.length; i++) {
    var oneDropdown = allDropdowns[i];
    var selectBox = oneDropdown.querySelector(".custom-select");
    var optionsList = oneDropdown.querySelector(".custom-options");

    if (selectBox && optionsList) {
      // clicking the box opens or closes the list of options
      selectBox.addEventListener("click", function () {
        var thisDropdownWrapper = this.closest(".custom-select-wrapper");
        var thisOptionsList =
          thisDropdownWrapper.querySelector(".custom-options");
        thisOptionsList.classList.toggle("hidden");
      });

      // clicking one option selects it and closes the list
      var optionButtons = optionsList.querySelectorAll(".custom-option");

      var o;
      for (o = 0; o < optionButtons.length; o = o + 1) {
        var oneOption = optionButtons[o];

        oneOption.addEventListener("click", function () {
          var chosenText = this.getAttribute("data-value");
          var dropdownWrapper = this.closest(".custom-select-wrapper");
          var textDisplay = dropdownWrapper.querySelector(".selected-text");

          if (textDisplay) {
            textDisplay.textContent = chosenText;
          }

          var listToClose = this.closest(".custom-options");
          listToClose.classList.add("hidden");
        });
      }
    }
  }

  // clicking anywhere OUTSIDE a dropdown closes it
  document.addEventListener("click", function (clickEvent) {
    var i;
    for (i = 0; i < allDropdowns.length; i = i + 1) {
      var clickedInsideThisDropdown = allDropdowns[i].contains(
        clickEvent.target,
      );

      if (!clickedInsideThisDropdown) {
        var optionsListToClose =
          allDropdowns[i].querySelector(".custom-options");
        if (optionsListToClose) {
          optionsListToClose.classList.add("hidden");
        }
      }
    }
  });
}

// --------------------------------------------------------------------------
// FEATURE 6: TESTIMONIALS CAROUSEL
// --------------------------------------------------------------------------

function setupCarousel() {
  var carouselTrack = document.getElementById("testimonials-carousel");
  var allCards = document.querySelectorAll(".testimonial-card");
  var nextButton = document.getElementById("next-testimonial");
  var previousButton = document.getElementById("prev-testimonial");
  var allDots = document.querySelectorAll(".carousel-indicator");

  // if the carousel is not on this page, stop here
  if (!carouselTrack || allCards.length === 0) {
    return;
  }

  // this number remembers which card is currently showing
  var currentCardIndex = 0;

  // this remembers the automatic sliding timer, so we can stop it later
  var autoSlideTimer = null;

  // this function moves the carousel to show the current card
  function showCurrentCard() {
    // if the index goes below 0, jump to the last card (loop around)
    if (currentCardIndex < 0) {
      currentCardIndex = allCards.length - 1;
    }

    // if the index goes past the last card, jump back to the first card
    if (currentCardIndex > allCards.length - 1) {
      currentCardIndex = 0;
    }

    // find out how wide one card is, then move the track by that many pixels
    var widthOfOneCard = allCards[0].offsetWidth;
    var pixelsToMove = currentCardIndex * widthOfOneCard;

    carouselTrack.style.transform = "translateX(" + pixelsToMove + "px)";

    // update the dots so the current one looks different from the others
    var d;
    for (d = 0; d < allDots.length; d = d + 1) {
      if (d === currentCardIndex) {
        allDots[d].classList.add("bg-accent");
        allDots[d].classList.remove("bg-slate-400");
      } else {
        allDots[d].classList.remove("bg-accent");
        allDots[d].classList.add("bg-slate-400");
      }
    }
  }

  // this function starts sliding automatically every 5 seconds
  function startAutoSlide() {
    autoSlideTimer = setInterval(function () {
      currentCardIndex = currentCardIndex + 1;
      showCurrentCard();
    }, 5000);
  }

  // this function stops the automatic sliding
  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  // clicking "next" shows the next card
  if (nextButton) {
    nextButton.addEventListener("click", function () {
      currentCardIndex = currentCardIndex + 1;
      showCurrentCard();

      // restart the timer so it waits 5 seconds again after a manual click
      stopAutoSlide();
      startAutoSlide();
    });
  }

  // clicking "previous" shows the previous card
  if (previousButton) {
    previousButton.addEventListener("click", function () {
      currentCardIndex = currentCardIndex - 1;
      showCurrentCard();

      stopAutoSlide();
      startAutoSlide();
    });
  }

  // clicking a dot jumps straight to that card
  var i;
  for (i = 0; i < allDots.length; i = i + 1) {
    var oneDot = allDots[i];

    oneDot.addEventListener("click", function () {
      var clickedDotIndex = Number(this.getAttribute("data-index"));
      currentCardIndex = clickedDotIndex;
      showCurrentCard();

      stopAutoSlide();
      startAutoSlide();
    });
  }

  // pause the automatic sliding while the mouse is over the carousel
  carouselTrack.addEventListener("mouseenter", function () {
    stopAutoSlide();
  });

  // start it again once the mouse leaves
  carouselTrack.addEventListener("mouseleave", function () {
    startAutoSlide();
  });

  // if the window changes size, recalculate the card position
  window.addEventListener("resize", function () {
    showCurrentCard();
  });

  // show the first card and start sliding automatically when the page loads
  showCurrentCard();
  startAutoSlide();
}

// --------------------------------------------------------------------------
// FEATURE 7: SCROLL TO TOP BUTTON
// --------------------------------------------------------------------------

function setupScrollToTopButton() {
  var scrollTopButton = document.getElementById("scroll-to-top");

  if (!scrollTopButton) {
    return;
  }

  // show the button only after the user has scrolled down a bit
  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      scrollTopButton.classList.remove("opacity-0");
      scrollTopButton.classList.remove("invisible");
    } else {
      scrollTopButton.classList.add("opacity-0");
      scrollTopButton.classList.add("invisible");
    }
  });

  // clicking the button scrolls the page back to the top
  scrollTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --------------------------------------------------------------------------
// RUN EVERY FEATURE
// This is the only part that actually "turns on" all the code above.
// --------------------------------------------------------------------------

setupDarkMode();
setupSettingsPanel();
setupNavbar();
setupPortfolioFilters();
setupCustomDropdowns();
setupCarousel();
setupScrollToTopButton();
