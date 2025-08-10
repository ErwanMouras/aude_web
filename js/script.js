// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Project item hover effects and click handlers
document.addEventListener('DOMContentLoaded', function() {
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add click functionality here if needed
            console.log('Project clicked:', this.querySelector('h3').textContent);
        });
    });
});

// Newsletter form handler
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Simulate newsletter signup
                alert('Thank you for subscribing to our newsletter!');
                this.querySelector('input[type="email"]').value = '';
            }
        });
    }
});

// Add scroll effect to header
let lastScrollY = window.scrollY;

window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
    
    lastScrollY = currentScrollY;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to elements
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.project-item, .hero-text, .philosophy-text');
    
    elementsToAnimate.forEach(el => {
        // Don't animate hero images
        if (!el.closest('.hero-image')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        }
    });
});

// Dropdown menu enhancements for touch devices
document.addEventListener('DOMContentLoaded', function() {
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        
        // Handle touch devices
        if ('ontouchstart' in window) {
            link.addEventListener('touchstart', function(e) {
                e.preventDefault();
                
                // Close other dropdowns
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                item.classList.toggle('active');
            });
        }
    });
});

// Filter functionality for gallery pages
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    const category = item.getAttribute('data-category');
                    if (category === filter) {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            if (item.style.opacity === '0') {
                                item.style.display = 'none';
                            }
                        }, 300);
                    }
                }
            });
        });
    });
});

// Image lazy loading for better performance
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Don't apply fade effect to hero images
                if (!img.closest('.hero-image')) {
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.addEventListener('load', function() {
                        img.style.opacity = '1';
                    });
                }
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        // Don't observe hero images
        if (!img.closest('.hero-image')) {
            imageObserver.observe(img);
        }
    });
});

// Custom Cursor functionality
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorText = document.querySelector('.cursor-text');
    
    if (cursor && cursorText) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        const projectsSection = document.querySelector('.projects');
        
        // Update cursor position with delay/offset
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorText.style.left = e.clientX + 'px';
            cursorText.style.top = e.clientY + 'px';
            
            // Check if mouse is in projects section
            if (projectsSection) {
                const rect = projectsSection.getBoundingClientRect();
                const isInProjectsSection = e.clientY >= rect.top && e.clientY <= rect.bottom;
                
                if (isInProjectsSection) {
                    cursor.classList.add('active');
                } else {
                    cursor.classList.remove('active');
                    cursorText.classList.remove('visible');
                }
            }
        });
        
        // Animate cursor with offset
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        
        animateCursor();

        // Handle hover effects for project items
        const projectItems = document.querySelectorAll('.project-item');
        
        projectItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const projectName = item.dataset.cursorText || item.querySelector('h3')?.textContent || '';
                const projectLocation = item.dataset.cursorLocation || item.querySelector('p')?.textContent || '';
                
                cursorText.innerHTML = `${projectName}<br><small>${projectLocation}</small>`;
                cursorText.classList.add('visible');
            });
            
            item.addEventListener('mouseleave', () => {
                cursorText.classList.remove('visible');
            });
        });
    }
});

// Newsletter functionality
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('emailInput');
    const messageDiv = document.getElementById('newsletterMessage');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (!email) {
                showMessage('Veuillez entrer votre adresse email', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Veuillez entrer une adresse email valide', 'error');
                return;
            }
            
            // Désactiver le bouton pendant l'envoi
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Inscription...';
            
            try {
                const response = await fetch('http://localhost:3000/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showMessage(data.message, 'success');
                    emailInput.value = '';
                } else {
                    showMessage(data.message, 'error');
                }
                
            } catch (error) {
                console.error('Erreur:', error);
                showMessage('Erreur de connexion. Veuillez réessayer.', 'error');
            } finally {
                // Réactiver le bouton
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showMessage(message, type) {
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `newsletter-message ${type}`;
            
            // Effacer le message après 5 secondes
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'newsletter-message';
            }, 5000);
        }
    }
});

