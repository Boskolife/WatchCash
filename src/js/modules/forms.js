import intlTelInput from 'intl-tel-input';

/**
 * Rolex serial number → production year lookup based on a commonly used
 * chart (Keepthetime / community-sourced data).
 * Letter prefixes: map to the first year of their range.
 * Numeric-only serials: use thresholds to approximate the year.
 */
const ROLEX_SERIAL_YEAR_TABLE = [
  // Random/scattered modern serials (approximate)
  { serial: 'Random', year: 2010 },

  // Letter-prefix serials (approximate first year of range)
  { serial: 'G', year: 2010 },
  { serial: 'V', year: 2009 },
  { serial: 'M', year: 2007 },
  { serial: 'Z', year: 2006 },
  { serial: 'D', year: 2005 },
  { serial: 'F', year: 2003 },
  { serial: 'Y', year: 2002 },
  { serial: 'K', year: 2001 },
  { serial: 'P', year: 2000 },
  { serial: 'A', year: 1998 },
  { serial: 'U', year: 1997 },
  { serial: 'T', year: 1996 },
  { serial: 'W', year: 1995 },
  { serial: 'S', year: 1993 },
  { serial: 'C', year: 1992 },
  { serial: 'N', year: 1991 },
  { serial: 'X', year: 1991 },
  { serial: 'E', year: 1990 },
  { serial: 'L', year: 1988 },
  { serial: 'R', year: 1987 },

  // Numeric serial thresholds (Keepthetime chart)
  { serial: '9,999,999', year: 1987 },
  { serial: '9,760,000', year: 1987 },
  { serial: '9,300,000', year: 1986 },
  { serial: '8,814,000', year: 1985 },
  { serial: '8,388,000', year: 1984 },
  { serial: '7,860,000', year: 1983 },
  { serial: '7,366,000', year: 1982 },
  { serial: '6,910,000', year: 1981 },
  { serial: '6,430,000', year: 1980 },
  { serial: '5,959,000', year: 1979 },
  { serial: '5,481,000', year: 1978 },
  { serial: '5,005,000', year: 1977 },
  { serial: '4,535,000', year: 1976 },
  { serial: '4,265,000', year: 1975 },
  { serial: '4,000,000', year: 1974 },
  { serial: '3,741,000', year: 1973 },
  { serial: '3,478,000', year: 1972 },
  { serial: '3,215,000', year: 1971 },
  { serial: '2,952,000', year: 1970 },
  { serial: '2,689,000', year: 1969 },
  { serial: '2,426,000', year: 1968 },
  { serial: '2,164,000', year: 1967 },
  { serial: '1,870,000', year: 1966 },
  { serial: '1,791,000', year: 1965 },
  { serial: '1,713,000', year: 1964 },
  { serial: '1,635,000', year: 1963 },
  { serial: '1,557,000', year: 1962 },
  { serial: '1,485,000', year: 1961 },
  { serial: '1,401,000', year: 1960 },
  { serial: '1,323,000', year: 1959 },
  { serial: '1,245,000', year: 1958 },
  { serial: '1,167,000', year: 1957 },
  { serial: '1,095,000', year: 1956 },
  { serial: '1,010,000', year: 1955 },
  { serial: '935,000', year: 1954 },
  { serial: '869,000', year: 1953 },
  { serial: '804,000', year: 1952 },
  { serial: '738,700', year: 1951 },
  { serial: '673,600', year: 1950 },
  { serial: '608,500', year: 1949 },
  { serial: '543,400', year: 1948 },
  { serial: '478,300', year: 1947 },
  { serial: '413,200', year: 1946 },
  { serial: '348,000', year: 1945 },
  { serial: '283,000', year: 1944 },
  { serial: '253,000', year: 1943 },
  { serial: '224,000', year: 1942 },
  { serial: '194,000', year: 1941 },
  { serial: '164,600', year: 1940 },
  { serial: '135,000', year: 1939 },
  { serial: '117,000', year: 1938 },
  { serial: '99,000', year: 1937 },
  { serial: '81,000', year: 1936 },
  { serial: '63,000', year: 1935 },
  { serial: '45,000', year: 1934 },
  { serial: '49,000', year: 1933 },
  { serial: '42,680', year: 1932 },
  { serial: '40,250', year: 1931 },
  { serial: '37,820', year: 1930 },
  { serial: '35,390', year: 1929 },
  { serial: '32,960', year: 1928 },
  { serial: '30,430', year: 1927 },
  { serial: '28,000', year: 1926 },
  { serial: '25,000', year: 1925 },
];

function parseSerialNum(s) {
  const cleaned = String(s).replace(/,/g, '').trim();
  const num = parseInt(cleaned, 10);
  return Number.isNaN(num) ? null : num;
}

