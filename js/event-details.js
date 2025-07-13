document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get("id"));
  
    if (!eventId) {
      window.location.href = "events.html";
      return;
    }
  
    // Find the event in data
    const event = eventsData.find((e) => e.id === eventId);
  
    // Event not found, display error
    if (!event) {
      document.getElementById("eventDetails").innerHTML = `
              <div class="col-12 text-center">
                  <div class="alert alert-danger">
                      <h4>Event Not Found</h4>
                      <p>The event you are looking for does not exist.</p>
                      <a href="events.html" class="btn btn-primary">Browse Events</a>
                  </div>
              </div>
          `;
      return;
    }
  
    // Update page title
    document.title = `${event.name} - Event Locator`;
    document.getElementById("eventBreadcrumb").textContent = event.name;
  
    // Populate event details
    displayEventDetails(event);
  
    // Load related events (same category)
    loadRelatedEvents(event);
  });
  
  // Function to display event details
  function displayEventDetails(event) {
    const eventDetailsContainer = document.getElementById("eventDetails");
  
    eventDetailsContainer.innerHTML = `
          <div class="col-lg-8">
              <img src="${event.image}" alt="${
      event.name
    }" class="img-fluid event-banner mb-4">
              <h1 class="mb-3">${event.name}</h1>
              <div class="d-flex align-items-center mb-4">
                  <span class="badge bg-${getCategoryColor(
                    event.category
                  )} category-badge me-2">${event.category}</span>
                  <span class="event-price ms-2 fw-bold">${event.price}</span>
              </div>
              <div class="description mb-4">
                  <h4>About This Event</h4>
                  <p>${event.description}</p>
              </div>
          </div>
          <div class="col-lg-4">
              <div class="event-info-box sticky-top" style="top: 20px;">
                  <div class="mb-3">
                      <div class="info-label">Date & Time</div>
                      <div>${formatDate(event.date)} at ${formatTime(
      event.time
    )}</div>
                  </div>
                  <div class="mb-3">
                      <div class="info-label">Location</div>
                      <div>${event.location}, ${event.city}</div>
                  </div>
                  <div class="mb-3">
                      <div class="info-label">Organizer</div>
                      <div>${event.organizer}</div>
                  </div>
                  <div class="mb-3">
                      <div class="info-label">Price</div>
                      <div>${event.price}</div>
                  </div>
                  <a href="#" class="btn btn-primary w-100 mb-2">Register Now</a>
                  <button class="btn btn-outline-secondary w-100">
                      <i class="bi bi-share"></i> Share Event
                  </button>
              </div>
          </div>
      `;
  }
  
  // Function to load related events
  function loadRelatedEvents(currentEvent) {
    const relatedEventsContainer = document.getElementById("relatedEvents");
  
    // Get events in the same category, excluding current event
    const related = eventsData
      .filter(
        (event) =>
          event.category === currentEvent.category && event.id !== currentEvent.id
      )
      .slice(0, 3); // Limit to 3 events
  
    if (related.length === 0) {
      document.querySelector(".related-events").style.display = "none";
      return;
    }
  
    // Create event cards for related events
    related.forEach((event) => {
      const col = document.createElement("div");
      col.className = "col";
  
      col.innerHTML = `
              <div class="card event-card h-100">
                  <img src="${event.image}" class="card-img-top" alt="${
        event.name
      }">
                  <div class="card-body">
                      <h5 class="card-title">${event.name}</h5>
                      <p class="event-date mb-1">${formatDate(event.date)}</p>
                      <p class="event-location">${event.location}, ${
        event.city
      }</p>
                      <a href="event-details.html?id=${
                        event.id
                      }" class="btn btn-outline-primary btn-sm mt-2">View Details</a>
                  </div>
              </div>
          `;
  
      relatedEventsContainer.appendChild(col);
    });
  }
  