import {
  getcontentManagerCanister,
  getLedgerCanister,
} from "./canisterFactory";
import { getAuthClient } from "./auth";

export async function initializeContract() {
  const authClient = await getAuthClient();
  window.auth = {};
  window.canister = {};
  window.auth.client = authClient;
  window.auth.isAuthenticated = await authClient.isAuthenticated();
  window.auth.identity = authClient.getIdentity();
  window.auth.principal = authClient.getIdentity()?.getPrincipal();
  window.auth.principalText = authClient.getIdentity()?.getPrincipal().toText();
  window.canister.contentManager = await getcontentManagerCanister();
  window.canister.ledger = await getLedgerCanister();
}