function findYearBySerialNumber(input) {
  const raw = String(input).trim();
  if (!raw) return null;

  const normalized = raw.toUpperCase().replace(/\s+/g, ' ').trim();
  const numericVal = parseSerialNum(raw);

  // Letter prefixes and exact matches (Random, single-letter codes, etc.)
  for (const row of ROLEX_SERIAL_YEAR_TABLE) {
    const rowUpper = row.serial.toUpperCase();
    const rowNorm = rowUpper.replace(/,/g, '').trim();

    // Exact match (with or without commas/spaces)
    if (normalized === rowUpper || normalized === rowNorm) {
      return row.year;
    }

    // For letter prefixes, allow full serials that start with the prefix (e.g., V123456)
    if (/^[A-Z]/.test(rowUpper) && normalized.startsWith(rowUpper)) {
      return row.year;
    }
  }

  // Numeric range lookup (pre-letter serials): table is newest-first; find smallest threshold >= user serial
  if (numericVal !== null) {
    const withNum = ROLEX_SERIAL_YEAR_TABLE.map((r) => ({
      serialNum: parseSerialNum(r.serial),
      year: r.year,
    })).filter((r) => r.serialNum != null);

    withNum.sort((a, b) => a.serialNum - b.serialNum);

    for (const r of withNum) {
      if (r.serialNum >= numericVal) return r.year;
    }

    return withNum[withNum.length - 1]?.year ?? null;
  }

  return null;
}

/**
 * Reveals extra form fields when user focuses on Brand Name input.
 * Used in section-sell-big (sell-my-watch page).
 */
export function initSellFormProgressiveReveal() {
  const brandInput = document.getElementById('sell-form-brand');
  const extraBlock = document.querySelector('[data-sell-form-extra]');
  if (!brandInput || !extraBlock) return;

  brandInput.addEventListener('focus', () => {
    extraBlock.classList.add('is-visible');
  });
}

export function initSellFormDragDrop() {
  const wrappers = document.querySelectorAll('[data-drag-drop-wrapper]');
  wrappers.forEach((wrapper) => {
    const input = wrapper.querySelector('.drag-and-drop-input');
    const dragArea = wrapper.querySelector('[data-drag-area]');
    const filesEl = wrapper.querySelector('[data-drag-files]');
    const label = wrapper.querySelector('.drag-and-drop-label');
    if (!input || !dragArea) return;

    let isOpening = false;

    function updateFilesLabel() {
      const files = input.files;
      if (!filesEl) return;
      if (files.length === 0) {
        filesEl.textContent = '';
        dragArea.classList.remove('has-files');
      } else {
        filesEl.textContent =
          files.length === 1 ? files[0].name : `${files.length} files selected`;
        dragArea.classList.add('has-files');
      }
    }

    function setFilesFromDataTransfer(dataTransfer) {
      if (!dataTransfer.files.length) return;
      const dt = new DataTransfer();
      for (const file of dataTransfer.files) {
        if (file.type.startsWith('image/')) dt.items.add(file);
      }
      if (dt.files.length) {
        input.files = dt.files;
        updateFilesLabel();
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    ['dragenter', 'dragover'].forEach((evt) => {
      dragArea.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragArea.classList.add('is-dragover');
      });
    });

    ['dragleave', 'drop'].forEach((evt) => {
      dragArea.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragArea.classList.remove('is-dragover');
      });
    });

    dragArea.addEventListener('drop', (e) => {
      setFilesFromDataTransfer(e.dataTransfer);
    });

    dragArea.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isOpening && (e.target === dragArea || dragArea.contains(e.target))) {
        isOpening = true;
        input.click();
        setTimeout(() => {
          isOpening = false;
        }, 100);
      }
    });

    if (label) {
      label.addEventListener('click', (e) => {
        if (dragArea.contains(e.target)) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    dragArea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        input.click();
      }
    });

    input.addEventListener('change', updateFilesLabel);
  });
}

const PHONE_INPUT_IDS = ['sell-form-phone', 'year-production-form-phone'];

const intlTelInputOptions = {
  initialCountry: 'auto',
  separateDialCode: true,
  strictMode: true,
  loadUtils: () => import('intl-tel-input/utils'),
  geoIpLookup: (success, failure) => {
    const geoUrl =
      typeof window !== 'undefined' && window.location.port === '3000'
        ? '/api/geo'
        : 'https://ipapi.co/json';
    fetch(geoUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        const countryCode = data.country_code?.toLowerCase();
        if (countryCode) {
          success(countryCode);
        } else {
          failure();
        }
      })
      .catch(() => {
        failure();
      });
  },
};

