// Inline component loader - works without HTTP server
class InlineComponentLoader {
    static getNavbarHTML() {
        return `
<header class="header">
    <div class="container">
        <div class="logo">
            <a href="index.html">
                <h1>AUDE MOURADIAN</h1>
            </a>
        </div>
        <div class="header-right">
            <div class="language-switcher">
                <button id="langFr" class="lang-btn active" data-lang="fr">FR</button>
                <span class="language-separator">|</span>
                <button id="langEn" class="lang-btn" data-lang="en">EN</button>
            </div>
            <nav class="nav">
                <div class="nav-toggle" id="navToggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul class="nav-menu" id="navMenu">
                    <li class="nav-item dropdown">
                        <a href="architecture.html" class="nav-link" data-translate="Architecture">Architecture</a>
                        <ul class="dropdown-menu">
                            <li><a href="residential.html" data-translate="Residential">Résidentiel</a></li>
                            <li><a href="commercial.html" data-translate="Commercial">Commercial</a></li>
                            <li><a href="hospitality.html" data-translate="Hospitality">Hôtellerie</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a href="design.html" class="nav-link" data-translate="Design">Design</a>
                        <ul class="dropdown-menu">
                            <li><a href="furniture.html" data-translate="Furniture">Mobilier</a></li>
                            <li><a href="lighting.html" data-translate="Lighting">Éclairage</a></li>
                            <li><a href="objects.html" data-translate="Objects">Objets</a></li>
                            <li><a href="bespoke.html" data-translate="Bespoke">Sur Mesure</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a href="creative.html" class="nav-link" data-translate="Creative">Créatif</a>
                        <ul class="dropdown-menu">
                            <li><a href="exhibitions.html" data-translate="Exhibitions">Expositions</a></li>
                            <li><a href="publications.html" data-translate="Publications">Publications</a></li>
                            <li><a href="photography.html" data-translate="Photography">Photographie</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a href="studio.html" class="nav-link" data-translate="Studio">Studio</a>
                        <ul class="dropdown-menu">
                            <li><a href="about.html" data-translate="About">À Propos</a></li>
                            <li><a href="contact.html" data-translate="Contact">Contact</a></li>
                            <li><a href="press.html" data-translate="Press">Presse</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</header>`;
    }

    static getFooterHTML() {
        return `
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3 data-translate="Contact">Contact</h3>
                <p data-translate="Lyon, France">Lyon, France</p>
                <p>aude.mouradian@gmail.com</p>
            </div>
            <div class="footer-section">
                <h3 data-translate="Follow">Suivez-nous</h3>
                <div class="social-links">
                    <a href="#" class="social-link">Instagram</a>
                    <a href="#" class="social-link">LinkedIn</a>
                    <a href="#" class="social-link">Pinterest</a>
                </div>
            </div>
            <div class="footer-section newsletter-section">
                <h3 data-translate="Newsletter">Newsletter</h3>
                <p data-translate="Stay updated with our latest projects">Restez informé de nos derniers projets</p>
                <form class="newsletter-form" id="newsletterForm">
                    <div class="input-group">
                        <input type="email" id="emailInput" placeholder="Entrez votre email" data-translate="Enter your email" required>
                        <button type="submit" data-translate="Subscribe">S'abonner</button>
                    </div>
                    <div class="newsletter-message" id="newsletterMessage"></div>
                </form>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Aude Architects. <span data-translate="All rights reserved">Tous droits réservés</span>.</p>
        </div>
    </div>
</footer>`;
    }

    static loadNavbar() {
        const placeholder = document.getElementById('navbar-placeholder');
        if (placeholder) {
            placeholder.innerHTML = this.getNavbarHTML();
            this.initializeLanguageSwitcher();
            this.initializeMobileMenu();
        }
    }

    static loadFooter() {
        const placeholder = document.getElementById('footer-placeholder');
        if (placeholder) {
            placeholder.innerHTML = this.getFooterHTML();
        }
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

    static init() {
        // Load components when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadNavbar();
                this.loadFooter();
            });
        } else {
            this.loadNavbar();
            this.loadFooter();
        }
    }
}

// Initialize inline component loader
InlineComponentLoader.init();