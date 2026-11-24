
// NEXUS | Superliga Europeia 2026/2027
// Compatível com o index.html enviado.
// Preserva os clubes personalizados e os resultados guardados.

const STORAGE_CLUBS = "nexus_clubs_v1";
const STORAGE_MATCHES = "nexus_matches_v1";
const ADMIN_PASSWORD = "Nexus2027!SL";

const DEFAULT_CLUBS = [
  { id: "sporting", name: "Sporting", league: "Portugal", crest: "https://media.api-sports.io/football/teams/228.png" },
  { id: "benfica", name: "Benfica", league: "Portugal", crest: "https://media.api-sports.io/football/teams/211.png" },
  { id: "braga", name: "Braga", league: "Portugal", crest: "https://media.api-sports.io/football/teams/217.png" },
  { id: "santa-clara", name: "Santa Clara", league: "Portugal", crest: "https://media.api-sports.io/football/teams/242.png" },
  { id: "porto", name: "Porto", league: "Portugal", crest: "https://media.api-sports.io/football/teams/212.png" },
  { id: "barcelona", name: "Barcelona", league: "Espanha", crest: "https://media.api-sports.io/football/teams/529.png" },
  { id: "real-madrid", name: "Real Madrid", league: "Espanha", crest: "https://media.api-sports.io/football/teams/541.png" },
  { id: "atletico-madrid", name: "Atlético de Madrid", league: "Espanha", crest: "https://media.api-sports.io/football/teams/530.png" },
  { id: "valencia", name: "Valência", league: "Espanha", crest: "https://media.api-sports.io/football/teams/532.png" },
  { id: "sevilla", name: "Sevilha", league: "Espanha", crest: "https://media.api-sports.io/football/teams/536.png" },
  { id: "manchester-united", name: "Manchester United", league: "Inglaterra", crest: "https://media.api-sports.io/football/teams/33.png" },
  { id: "manchester-city", name: "Manchester City", league: "Inglaterra", crest: "https://media.api-sports.io/football/teams/50.png" },
  { id: "chelsea", name: "Chelsea", league: "Inglaterra", crest: "https://media.api-sports.io/football/teams/49.png" },
  { id: "liverpool", name: "Liverpool", league: "Inglaterra", crest: "https://media.api-sports.io/football/teams/40.png" },
  { id: "arsenal", name: "Arsenal", league: "Inglaterra", crest: "https://media.api-sports.io/football/teams/42.png" },
  { id: "juventus", name: "Juventus", league: "Itália", crest: "https://media.api-sports.io/football/teams/496.png" },
  { id: "inter", name: "Inter de Milão", league: "Itália", crest: "https://media.api-sports.io/football/teams/505.png" },
  { id: "ac-milan", name: "AC Milan", league: "Itália", crest: "https://media.api-sports.io/football/teams/489.png" },
  { id: "napoli", name: "Napoli", league: "Itália", crest: "https://media.api-sports.io/football/teams/492.png" },
  { id: "roma", name: "Roma", league: "Itália", crest: "https://media.api-sports.io/football/teams/497.png" },
  { id: "psg", name: "Paris Saint-Germain", league: "França", crest: "https://media.api-sports.io/football/teams/85.png" },
  { id: "lyon", name: "Lyon", league: "França", crest: "https://media.api-sports.io/football/teams/80.png" },
  { id: "marseille", name: "Marseille", league: "França", crest: "https://media.api-sports.io/football/teams/81.png" },
  { id: "monaco", name: "Monaco", league: "França", crest: "https://media.api-sports.io/football/teams/91.png" },
  { id: "lille", name: "Lille", league: "França", crest: "https://media.api-sports.io/football/teams/79.png" },
  { id: "bayern", name: "Bayern de Munique", league: "Alemanha", crest: "https://media.api-sports.io/football/teams/157.png" },
  { id: "dortmund", name: "Borussia Dortmund", league: "Alemanha", crest: "https://media.api-sports.io/football/teams/165.png" },
  { id: "leverkusen", name: "Bayer Leverkusen", league: "Alemanha", crest: "https://media.api-sports.io/football/teams/168.png" },
  { id: "rb-leipzig", name: "RB Leipzig", league: "Alemanha", crest: "https://media.api-sports.io/football/teams/173.png" },
  { id: "frankfurt", name: "Eintracht Frankfurt", league: "Alemanha", crest: "https://media.api-sports.io/football/teams/169.png" }
];

