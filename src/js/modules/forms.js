import intlTelInput from 'intl-tel-input';

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

export function initSellFormPhone() {
  const phoneInput = document.getElementById('sell-form-phone');
  const form = phoneInput?.closest('form');
  if (!phoneInput || !form) return;

  const iti = intlTelInput(phoneInput, {
    initialCountry: 'auto',
    separateDialCode: false,
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
  });

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
  });

  form.addEventListener('submit', (e) => {
    const fullNumber = iti.getNumber();
    if (fullNumber) {
      phoneInput.value = fullNumber;
    } else {
      // Validate before submit
      if (!iti.isValidNumber()) {
        e.preventDefault();
        phoneInput.setCustomValidity('Please enter a valid phone number');
        phoneInput.reportValidity();
        return;
      }
    }
    phoneInput.setCustomValidity('');
    // Phone value will be updated before form submission handler runs
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
        opt.classList.toggle('is-selected', opt.dataset.value === value);
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
    input.setCustomValidity('');
    input.classList.remove('error', 'is-invalid');
  });
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
    input.setCustomValidity('');
    input.classList.remove('error', 'is-invalid');
  });
}

export function initSellFormSubmit() {
  const forms = document.querySelectorAll('.sell__form');
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

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
      window.location.href = '/thanks-page.html';
    });
  });
}
