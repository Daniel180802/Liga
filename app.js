
const PASSWORD = "Nexus2027!SL";

const leagues = [
  "Portugal",
  "Espanha",
  "França",
  "Itália",
  "Alemanha",
  "Inglaterra"
];

function createInitialClubs() {
  return leagues.flatMap((league, index) =>
    Array.from({ length: 5 }, (_, i) => ({
      id: `${index}-${i}`,
      name: `A definir ${i + 1}`,
      league,
      logo: ""
    }))
  );
}

function load(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

let clubs = load("nexus_clubs", createInitialClubs());
let matches = load("nexus_matches", []);

function saveData() {
  localStorage.setItem("nexus_clubs", JSON.stringify(clubs));
  localStorage.setItem("nexus_matches", JSON.stringify(matches));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function calculateTable() {
  const table = clubs.map(club => ({
    ...club,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    gf: 0,
    ga: 0,
    points: 0
  }));

  matches.forEach(match => {
    const home = table.find(c => c.id === match.home);
    const away = table.find(c => c.id === match.away);

    // Só atualizamos estatísticas de clubes da Superliga.
    if (!home && !away) return;

    if (home) {
      home.played++;
      home.gf += match.hg;
      home.ga += match.ag;
    }

    if (away) {
      away.played++;
      away.gf += match.ag;
      away.ga += match.hg;
    }

    if (match.hg > match.ag) {
      if (home) {
        home.wins++;
        home.points += 3;
      }
      if (away) away.losses++;
    } else if (match.hg < match.ag) {
      if (away) {
        away.wins++;
        away.points += 3;
      }
      if (home) home.losses++;
    } else {
      if (home) {
        home.draws++;
        home.points++;
      }
      if (away) {
        away.draws++;
        away.points++;
      }
    }
  });

  return table.map(c => ({
    ...c,
    gd: c.gf - c.ga
  })).sort((a, b) =>
    b.points - a.points ||
    b.gd - a.gd ||
    b.gf - a.gf ||
    a.name.localeCompare(b.name)
  );
}

function render() {
  const filter = document.getElementById("leagueFilter").value;
  const table = calculateTable();

  const filtered = table.filter(c =>
    filter === "Todas" || c.league === filter
  );

  document.getElementById("rankingBody").innerHTML =
    filtered.map((c, i) => `
      <tr>
        <td class="position">${i + 1}</td>
        <td>
          ${c.logo
            ? `<img class="club-logo" src="${escapeHTML(c.logo)}" alt="">`
            : ""}
          ${escapeHTML(c.name)}
        </td>
        <td>${escapeHTML(c.league)}</td>
        <td>${c.played}</td>
        <td>${c.wins}</td>
        <td>${c.draws}</td>
        <td>${c.losses}</td>
        <td>${c.gf}</td>
        <td>${c.ga}</td>
        <td>${c.gd}</td>
        <td class="points">${c.points}</td>
      </tr>
    `).join("");

  document.getElementById("clubCount").textContent = clubs.length;
  document.getElementById("matchCount").textContent = matches.length;

  document.getElementById("goalCount").textContent =
    matches.reduce((sum, m) => sum + m.hg + m.ag, 0);

  renderResults();
}

function renderResults() {
  const recent = [...matches].reverse().slice(0, 8);

  document.getElementById("results").innerHTML =
    recent.length ? recent.map(m => {
      const home = clubs.find(c => c.id === m.home);
      const away = clubs.find(c => c.id === m.away);

      const homeName = home ? home.name : m.homeName || m.home;
      const awayName = away ? away.name : m.awayName || m.away;

      return `
        <div class="result-card">
          <span>${escapeHTML(homeName)}</span>
          <strong>${m.hg} - ${m.ag}</strong>
          <span>${escapeHTML(awayName)}</span>
        </div>
      `;
    }).join("") : "<p class='note'>Ainda não existem resultados registados.</p>";
}

// ADMINISTRAÇÃO

function openAdmin() {
  document.getElementById("adminModal").style.display = "flex";
  document.getElementById("loginArea").hidden = false;
  document.getElementById("dashboard").hidden = true;
}

function closeAdmin() {
  document.getElementById("adminModal").style.display = "none";
}

function login() {
  const password = document.getElementById("adminPassword").value;

  if (password !== PASSWORD) {
    document.getElementById("loginError").textContent =
      "Palavra-passe incorreta.";
    return;
  }

  document.getElementById("loginArea").hidden = true;
  document.getElementById("dashboard").hidden = false;
  populateAdmin();
}

function logout() {
  document.getElementById("adminPassword").value = "";
  closeAdmin();
}

function populateAdmin() {
  const options = clubs.map(c =>
    `<option value="${escapeHTML(c.id)}">${escapeHTML(c.name)} (${escapeHTML(c.league)})</option>`
  ).join("");

  document.getElementById("clubSelect").innerHTML = options;
  document.getElementById("homeTeam").innerHTML =
    `<option value="">Selecionar equipa</option>${options}`;

  document.getElementById("awayTeam").innerHTML =
    `<option value="">Selecionar equipa</option>
     ${options}
     <option value="__external__">Outra equipa (fora da Superliga)</option>`;

  loadClubForm();
  toggleExternalTeam();
  renderAdminMatches();
}

function loadClubForm() {
  const id = document.getElementById("clubSelect").value;
  const club = clubs.find(c => c.id === id);

  if (!club) return;

  document.getElementById("clubName").value = club.name;
  document.getElementById("clubLogo").value = club.logo;
}

function toggleExternalTeam() {
  const isExternal =
    document.getElementById("awayTeam").value === "__external__";

  document.getElementById("externalTeamArea").hidden = !isExternal;
}

function saveClub() {
  const id = document.getElementById("clubSelect").value;
  const club = clubs.find(c => c.id === id);

  const name = document.getElementById("clubName").value.trim();
  const logo = document.getElementById("clubLogo").value.trim();

  if (!club || !name) {
    alert("Introduz um nome válido.");
    return;
  }

  if (logo && !/^https?:\/\//i.test(logo)) {
    alert("O endereço do escudo deve começar por http:// ou https://");
    return;
  }

  club.name = name;
  club.logo = logo;

  saveData();
  populateAdmin();
  render();

  alert("Clube atualizado!");
}

function addResult() {
  const home = document.getElementById("homeTeam").value;
  const awayChoice = document.getElementById("awayTeam").value;

  const externalName =
    document.getElementById("externalTeam").value.trim();

  const away = awayChoice === "__external__"
    ? externalName
    : awayChoice;

  const hg = Number(document.getElementById("homeGoals").value);
  const ag = Number(document.getElementById("awayGoals").value);

  if (!home || !away) {
    alert("Seleciona as duas equipas.");
    return;
  }

  if (
    awayChoice !== "__external__" && home === away
  ) {
    alert("Escolhe duas equipas diferentes.");
    return;
  }

  if (clubs.some(c => c.id === away && c.id === home)) {
    alert("Uma equipa não pode jogar contra si própria.");
    return;
  }

  if (
    !Number.isInteger(hg) || !Number.isInteger(ag) ||
    hg < 0 || ag < 0
  ) {
    alert("Introduz resultados válidos.");
    return;
  }

  const homeClub = clubs.find(c => c.id === home);
  const awayClub = clubs.find(c => c.id === away);

  matches.push({
    id: crypto.randomUUID(),
    home,
    away,
    homeName: homeClub.name,
    awayName: awayClub ? awayClub.name : away,
    hg,
    ag
  });

  saveData();
  render();
  renderAdminMatches();

  document.getElementById("homeGoals").value = 0;
  document.getElementById("awayGoals").value = 0;
  document.getElementById("externalTeam").value = "";

  alert("Resultado registado com sucesso!");
}

function renderAdminMatches() {
  const container = document.getElementById("adminMatches");

  if (!container) return;

  container.innerHTML = matches.length
    ? matches.map(m => `
      <div class="admin-match">
        <span>
          ${escapeHTML(m.homeName || m.home)}
          ${m.hg} - ${m.ag}
          ${escapeHTML(m.awayName || m.away)}
        </span>
        <button class="delete-button"
          onclick="deleteMatch('${escapeHTML(m.id)}')">
          Apagar
        </button>
      </div>
    `).join("")
    : "<p class='note'>Ainda não existem resultados.</p>";
}

function deleteMatch(id) {
  if (!confirm("Queres apagar este resultado?")) return;

  matches = matches.filter(m => m.id !== id);

  saveData();
  render();
  renderAdminMatches();
}

render();