const LEAGUES = ["Portugal", "Espanha", "Inglaterra", "Itália", "França", "Alemanha"];

let clubs = [];
let matches = [];
let selectedLeague = "Todas";

const $ = selector => document.querySelector(selector);

function loadData() {
  try {
    const storedClubs = JSON.parse(localStorage.getItem(STORAGE_CLUBS) || "null");
    const storedMatches = JSON.parse(localStorage.getItem(STORAGE_MATCHES) || "null");

    if (
      Array.isArray(storedClubs) &&
      storedClubs.length === DEFAULT_CLUBS.length &&
      DEFAULT_CLUBS.every(base => storedClubs.some(saved => saved.id === base.id))
    ) {
      clubs = DEFAULT_CLUBS.map(base => {
        const saved = storedClubs.find(item => item.id === base.id) || {};
        return { ...base, ...saved, league: base.league };
      });
    } else {
      clubs = DEFAULT_CLUBS.map(club => ({ ...club }));
    }

    matches = Array.isArray(storedMatches) ? storedMatches : [];
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
    clubs = DEFAULT_CLUBS.map(club => ({ ...club }));
    matches = [];
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
  return clubs
    .map(club => ({ ...club, ...getStats(club.id) }))
    .sort((a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.name.localeCompare(b.name)
    );
}

function render() {
  renderRanking();
  renderStats();
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
      <td>${club.league}</td>
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

function renderStats() {
  const totalGoals = matches.reduce(
    (sum, match) =>
      sum + Number(match.homeGoals || 0) + Number(match.awayGoals || 0),
    0
  );

  if ($("#clubCount")) $("#clubCount").textContent = clubs.length;
  if ($("#matchCount")) $("#matchCount").textContent = matches.length;
  if ($("#goalCount")) $("#goalCount").textContent = totalGoals;
}

function renderResults() {
  const container = $("#results");
  if (!container) return;

  const recent = [...matches].reverse().slice(0, 10);

  container.innerHTML = recent.map(match => `
    <div class="recent-match">
      <span>${match.homeName}</span>
      <strong>${match.homeGoals} - ${match.awayGoals}</strong>
      <span>${match.awayName}</span>
    </div>
  `).join("") || "<p>Ainda não existem resultados.</p>";
}

function renderClubSelect() {
  const select = $("#clubSelect");
  if (!select) return;

  const previous = select.value;

  select.innerHTML = clubs.map(club =>
    `<option value="${club.id}">${club.name}</option>`
  ).join("");

  if (previous && getClub(previous)) select.value = previous;

  loadClubForm();
}

function loadClubForm() {
  const club = getClub($("#clubSelect")?.value);
  if (!club) return;

  $("#clubName").value = club.name;
  $("#clubLogo").value = club.crest || "";
}

function saveClub() {
  const club = getClub($("#clubSelect")?.value);
  if (!club) return;

  const name = $("#clubName")?.value.trim();
  const crest = $("#clubLogo")?.value.trim();

  if (!name) {
    alert("Introduz o nome do clube.");
    return;
  }

  club.name = name;
  club.crest = crest || club.crest;

  saveData();
  renderClubSelect();
  renderMatchOptions();
  render();
  renderResults();
  renderAdminMatches();

  alert("Clube guardado com sucesso!");
}

function renderMatchOptions() {
  const home = $("#homeTeam");
  const away = $("#awayTeam");

  if (!home || !away) return;

  home.innerHTML = clubs.map(club =>
    `<option value="${club.id}">${club.name}</option>`
  ).join("");

  away.innerHTML = clubs.map(club =>
    `<option value="${club.id}">${club.name}</option>`
  ).join("") +
    `<option value="external">Outra equipa (fora da Superliga)</option>`;

  toggleExternalTeam();
}

function toggleExternalTeam() {
  const area = $("#externalTeamArea");
  const isExternal = $("#awayTeam")?.value === "external";

  if (area) area.hidden = !isExternal;
}

function addResult() {
  const homeId = $("#homeTeam")?.value;
  const awayId = $("#awayTeam")?.value;

  const homeGoals = Number($("#homeGoals")?.value);
  const awayGoals = Number($("#awayGoals")?.value);

  if (!homeId || !awayId) {
    alert("Seleciona as duas equipas.");
    return;
  }

  if (awayId !== "external" && homeId === awayId) {
    alert("Uma equipa não pode jogar contra ela própria.");
    return;
  }

  if (
    !Number.isInteger(homeGoals) ||
    !Number.isInteger(awayGoals) ||
    homeGoals < 0 ||
    awayGoals < 0
  ) {
    alert("Introduz um resultado válido.");
    return;
  }

  const homeClub = getClub(homeId);
  const isExternal = awayId === "external";

  const awayName = isExternal
    ? $("#externalTeam")?.value.trim()
    : getClub(awayId)?.name;

  if (!homeClub || !awayName) {
    alert("Indica o nome da equipa visitante.");
    return;
  }

  matches.push({
    id: Date.now(),
    homeId,
    awayId: isExternal ? null : awayId,
    homeName: homeClub.name,
    awayName,
    homeGoals,
    awayGoals,
    date: new Date().toISOString()
  });

  saveData();
  render();
  renderResults();
  renderAdminMatches();

  $("#homeGoals").value = 0;
  $("#awayGoals").value = 0;

  if ($("#externalTeam")) $("#externalTeam").value = "";

  alert("Resultado registado com sucesso!");
}

function renderAdminMatches() {
  const container = $("#adminMatches");
  if (!container) return;

  container.innerHTML = [...matches].reverse().map(match => `
    <div class="admin-match">
      <span>${match.homeName}</span>
      <strong>${match.homeGoals} - ${match.awayGoals}</strong>
      <span>${match.awayName}</span>
      <button type="button" data-delete-match="${match.id}">Apagar</button>
    </div>
  `).join("") || "<p>Sem resultados registados.</p>";

  container.querySelectorAll("[data-delete-match]").forEach(button => {
    button.addEventListener("click", () =>
      deleteMatch(Number(button.dataset.deleteMatch))
    );
  });
}

function deleteMatch(id) {
  if (!confirm("Queres apagar este resultado?")) return;

  matches = matches.filter(match => match.id !== id);

  saveData();
  render();
  renderResults();
  renderAdminMatches();
}

function openAdmin() {
  const modal = $("#adminModal");
  if (!modal) return;

  modal.style.display = "flex";

  if ($("#loginArea")) $("#loginArea").hidden = false;
  if ($("#dashboard")) $("#dashboard").hidden = true;
  if ($("#adminPassword")) $("#adminPassword").value = "";
  if ($("#loginError")) $("#loginError").textContent = "";
}

function closeAdmin() {
  const modal = $("#adminModal");
  if (modal) modal.style.display = "none";
}

function login() {
  const password = $("#adminPassword")?.value || "";

  if (password !== ADMIN_PASSWORD) {
    if ($("#loginError")) {
      $("#loginError").textContent = "Palavra-passe incorreta.";
    }
    return;
  }

  if ($("#loginArea")) $("#loginArea").hidden = true;
  if ($("#dashboard")) $("#dashboard").hidden = false;

  renderClubSelect();
  renderMatchOptions();
  renderAdminMatches();
}

function logout() {
  if ($("#dashboard")) $("#dashboard").hidden = true;
  if ($("#loginArea")) $("#loginArea").hidden = false;
  if ($("#adminPassword")) $("#adminPassword").value = "";
  if ($("#loginError")) $("#loginError").textContent = "";
}

function init() {
  loadData();

  render();
  renderResults();
  renderMatchOptions();
  renderAdminMatches();

  $("#leagueFilter")?.addEventListener("change", event => {
    selectedLeague = event.target.value;
    renderRanking();
  });

  $("#awayTeam")?.addEventListener("change", toggleExternalTeam);

  $("#adminModal")?.addEventListener("click", event => {
    if (event.target.id === "adminModal") closeAdmin();
  });
}

document.addEventListener("DOMContentLoaded", init);

