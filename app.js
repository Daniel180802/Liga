
const STORAGE_CLUBS = "nexus_clubs_v1";
const STORAGE_MATCHES = "nexus_matches_v1";

const ADMIN_PASSWORD = "Nexus2027!SL";

const DEFAULT_CLUBS = [
  // PORTUGAL
  { id: "sporting", name: "Sporting", league: "Portugal", crest: "https://media.api-sports.io/football/teams/228.png" },
  { id: "benfica", name: "Benfica", league: "Portugal", crest: "https://media.api-sports.io/football/teams/211.png" },
  { id: "braga", name: "Braga", league: "Portugal", crest: "https://media.api-sports.io/football/teams/217.png" },
  { id: "santa-clara", name: "Santa Clara", league: "Portugal", crest: "https://media.api-sports.io/football/teams/242.png" },
  { id: "porto", name: "Porto", league: "Portugal", crest: "https://media.api-sports.io/football/teams/212.png" },

  // ESPANHA
  { id: "barcelona", name: "Barcelona", league: "Espanha", crest: "https://media.api-sports.io/football/teams/529.png" },
  { id: "real-madrid", name: "Real Madrid", league: "Espanha", crest: "https://media.api-sports.io/football/teams/541.png" },
  { id: "atletico-madrid", name: "Atlético de Madrid", league: "Espanha", crest: "https://media.api-sports.io/football/teams/530.png" },
  { id: "valencia", name: "Valência", league: "Espanha", crest: "https://media.api-sports.io/football/teams/532.png" },
  { id: "sevilla", name: "Sevilha", league: "Espanha", crest: "https://media.api-sports.io/football/teams/536.png" },

  // INGLATERRA
  { id: "manchester-united", name: "Manchester United", league: "Inglaterra", crest: "https://media.api-sports.io/football/teams/33.png" },
  { id: "manchester-city", name: "Manchester City", league: "Inglaterra", crest: "https://media.api-sports.io/football/teams/50.png" },
  { id: "chelsea", name: "Chelsea", league: "Inglaterra", crest: "https://media.api-sports.io/football/teams/49.png" },
  { id: "liverpool", name: "Liverpool", league: "Inglaterra", crest: "https://media.api-sports.io/football/teams/40.png" },
  { id: "arsenal", name: "Arsenal", league: "Inglaterra", crest: "https://media.api-sports.io/football/teams/42.png" },

  // ITÁLIA
  { id: "juventus", name: "Juventus", league: "Itália", crest: "https://media.api-sports.io/football/teams/496.png" },
  { id: "inter", name: "Inter de Milão", league: "Itália", crest: "https://media.api-sports.io/football/teams/505.png" },
  { id: "ac-milan", name: "AC Milan", league: "Itália", crest: "https://media.api-sports.io/football/teams/489.png" },
  { id: "napoli", name: "Napoli", league: "Itália", crest: "https://media.api-sports.io/football/teams/492.png" },
  { id: "roma", name: "Roma", league: "Itália", crest: "https://media.api-sports.io/football/teams/497.png" },

  // FRANÇA
  { id: "psg", name: "Paris Saint-Germain", league: "França", crest: "https://media.api-sports.io/football/teams/85.png" },
  { id: "lyon", name: "Lyon", league: "França", crest: "https://media.api-sports.io/football/teams/80.png" },
  { id: "marseille", name: "Marseille", league: "França", crest: "https://media.api-sports.io/football/teams/81.png" },
  { id: "monaco", name: "Monaco", league: "França", crest: "https://media.api-sports.io/football/teams/91.png" },
  { id: "lille", name: "Lille", league: "França", crest: "https://media.api-sports.io/football/teams/79.png" },

  // ALEMANHA
  { id: "bayern", name: "Bayern de Munique", league: "Alemanha", crest: "https://media.api-sports.io/football/teams/157.png" },
  { id: "dortmund", name: "Borussia Dortmund", league: "Alemanha", crest: "https://media.api-sports.io/football/teams/165.png" },
  { id: "leverkusen", name: "Bayer Leverkusen", league: "Alemanha", crest: "https://media.api-sports.io/football/teams/168.png" },
  { id: "rb-leipzig", name: "RB Leipzig", league: "Alemanha", crest: "https://media.api-sports.io/football/teams/173.png" },
  { id: "frankfurt", name: "Eintracht Frankfurt", league: "Alemanha", crest: "https://media.api-sports.io/football/teams/169.png" }
];

const LEAGUES = [
  "Portugal",
  "Espanha",
  "Inglaterra",
  "Itália",
  "França",
  "Alemanha"
];

let clubs = [];
let matches = [];
let selectedLeague = "Todas";
let currentAdminClub = null;

