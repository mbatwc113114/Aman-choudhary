// Get project id from URL
const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

// Fetch JSON data
fetch("projects.json")
    .then(response => response.json())
    .then(data => {

        const project = data[projectId];

        if (!project) {
            document.body.innerHTML = "<h2 style='text-align:center;margin-top:100px;'>Project Not Found</h2>";
            return;
        }

        document.getElementById("project-title").textContent = project.title;
        document.getElementById("project-category").textContent = project.category;
        document.getElementById("project-description").textContent = project.description;
        document.getElementById("project-image").src = project.image;

        const techContainer = document.getElementById("project-tech");
        project.tech.forEach(tech => {
            const span = document.createElement("span");
            span.textContent = tech;
            techContainer.appendChild(span);
        });

    });
