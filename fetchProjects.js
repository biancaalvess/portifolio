// URL da API do GitHub para os repositórios do usuário
const GITHUB_API_URL = "https://api.github.com/users/biancaalvess/repos";

// Array de nomes de repositórios que você não quer mostrar
const excludeProjects = [
    "Repositorio-estudos",
    "biancaalvess",
    "portifolio",
    "site-grupo-arco-estudos",
    "target-teste"
];

// Função para buscar o conteúdo do README de um repositório e extrair o segundo parágrafo
async function fetchReadme(repoName) {
    const readmeUrl = `https://api.github.com/repos/biancaalvess/${repoName}/readme`;

    try {
        const response = await fetch(readmeUrl);
        if (!response.ok) {
            throw new Error(`Erro ao buscar README: ${response.statusText}`);
        }

        const readmeData = await response.json();

        // Verifica se a propriedade 'content' está presente no JSON retornado
        if (!readmeData.content) {
            throw new Error('README não encontrado no repositório.');
        }

        // Converte o conteúdo base64 para texto usando UTF-8
        const content = atob(readmeData.content); // Decodifica o conteúdo base64 para binário

        // Utiliza TextDecoder para converter o texto corretamente para UTF-8
        const decoder = new TextDecoder("utf-8");
        const decodedContent = decoder.decode(new Uint8Array([...content].map(char => char.charCodeAt(0))));

        // Divide o conteúdo em parágrafos
        const paragraphs = decodedContent.split('\n\n'); // Divide por duplas quebras de linha para obter parágrafos

        // Verifica se existe um segundo parágrafo, caso contrário, retorna uma mensagem padrão
        const secondParagraph = paragraphs.length > 1 
            ? paragraphs[1].split('\n').find(line => line.trim() !== '') 
            : "Descrição não disponível.";

        console.log(`Segundo parágrafo do README de ${repoName}: ${secondParagraph}`); // Log para verificar

        return secondParagraph || "Descrição não disponível.";
    } catch (error) {
        console.error(`Erro ao buscar o README do repositório ${repoName}:`, error);
        return "Descrição não disponível.";
    }
}

// Função para buscar a URL da imagem da pasta "fotos"
async function fetchImageUrl(repoName) {
    const photosUrl = `https://api.github.com/repos/biancaalvess/${repoName}/contents/fotos`;

    try {
        const response = await fetch(photosUrl);
        if (!response.ok) {
            throw new Error(`Erro ao buscar imagens: ${response.statusText}`);
        }

        const photosData = await response.json();

        // Filtra os arquivos para encontrar apenas imagens
        const imageFiles = photosData.filter(file => 
            file.type === "file" && 
            (file.name.endsWith(".jpg") || file.name.endsWith(".png") || file.name.endsWith(".jpeg"))
        );

        // Retorna a URL da primeira imagem encontrada
        if (imageFiles.length > 0) {
            return imageFiles[0].download_url;
        } else {
            return null; // Nenhuma imagem encontrada
        }
    } catch (error) {
        console.error(`Erro ao buscar imagens do repositório ${repoName}:`, error);
        return null;
    }
}

// Função para formatar o nome do projeto
function formatProjectName(name) {
    // Remove os traços e capitaliza a primeira letra de cada palavra
    return name
        .split('-')                      // Divide o nome pelos traços
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza cada palavra
        .join(' ');                      // Junta as palavras novamente com espaços
}

// Função para buscar os repositórios do GitHub
async function fetchProjects() {
    try {
        const response = await fetch(GITHUB_API_URL);
        const projects = await response.json();

        const projectsContainer = document.getElementById("projects-container");
        projectsContainer.innerHTML = ""; // Limpa a seção antes de adicionar novos projetos

        for (const project of projects) {
            // Verifica se o projeto está na lista de exclusão
            if (excludeProjects.includes(project.name)) {
                continue; // Pula este projeto
            }

            // Cria um novo elemento de projeto com a estrutura desejada
            const projectCard = document.createElement("div");
            projectCard.classList.add("project-card");

            // Aplica a formatação ao nome do projeto
            const formattedName = formatProjectName(project.name);

            // Adiciona título do projeto formatado
            const projectTitle = document.createElement("h3");
            projectTitle.textContent = formattedName;
            projectCard.appendChild(projectTitle);

            // Busca a descrição do README
            try {
                const projectDescription = await fetchReadme(project.name);
                const projectDescElement = document.createElement("p");
                projectDescElement.textContent = projectDescription;
                projectCard.appendChild(projectDescElement);
            } catch (error) {
                console.error(`Erro ao buscar descrição do projeto ${project.name}:`, error);
                const projectDescElement = document.createElement("p");
                projectDescElement.textContent = "Descrição não disponível.";
                projectCard.appendChild(projectDescElement);
            }

            // Busca a URL da imagem da pasta "fotos"
            const imageUrl = await fetchImageUrl(project.name);
            if (imageUrl) {
                const projectImage = document.createElement("img");
                projectImage.src = imageUrl;
                projectImage.alt = formattedName;
                projectImage.style.width = "100%";
                projectImage.style.borderRadius = "10px";
                projectCard.appendChild(projectImage);
            }

            // Adiciona link para o GitHub
            const projectLink = document.createElement("a");
            projectLink.href = project.html_url;
            projectLink.target = "_blank";
            projectLink.classList.add("github-btn");
            projectLink.textContent = "GitHub";
            projectCard.appendChild(projectLink);

            // Adiciona o card à seção de projetos
            projectsContainer.appendChild(projectCard);
        }
    } catch (error) {
        console.error("Erro ao buscar projetos do GitHub:", error);
    }
}

// Chama a função para buscar projetos ao carregar a página
window.onload = fetchProjects;