const $ = (selector) => document.querySelector(selector);

function loadData() {
  const savedClubs = localStorage.getItem(STORAGE_CLUBS);
  const savedMatches = localStorage.getItem(STORAGE_MATCHES);

  clubs = savedClubs
    ? JSON.parse(savedClubs)
    : DEFAULT_CLUBS.map(club => ({ ...club }));

  matches = savedMatches
    ? JSON.parse(savedMatches)
    : [];

  // Atualiza os clubes padrão se a instalação ainda tiver nomes provisórios.
  if (
    !savedClubs ||
    clubs.length !== 30 ||
    clubs.some(c => !DEFAULT_CLUBS.some(d => d.id === c.id))
  ) {
    clubs = DEFAULT_CLUBS.map(club => ({ ...club }));
    localStorage.setItem(STORAGE_CLUBS, JSON.stringify(clubs));
  }

  saveData();
}

function saveData() {
  localStorage.setItem(STORAGE_CLUBS, JSON.stringify(clubs));
  localStorage.setItem(STORAGE_MATCHES, JSON.stringify(matches));
}

function getClub(id) {
  return clubs.find(club => club.id === id);
}

function getStats(clubId) {
  const stats = {
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0
  };

  matches.forEach(match => {
    const homeGoals = Number(match.homeGoals);
    const awayGoals = Number(match.awayGoals);

    if (!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) return;

    if (match.homeId === clubId) {
      stats.played++;
      stats.goalsFor += homeGoals;
      stats.goalsAgainst += awayGoals;

      if (homeGoals > awayGoals) {
        stats.wins++;
        stats.points += 3;
      } else if (homeGoals === awayGoals) {
        stats.draws++;
        stats.points++;
      } else {
        stats.losses++;
      }
    }

    if (match.awayId === clubId) {
      stats.played++;
      stats.goalsFor += awayGoals;
      stats.goalsAgainst += homeGoals;

      if (awayGoals > homeGoals) {
        stats.wins++;
        stats.points += 3;
      } else if (awayGoals === homeGoals) {
        stats.draws++;
        stats.points++;
      } else {
        stats.losses++;
      }
    }
  });

  stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
  return stats;
}

function getRanking() {
  return clubs.map(club => ({
    ...club,
    ...getStats(club.id)
  })).sort((a, b) =>
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor ||
    a.name.localeCompare(b.name)
  );
}

function renderLeagueFilters() {
  const container = $("#leagueFilters");
  if (!container) return;

  const options = ["Todas", ...LEAGUES];

  container.innerHTML = options.map(league => `
    <button
      class="filter-btn ${selectedLeague === league ? "active" : ""}"
      data-league="${league}">
      ${league}
    </button>
  `).join("");

  container.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      selectedLeague = button.dataset.league;
      renderLeagueFilters();
      renderRanking();
    });
  });
}