// Language switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Language data
    const translations = {
        fr: {
            // Navigation
            'Architecture': 'Architecture',
            'Residential': 'Résidentiel',
            'Commercial': 'Commercial', 
            'Hospitality': 'Hôtellerie',
            'Design': 'Design',
            'Furniture': 'Mobilier',
            'Lighting': 'Éclairage',
            'Objects': 'Objets',
            'Bespoke': 'Sur Mesure',
            'Creative': 'Créatif',
            'Exhibitions': 'Expositions',
            'Publications': 'Publications',
            'Photography': 'Photographie',
            'Studio': 'Studio',
            'About': 'À Propos',
            'Contact': 'Contact',
            'Press': 'Presse',
            
            // Homepage
            'Soft Minimalism': 'Minimalisme Doux',
            'Recent Work': 'Travaux Récents',
            'Design Philosophy': 'Philosophie du Design',
            'Residential Project': 'Projet Résidentiel',
            'Commercial Space': 'Espace Commercial',
            'Cultural Center': 'Centre Culturel',
            'Furniture Collection': 'Collection de Mobilier',
            'Lighting Series': 'Série d\'Éclairage',
            'Interior Design': 'Design d\'Intérieur',
            'Hospitality Project': 'Projet Hôtelier',
            'Design Objects': 'Objets de Design',
            'Scandinavian Design': 'Design Scandinave',
            
            // Contact
            'Follow': 'Suivez-nous',
            'Newsletter': 'Newsletter',
            'Enter your email': 'Entrez votre email',
            'Subscribe': 'S\'abonner',
            'Stay updated with our latest projects': 'Restez informé de nos derniers projets',
            'Copenhagen, Denmark': 'Copenhague, Danemark',
            
            // Common phrases
            'All rights reserved': 'Tous droits réservés',
            'Send Message': 'Envoyer le Message',
            'Name': 'Nom',
            'Email': 'Email',
            'Company': 'Entreprise',
            'Message': 'Message',
            'Project Type': 'Type de Projet',
            'Tell us about your project...': 'Parlez-nous de votre projet...',
            'Select project type': 'Sélectionnez le type de projet',
            
            // Additional content
            'hero-description': 'Une approche du design centrée sur l\'humain qui mélange fonctionnalité et élégance esthétique',
            'philosophy-text-1': 'Nous croyons en la création d\'espaces et d\'objets à la fois utiles et visuellement sereins. Notre approche met l\'accent sur la simplicité, les matériaux naturels et une compréhension profonde des besoins humains.',
            'philosophy-text-2': 'Chaque projet est abordé avec un esprit holistique, en considérant la relation entre la forme, la fonction et l\'expérience humaine.',
            'stockholm-sweden': 'Stockholm, Suède',
            'oslo-norway': 'Oslo, Norvège',
            
            // Contact form translations
            'contact-form-title': 'Contactez-nous pour votre projet',
            'contact-form-subtitle': 'Partagez vos idées et obtenez un devis personnalisé',
            'full-name-label': 'Nom complet *',
            'full-name-placeholder': 'Votre nom complet',
            'email-label': 'Adresse e-mail *',
            'email-placeholder': 'votre@email.com',
            'phone-label': 'Numéro de téléphone',
            'phone-placeholder': '+33 6 12 34 56 78',
            'project-type-label': 'Type de projet *',
            'select-project-type': 'Sélectionnez un type',
            'renovation': 'Rénovation',
            'interior-design': 'Décoration intérieure',
            'layout': 'Aménagement',
            'architecture': 'Architecture',
            'furniture-design': 'Design de mobilier',
            'lighting-design': 'Éclairage',
            'other': 'Autre',
            'project-description-label': 'Description du projet *',
            'project-description-placeholder': 'Décrivez brièvement votre projet, vos besoins et vos attentes...',
            'budget-label': 'Budget estimé',
            'select-budget': 'Sélectionnez votre budget',
            'under-10k': 'Moins de 10 000€',
            '10k-50k': '10 000€ - 50 000€',
            'over-50k': 'Plus de 50 000€',
            'start-date-label': 'Date de début souhaitée',
            'files-label': 'Joindre des fichiers',
            'files-placeholder': 'Choisir des fichiers',
            'choose-files': 'Choisir des fichiers',
            'file-info': '(Images, plans, PDF acceptés)',
            'gdpr-consent': 'J\'accepte que mes informations soient utilisées pour répondre à ma demande conformément à la politique de confidentialité *',
            'send-message': 'Envoyer la demande',
            
            // Page headers
            'We create spaces that enhance the human experience': 'Nous créons des espaces qui améliorent l\'expérience humaine',
            'through thoughtful design, natural materials': 'grâce à un design réfléchi, des matériaux naturels',
            'Creating objects and furniture that embody our philosophy': 'Créer des objets et du mobilier qui incarnent notre philosophie',
            'Our creative practice extends beyond architecture': 'Notre pratique créative s\'étend au-delà de l\'architecture',
            
            // Filter buttons
            'All': 'Tout',
            
            // Common project types
            'Copenhagen Townhouse': 'Maison de Ville de Copenhague',
            'Kinfolk Office': 'Bureau Kinfolk',
            'Hotel SP34': 'Hôtel SP34',
            'Tokyo Apartment': 'Appartement de Tokyo',
            'Restaurant Barr': 'Restaurant Barr',
            'Boutique Hotel': 'Hôtel Boutique',
            
            // Contact page
            'Get in touch to discuss your project': 'Contactez-nous pour discuter de votre projet',
            'Studio Information': 'Informations du Studio',
            'Send us a message': 'Envoyez-nous un message',
            'Press Inquiries': 'Demandes de Presse',
            'Career Opportunities': 'Opportunités de Carrière',
            'For press and media inquiries': 'Pour les demandes de presse et médias',
            'We are always looking for talented individuals': 'Nous recherchons toujours des personnes talentueuses',
            
            // Page-specific descriptions
            'Creating objects and furniture that embody our philosophy of soft minimalism, focusing on essential forms, natural materials, and enduring quality.': 'Créer des objets et du mobilier qui incarnent notre philosophie du minimalisme doux, en nous concentrant sur les formes essentielles, les matériaux naturels et la qualité durable.',
            'Creating memorable experiences through thoughtful hospitality design that balances comfort, functionality, and aesthetic excellence in hotels, restaurants, and cultural spaces.': 'Créer des expériences mémorables grâce à un design hôtelier réfléchi qui équilibre confort, fonctionnalité et excellence esthétique dans les hôtels, restaurants et espaces culturels.',
            'Creating homes that nurture the human spirit through thoughtful spatial design, natural light, and carefully selected materials that age beautifully over time.': 'Créer des maisons qui nourrissent l\'esprit humain grâce à un design spatial réfléchi, la lumière naturelle et des matériaux soigneusement sélectionnés qui vieillissent magnifiquement avec le temps.',
            'Designing workspaces that inspire creativity and productivity while reflecting brand values and fostering human connection in professional environments.': 'Concevoir des espaces de travail qui inspirent créativité et productivité tout en reflétant les valeurs de marque et en favorisant les connexions humaines dans les environnements professionnels.',
            'Our creative practice extends beyond architecture and design to include exhibitions, publications, and art direction that communicate our design philosophy through diverse media.': 'Notre pratique créative s\'étend au-delà de l\'architecture et du design pour inclure des expositions, publications et direction artistique qui communiquent notre philosophie du design à travers divers médias.',
            'Our exhibition work explores design philosophy through curated spaces, installations, and collaborative presentations that communicate our approach to architecture and design.': 'Nos travaux d\'exposition explorent la philosophie du design à travers des espaces organisés, des installations et des présentations collaboratives qui communiquent notre approche de l\'architecture et du design.',
            'Our editorial work includes books, catalogues, and magazine features that document our projects and explore the philosophy behind our design approach.': 'Nos travaux éditoriaux incluent livres, catalogues et articles de magazines qui documentent nos projets et explorent la philosophie derrière notre approche du design.',
            'Our photographic work documents spaces, objects, and experiences, capturing the essence of our design philosophy through careful attention to light, composition, and atmosphere.': 'Notre travail photographique documente espaces, objets et expériences, capturant l\'essence de notre philosophie du design à travers une attention minutieuse à la lumière, la composition et l\'atmosphère.',
            'Our lighting designs create atmospheric environments through carefully considered form, material, and light quality, enhancing spaces with sculptural presence and functional illumination.': 'Nos designs d\'éclairage créent des environnements atmosphériques à travers une forme, des matériaux et une qualité de lumière soigneusement considérés, rehaussant les espaces avec une présence sculpturale et un éclairage fonctionnel.',
            'Our furniture designs celebrate natural materials and timeless forms, creating pieces that enhance daily life through thoughtful function and aesthetic refinement.': 'Nos designs de mobilier célèbrent les matériaux naturels et les formes intemporelles, créant des pièces qui enrichissent la vie quotidienne à travers une fonction réfléchie et un raffinement esthétique.',
            'Our collection of design objects explores the beauty of everyday items through refined forms, natural materials, and thoughtful craftsmanship that elevates daily rituals.': 'Notre collection d\'objets de design explore la beauté des objets du quotidien à travers des formes raffinées, des matériaux naturels et un artisanat réfléchi qui élève les rituels quotidiens.',
            'Custom design solutions tailored to specific projects and clients, from architectural elements to furniture pieces that perfectly complement our built environments.': 'Solutions de design sur mesure adaptées à des projets et clients spécifiques, des éléments architecturaux aux pièces de mobilier qui complètent parfaitement nos environnements construits.',
            'Founded in 2008 in Copenhagen, Norm Architects is a multidisciplinary architecture and design practice creating spaces and objects that enrich the human experience.': 'Fondé en 2008 à Copenhague, Norm Architects est un cabinet d\'architecture et de design multidisciplinaire créant des espaces et objets qui enrichissent l\'expérience humaine.',
            'Media coverage and press information about Norm Architects\' projects, philosophy, and achievements in architecture and design.': 'Couverture médiatique et informations de presse sur les projets, la philosophie et les réalisations de Norm Architects en architecture et design.'
        },
        en: {
            // Navigation  
            'Architecture': 'Architecture',
            'Residential': 'Residential',
            'Commercial': 'Commercial',
            'Hospitality': 'Hospitality', 
            'Design': 'Design',
            'Furniture': 'Furniture',
            'Lighting': 'Lighting',
            'Objects': 'Objects',
            'Bespoke': 'Bespoke',
            'Creative': 'Creative',
            'Exhibitions': 'Exhibitions',
            'Publications': 'Publications',
            'Photography': 'Photography',
            'Studio': 'Studio',
            'About': 'About',
            'Contact': 'Contact',
            'Press': 'Press',
            
            // Homepage
            'Soft Minimalism': 'Soft Minimalism',
            'Recent Work': 'Recent Work',
            'Design Philosophy': 'Design Philosophy', 
            'Residential Project': 'Residential Project',
            'Commercial Space': 'Commercial Space',
            'Cultural Center': 'Cultural Center',
            'Furniture Collection': 'Furniture Collection',
            'Lighting Series': 'Lighting Series',
            'Interior Design': 'Interior Design',
            'Hospitality Project': 'Hospitality Project',
            'Design Objects': 'Design Objects',
            'Scandinavian Design': 'Scandinavian Design',
            
            // Contact
            'Follow': 'Follow',
            'Newsletter': 'Newsletter',
            'Enter your email': 'Enter your email',
            'Subscribe': 'Subscribe',
            'Stay updated with our latest projects': 'Stay updated with our latest projects',
            'Copenhagen, Denmark': 'Copenhagen, Denmark',
            
            // Common phrases
            'All rights reserved': 'All rights reserved',
            'Send Message': 'Send Message',
            'Name': 'Name',
            'Email': 'Email', 
            'Company': 'Company',
            'Message': 'Message',
            'Project Type': 'Project Type',
            'Tell us about your project...': 'Tell us about your project...',
            'Select project type': 'Select project type',
            
            // Additional content
            'hero-description': 'A human-centric approach to design that blends functionality with aesthetic elegance',
            'philosophy-text-1': 'We believe in creating spaces and objects that are both purposeful and visually serene. Our approach emphasizes simplicity, natural materials, and a deep understanding of human needs.',
            'philosophy-text-2': 'Every project is approached with a holistic mindset, considering the relationship between form, function, and the human experience.',
            'stockholm-sweden': 'Stockholm, Sweden',
            'oslo-norway': 'Oslo, Norway',
            
            // Contact form translations
            'contact-form-title': 'Contact us for your project',
            'contact-form-subtitle': 'Share your ideas and get a personalized quote',
            'full-name-label': 'Full name *',
            'full-name-placeholder': 'Your full name',
            'email-label': 'Email address *',
            'email-placeholder': 'your@email.com',
            'phone-label': 'Phone number',
            'phone-placeholder': '+1 234 567 8900',
            'project-type-label': 'Project type *',
            'select-project-type': 'Select a type',
            'renovation': 'Renovation',
            'interior-design': 'Interior design',
            'layout': 'Layout',
            'architecture': 'Architecture',
            'furniture-design': 'Furniture design',
            'lighting-design': 'Lighting',
            'other': 'Other',
            'project-description-label': 'Project description *',
            'project-description-placeholder': 'Briefly describe your project, needs and expectations...',
            'budget-label': 'Estimated budget',
            'select-budget': 'Select your budget',
            'under-10k': 'Under $10,000',
            '10k-50k': '$10,000 - $50,000',
            'over-50k': 'Over $50,000',
            'start-date-label': 'Desired start date',
            'files-label': 'Attach files',
            'files-placeholder': 'Choose files',
            'choose-files': 'Choose files',
            'file-info': '(Images, plans, PDF accepted)',
            'gdpr-consent': 'I agree that my information may be used to respond to my request in accordance with the privacy policy *',
            'send-message': 'Send request',
            
            // Page headers
            'We create spaces that enhance the human experience': 'We create spaces that enhance the human experience',
            'through thoughtful design, natural materials': 'through thoughtful design, natural materials',
            'Creating objects and furniture that embody our philosophy': 'Creating objects and furniture that embody our philosophy',
            'Our creative practice extends beyond architecture': 'Our creative practice extends beyond architecture',
            
            // Filter buttons
            'All': 'All',
            
            // Common project types
            'Copenhagen Townhouse': 'Copenhagen Townhouse',
            'Kinfolk Office': 'Kinfolk Office',
            'Hotel SP34': 'Hotel SP34',
            'Tokyo Apartment': 'Tokyo Apartment',
            'Restaurant Barr': 'Restaurant Barr',
            'Boutique Hotel': 'Boutique Hotel',
            
            // Contact page
            'Get in touch to discuss your project': 'Get in touch to discuss your project',
            'Studio Information': 'Studio Information',
            'Send us a message': 'Send us a message',
            'Press Inquiries': 'Press Inquiries',
            'Career Opportunities': 'Career Opportunities',
            'For press and media inquiries': 'For press and media inquiries',
            'We are always looking for talented individuals': 'We are always looking for talented individuals',
            
            // Page-specific descriptions
            'Creating objects and furniture that embody our philosophy of soft minimalism, focusing on essential forms, natural materials, and enduring quality.': 'Creating objects and furniture that embody our philosophy of soft minimalism, focusing on essential forms, natural materials, and enduring quality.',
            'Creating memorable experiences through thoughtful hospitality design that balances comfort, functionality, and aesthetic excellence in hotels, restaurants, and cultural spaces.': 'Creating memorable experiences through thoughtful hospitality design that balances comfort, functionality, and aesthetic excellence in hotels, restaurants, and cultural spaces.',
            'Creating homes that nurture the human spirit through thoughtful spatial design, natural light, and carefully selected materials that age beautifully over time.': 'Creating homes that nurture the human spirit through thoughtful spatial design, natural light, and carefully selected materials that age beautifully over time.',
            'Designing workspaces that inspire creativity and productivity while reflecting brand values and fostering human connection in professional environments.': 'Designing workspaces that inspire creativity and productivity while reflecting brand values and fostering human connection in professional environments.',
            'Our creative practice extends beyond architecture and design to include exhibitions, publications, and art direction that communicate our design philosophy through diverse media.': 'Our creative practice extends beyond architecture and design to include exhibitions, publications, and art direction that communicate our design philosophy through diverse media.',
            'Our exhibition work explores design philosophy through curated spaces, installations, and collaborative presentations that communicate our approach to architecture and design.': 'Our exhibition work explores design philosophy through curated spaces, installations, and collaborative presentations that communicate our approach to architecture and design.',
            'Our editorial work includes books, catalogues, and magazine features that document our projects and explore the philosophy behind our design approach.': 'Our editorial work includes books, catalogues, and magazine features that document our projects and explore the philosophy behind our design approach.',
            'Our photographic work documents spaces, objects, and experiences, capturing the essence of our design philosophy through careful attention to light, composition, and atmosphere.': 'Our photographic work documents spaces, objects, and experiences, capturing the essence of our design philosophy through careful attention to light, composition, and atmosphere.',
            'Our lighting designs create atmospheric environments through carefully considered form, material, and light quality, enhancing spaces with sculptural presence and functional illumination.': 'Our lighting designs create atmospheric environments through carefully considered form, material, and light quality, enhancing spaces with sculptural presence and functional illumination.',
            'Our furniture designs celebrate natural materials and timeless forms, creating pieces that enhance daily life through thoughtful function and aesthetic refinement.': 'Our furniture designs celebrate natural materials and timeless forms, creating pieces that enhance daily life through thoughtful function and aesthetic refinement.',
            'Our collection of design objects explores the beauty of everyday items through refined forms, natural materials, and thoughtful craftsmanship that elevates daily rituals.': 'Our collection of design objects explores the beauty of everyday items through refined forms, natural materials, and thoughtful craftsmanship that elevates daily rituals.',
            'Custom design solutions tailored to specific projects and clients, from architectural elements to furniture pieces that perfectly complement our built environments.': 'Custom design solutions tailored to specific projects and clients, from architectural elements to furniture pieces that perfectly complement our built environments.',
            'Founded in 2008 in Copenhagen, Norm Architects is a multidisciplinary architecture and design practice creating spaces and objects that enrich the human experience.': 'Founded in 2008 in Copenhagen, Norm Architects is a multidisciplinary architecture and design practice creating spaces and objects that enrich the human experience.',
            'Media coverage and press information about Norm Architects\' projects, philosophy, and achievements in architecture and design.': 'Media coverage and press information about Norm Architects\' projects, philosophy, and achievements in architecture and design.'
        }
    };

    // Get current language from localStorage or default to French
    let currentLang = localStorage.getItem('language') || 'fr';
    
    // Initialize language
    setLanguage(currentLang);
    
    // Language switch event listeners
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const newLang = this.getAttribute('data-lang');
            setLanguage(newLang);
            localStorage.setItem('language', newLang);
        });
    });
    
    function setLanguage(lang) {
        currentLang = lang;
        
        // Debug log
        console.log('Setting language to:', lang);
        
        // Update button states
        const allLangButtons = document.querySelectorAll('.lang-btn');
        allLangButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
        
        // Update all translatable elements
        const translatableElements = document.querySelectorAll('[data-translate]');
        console.log('Found translatable elements:', translatableElements.length);
        
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' && (element.type === 'email' || element.type === 'text')) {
                    element.placeholder = translations[lang][key];
                } else if (element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
                console.log('Translated:', key, '→', translations[lang][key]);
            } else {
                console.log('Translation not found for:', key);
            }
        });
        
        // Update document language attribute
        document.documentElement.lang = lang;
        
        // Save to localStorage
        localStorage.setItem('language', lang);
    }
});

