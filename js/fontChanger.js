(function() {

    let fontTogglers = document.querySelectorAll('[data-font-toggle]');
    let fontElem = document.querySelector('[data-font]');
    let fontSizeChangers = document.querySelectorAll('[data-font-size]');
    let fontSizeDefault = 100;
    let fontCurrent = fontElem.getAttribute('data-font');
    let event = new CustomEvent('eventFontSizeChange');

    function _bindEvents() {
        let i;
        for (i = 0; i < fontTogglers.length; i++) {
            let toggler = fontTogglers[i];
            let fontClass = toggler.getAttribute('data-font-toggle');
            toggler.addEventListener('click', _handlerToggleFont.bind(this, fontClass, toggler));
        }
        for (i = 0; i < fontSizeChangers.length; i++) {
            let changer = fontSizeChangers[i];
            let fontSize = changer.getAttribute('data-font-size');
            changer.addEventListener('click', _handlerChangeFontSize.bind(this, fontSize, changer));
            changer.dispatchEvent(event);
        }
    }

    function _handlerToggleFont(fontClass, elem, ev) {
        ev.preventDefault();
        _toggleFontFamily(fontClass);
    }

    function _handlerChangeFontSize(type, elem, ev) {
        ev.preventDefault();
        _changeFontSize(type);
    }

    function _changeFontSize(type) {
        let fontSizeCurrentInt;
        let fontSizeStored;
        fontSizeStored = sessionStorage.getItem('font-size');
        if (fontSizeStored === null) {
            fontSizeCurrentInt = fontSizeDefault;
        } else {
            fontSizeCurrentInt = (parseFloat(fontSizeStored) / 100.0) * 100;
        }
        let fontSizeNew;
        let next = true;
        switch (type) {
            case 'decrease':
                fontSizeNew = (fontSizeCurrentInt - 15) + '%';
                if ((fontSizeCurrentInt - 15) < 84) {
                    next = false;
                } else {
                    _setFontSize(fontSizeNew);
                }
                break;
            case 'default':
                fontSizeNew = fontSizeDefault + '%';
                _setFontSize(fontSizeNew);
                break;
            case 'increase':
                fontSizeNew = (fontSizeCurrentInt + 15) + '%';
                if ((fontSizeCurrentInt + 15) > 131) {
                    next = false;
                } else {
                    _setFontSize(fontSizeNew);
                }
                break;
        }
        if (next) {
            _storeFontSize(fontSizeNew);
            _fixFontSize(fontCurrent);
        }
        _toggleActiveStates();
        _enableDisableElems();
    }

    function _enableDisableElems() {
        let fontSizeCurrentInt;
        let elIncrease = document.querySelector('[data-font-size="increase"]');
        let elDecrease = document.querySelector('[data-font-size="decrease"]');
        if (document.body.contains(elIncrease) && document.body.contains(elDecrease)) {
            if (sessionStorage.getItem('font-size') === null) {
                fontSizeCurrentInt = fontSizeDefault;
            } else {
                fontSizeCurrentInt = (parseFloat(sessionStorage.getItem('font-size')) / 100.0) * 100;
            }
            if ((fontSizeCurrentInt + 15) > 131) {
                elIncrease.setAttribute('aria-disabled', 'true');
                elDecrease.setAttribute('aria-disabled', 'false');
            } else if ((fontSizeCurrentInt - 15) < 84) {
                elDecrease.setAttribute('aria-disabled', 'true');
                elIncrease.setAttribute('aria-disabled', 'false');
            } else {
                elIncrease.setAttribute('aria-disabled', 'false');
                elDecrease.setAttribute('aria-disabled', 'false');
            }
        }
    }

    function _setFontSize(fontSizeNew) {
        let fontSizeInt = (parseFloat(fontSizeNew) / 100.0) * 100;
        document.documentElement.style.fontSize = fontSizeInt + '%';
    }

    function _fixFontSize(fontToFix) {
        let fontSizeNewInt;
        let fontSizeStored;
        fontSizeStored = sessionStorage.getItem('font-size');
        if (fontToFix === 'dyslexia') {
            if (fontSizeStored === null) {
                fontSizeNewInt = fontSizeDefault - 5;
            } else {
                fontSizeNewInt = ((parseFloat(fontSizeStored) / 100.0) * 100) - 5;
            }
        } else if (fontToFix === 'regular') {
            if (fontSizeStored === null) {
                fontSizeNewInt = fontSizeDefault;
            } else {
                fontSizeNewInt = (parseFloat(fontSizeStored) / 100.0) * 100;
            }
        }
        document.documentElement.style.fontSize = fontSizeNewInt + '%';
    }

    function _toggleFontFamily(font) {
        let fontToFix;
        if (fontElem.getAttribute('data-font') === font) {
            fontElem.setAttribute('data-font', 'regular');
            fontToFix = 'regular';
        } else {
            fontElem.setAttribute('data-font', font);
            fontToFix = 'dyslexia';
        }
        _storeFontFamily(fontElem.getAttribute('data-font'));
        _fixFontSize(fontToFix);
        _toggleActiveStates();
    }

    function _toggleActiveStates() {
        _resetActiveStates();
        let fontSizeInt;
        if (fontElem.getAttribute('data-font') === 'dyslexia') {
            for (let i = 0; i < fontTogglers.length; i++) {
                if (fontTogglers[i].getAttribute('data-font-toggle') === 'dyslexia') {
                    fontTogglers[i].classList.add('active');
                    fontTogglers[i].setAttribute('aria-pressed', 'true');
                }
            }
        }
        let fontSizeStored;
        fontSizeStored = sessionStorage.getItem('font-size');
        if (fontSizeStored !== null) {
            fontSizeInt = (parseFloat(fontSizeStored) / 100.0) * 100;
            if (fontSizeInt > 102) {
                for (let i = 0; i < fontSizeChangers.length; i++) {
                    if (fontSizeChangers[i].getAttribute('data-font-size') === 'increase') {
                        fontSizeChangers[i].classList.add('active');
                    }
                }
            } else if (fontSizeInt < 98) {
                for (let i = 0; i < fontSizeChangers.length; i++) {
                    if (fontSizeChangers[i].getAttribute('data-font-size') === 'decrease') {
                        fontSizeChangers[i].classList.add('active');
                    }
                }
            }
        }
    }

    function _storeFontFamily(fontClass) {
        if (_storageAvailable('sessionStorage')) {
            sessionStorage.setItem('font', fontClass);
        } else {
            // Too bad, no localStorage for us
        }
    }

    function _storeFontSize(fontSize) {
        if (_storageAvailable('sessionStorage')) {
            sessionStorage.setItem('font-size', fontSize);
        } else {
            // Too bad, no localStorage for us
        }
    }

    function _checkStoredSettings() {
        if (sessionStorage.getItem('font-size')) {
            _setFontSize(sessionStorage.getItem('font-size'));
        }
        if (sessionStorage.getItem('font')) {
            _toggleFontFamily(sessionStorage.getItem('font'));
        }
        _toggleActiveStates();
    }

    function _storageAvailable(type) {
        let storage, x;
        try {
            storage = window[type];
            x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return e instanceof DOMException && (
                    // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage.length !== 0;
        }
    }

    function _resetActiveStates() {
        for (let i = 0; i < fontTogglers.length; i++) {
            fontTogglers[i].classList.remove('active');
            fontTogglers[i].setAttribute('aria-pressed', 'false');
        }
        for (let i = 0; i < fontSizeChangers.length; i++) {
            fontSizeChangers[i].classList.remove('active');
        }
    }

    function init() {
        _bindEvents();
        _checkStoredSettings();
        _toggleActiveStates();
        _enableDisableElems();
    }

    init();

})();
