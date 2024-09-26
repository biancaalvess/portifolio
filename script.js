document.addEventListener('DOMContentLoaded', function() {
    const projectsContainer = document.getElementById('projects-container'); // ID corrigido
    const username = 'biancaalvess'; // Substitua pelo seu nome de usuário do GitHub

    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(data => {
            data.forEach(repo => {
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card');

                projectCard.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'Sem descrição'}</p>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Ver no GitHub</a>
                `;

                projectsContainer.appendChild(projectCard);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar repositórios do GitHub:', error);
            projectsContainer.innerHTML = '<p>Não foi possível carregar os projetos no momento.</p>';
        });
});