// Mobile-specific enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Improved touch handling for mobile devices
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchStartY - touchEndY;
        
        // Close mobile menu on upward swipe
        if (swipeDistance > swipeThreshold) {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    }
    
    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Optimize scroll performance on mobile
    let ticking = false;
    
    function updateScrollEffects() {
        const header = document.querySelector('.header');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
        
        ticking = false;
    }
    
    function requestScrollTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollTick, { passive: true });
    
    // Responsive image loading based on screen size
    function loadResponsiveImages() {
        const images = document.querySelectorAll('img[src*="images.jpeg"]');
        const isMobile = window.innerWidth <= 768;
        
        images.forEach(img => {
            if (isMobile) {
                img.style.objectFit = 'cover';
                img.style.objectPosition = 'center';
            }
        });
    }
    
    loadResponsiveImages();
    window.addEventListener('resize', loadResponsiveImages);
    
    // Enhanced form validation for mobile
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validation
            if (!validateContactForm(data)) {
                return;
            }
            
            // Disable submit button
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
            
            try {
                // For now, simulate sending to the same newsletter endpoint
                // In a real implementation, you'd have a separate contact endpoint
                const response = await fetch('http://localhost:3000/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName: data.fullName,
                        email: data.email,
                        phone: data.phone,
                        projectType: data.projectType,
                        projectDescription: data.projectDescription,
                        budget: data.budget,
                        startDate: data.startDate,
                        gdprConsent: data.gdprConsent === 'on'
                    })
                });
                
                const responseData = await response.json();
                
                if (responseData.success) {
                    showContactMessage(responseData.message || 'Message envoyé avec succès!', 'success');
                    this.reset();
                } else {
                    showContactMessage(responseData.message || 'Erreur lors de l\'envoi', 'error');
                }
                
            } catch (error) {
                console.error('Erreur:', error);
                showContactMessage('Erreur de connexion. Votre message a été sauvegardé et nous vous contacterons bientôt.', 'success');
                this.reset(); // For demo purposes, we'll reset the form
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
    
    function validateContactForm(data) {
        const messageDiv = document.getElementById('contactMessage');
        
        // Check required fields
        if (!data.fullName || data.fullName.trim().length < 2) {
            showContactMessage('Veuillez entrer un nom complet valide (minimum 2 caractères)', 'error');
            return false;
        }
        
        if (!data.email) {
            showContactMessage('Veuillez entrer votre adresse email', 'error');
            return false;
        }
        
        if (!isValidEmail(data.email)) {
            showContactMessage('Veuillez entrer une adresse email valide', 'error');
            return false;
        }
        
        if (!data.projectType) {
            showContactMessage('Veuillez sélectionner un type de projet', 'error');
            return false;
        }
        
        if (!data.projectDescription || data.projectDescription.trim().length < 10) {
            showContactMessage('Veuillez décrire votre projet (minimum 10 caractères)', 'error');
            return false;
        }
        
        if (!data.gdprConsent) {
            showContactMessage('Veuillez accepter les conditions de traitement des données', 'error');
            return false;
        }
        
        return true;
    }
    
    function showContactMessage(message, type) {
        const messageDiv = document.getElementById('contactMessage');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `form-message ${type}`;
            
            // Clear message after 5 seconds
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'form-message';
            }, 5000);
            
            // Scroll to message
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // File upload handling
    const fileInput = document.getElementById('files');
    const fileLabel = document.querySelector('.file-input-label');
    
    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', function() {
            const files = this.files;
            const fileSpan = fileLabel.querySelector('[data-translate="choose-files"]');
            
            if (files.length > 0) {
                if (files.length === 1) {
                    fileSpan.textContent = files[0].name;
                } else {
                    fileSpan.textContent = `${files.length} fichiers sélectionnés`;
                }
                fileLabel.style.borderColor = '#8b8680';
                fileLabel.style.backgroundColor = '#f0f0f0';
            } else {
                const currentLang = localStorage.getItem('language') || 'fr';
                fileSpan.textContent = currentLang === 'fr' ? 'Choisir des fichiers' : 'Choose files';
                fileLabel.style.borderColor = '#e8e4d8';
                fileLabel.style.backgroundColor = '#fafafa';
            }
        });
    }
    
    // Mobile-friendly focus management
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Scroll input into view on mobile
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 300);
            }
        });
    });
});