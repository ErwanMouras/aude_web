// Component loader system for navbar and footer
class ComponentLoader {
    static async loadComponent(componentPath, targetSelector) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const targetElement = document.querySelector(targetSelector);
            if (targetElement) {
                targetElement.innerHTML = html;
            }
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
        }
    }

    static async loadNavbar() {
        await this.loadComponent('../html/components/navbar.html', '#navbar-placeholder');
        // Re-initialize language switcher after navbar is loaded
        this.initializeLanguageSwitcher();
        // Re-initialize mobile menu after navbar is loaded
        this.initializeMobileMenu();
    }

    static async loadFooter() {
        await this.loadComponent('../html/components/footer.html', '#footer-placeholder');
    }

    static initializeLanguageSwitcher() {
        const langFr = document.getElementById('langFr');
        const langEn = document.getElementById('langEn');
        
        if (langFr && langEn) {
            // Get current language from localStorage or default to 'fr'
            const currentLang = localStorage.getItem('language') || 'fr';
            
            // Set initial active state
            if (currentLang === 'fr') {
                langFr.classList.add('active');
                langEn.classList.remove('active');
            } else {
                langEn.classList.add('active');
                langFr.classList.remove('active');
            }
            
            // Apply current language
            if (typeof setLanguage === 'function') {
                setLanguage(currentLang);
            }
            
            // Add event listeners
            langFr.addEventListener('click', () => {
                if (typeof setLanguage === 'function') {
                    setLanguage('fr');
                }
            });
            
            langEn.addEventListener('click', () => {
                if (typeof setLanguage === 'function') {
                    setLanguage('en');
                }
            });
        }
    }

    static initializeMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    static async init() {
        // Load components when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', async () => {
                await this.loadNavbar();
                await this.loadFooter();
            });
        } else {
            await this.loadNavbar();
            await this.loadFooter();
        }
    }
}

// Initialize component loader
ComponentLoader.init();