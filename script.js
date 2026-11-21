const eventList = document.querySelector("#event-list");

async function loadStarredRepositories() {
  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Could not load repositories: ${response.status} ${response.statusText}`.trim());
    }

    const events = await response.json();

    if (!Array.isArray(events)) {
      throw new Error("Repository data must be a JSON array.");
    }

    renderRepositories(events);
  } catch (error) {
    eventList.textContent = "Unable to load starred repositories.";
    console.error(error);
  }
}

function renderRepositories(events) {
  eventList.replaceChildren();
  let validEventCount = 0;

  events.forEach((event) => {
    if (!event || typeof event !== "object") {
      return;
    }

    const name = typeof event.repo === "string"
      ? event.repo
      : typeof event.name === "string"
        ? event.name
        : "";

    let url;
    if (typeof event.url === "string") {
      try {
        const parsedUrl = new URL(event.url);
        if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
          url = parsedUrl.href;
        }
      } catch {
        url = undefined;
      }
    }

    if (!name.trim() || !url) {
      console.warn("Skipping invalid repository entry.", event);
      return;
    }

    const item = document.createElement("li");
    item.className = "repository-item";

    const link = document.createElement("a");
    link.href = url;
    link.textContent = name.trim();

    item.append(link);

    if (typeof event.description === "string" && event.description.trim()) {
      const description = document.createElement("p");
      description.className = "repository-description";
      description.textContent = event.description.trim();
      item.append(description);
    }

    const metaItems = [];
    if (typeof event.language === "string" && event.language.trim()) {
      metaItems.push(event.language.trim());
    }
    if (typeof event.stars === "number" && Number.isFinite(event.stars) && event.stars >= 0) {
      metaItems.push(`★ ${event.stars.toLocaleString()}`);
    }

    if (metaItems.length > 0) {
      const meta = document.createElement("div");
      meta.className = "repository-meta";
      meta.textContent = metaItems.join(" · ");
      item.append(meta);
    }

    eventList.append(item);
    validEventCount += 1;
  });

  if (validEventCount === 0) {
    eventList.textContent = "No valid starred repositories found.";
  }
}

loadStarredRepositories();
