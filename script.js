document.addEventListener('DOMContentLoaded', function() {
    const projectsContainer = document.getElementById('projects-container');
    const username = 'biancaalvess';
    const token = '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'; // Substitua pelo seu token pessoal

    fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
            'Authorization': `token ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta da API');
        }
        return response.json();
    })
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
