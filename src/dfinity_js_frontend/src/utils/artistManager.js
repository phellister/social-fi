export async function createArtist(artist) {
  return window.canister.contentManager.addArtist(artist);
}

export async function updateArtist(artist) {
  return window.canister.contentManager.updateArtist(artist);
}

export async function followArtist(artistId) {
  return window.canister.contentManager.followArtist(artistId);
}

export async function getArtistByOwner() {
  try {
    return await window.canister.contentManager.getArtistByOwner();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getArtists() {
  try {
    return await window.canister.contentManager.getArtists();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}
