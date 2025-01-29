document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Authorization': `token ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erro na resposta da API');
        }

        const data = await response.json();

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
    } catch (error) {
        console.error('Erro ao buscar repositórios do GitHub:', error);
        projectsContainer.innerHTML = '<p>Não foi possível carregar os projetos no momento.</p>';
    }
});
