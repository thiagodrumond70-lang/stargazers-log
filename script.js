const eventList = document.querySelector("#event-list");

async function loadStarredRepositories() {
  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Could not load repositories: ${response.status}`);
    }

    const events = await response.json();
    renderRepositories(events);
  } catch (error) {
    eventList.textContent = "Unable to load starred repositories.";
    console.error(error);
  }
}

function renderRepositories(events) {
  eventList.replaceChildren();

  events.forEach((event) => {
    const item = document.createElement("li");
    item.className = "repository-item";

    const link = document.createElement("a");
    link.href = event.url;
    link.textContent = event.repo || event.name;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = event.description;

    const meta = document.createElement("div");
    meta.className = "repository-meta";
    meta.textContent = [event.language, event.stars ? `★ ${event.stars.toLocaleString()}` : ""]
      .filter(Boolean)
      .join(" · ");

    item.append(link, description, meta);
    eventList.append(item);
  });
}

loadStarredRepositories();