function initOnePhoneInput(phoneInput) {
  const form = phoneInput.closest('form');
  if (!form) return;

  const iti = intlTelInput(phoneInput, intlTelInputOptions);

  // Validation: prevent entering more digits than required
  let lastValidValue = '';

  function validatePhoneInput(e) {
    if (!intlTelInput.utils || !iti.getSelectedCountryData()) {
      lastValidValue = phoneInput.value;
      return;
    }

    const countryData = iti.getSelectedCountryData();
    const currentValue = phoneInput.value;

    // Get only digits from input (excluding dial code if separateDialCode is false)
    const digitsOnly = currentValue.replace(/\D/g, '');

    // Maximum length for international phone numbers is typically 15 digits (E.164 standard)
    // But we need to check country-specific max length
    let maxLength = 15;

    try {
      // Try to get country-specific max length from utils
      if (intlTelInput.utils && countryData.iso2) {
        // Use getExampleNumber to estimate max length
        const exampleNumber = intlTelInput.utils.getExampleNumber(
          countryData.iso2,
          false,
          intlTelInput.utils.numberType.MOBILE,
        );

        if (exampleNumber) {
          const exampleDigits = exampleNumber.replace(/\D/g, '');
          // Add some buffer, but cap at 15 (E.164 max)
          maxLength = Math.min(exampleDigits.length + 2, 15);
        }
      }
    } catch (error) {
      // Fallback to 15 if utils not ready
      maxLength = 15;
    }

    // If input exceeds max length, revert to last valid value
    if (digitsOnly.length > maxLength) {
      e.preventDefault();
      phoneInput.value = lastValidValue;
      const cursorPos = Math.min(
        phoneInput.selectionStart || 0,
        phoneInput.value.length,
      );
      phoneInput.setSelectionRange(cursorPos, cursorPos);
      return;
    }

    // Update last valid value
    lastValidValue = currentValue;
  }

  // Use beforeinput event to prevent invalid input
  phoneInput.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertText' || e.inputType === 'insertCompositionText') {
      const testValue =
        phoneInput.value.slice(0, phoneInput.selectionStart || 0) +
        (e.data || '') +
        phoneInput.value.slice(phoneInput.selectionEnd || 0);
      const testDigits = testValue.replace(/\D/g, '');

      if (!intlTelInput.utils || !iti.getSelectedCountryData()) {
        if (testDigits.length > 15) {
          e.preventDefault();
          return;
        }
      } else {
        let maxLength = 15;
        try {
          const countryData = iti.getSelectedCountryData();
          if (countryData && intlTelInput.utils) {
            const exampleNumber = intlTelInput.utils.getExampleNumber(
              countryData.iso2,
              false,
              intlTelInput.utils.numberType.MOBILE,
            );
            if (exampleNumber) {
              const exampleDigits = exampleNumber.replace(/\D/g, '');
              maxLength = Math.min(exampleDigits.length + 2, 15);
            }
          }
        } catch (error) {
          maxLength = 15;
        }

        if (testDigits.length > maxLength) {
          e.preventDefault();
          return;
        }
      }
    }
  });

  // Also validate on input event as fallback
  phoneInput.addEventListener('input', validatePhoneInput);

  // Validate on country change
  phoneInput.addEventListener('countrychange', () => {
    lastValidValue = phoneInput.value;
    validatePhoneInput({ preventDefault: () => {} });
    updatePhoneCustomValidity();
  });

  // So form.checkValidity() works (e.g. year-production step 4)
  function updatePhoneCustomValidity() {
    const val = phoneInput.value.trim();
    if (!val) {
      phoneInput.setCustomValidity('');
      return;
    }
    try {
      const valid =
        iti.getNumber() && (typeof iti.isValidNumber === 'function' ? iti.isValidNumber() : true);
      phoneInput.setCustomValidity(valid ? '' : 'Please enter a valid phone number');
    } catch {
      phoneInput.setCustomValidity('');
    }
  }

  phoneInput.addEventListener('blur', updatePhoneCustomValidity);

  form.addEventListener('submit', () => {
    const fullNumber = iti.getNumber();
    if (fullNumber) {
      phoneInput.value = fullNumber;
    }
  });
}

export function initSellFormPhone() {
  PHONE_INPUT_IDS.forEach((id) => {
    const phoneInput = document.getElementById(id);
    if (phoneInput) initOnePhoneInput(phoneInput);
  });
}

