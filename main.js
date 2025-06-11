// === Demo NFT Data ===
const nftData = [
  { id: 1, category: "pepe", name: "Pepe Classic", image: "https://i.imgur.com/po5ckXr.png" },
  { id: 2, category: "pepe", name: "Pepe with Candy", image: "https://i.imgur.com/eoO0Ttu.png" },
  { id: 3, category: "dorofHat", name: "Pepe Dorof Hat", image: "https://i.imgur.com/fVdQDhK.png" },
  { id: 4, category: "candy", name: "Candy Swirl", image: "https://i.imgur.com/otU1i5N.png" },
  { id: 5, category: "themes", name: "Pepe Green Theme", image: "https://i.imgur.com/HkgP92T.png" },
  { id: 6, category: "candy", name: "Lollipop", image: "https://i.imgur.com/ut6zFoI.png" },
  { id: 7, category: "dorofHat", name: "Dorof Hat Red", image: "https://i.imgur.com/2Wtjprz.png" },
  { id: 8, category: "themes", name: "Pepe Blue Theme", image: "https://i.imgur.com/y65EnXY.png" }
];

// === Global variables ===
let connectedAddress = null;
let walletBalance = 100.0; // demo balance TON
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// === Elements ===
const connectWalletBtn = document.getElementById("connectWalletBtn");
const walletInfo = document.getElementById("walletInfo");
const walletAddressSpan = document.getElementById("walletAddress");
const walletBalanceSpan = document.getElementById("walletBalance");
const nftGallery = document.getElementById("nftGallery");
const favoritesGallery = document.getElementById("favoritesGallery");
const filterButtons = document.querySelectorAll(".filterBtn");
const transferBtn = document.getElementById("transferBtn");
const transferStatus = document.getElementById("transferStatus");

// === Functions ===

function renderNFTs(category = "all") {
  nftGallery.innerHTML = "";
  let filtered = category === "all" ? nftData : nftData.filter(nft => nft.category === category);
  filtered.forEach(nft => {
    const card = document.createElement("div");
    card.className = "nftCard";
    card.innerHTML = `
      <img class="nftImage" src="${nft.image}" alt="${nft.name}" />
      <div class="nftName">${nft.name}</div>
      <button class="favoriteBtn ${favorites.includes(nft.id) ? "active" : ""}" data-id="${nft.id}" title="Toggle Favorite">&#9733;</button>
    `;
    nftGallery.appendChild(card);
  });
  // Add event listeners for favorite buttons
  document.querySelectorAll(".favoriteBtn").forEach(btn => {
    btn.addEventListener("click", toggleFavorite);
  });
}

function renderFavorites() {
  favoritesGallery.innerHTML = "";
  if (favorites.length === 0) {
    favoritesGallery.innerHTML = "<p>No favorites yet.</p>";
    return;
  }
  favorites.forEach(id => {
    let nft = nftData.find(n => n.id === id);
    if (!nft) return;
    const card = document.createElement("div");
    card.className = "nftCard";
    card.innerHTML = `
      <img class="nftImage" src="${nft.image}" alt="${nft.name}" />
      <div class="nftName">${nft.name}</div>
      <button class="favoriteBtn active" data-id="${nft.id}" title="Remove Favorite">&#9733;</button>
    `;
    favoritesGallery.appendChild(card);
  });
  // Add event listeners for favorite buttons in favorites section
  document.querySelectorAll("#favoritesGallery .favoriteBtn").forEach(btn => {
    btn.addEventListener("click", toggleFavorite);
  });
}

function toggleFavorite(event) {
  const id = parseInt(event.target.dataset.id);
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderNFTs(getActiveCategory());
  renderFavorites();
}

function getActiveCategory() {
  const activeBtn = document.querySelector(".filterBtn.active");
  return activeBtn ? activeBtn.dataset.category : "all";
}

function connectWallet() {
  // Demo: simulate wallet connection
  connectedAddress = "EQC1234DEMOADDRESS5678";
  walletBalance = 100.0; // demo balance
  walletAddressSpan.textContent = connectedAddress;
  walletBalanceSpan.textContent = `Balance: ${walletBalance.toFixed(2)} TON`;
  walletInfo.style.display = "flex";
  connectWalletBtn.style.display = "none";
  transferStatus.textContent = "";
}

function transferTON() {
  if (!connectedAddress) {
    transferStatus.style.color = "red";
    transferStatus.textContent = "Please connect wallet first.";
    return;
  }
  const toAddr = document.getElementById("toAddress").value.trim();
  const amount = parseFloat(document.getElementById("transferAmount").value);
  if (!toAddr || toAddr.length < 10) {
    transferStatus.style.color = "red";
    transferStatus.textContent = "Enter a valid recipient address.";
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    transferStatus.style.color = "red";
    transferStatus.textContent = "Enter a valid amount greater than zero.";
    return;
  }
  if (amount > walletBalance) {
    transferStatus.style.color = "red";
    transferStatus.textContent = "Insufficient balance.";
    return;
  }
  // Demo: Simulate transfer with 1 second delay
  transferStatus.style.color = "#58cc02";
  transferStatus.textContent = "Processing transfer...";
  setTimeout(() => {
    walletBalance -= amount;
    walletBalanceSpan.textContent = `Balance: ${walletBalance.toFixed(2)} TON`;
    transferStatus.textContent = `Successfully sent ${amount.toFixed(2)} TON to ${toAddr}`;
    // Clear inputs
    document.getElementById("toAddress").value = "";
    document.getElementById("transferAmount").value = "";
  }, 1000);
}

// === Event Listeners ===
connectWalletBtn.addEventListener("click", connectWallet);

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderNFTs(btn.dataset.category);
  });
});

transferBtn.addEventListener("click", transferTON);

// === Initial Render ===
renderNFTs();
renderFavorites();
