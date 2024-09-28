const apiKey = "rq9GEdTPnGCkQGXgy4nmX3GR0VQaGjmx";

let requestCount = 0; // Track the number of requests made
let dailyRequestCount = 0; // Track the number of requests made today

async function fetchNYTData(url) {
  try {
    requestCount++;
    dailyRequestCount++;

    if (requestCount > 5) {
      console.warn("Rate limit (5 requests per minute) exceeded. Waiting 12 seconds...");
      await new Promise(resolve => setTimeout(resolve, 12000)); // Wait for 12 seconds
      requestCount = 0; // Reset the count after waiting
    }

    if (dailyRequestCount > 500) {
      console.error("Daily rate limit (500 requests per day) exceeded. Please try again later.");
      return null; // Or handle the error differently
    }

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 429) { // Example: Assuming 429 is the rate limit error code
        console.error("Rate limit exceeded. Retrying in 12 seconds...");
        await new Promise(resolve => setTimeout(resolve, 12000)); // Wait for 12 seconds
        return fetchNYTData(url); // Retry the request
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function createStoryElement(story) {
  const storyDiv = document.createElement('div');
  storyDiv.classList.add('story');
  storyDiv.innerHTML = `
        <p>${story.abstract}</p>
        <a href="${story.web_url}" target="_blank">Read More</a>
    `;
  return storyDiv;
}

function createSectionElement(section) {
  const sectionDiv = document.createElement('div');
  sectionDiv.classList.add('section');
  sectionDiv.innerHTML = `
        <h3>${section.name}</h3>
        <p>${section.description}</p>
    `;
  return sectionDiv;
}

async function loadTopStoriesScience() {
  const topStoriesContainer = document.querySelector('.science-stories-container');
  const apiUrl = `https://api.nytimes.com/svc/topstories/v2/science.json?api-key=${apiKey}`;
  const data = await fetchNYTData(apiUrl);
  data.results.forEach(story => {
    topStoriesContainer.appendChild(createStoryElement(story));
  });
}

async function loadTopStoriesWorld() {
  const topStoriesContainer = document.querySelector('.world-stories-container');
  const apiUrl = `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${apiKey}`;
  const data = await fetchNYTData(apiUrl);
  data.results.forEach(story => {
    topStoriesContainer.appendChild(createStoryElement(story));
  });
}

loadTopStoriesScience();
loadTopStoriesWorld();