export function initCustomSelect() {
  const customSelects = document.querySelectorAll('[data-custom-select]');
  if (!customSelects.length) return;

  customSelects.forEach((container) => {
    const select = container.querySelector('select');
    const button = container.querySelector('.custom-select__button');
    const dropdown = container.querySelector('.custom-select__dropdown');
    const selectedText = container.querySelector('.custom-select__selected');
    const options = container.querySelectorAll('.custom-select__option');

    if (!select || !button || !dropdown || !selectedText) return;

    function updateSelected(value, text) {
      select.value = value;
      selectedText.textContent = text;

      if (value === '') {
        container.classList.add('is-placeholder');
      } else {
        container.classList.remove('is-placeholder');
      }

      options.forEach((opt) => {
        const isSelected = opt.dataset.value === value;
        opt.classList.toggle('is-selected', isSelected);
        opt.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });

      button.setAttribute('aria-expanded', 'false');
      container.classList.remove('is-open');
    }

    function toggleDropdown() {
      const isOpen = container.classList.contains('is-open');
      if (!isOpen) {
        container.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      } else {
        container.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
      }
    }

    function closeDropdown() {
      container.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    }

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown();
    });

    options.forEach((option) => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const value = option.dataset.value;
        const text = option.textContent;
        updateSelected(value, text);
        closeDropdown();
      });

      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          option.click();
        } else if (e.key === 'Escape') {
          closeDropdown();
          button.focus();
        }
      });
    });

    let focusedIndex = -1;

    function focusOption(index) {
      options.forEach((opt, i) => {
        if (i === index) {
          opt.setAttribute('tabindex', '0');
          opt.focus();
          opt.scrollIntoView({ block: 'nearest' });
        } else {
          opt.setAttribute('tabindex', '-1');
        }
      });
      focusedIndex = index;
    }

    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (!container.classList.contains('is-open')) {
          toggleDropdown();
          focusedIndex = 0;
          focusOption(0);
        } else if (e.key === 'ArrowDown') {
          focusedIndex = Math.min(focusedIndex + 1, options.length - 1);
          focusOption(focusedIndex);
        }
      } else if (
        e.key === 'ArrowUp' &&
        container.classList.contains('is-open')
      ) {
        e.preventDefault();
        focusedIndex = Math.max(focusedIndex - 1, 0);
        focusOption(focusedIndex);
      } else if (
        e.key === 'Escape' &&
        container.classList.contains('is-open')
      ) {
        closeDropdown();
        focusedIndex = -1;
      }
    });

    dropdown.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusedIndex = Math.min(focusedIndex + 1, options.length - 1);
        focusOption(focusedIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusedIndex = Math.max(focusedIndex - 1, 0);
        focusOption(focusedIndex);
      } else if (e.key === 'Home') {
        e.preventDefault();
        focusOption(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        focusOption(options.length - 1);
      }
    });

    document.addEventListener('click', (e) => {
      if (
        !container.contains(e.target) &&
        container.classList.contains('is-open')
      ) {
        closeDropdown();
      }
    });

    select.addEventListener('change', () => {
      const selectedOption = Array.from(select.options).find(
        (opt) => opt.value === select.value,
      );
      if (selectedOption) {
        updateSelected(select.value, selectedOption.textContent);
      }
    });

    const initialOption = Array.from(select.options).find(
      (opt) => opt.value === select.value,
    );
    if (initialOption) {
      updateSelected(select.value, initialOption.textContent);
    }
  });
}

export function resetSellForm(form) {
  // Reset all text inputs
  const emailInput = form.querySelector('#sell-form-email');
  if (emailInput) emailInput.value = '';

  const brandInput = form.querySelector('#sell-form-brand');
  if (brandInput) brandInput.value = '';

  const firstNameInput = form.querySelector('#sell-form-first-name');
  if (firstNameInput) firstNameInput.value = '';

  const additionalInfoTextarea = form.querySelector(
    '#sell-form-additional-information',
  );
  if (additionalInfoTextarea) additionalInfoTextarea.value = '';

  // Reset phone input and intl-tel-input
  const phoneInput = form.querySelector('#sell-form-phone');
  if (phoneInput) {
    try {
      const itiInstance =
        phoneInput.iti || intlTelInput?.getInstance(phoneInput);
      if (itiInstance && typeof itiInstance.setCountry === 'function') {
        // Reset to initial country
        itiInstance.setCountry('auto');
      }
      phoneInput.value = '';
    } catch (error) {
      phoneInput.value = '';
    }
  }

  // Reset custom select
  const boxAndPapersSelect = form.querySelector('#sell-form-box-and-papers');
  if (boxAndPapersSelect) {
    boxAndPapersSelect.value = '';
    const customSelect = boxAndPapersSelect.closest('[data-custom-select]');
    if (customSelect) {
      const selectedText = customSelect.querySelector('.custom-select__selected');
      if (selectedText) {
        selectedText.textContent = 'Please select...';
      }
      customSelect.classList.add('is-placeholder');
      const options = customSelect.querySelectorAll('.custom-select__option');
      options.forEach((opt) => opt.classList.remove('is-selected'));
    }
  }

  // Reset file input and drag-and-drop area
  const fileInput = form.querySelector('#sell-form-watch');
  if (fileInput) {
    fileInput.value = '';
    const dragArea = form.querySelector('[data-drag-area]');
    if (dragArea) {
      dragArea.classList.remove('has-files');
      const filesEl = form.querySelector('[data-drag-files]');
      if (filesEl) {
        filesEl.textContent = '';
      }
    }
  }

  // Reset form validation states
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => {
    input.classList.remove('error', 'is-invalid');
    input.removeAttribute('aria-invalid');
    clearFieldError(input);
  });

  // Reset custom select validation
  const customSelect = form.querySelector('[data-custom-select]');
  if (customSelect) {
    customSelect.classList.remove('is-invalid');
    const errorEl = customSelect.parentElement.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.removeAttribute('role');
      errorEl.classList.remove('is-visible');
    }
  }

  // Reset drag-and-drop wrapper validation
  const dragDropWrapper = form.querySelector('[data-drag-drop-wrapper]');
  if (dragDropWrapper) {
    dragDropWrapper.classList.remove('is-invalid');
    const errorEl = dragDropWrapper.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.removeAttribute('role');
      errorEl.classList.remove('is-visible');
    }
  }
}

