// Autocomplete functionality for city search
class CityAutocomplete {
  constructor(inputElement, options = {}) {
    this.input = inputElement;
    this.options = {
      minLength: 1,
      maxSuggestions: 5,
      debounceDelay: 300,
      ...options,
    };

    this.dropdown = null;
    this.suggestions = [];
    this.selectedIndex = -1;
    this.isOpen = false;
    this.debounceTimer = null;

    this.init();
  }

  init() {
    this.createDropdown();
    this.bindEvents();
  }

  createDropdown() {
    this.dropdown = document.createElement("div");
    this.dropdown.className = "autocomplete-dropdown";
    this.dropdown.setAttribute("role", "listbox");
    this.dropdown.setAttribute("aria-label", "City suggestions");
    this.dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      max-height: 250px;
      overflow-y: auto;
      display: none;
    `;

    // Insert dropdown after input
    this.input.parentNode.style.position = "relative";
    this.input.parentNode.appendChild(this.dropdown);
  }

  bindEvents() {
    // Input events
    this.input.addEventListener("input", this.handleInput.bind(this));
    this.input.addEventListener("keydown", this.handleKeydown.bind(this));
    this.input.addEventListener("focus", this.handleFocus.bind(this));
    this.input.addEventListener("blur", this.handleBlur.bind(this));

    // Click outside to close
    document.addEventListener("click", this.handleClickOutside.bind(this));
  }

  handleInput(e) {
    const value = e.target.value;

    // Clear previous timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Debounce the search
    this.debounceTimer = setTimeout(() => {
      this.search(value);
    }, this.options.debounceDelay);
  }

  handleKeydown(e) {
    if (!this.isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.selectNext();
        break;
      case "ArrowUp":
        e.preventDefault();
        this.selectPrevious();
        break;
      case "Enter":
        e.preventDefault();
        this.selectCurrent();
        break;
      case "Escape":
        this.close();
        this.input.focus();
        break;
      case "Tab":
        if (this.selectedIndex >= 0) {
          this.selectCurrent();
        }
        break;
    }
  }

  handleFocus() {
    const value = this.input.value;
    if (value.length >= this.options.minLength) {
      this.search(value);
    } else if (value.length === 0) {
      // Show popular cities when input is empty and focused
      this.showSuggestions(getCitySuggestions("", this.options.maxSuggestions));
    }
  }

  handleBlur() {
    // Delay closing to allow for clicks on suggestions
    setTimeout(() => {
      this.close();
    }, 150);
  }

  handleClickOutside(e) {
    if (!this.dropdown.contains(e.target) && e.target !== this.input) {
      this.close();
    }
  }

  search(query) {
    if (query.length < this.options.minLength) {
      this.close();
      return;
    }

    const suggestions = getCitySuggestions(query, this.options.maxSuggestions);
    this.showSuggestions(suggestions);
  }

  showSuggestions(suggestions) {
    this.suggestions = suggestions;
    this.selectedIndex = -1;

    if (suggestions.length === 0) {
      this.close();
      return;
    }

    this.renderSuggestions();
    this.open();
  }

  renderSuggestions() {
    this.dropdown.innerHTML = "";

    this.suggestions.forEach((suggestion, index) => {
      const item = document.createElement("div");
      item.className = "autocomplete-item";
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", "false");
      item.setAttribute("data-index", index);
      item.style.cssText = `
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.2s ease;
      `;

      const cityInfo = document.createElement("div");
      cityInfo.innerHTML = `
        <div style="font-weight: 500;">${suggestion.name}</div>
        <div style="font-size: 0.8em; color: #666;">${suggestion.country}</div>
      `;

      const eventCount = document.createElement("div");
      eventCount.style.cssText = `
        font-size: 0.8em;
        color: #999;
        background: #f8f9fa;
        padding: 2px 6px;
        border-radius: 10px;
      `;
      eventCount.textContent = `${suggestion.events} events`;

      item.appendChild(cityInfo);
      item.appendChild(eventCount);

      // Highlight matching text
      this.highlightMatch(item, suggestion.name);

      // Add hover and click events
      item.addEventListener("mouseenter", () => {
        this.selectedIndex = index;
        this.updateSelection();
      });

      item.addEventListener("click", () => {
        this.selectSuggestion(suggestion);
      });

      // Add keyboard accessibility
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.selectSuggestion(suggestion);
        }
      });

      this.dropdown.appendChild(item);
    });

    this.updateSelection();
  }

  highlightMatch(item, cityName) {
    const inputValue = this.input.value.toLowerCase();
    const cityNameLower = cityName.toLowerCase();

    if (inputValue && cityNameLower.includes(inputValue)) {
      const regex = new RegExp(`(${inputValue})`, "gi");
      const highlightedName = cityName.replace(regex, "<strong>$1</strong>");
      item.querySelector("div").innerHTML = highlightedName;
    }
  }

  selectNext() {
    this.selectedIndex = Math.min(
      this.selectedIndex + 1,
      this.suggestions.length - 1
    );
    this.updateSelection();
  }

  selectPrevious() {
    this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
    this.updateSelection();
  }

  selectCurrent() {
    if (
      this.selectedIndex >= 0 &&
      this.selectedIndex < this.suggestions.length
    ) {
      this.selectSuggestion(this.suggestions[this.selectedIndex]);
    }
  }

  selectSuggestion(suggestion) {
    this.input.value = suggestion.name;
    this.input.focus();
    this.close();

    // Trigger change event for form validation
    this.input.dispatchEvent(new Event("change", { bubbles: true }));

    // If this is on the home page, trigger search form submission
    const searchForm = document.getElementById("searchForm");
    if (searchForm && this.input.id === "cityInput") {
      // Auto-submit form after city selection
      setTimeout(() => {
        searchForm.dispatchEvent(new Event("submit", { bubbles: true }));
      }, 100);
    }
  }

  updateSelection() {
    const items = this.dropdown.querySelectorAll(".autocomplete-item");

    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.style.backgroundColor = "#e3f2fd";
        item.style.color = "#1976d2";
        item.setAttribute("aria-selected", "true");
      } else {
        item.style.backgroundColor = "";
        item.style.color = "";
        item.setAttribute("aria-selected", "false");
      }
    });

    // Update input aria attributes
    if (this.selectedIndex >= 0) {
      this.input.setAttribute(
        "aria-activedescendant",
        `suggestion-${this.selectedIndex}`
      );
    } else {
      this.input.removeAttribute("aria-activedescendant");
    }
  }

  open() {
    this.dropdown.style.display = "block";
    this.isOpen = true;
    this.input.setAttribute("aria-expanded", "true");
  }

  close() {
    this.dropdown.style.display = "none";
    this.isOpen = false;
    this.selectedIndex = -1;
    this.input.setAttribute("aria-expanded", "false");
    this.input.removeAttribute("aria-activedescendant");
  }

  destroy() {
    if (this.dropdown && this.dropdown.parentNode) {
      this.dropdown.parentNode.removeChild(this.dropdown);
    }
  }
}

// Utility function to initialize autocomplete on an input
function initCityAutocomplete(inputElement, options = {}) {
  return new CityAutocomplete(inputElement, options);
}