function renderRanking() {
  const container = $("#rankingBody");
  if (!container) return;

  const ranking = getRanking().filter(club =>
    selectedLeague === "Todas" || club.league === selectedLeague
  );

  container.innerHTML = ranking.map((club, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>
        <div class="club-cell">
          <img src="${club.crest}" alt=""
               onerror="this.style.display='none'">
          <span>${club.name}</span>
        </div>
      </td>
      <td>${club.played}</td>
      <td>${club.wins}</td>
      <td>${club.draws}</td>
      <td>${club.losses}</td>
      <td>${club.goalsFor}</td>
      <td>${club.goalsAgainst}</td>
      <td>${club.goalDifference > 0 ? "+" : ""}${club.goalDifference}</td>
      <td><strong>${club.points}</strong></td>
    </tr>
  `).join("");
}

function renderDashboard() {
  const ranking = getRanking();

  const totalGames = matches.length;
  const totalGoals = matches.reduce((sum, match) =>
    sum + Number(match.homeGoals || 0) + Number(match.awayGoals || 0), 0
  );

  if ($("#totalClubs")) $("#totalClubs").textContent = clubs.length;
  if ($("#totalGames")) $("#totalGames").textContent = totalGames;
  if ($("#totalGoals")) $("#totalGoals").textContent = totalGoals;

  renderRanking();
  renderRecentMatches();
}

function renderRecentMatches() {
  const container = $("#recentMatches");
  if (!container) return;

  const recent = [...matches].reverse().slice(0, 5);

  container.innerHTML = recent.map(match => `
    <div class="recent-match">
      <span>${match.homeName}</span>
      <strong>${match.homeGoals} - ${match.awayGoals}</strong>
      <span>${match.awayName}</span>
    </div>
  `).join("") || "<p>Ainda não existem resultados.</p>";
}

function renderAdminClubs() {
  const container = $("#adminClubs");
  if (!container) return;

  container.innerHTML = clubs.map(club => `
    <div class="admin-club">
      <img src="${club.crest}" alt=""
           onerror="this.style.display='none'">
      <div>
        <strong>${club.name}</strong>
        <small>${club.league}</small>
      </div>
      <button data-edit-club="${club.id}">Editar</button>
    </div>
  `).join("");

  container.querySelectorAll("[data-edit-club]").forEach(button => {
    button.addEventListener("click", () => {
      openClubEditor(button.dataset.editClub);
    });
  });
}

function openClubEditor(id) {
  const club = getClub(id);
  if (!club) return;

  currentAdminClub = id;

  const name = prompt("Nome do clube:", club.name);
  if (name === null) return;

  const crest = prompt("URL do escudo:", club.crest);
  if (crest === null) return;

  club.name = name.trim() || club.name;
  club.crest = crest.trim() || club.crest;

  saveData();
  renderAdminClubs();
  renderDashboard();
}

function renderMatchOptions() {
  const home = $("#homeTeam");
  const away = $("#awayTeam");

  if (!home || !away) return;

  const options = clubs.map(club =>
    `<option value="${club.id}">${club.name}</option>`
  ).join("");

  home.innerHTML = options;
  away.innerHTML = options +
    `<option value="external">Outra equipa (fora da Superliga)</option>`;
}

function addMatch(event) {
  event.preventDefault();

  const homeId = $("#homeTeam")?.value;
  const awayId = $("#awayTeam")?.value;

  const homeGoals = Number($("#homeGoals")?.value);
  const awayGoals = Number($("#awayGoals")?.value);

  if (!homeId || !awayId) {
    alert("Seleciona as duas equipas.");
    return;
  }

  if (homeId === awayId) {
    alert("Uma equipa não pode jogar contra ela própria.");
    return;
  }

  if (
    !Number.isInteger(homeGoals) ||
    !Number.isInteger(awayGoals) ||
    homeGoals < 0 ||
    awayGoals < 0
  ) {
    alert("Introduz resultados válidos.");
    return;
  }

  const homeClub = getClub(homeId);
  const external = awayId === "external";

  const awayName = external
    ? ($("#externalTeamName")?.value.trim() || "")
    : getClub(awayId)?.name;

  if (!awayName) {
    alert("Indica o nome da equipa visitante.");
    return;
  }

  matches.push({
    id: Date.now(),
    homeId,
    awayId: external ? null : awayId,
    homeName: homeClub.name,
    awayName,
    homeGoals,
    awayGoals,
    date: new Date().toISOString()
  });

  saveData();
  renderDashboard();

  $("#matchForm")?.reset();

  alert("Resultado registado com sucesso!");
}

function deleteMatch(id) {
  if (!confirm("Queres apagar este resultado?")) return;

  matches = matches.filter(match => match.id !== id);
  saveData();
  renderDashboard();
  renderAdminMatches();
}

function renderAdminMatches() {
  const container = $("#adminMatches");
  if (!container) return;

  container.innerHTML = [...matches].reverse().map(match => `
    <div class="admin-match">
      <span>${match.homeName}</span>
      <strong>${match.homeGoals} - ${match.awayGoals}</strong>
      <span>${match.awayName}</span>
      <button data-delete-match="${match.id}">Apagar</button>
    </div>
  `).join("") || "<p>Sem resultados registados.</p>";

  container.querySelectorAll("[data-delete-match]").forEach(button => {
    button.addEventListener("click", () => {
      deleteMatch(Number(button.dataset.deleteMatch));
    });
  });
}

function loginAdmin(event) {
  event.preventDefault();

  const password = $("#adminPassword")?.value;

  if (password !== ADMIN_PASSWORD) {
    alert("Palavra-passe incorreta.");
    return;
  }

  $("#adminLogin")?.classList.add("hidden");
  $("#adminPanel")?.classList.remove("hidden");

  renderAdminClubs();
  renderAdminMatches();
}

function logoutAdmin() {
  $("#adminPanel")?.classList.add("hidden");
  $("#adminLogin")?.classList.remove("hidden");
}

function init() {
  loadData();

  renderLeagueFilters();
  renderDashboard();
  renderMatchOptions();
  renderAdminClubs();
  renderAdminMatches();

  $("#matchForm")?.addEventListener("submit", addMatch);
  $("#adminLoginForm")?.addEventListener("submit", loginAdmin);
  $("#logoutAdmin")?.addEventListener("click", logoutAdmin);

  const awaySelect = $("#awayTeam");
  const externalInput = $("#externalTeamName");

  awaySelect?.addEventListener("change", () => {
    if (externalInput) {
      externalInput.style.display =
        awaySelect.value === "external" ? "block" : "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