function resetSimpleSellForm(form) {
  // Reset email
  const emailInput = form.querySelector('#sell-form-email');
  if (emailInput) emailInput.value = '';

  // Reset brand name
  const brandInput = form.querySelector('#sell-form-brand');
  if (brandInput) brandInput.value = '';

  // Reset form validation states
  const inputs = form.querySelectorAll('input');
  inputs.forEach((input) => {
    input.classList.remove('error', 'is-invalid');
    input.removeAttribute('aria-invalid');
    clearFieldError(input);
  });
}

// Form validation helper functions
function showFieldError(field, message) {
  field.classList.add('is-invalid');
  field.setAttribute('aria-invalid', 'true');
  
  // For phone input wrapped in .iti container, find error element in parent label
  let containerToSearch = field.parentElement;
  if (containerToSearch.classList.contains('iti')) {
    // If field is inside .iti, search in the parent label element
    containerToSearch = containerToSearch.parentElement;
  }
  
  // Find or create error message element
  let errorEl = containerToSearch.querySelector('.form-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.setAttribute('aria-live', 'polite');
    containerToSearch.appendChild(errorEl);
  }
  
  errorEl.textContent = message;
  errorEl.setAttribute('role', 'alert');
  errorEl.classList.add('is-visible');
}

function clearFieldError(field) {
  field.classList.remove('is-invalid');
  field.setAttribute('aria-invalid', 'false');
  
  // For phone input wrapped in .iti container, find error element in parent label
  let containerToSearch = field.parentElement;
  if (containerToSearch.classList.contains('iti')) {
    // If field is inside .iti, search in the parent label element
    containerToSearch = containerToSearch.parentElement;
  }
  
  const errorEl = containerToSearch.querySelector('.form-error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.removeAttribute('role');
    errorEl.classList.remove('is-visible');
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateForm(form) {
  let isValid = true;
  const errors = [];

  // Validate email
  const emailInput = form.querySelector('#sell-form-email');
  if (emailInput) {
    const emailValue = emailInput.value.trim();
    if (!emailValue) {
      showFieldError(emailInput, 'Email address is required');
      isValid = false;
    } else if (!validateEmail(emailValue)) {
      showFieldError(emailInput, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }
  }

  // Validate brand name
  const brandInput = form.querySelector('#sell-form-brand');
  if (brandInput) {
    const brandValue = brandInput.value.trim();
    if (!brandValue) {
      showFieldError(brandInput, 'Brand name is required');
      isValid = false;
    } else {
      clearFieldError(brandInput);
    }
  }

  // Validate first name (if exists - only in big form)
  const firstNameInput = form.querySelector('#sell-form-first-name');
  if (firstNameInput) {
    const firstNameValue = firstNameInput.value.trim();
    if (!firstNameValue) {
      showFieldError(firstNameInput, 'First name is required');
      isValid = false;
    } else {
      clearFieldError(firstNameInput);
    }
  }

  // Validate phone (if exists - sell form or year-production form)
  const phoneInput =
    form.querySelector('#sell-form-phone') ||
    form.querySelector('#year-production-form-phone');
  if (phoneInput) {
    const phoneValue = phoneInput.value.trim();
    if (!phoneValue) {
      showFieldError(phoneInput, 'Phone number is required');
      isValid = false;
    } else {
      // Validate phone using intl-tel-input if available
      try {
        const itiInstance = phoneInput.iti || intlTelInput?.getInstance(phoneInput);
        if (itiInstance && typeof itiInstance.isValidNumber === 'function') {
          if (!itiInstance.isValidNumber()) {
            // Get detailed error message if available
            let errorMessage = 'Please enter a valid phone number';
            if (typeof itiInstance.getValidationError === 'function' && intlTelInput.utils) {
              const errorCode = itiInstance.getValidationError();
              if (errorCode !== undefined && intlTelInput.utils.validationError) {
                const errorMap = {
                  [intlTelInput.utils.validationError.TOO_SHORT]: 'Phone number is too short',
                  [intlTelInput.utils.validationError.TOO_LONG]: 'Phone number is too long',
                  [intlTelInput.utils.validationError.INVALID_COUNTRY_CODE]: 'Invalid country code',
                  [intlTelInput.utils.validationError.INVALID_LENGTH]: 'Invalid phone number length',
                };
                errorMessage = errorMap[errorCode] || errorMessage;
              }
            }
            showFieldError(phoneInput, errorMessage);
            isValid = false;
          } else {
            clearFieldError(phoneInput);
            // Remove iti--error class if library added it
            const itiContainer = phoneInput.closest('.iti');
            if (itiContainer) {
              itiContainer.classList.remove('iti--error');
            }
          }
        } else {
          // Fallback validation - check if phone has reasonable length
          const digitsOnly = phoneValue.replace(/\D/g, '');
          if (digitsOnly.length < 7) {
            showFieldError(phoneInput, 'Please enter a valid phone number');
            isValid = false;
          } else {
            clearFieldError(phoneInput);
          }
        }
      } catch (error) {
        // If intl-tel-input validation fails, use basic validation
        const digitsOnly = phoneValue.replace(/\D/g, '');
        if (digitsOnly.length < 7) {
          showFieldError(phoneInput, 'Please enter a valid phone number');
          isValid = false;
        } else {
          clearFieldError(phoneInput);
        }
      }
    }
  }

  // Validate box and papers select (if exists - only in big form)
  const boxAndPapersSelect = form.querySelector('#sell-form-box-and-papers');
  if (boxAndPapersSelect) {
    const selectValue = boxAndPapersSelect.value;
    if (!selectValue || selectValue === '') {
      const selectContainer = boxAndPapersSelect.closest('[data-custom-select]');
      if (selectContainer) {
        selectContainer.classList.add('is-invalid');
        let errorEl = selectContainer.parentElement.querySelector('.form-error');
        if (!errorEl) {
          errorEl = document.createElement('span');
          errorEl.className = 'form-error';
          errorEl.setAttribute('aria-live', 'polite');
          selectContainer.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = 'Please select an option';
        errorEl.setAttribute('role', 'alert');
        errorEl.classList.add('is-visible');
      }
      isValid = false;
    } else {
      const selectContainer = boxAndPapersSelect.closest('[data-custom-select]');
      if (selectContainer) {
        selectContainer.classList.remove('is-invalid');
        const errorEl = selectContainer.parentElement.querySelector('.form-error');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.removeAttribute('role');
          errorEl.classList.remove('is-visible');
        }
      }
    }
  }

  // Validate file upload (if exists - only in big form)
  const fileInput = form.querySelector('#sell-form-watch');
  if (fileInput) {
    if (!fileInput.files || fileInput.files.length === 0) {
      const fileWrapper = fileInput.closest('[data-drag-drop-wrapper]');
      if (fileWrapper) {
        fileWrapper.classList.add('is-invalid');
        let errorEl = fileWrapper.querySelector('.form-error');
        if (!errorEl) {
          errorEl = document.createElement('span');
          errorEl.className = 'form-error';
          errorEl.setAttribute('aria-live', 'polite');
          const hintEl = fileWrapper.querySelector('#sell-form-watch-hint');
          if (hintEl && hintEl.nextSibling) {
            fileWrapper.insertBefore(errorEl, hintEl.nextSibling);
          } else {
            fileWrapper.appendChild(errorEl);
          }
        }
        errorEl.textContent = 'Please upload at least one photo';
        errorEl.setAttribute('role', 'alert');
        errorEl.classList.add('is-visible');
      }
      isValid = false;
    } else {
      const fileWrapper = fileInput.closest('[data-drag-drop-wrapper]');
      if (fileWrapper) {
        fileWrapper.classList.remove('is-invalid');
        const errorEl = fileWrapper.querySelector('.form-error');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.removeAttribute('role');
          errorEl.classList.remove('is-visible');
        }
      }
    }
  }

  return isValid;
}

export function initSellFormSubmit() {
  const forms = document.querySelectorAll('.sell__form');
  if (!forms.length) return;

  forms.forEach((form) => {
    // Skip find form – it has its own custom submit logic
    if (form.classList.contains('find__form')) {
      return;
    }

    // Add real-time validation on blur
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach((input) => {
      input.addEventListener('blur', () => {
        if (input.value.trim() || input.type === 'file') {
          // Only validate if field has value or is file input
          validateForm(form);
        }
      });

      input.addEventListener('input', () => {
        // Clear error when user starts typing
        if (input.classList.contains('is-invalid')) {
          clearFieldError(input);
        }
      });
    });

    // Validate custom select on change
    const customSelect = form.querySelector('[data-custom-select]');
    if (customSelect) {
      const select = customSelect.querySelector('select');
      if (select) {
        select.addEventListener('change', () => {
          const selectContainer = select.closest('[data-custom-select]');
          if (selectContainer && selectContainer.classList.contains('is-invalid')) {
            if (select.value && select.value !== '') {
              selectContainer.classList.remove('is-invalid');
              const errorEl = selectContainer.parentElement.querySelector('.form-error');
              if (errorEl) {
                errorEl.textContent = '';
                errorEl.removeAttribute('role');
                errorEl.classList.remove('is-visible');
              }
            }
          }
        });
      }
    }

    // Validate file input on change
    const fileInput = form.querySelector('#sell-form-watch');
    if (fileInput) {
      fileInput.addEventListener('change', () => {
        const fileWrapper = fileInput.closest('[data-drag-drop-wrapper]');
        if (fileWrapper && fileWrapper.classList.contains('is-invalid')) {
          if (fileInput.files && fileInput.files.length > 0) {
            fileWrapper.classList.remove('is-invalid');
            const errorEl = fileWrapper.querySelector('.form-error');
            if (errorEl) {
              errorEl.textContent = '';
              errorEl.removeAttribute('role');
              errorEl.classList.remove('is-visible');
            }
          }
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate form before submission
      if (!validateForm(form)) {
        // Focus first invalid field
        const firstInvalid = form.querySelector('.is-invalid, [data-custom-select].is-invalid, [data-drag-drop-wrapper].is-invalid');
        if (firstInvalid) {
          const focusableField = firstInvalid.querySelector('input, select, textarea') || firstInvalid.querySelector('[data-custom-select] button') || firstInvalid.querySelector('[data-drag-area]');
          if (focusableField) {
            setTimeout(() => focusableField.focus(), 100);
          }
        }
        return;
      }

      const formData = {};

      // Get email
      const emailInput = form.querySelector('#sell-form-email');
      if (emailInput) {
        formData.email = emailInput.value.trim();
      }

      // Get brand name
      const brandInput = form.querySelector('#sell-form-brand');
      if (brandInput) {
        formData.brandName = brandInput.value.trim();
      }

      // Get first name (if exists)
      const firstNameInput = form.querySelector('#sell-form-first-name');
      if (firstNameInput) {
        formData.firstName = firstNameInput.value.trim();
      }

      // Get phone number (if exists, with international format from intl-tel-input)
      const phoneInput = form.querySelector('#sell-form-phone');
      if (phoneInput) {
        try {
          // Update phone number to international format before collecting data
          const itiInstance =
            phoneInput.iti || intlTelInput?.getInstance(phoneInput);
          if (itiInstance && typeof itiInstance.getNumber === 'function') {
            const fullNumber = itiInstance.getNumber();
            if (fullNumber) {
              phoneInput.value = fullNumber;
              formData.phone = fullNumber;
            } else {
              formData.phone = phoneInput.value.trim();
            }
          } else {
            formData.phone = phoneInput.value.trim();
          }
        } catch (error) {
          formData.phone = phoneInput.value.trim();
        }
      }

      // Get box and papers selection (if exists)
      const boxAndPapersSelect = form.querySelector('#sell-form-box-and-papers');
      if (boxAndPapersSelect) {
        formData.boxAndPapers = boxAndPapersSelect.value;
      }

      // Get files (if exists)
      const fileInput = form.querySelector('#sell-form-watch');
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        formData.files = Array.from(fileInput.files).map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        }));
      }

      // Get additional information (if exists)
      const additionalInfoTextarea = form.querySelector(
        '#sell-form-additional-information',
      );
      if (additionalInfoTextarea) {
        formData.additionalInformation = additionalInfoTextarea.value.trim();
      }

      // Output to console
      console.log('=== Form Submission Data ===');
      console.log('Form Data:', formData);
      console.log('Form Data (JSON):', JSON.stringify(formData, null, 2));

      // Also log FormData object if needed for actual submission
      const formDataObj = new FormData(form);
      console.log('FormData object:');
      for (const [key, value] of formDataObj.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}:`, {
            name: value.name,
            size: value.size,
            type: value.type,
          });
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      // Redirect to thanks page after successful submission
      window.location.href = 'thanks-page.html';
    });
  });
}

/**
 * Find form: lookup Rolex serial → year, then redirect to year-production with ?year=
 */
export function initFindForm() {
  const form = document.querySelector('.find__form');
  const serialInput = document.getElementById('find-serial-number');
  if (!form || !serialInput) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const serial = serialInput.value.trim();
    if (!serial) {
      form.reportValidity();
      return;
    }
    const year = findYearBySerialNumber(serial);
    if (year != null) {
      const url = new URL('year-production.html', window.location.href);
      url.searchParams.set('year', String(year));
      window.location.href = url.pathname + url.search;
    } else {
      serialInput.setCustomValidity('Serial number not found in our database. Please check and try again.');
      form.reportValidity();
      serialInput.addEventListener(
        'input',
        () => serialInput.setCustomValidity(''),
        { once: true },
      );
    }
  });
}

export function initYearProductionFormSteps() {
  const section = document.querySelector('.year-production');
  if (!section) return;

  // Apply year from URL (e.g. from find form redirect)
  const urlYear = new URLSearchParams(window.location.search).get('year');
  if (urlYear && /^\d{4}$/.test(urlYear)) {
    const subtitle = section.querySelector('.year-production__subtitle');
    const title = section.querySelector('.year-production__title');
    if (subtitle) {
      subtitle.textContent = `Get the Value of Your ${urlYear} Rolex`;
    }
    if (title) {
      title.textContent = `Year Production: ${urlYear}`;
    }
    const yearInput = document.getElementById('year-production-form-year-of-purchase');
    if (yearInput) {
      yearInput.value = urlYear;
      yearInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  const stepContents = Array.from(
    section.querySelectorAll('.year-production__step-content'),
  );
  const stepLabels = Array.from(
    section.querySelectorAll('.year-production__step-label'),
  );
  const forms = stepContents.map((step) =>
    step.querySelector('.year-production__form'),
  );

  let currentStep = 0;

  function setActiveStep(index) {
    stepContents.forEach((step, i) => {
      step.classList.toggle('is-active', i === index);
    });
    stepLabels.forEach((label, i) => {
      // Mark current and all previous steps as active (completed/progress)
      label.classList.toggle('active', i <= index);
    });
    currentStep = index;
    updateStepButtonState(index);
  }

  function validateStepForm(form) {
    if (!form) return true;
    if (!form.checkValidity()) {
      // Use built-in browser validation UI
      form.reportValidity();
      return false;
    }
    return true;
  }

  function focusFirstField(stepIndex) {
    const step = stepContents[stepIndex];
    if (!step) return;
    const field = step.querySelector(
      'input, select, textarea, button, [data-drag-area]',
    );
    if (field && typeof field.focus === 'function') {
      setTimeout(() => field.focus(), 0);
    }
  }

  function updateStepButtonState(formIndex) {
    const form = forms[formIndex];
    const btn = form?.querySelector('.year-production__form-button');
    if (!btn) return;
    btn.disabled = !form.checkValidity();
  }

  function handleFinalSubmit() {
    // Validate all forms before submit
    let allValid = true;
    forms.forEach((form) => {
      if (form && !form.checkValidity()) {
        allValid = false;
        form.reportValidity();
      }
    });

    if (!allValid) {
      const firstInvalid = section.querySelector(
        '.year-production__form :invalid, [data-custom-select].is-invalid, [data-drag-drop-wrapper].is-invalid',
      );
      if (firstInvalid) {
        const invalidStep = firstInvalid.closest('.year-production__step-content');
        const idx = stepContents.indexOf(invalidStep);
        if (idx !== -1 && idx !== currentStep) {
          setActiveStep(idx);
          focusFirstField(idx);
        }
      }
      return;
    }

    // Sync iti phone values to inputs before aggregating
    forms.forEach((form) => {
      if (!form) return;
      const phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput) {
        try {
          const itiInstance = phoneInput.iti || intlTelInput?.getInstance(phoneInput);
          if (itiInstance && typeof itiInstance.getNumber === 'function') {
            const fullNumber = itiInstance.getNumber();
            if (fullNumber) phoneInput.value = fullNumber;
          }
        } catch (_) {}
      }
    });

    const aggregated = new FormData();
    forms.forEach((form) => {
      if (!form) return;
      const fd = new FormData(form);
      for (const [key, value] of fd.entries()) {
        aggregated.append(key, value);
      }
    });

    // Build serializable payload for console and localStorage (for testing)
    const payload = { _submittedAt: new Date().toISOString(), fields: {} };
    for (const [key, value] of aggregated.entries()) {
      if (value instanceof File) {
        payload.fields[key] = {
          _type: 'File',
          name: value.name,
          size: value.size,
          type: value.type,
          lastModified: value.lastModified,
        };
        console.log(`${key}:`, payload.fields[key]);
      } else {
        payload.fields[key] = value;
        console.log(`${key}:`, value);
      }
    }
    console.log('=== Year Production Submission ===');
    try {
      localStorage.setItem(
        'yearProductionFormSubmission',
        JSON.stringify(payload, null, 2),
      );
    } catch (e) {
      console.warn('Could not save submission to localStorage:', e);
    }

    // TODO: Replace with real submission when backend is ready
    window.location.href = 'thanks-page.html';
  }

  // Initialize first step as active
  setActiveStep(0);

  stepContents.forEach((step, index) => {
    const form = forms[index];
    if (!form) return;

    const updateButton = () => updateStepButtonState(index);
    form.addEventListener('input', updateButton);
    form.addEventListener('change', updateButton);
    form.addEventListener('blur', updateButton, true);

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateStepForm(form)) {
        return;
      }

      if (index < stepContents.length - 1) {
        setActiveStep(index + 1);
        focusFirstField(index + 1);
      } else {
        handleFinalSubmit();
      }
    });
  });
}
