/**
 * GODMODE i18n - Localization Utility
 * Handles language detection, loading JSON locales, and DOM translation.
 */

const i18n = {
    locale: 'en',
    translations: {},
    isLoaded: false,

    /**
     * Detects user language and loads the appropriate locale
     */
    async init() {
        // Priority: 1. Query Param, 2. LocalStorage, 3. Navigator Language
        const params = new URLSearchParams(window.location.search);
        const queryLang = params.get('lang');
        const storageLang = localStorage.getItem('godmode_lang');
        const userLang = navigator.language || navigator.userLanguage;

        if (queryLang) {
            this.locale = queryLang.startsWith('es') ? 'es' : 'en';
            localStorage.setItem('godmode_lang', this.locale);
        } else if (storageLang) {
            this.locale = storageLang;
        } else {
            this.locale = userLang.startsWith('es') ? 'es' : 'en';
        }

        try {
            const response = await fetch(`./locales/${this.locale}.json`);
            if (!response.ok) throw new Error(`Could not load locale: ${this.locale}`);
            this.translations = await response.json();
            this.isLoaded = true;

            // Update HTML lang attribute
            document.documentElement.lang = this.locale;

            // Run initial translation
            this.translatePage();

            // Dispatch event for other scripts to know i18n is ready
            window.dispatchEvent(new CustomEvent('i18n-ready'));
        } catch (err) {
            console.error('i18n init failed:', err);
            // Fallback to English if Spanish fails
            if (this.locale !== 'en') {
                this.locale = 'en';
                await this.init();
            }
        }
    },

    /**
     * Translates a key with optional variable interpolation
     * Usage: i18n.t('vip.ambassador_body_passes', { count: 10 })
     */
    t(key, variables = {}) {
        if (!this.isLoaded) return key;

        // Support nested keys like 'vip.title'
        const keys = key.split('.');
        let template = this.translations;

        for (const k of keys) {
            if (template[k] === undefined) {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
            template = template[k];
        }

        // Variable interpolation {variable}
        let result = template;
        Object.keys(variables).forEach(varName => {
            const regex = new RegExp(`{${varName}}`, 'g');
            result = result.replace(regex, variables[varName]);
        });

        return result;
    },

    /**
     * Translates all elements with data-i18n attribute
     */
    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);

            if (translation !== key) {
                // Determine where to put the translation (text, placeholder, or specific attribute)
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (el.hasAttribute('placeholder')) {
                        el.setAttribute('placeholder', translation);
                    } else {
                        el.value = translation;
                    }
                } else if (el.hasAttribute('data-i18n-attr')) {
                    const attr = el.getAttribute('data-i18n-attr');
                    el.setAttribute(attr, translation);
                } else if (el.hasAttribute('data-i18n-html')) {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        // Translate title if data-i18n is on head title
        const titleEl = document.querySelector('title[data-i18n]');
        if (titleEl) {
            document.title = this.t(titleEl.getAttribute('data-i18n'));
        }
    }
};

// Auto-init i18n
// Using a self-invoking function to avoid global pollution if not needed, 
// but we want i18n to be available globally for other scripts.
window.i18n = i18n;
document.addEventListener('DOMContentLoaded', () => i18n.init());
