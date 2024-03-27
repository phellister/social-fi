import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createContent(content) {
  return window.canister.contentManager.addContent(content);
}

export async function updateContent(content) {
  return window.canister.contentManager.updateContent(content);
}

// likeContent;
export async function likeContent(content) {
  return window.canister.contentManager.likeContent(content);
}

// getFollowingArtists
export async function getFollowingArtists() {
  try {
    return await window.canister.contentManager.getFollowingArtists();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// getFollowingContents
export async function getFollowingContents() {
  try {
    return await window.canister.contentManager.getFollowingContents();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getContents() {
  try {
    return await window.canister.contentManager.getContents();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// getAddressFromPrincipal
export async function getAddressFromPrincipal(principal) {
  return await window.canister.contentManager.getAddressFromPrincipal(
    principal
  );
}

export async function subscribe(contentId, amount) {
  const amountInt = parseInt(amount, 10);
  const contentManagerCanister = window.canister.contentManager;
  const orderResponse = await contentManagerCanister.createReservePay(
    contentId,
    amountInt
  );

  console.log(orderResponse);
  const sellerPrincipal = Principal.from(orderResponse.Ok.seller);
  const sellerAddress = await contentManagerCanister.getAddressFromPrincipal(
    sellerPrincipal
  );
  const block = await transferICP(
    sellerAddress,
    orderResponse.Ok.price,
    orderResponse.Ok.memo
  );
  await contentManagerCanister.completeSubscription(
    sellerPrincipal,
    contentId,
    orderResponse.Ok.price,
    block,
    orderResponse.Ok.memo
  );
}
