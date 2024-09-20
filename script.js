// Função de animação quando a seção entra na viewport
function animateOnScroll() {
    const sections = document.querySelectorAll('section');
    const triggerBottom = window.innerHeight * 0.8;

    sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    
    if (sectionTop < triggerBottom) {
        section.classList.add('active-section');
    } else {
        section.classList.remove('active-section');
    }
    });
}

window.addEventListener('scroll', animateOnScroll);

  // Efeito de suavidade ao rolar para seções
const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
    link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
        behavior: 'smooth'
    });
    });
});

// Adicionar a classe 'visible' quando a página carrega
window.addEventListener('DOMContentLoaded', (event) => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.classList.add('visible'));
});