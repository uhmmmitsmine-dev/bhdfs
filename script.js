const players = [
  { name: "Nikola Jokic", team: "Denver Nuggets", ovr: 98 },
  { name: "Jamal Murray", team: "Denver Nuggets", ovr: 87 },
  { name: "Anthony Edwards", team: "Minnesota Timberwolves", ovr: 93 },
  { name: "Karl-Anthony Towns", team: "New York Knicks", ovr: 90 },
  { name: "Jalen Brunson", team: "New York Knicks", ovr: 92 },
  { name: "Donovan Mitchell", team: "Cleveland Cavaliers", ovr: 92 },
  { name: "Darius Garland", team: "Cleveland Cavaliers", ovr: 88 },
  { name: "Giannis Antetokounmpo", team: "Milwaukee Bucks", ovr: 97 },
  { name: "Damian Lillard", team: "Milwaukee Bucks", ovr: 92 },
  { name: "Jayson Tatum", team: "Boston Celtics", ovr: 96 },
  { name: "Jaylen Brown", team: "Boston Celtics", ovr: 92 },
  { name: "Joel Embiid", team: "Philadelphia 76ers", ovr: 96 },
  { name: "Tyrese Maxey", team: "Philadelphia 76ers", ovr: 90 },
  { name: "Luka Doncic", team: "Los Angeles Lakers", ovr: 97 },
  { name: "LeBron James", team: "Los Angeles Lakers", ovr: 95 },
  { name: "Anthony Davis", team: "Dallas Mavericks", ovr: 94 },
  { name: "Kyrie Irving", team: "Dallas Mavericks", ovr: 91 },
  { name: "Shai Gilgeous-Alexander", team: "Oklahoma City Thunder", ovr: 96 },
  { name: "Jalen Williams", team: "Oklahoma City Thunder", ovr: 89 },
  { name: "Kevin Durant", team: "Phoenix Suns", ovr: 94 },
  { name: "Devin Booker", team: "Phoenix Suns", ovr: 93 },
  { name: "Stephen Curry", team: "Golden State Warriors", ovr: 95 },
  { name: "Jimmy Butler", team: "Golden State Warriors", ovr: 90 },
  { name: "Ja Morant", team: "Memphis Grizzlies", ovr: 92 },
  { name: "Jaren Jackson Jr.", team: "Memphis Grizzlies", ovr: 88 },
  { name: "Zion Williamson", team: "New Orleans Pelicans", ovr: 90 },
  { name: "Dejounte Murray", team: "New Orleans Pelicans", ovr: 86 },
  { name: "Victor Wembanyama", team: "San Antonio Spurs", ovr: 95 },
  { name: "De'Aaron Fox", team: "San Antonio Spurs", ovr: 89 },
  { name: "Trae Young", team: "Atlanta Hawks", ovr: 89 },
  { name: "Paolo Banchero", team: "Orlando Magic", ovr: 88 },
  { name: "LaMelo Ball", team: "Charlotte Hornets", ovr: 86 }
];

const pickCatalog = [
  { round: 1, label: "2027 1st Round Pick", value: 14 },
  { round: 1, label: "2028 1st Round Pick", value: 13 },
  { round: 1, label: "2029 1st Round Pick", value: 12 },
  { round: 2, label: "2027 2nd Round Pick", value: 6 },
  { round: 2, label: "2028 2nd Round Pick", value: 5 },
  { round: 2, label: "2029 2nd Round Pick", value: 5 }
];

const generateBtn = document.getElementById("generateBtn");
const playersPerTeamInput = document.getElementById("playersPerTeam");
const maxDifferenceInput = document.getElementById("maxDifference");
const includePicksInput = document.getElementById("includePicks");
const maxPicksPerTeamInput = document.getElementById("maxPicksPerTeam");
const resultEl = document.getElementById("result");

const byTeam = players.reduce((map, player) => {
  map[player.team] ??= [];
  map[player.team].push(player);
  return map;
}, {});

const teams = Object.keys(byTeam);

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(maxInclusive) {
  return Math.floor(Math.random() * (maxInclusive + 1));
}

function pickUniqueItems(items, count) {
  const pool = [...items];
  const selected = [];

  for (let i = 0; i < count && pool.length; i += 1) {
    const idx = Math.floor(Math.random() * pool.length);
    selected.push(pool[idx]);
    pool.splice(idx, 1);
  }

  return selected;
}

function playerValueTotal(roster) {
  return roster.reduce((sum, player) => sum + player.ovr, 0);
}

function pickValueTotal(picks) {
  return picks.reduce((sum, pick) => sum + pick.value, 0);
}

function formatPlayers(list) {
  return list
    .map(
      (player) =>
        `<li><strong>${player.name}</strong> — Team: ${player.team}, 2K OVR: ${player.ovr}</li>`
    )
    .join("");
}

function formatPicks(picks, teamName) {
  if (!picks.length) {
    return "";
  }

  return picks
    .map(
      (pick) =>
        `<li><strong>${pick.label}</strong> — ${teamName} (${pick.round === 1 ? "1st" : "2nd"} round, value ${pick.value})</li>`
    )
    .join("");
}

function generateTrade() {
  const playersPerTeam = Number(playersPerTeamInput.value);
  const maxDifference = Number(maxDifferenceInput.value);
  const includePicks = includePicksInput.checked;
  const maxPicksPerTeam = includePicks ? Number(maxPicksPerTeamInput.value) : 0;

  let attempts = 0;
  while (attempts < 700) {
    const teamA = randomItem(teams);
    let teamB = randomItem(teams);
    while (teamA === teamB) {
      teamB = randomItem(teams);
    }

    const sendAPlayers = pickUniqueItems(byTeam[teamA], playersPerTeam);
    const sendBPlayers = pickUniqueItems(byTeam[teamB], playersPerTeam);

    if (sendAPlayers.length < playersPerTeam || sendBPlayers.length < playersPerTeam) {
      attempts += 1;
      continue;
    }

    const sendAPicks = pickUniqueItems(pickCatalog, randomInt(maxPicksPerTeam));
    const sendBPicks = pickUniqueItems(pickCatalog, randomInt(maxPicksPerTeam));

    const totalA = playerValueTotal(sendAPlayers) + pickValueTotal(sendAPicks);
    const totalB = playerValueTotal(sendBPlayers) + pickValueTotal(sendBPicks);
    const diff = Math.abs(totalA - totalB);

    if (diff <= maxDifference) {
      const receivesAList = formatPlayers(sendBPlayers) + formatPicks(sendBPicks, teamB);
      const receivesBList = formatPlayers(sendAPlayers) + formatPicks(sendAPicks, teamA);

      resultEl.innerHTML = `
        <div class="trade-grid">
          <article class="team-card">
            <h3>${teamA} receive</h3>
            <ul>${receivesAList}</ul>
          </article>
          <article class="team-card">
            <h3>${teamB} receive</h3>
            <ul>${receivesBList}</ul>
          </article>
        </div>
        <p class="summary">
          Total outgoing trade value — ${teamA}: ${totalA}, ${teamB}: ${totalB} (difference: ${diff})
        </p>
      `;
      return;
    }

    attempts += 1;
  }

  resultEl.innerHTML =
    "<p>Couldn't find a balanced trade with the current settings. Try increasing max value difference.</p>";
}

generateBtn.addEventListener("click", generateTrade);
generateTrade();
