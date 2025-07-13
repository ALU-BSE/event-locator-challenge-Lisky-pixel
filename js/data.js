const eventsData = [
  {
    id: 1,
    name: "Music Festival",
    date: "2025-04-15",
    time: "16:00",
    location: "Rwanda",
    city: "Kigali",
    category: "music",
    description:
      "Join us for a day of amazing live performances featuring top artists from around the East African. Food and drinks will be available for purchase. Bring your friends and enjoy the vibes!",
    image: "assets/images/Music.jpg",
    price: "$45",
    organizer: "Sofar",
    featured: true,
  },
  {
    id: 2,
    name: "Modern Art Exhibition",
    date: "2025-04-20",
    time: "10:00",
    location: "Nike Art Center",
    city: "Lagos",
    category: "art",
    description:
      "Experience groundbreaking works from contemporary artists pushing the boundaries of modern art. This exhibition showcases innovative techniques and thought-provoking concepts that challenge conventional perspectives.",
    image: "assets/images/Art.jpg",
    price: "$25",
    organizer: "Nike Art",
    featured: true,
  },
  {
    id: 3,
    name: "Kigali Food Festival ",
    date: "2025-04-25",
    time: "12:00",
    location: "La Palisse Hotel",
    city: "Kigali",
    category: "food",
    description:
      "Kigali Food Festival is a celebrated annual event that brings together all the best cuisines and restaurants in one place to celebrate a culinary art.",
    image: "assets/images/Food.jpg",
    price: "Free entry",
    organizer: "Kigali Food Festival",
    featured: true,
  },
  {
    id: 4,
    name: "Tech Conference 2025",
    date: "2025-04-03",
    time: "09:00",
    location: "Tech Center",
    city: "Kigali",
    category: "technology",
    description:
      "The premier technology conference featuring keynote speakers from leading tech companies, workshops, networking opportunities, and the latest innovations in AI, blockchain, and more.",
    image: "assets/images/Tech.jpg",
    price: "$19",
    organizer: "Global AI Summit",
    featured: false,
  },
  {
    id: 5,
    name: "Basketball Tournament",
    date: "2025-05-15",
    time: "14:00",
    location: "BK Arena",
    city: "Kigali",
    category: "sports",
    description:
      "Watch the most talented local basketball teams compete in this exciting tournament. Food, drinks, and merchandise will be available for purchase throughout the event.",
    image: "assets/images/Basketball.jpg",
    price: "$30",
    organizer: "BAL",
    featured: false,
  },
  {
    id: 6,
    name: "Jazz Night Live",
    date: "2025-04-18",
    time: "20:00",
    location: "Quilox",
    city: "Abuja",
    category: "music",
    description:
      "An intimate evening of jazz performances by renowned musicians. Enjoy craft cocktails and a sophisticated atmosphere as you listen to smooth melodies and improvisational genius.",
    image: "assets/images/Jazz.jpg",
    price: "$50",
    organizer: "BABASHEESH CHATHAM",
    featured: false,
  },
  {
    id: 7,
    name: "Wine Tasting",
    date: "2025-05-05",
    time: "19:00",
    location: "Vineyard Valley",
    city: "Abuja",
    category: "food",
    description:
      "Take a guided tour through beautiful vineyards and sample premium wines paired with gourmet cheeses and appetizers. Learn about wine-making processes and history from expert sommeliers.",
    image: "assets/images/Wine.jpg",
    price: "$35",
    organizer: "Treasure Suites",
    featured: false,
  },
  {
    id: 8,
    name: "Digital Art Workshop",
    date: "2025-04-30",
    time: "13:00",
    location: "Creative Studio",
    city: "Lagos",
    category: "art",
    description:
      "Learn digital art techniques using industry-standard software. This hands-on workshop is perfect for beginners and intermediate artists looking to enhance their digital skills.",
    image: "assets/images/Digital-Art.jpg",
    price: "$75",
    organizer: "Digital Artists Collective",
    featured: false,
  },
  {
    id: 9,
    name: "Kigali International Peace Marathon",
    date: "2025-06-08",
    time: "08:00",
    location: "Kigali, in front of BK Arena",
    city: "Kigali",
    category: "sports",
    description:
      "Join thousands of runners in this annual marathon event. The route takes you through historic landmarks and beautiful scenery. All fitness levels are welcome to participate.",
    image: "assets/images/Marathon.jpg",
    price: "$60",
    organizer: "Rwanda Athletic Federation (RAF)",
    featured: false,
  },
  {
    id: 10,
    name: "IndabaX Rwanda 2025",
    date: "2025-04-03",
    time: "09:30",
    location: "Kigali Convention Center",
    city: "Kigali",
    category: "technology",
    description:
      "Connect with industry leaders and explore the latest advancements in artificial intelligence and machine learning. Featuring hands-on demonstrations, panel discussions, and networking opportunities.",
    image: "assets/images/Indaba.jpg",
    price: "$150",
    organizer: "Indaba",
    featured: false,
  },
];

// Enhanced city data with metadata for autocomplete
const cityData = [
  { name: "Kigali", country: "Rwanda", events: 5, popular: true },
  { name: "Lagos", country: "Nigeria", events: 2, popular: true },
  { name: "Abuja", country: "Nigeria", events: 2, popular: false },
  { name: "Nairobi", country: "Kenya", events: 0, popular: true },
  { name: "Cairo", country: "Egypt", events: 0, popular: true },
  { name: "Cape Town", country: "South Africa", events: 0, popular: true },
  { name: "Johannesburg", country: "South Africa", events: 0, popular: true },
  { name: "Accra", country: "Ghana", events: 0, popular: false },
  { name: "Dakar", country: "Senegal", events: 0, popular: false },
  { name: "Addis Ababa", country: "Ethiopia", events: 0, popular: true },
];

//functions for data manipulation
function formatDate(dateString) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${ampm}`;
}

// Function to get category color for badges
function getCategoryColor(category) {
  const categoryColors = {
    music: "primary",
    art: "success",
    food: "warning",
    sports: "danger",
    technology: "info",
  };
  return categoryColors[category] || "secondary";
}

// Enhanced search utilities
function normalizeCity(city) {
  return city.toLowerCase().trim().replace(/\s+/g, " ");
}

function matchCity(searchTerm, cityName) {
  const normalizedSearch = normalizeCity(searchTerm);
  const normalizedCity = normalizeCity(cityName);
  return (
    normalizedCity.includes(normalizedSearch) ||
    normalizedCity.startsWith(normalizedSearch)
  );
}

// Get unique cities from events data
function getAvailableCities() {
  const cities = [...new Set(eventsData.map((event) => event.city))];
  return cities.map(
    (city) =>
      cityData.find((c) => c.name === city) || {
        name: city,
        country: "",
        events: 0,
        popular: false,
      }
  );
}

// Get city suggestions for autocomplete
function getCitySuggestions(searchTerm, limit = 5) {
  if (!searchTerm || searchTerm.length < 1) {
    // Return popular cities when no search term
    return cityData.filter((city) => city.popular).slice(0, limit);
  }

  const normalizedSearch = normalizeCity(searchTerm);
  const suggestions = cityData.filter((city) =>
    matchCity(searchTerm, city.name)
  );

  // Sort by relevance (exact matches first, then popular cities)
  suggestions.sort((a, b) => {
    const aExact = normalizeCity(a.name).startsWith(normalizedSearch);
    const bExact = normalizeCity(b.name).startsWith(normalizedSearch);

    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    // If both are exact or both are not, sort by popularity then alphabetically
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;

    return a.name.localeCompare(b.name);
  });

  return suggestions.slice(0, limit);
}
