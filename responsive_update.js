// Update script for responsive pages
document.addEventListener('DOMContentLoaded', function() {
    // Add viewport meta tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0');
        document.head.appendChild(meta);
    }
    
    // Add responsive CSS link if not present
    if (!document.querySelector('link[href="responsive.css"]')) {
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'responsive.css');
        document.head.appendChild(link);
    }
    
    // Update navigation links to point to responsive versions
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('nlp_') && href.endsWith('.html') && !href.includes('_responsive')) {
            // Replace with responsive version
            const newHref = href.replace('.html', '_responsive.html');
            link.setAttribute('href', newHref);
        }
    });
    
    // Add mobile menu toggle if not present
    const nav = document.querySelector('.main-nav');
    if (nav && !document.getElementById('menuToggle')) {
        // Convert nav to flex container if it's not already
        nav.style.display = 'flex';
        nav.style.justifyContent = 'space-between';
        nav.style.alignItems = 'center';
        
        // Add menu toggle button
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.id = 'menuToggle';
        menuToggle.textContent = '☰';
        
        // Get the nav list
        const navList = nav.querySelector('ul');
        if (navList) {
            navList.id = 'navList';
            
            // Insert the toggle button before the nav list
            nav.insertBefore(menuToggle, navList);
            
            // Add event listener for menu toggle
            menuToggle.addEventListener('click', function() {
                navList.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.main-nav')) {
                    navList.classList.remove('active');
                }
            });
        }
    }
    
    // Add mobile menu styles if not present
    if (!document.getElementById('mobileMenuStyles')) {
        const style = document.createElement('style');
        style.id = 'mobileMenuStyles';
        style.textContent = `
            @media (max-width: 768px) {
                .menu-toggle {
                    display: block;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5em;
                    cursor: pointer;
                }
                
                .nav-list {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background-color: var(--dark, #2c3e50);
                    flex-direction: column;
                    padding: 10px;
                    border-radius: 0 0 8px 8px;
                    display: none;
                    z-index: 1000;
                }
                
                .nav-list.active {
                    display: flex;
                }
                
                .nav-item {
                    width: 100%;
                    text-align: center;
                    margin: 5px 0;
                }
                
                .nav-link {
                    display: block;
                    padding: 10px;
                }
                
                .main-nav {
                    flex-wrap: wrap;
                    position: relative;
                }
            }
        `;
        document.head.appendChild(style);
    }
});
