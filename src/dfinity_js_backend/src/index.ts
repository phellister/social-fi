import {
  query,
  update,
  text,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  Ok,
  Err,
  ic,
  Opt,
  None,
  Some,
  Principal,
  Duration,
  nat64,
  bool,
  Result,
  Canister,
} from "azle";
import {
  Ledger,
  binaryAddressFromPrincipal,
  hexAddressFromPrincipal,
} from "azle/canisters/ledger";
//@ts-ignore
import { hashCode } from "hashcode";
// Importing UUID v4 for generating unique identifiers
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

/**
 * This type represents an content that can be listed on an content manager.
 * It contains basic properties needed to define an content.
 */
const Content = Record({
  id: text,
  title: text,
  description: text,
  cover: text,
  createdAt: text,
  updatedAt: Opt(text),
  category: text,
  mediaType: text,
  tags: Vec(text),
  owner: Principal,
  subscriptionFee: nat64,
  subscriptions: nat64,
  likes: nat64,
  comments: Vec(text),
});

// Payload structure for creating an content
const ContentPayload = Record({
  title: text,
  description: text,
  cover: text,
  category: text,
  mediaType: text,
  tags: Vec(text),
  subscriptionFee: nat64,
});

// Payload structure for updating an content
const UpdateContentPayload = Record({
  id: text,
  description: text,
  subscriptionFee: nat64,
  cover: text,
});

// Structure representing a artist
const Artist = Record({
  id: text,
  principal: Principal,
  userName: text,
  email: text,
  phone: text,
  bio: text,
  profilePic: text,
  followers: nat64,
  contents: Vec(text),
});

const Client = Record({
  id: text,
  principal: Principal,
  contents: Vec(text),
  following: Vec(text),
});

// Payload structure for creating a artist
const ArtistPayload = Record({
  userName: text,
  email: text,
  phone: text,
  bio: text,
  profilePic: text,
});

// Payload structure for updating a artist
const UpdateArtistPayload = Record({
  id: text,
  userName: text,
  email: text,
  phone: text,
  bio: text,
  profilePic: text,
});

export const SubscriptionStatus = Variant({
  SubscriptionPending: text,
  Completed: text,
});

export const ReserveSubscription = Record({
  price: nat64,
  status: text,
  seller: Principal,
  paid_at_block: Opt(nat64),
  memo: nat64,
});

// Variant representing different error types
const ErrorType = Variant({
  NotFound: text,
  InvalidPayload: text,
  SubscriptionFailed: text,
  SubscriptionCompleted: text,
});

// Structure representing a artist
const ArtistReturn = Record({
  id: text,
  principal: Principal,
  userName: text,
  email: text,
  phone: text,
  bio: text,
  profilePic: text,
  followers: nat64,
  contents: Vec(Content),
});

/**
 * `contentsStorage` - a key-value data structure used to store contents by owners.
 * {@link StableBTreeMap} is a self-balancing tree that acts as durable data storage across canister upgrades.
 * For this contract, `StableBTreeMap` is chosen for the following reasons:
 * - `insert`, `get`, and `remove` operations have constant time complexity (O(1)).
 * - Data stored in the map survives canister upgrades, unlike using HashMap where data is lost after an upgrade.
 *
 * Breakdown of the `StableBTreeMap(text, Content)` data structure:
 * - The key of the map is an `contentId`.
 * - The value in this map is an content (`Content`) related to a given key (`contentId`).
 *
 * Constructor values:
 * 1) 0 - memory id where to initialize a map.
 * 2) 16 - maximum size of the key in bytes.
 * 3) 1024 - maximum size of the value in bytes.
 * Values 2 and 3 are not used directly in the constructor but are utilized by the Azle compiler during compile time.
 */
const contentsStorage = StableBTreeMap(0, text, Content);
const clientsStorage = StableBTreeMap(1, text, Client);
const artistsStorage = StableBTreeMap(3, text, Artist);
const pendingSubscriptions = StableBTreeMap(4, nat64, ReserveSubscription);
const persistedSubscriptions = StableBTreeMap(
  7,
  Principal,
  ReserveSubscription
);

const SUBSCRIPTION_RESERVATION_PERIOD = 120n; // reservation period in seconds

const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

// Exporting default Canister module
export default Canister({
  // Function to add an content
  addContent: update(
    [ContentPayload],
    Result(Content, ErrorType),
    (payload) => {
      // Check if the payload is a valid object
      if (typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ NotFound: "invalid payload" });
      }
      // Create an content with a unique id generated using UUID v4
      const content = {
        id: uuidv4(),
        owner: ic.caller(),
        createdAt: new Date().toISOString(),
        likes: 0n,
        subscriptions: 0n,
        comments: [],
        updatedAt: None,
        ...payload,
      };

      // get artist with the same principal
      const artistOpt = artistsStorage.values().filter((artist) => {
        return artist.principal.toText() === ic.caller().toText();
      });
      if (artistOpt.length === 0) {
        // create default artist
        const artist = {
          id: uuidv4(),
          principal: ic.caller(),
          contents: [content.id],
          email: "johndoe@gmail",
          userName: "johndoe",
          phone: "_",
        };
        artistsStorage.insert(artist.id, artist);
      } else {
        // add content to the artist

        const artist = artistOpt[0];
        const updatedArtist = {
          ...artist,
          contents: [...artist.contents, content.id],
        };
        artistsStorage.insert(artist.id, updatedArtist);
      }

      // Insert the content into the contentsStorage
      contentsStorage.insert(content.id, content);
      return Ok(content);
    }
  ),

  // get all contents
  getContents: query([], Vec(Content), () => {
    return contentsStorage.values();
  }),

  // Function get content by id
  getContent: query([text], Result(Content, ErrorType), (id) => {
    const contentOpt = contentsStorage.get(id);
    if ("None" in contentOpt) {
      return Err({ NotFound: `content with id=${id} not found` });
    }
    return Ok(contentOpt.Some);
  }),

  // Function to update an content
  updateContent: update(
    [UpdateContentPayload],
    Result(Content, ErrorType),
    (payload) => {
      const contentOpt = contentsStorage.get(payload.id);
      if ("None" in contentOpt) {
        return Err({ NotFound: `content with id=${payload.id} not found` });
      }
      const content = contentOpt.Some;
      const updatedContent = {
        ...content,
        ...payload,
      };
      contentsStorage.insert(content.id, updatedContent);
      return Ok(updatedContent);
    }
  ),

  // like content
  likeContent: update([text], Result(Content, ErrorType), (contentId) => {
    const contentOpt = contentsStorage.get(contentId);
    if ("None" in contentOpt) {
      return Err({ NotFound: `content with id=${contentId} not found` });
    }
    const content = contentOpt.Some;
    content.likes += 1n;
    contentsStorage.insert(content.id, content);
    return Ok(content);
  }),

  // Function to add a artist
  addArtist: update([ArtistPayload], Result(Artist, ErrorType), (payload) => {
    // Check if the payload is a valid object
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ NotFound: "invalid payload" });
    }
    // Create a artist with a unique id generated using UUID v4
    const artist = {
      id: uuidv4(),
      principal: ic.caller(),
      followers: 0n,
      contents: [],
      ...payload,
    };
    // Insert the artist into the artistsStorage
    artistsStorage.insert(artist.id, artist);
    return Ok(artist);
  }),

  // get all artists
  getArtists: query([], Vec(ArtistReturn), () => {
    const artists = artistsStorage.values();
    return artists.map((artist) => {
      const artistContents = contentsStorage.values().filter((content) => {
        return artist.contents.includes(content.id);
      });
      return {
        ...artist,
        contents: artistContents,
      };
    });
  }),

  // Function get artist by id
  getArtist: query([text], Result(ArtistReturn, ErrorType), (id) => {
    const artistOpt = artistsStorage.get(id);
    if ("None" in artistOpt) {
      return Err({ NotFound: `artist with id=${id} not found` });
    }
    const artist = artistOpt.Some;
    const artistContents = contentsStorage.values().filter((content) => {
      return artist.contents.includes(content.id);
    });
    return Ok({
      ...artist,
      contents: artistContents,
    });
  }),

  // get artist by owner

  // get contents reserved by a artist
  getArtistContents: query([text], Vec(Content), (id) => {
    const artistOpt = artistsStorage.get(id);
    if ("None" in artistOpt) {
      return [];
    }
    const artist = artistOpt.Some;
    return contentsStorage.values().filter((content) => {
      return artist.contents.includes(content.id);
    });
  }),

  // Function to update a artist
  updateArtist: update(
    [UpdateArtistPayload],
    Result(Artist, ErrorType),
    (payload) => {
      const artistOpt = artistsStorage.get(payload.id);
      if ("None" in artistOpt) {
        return Err({ NotFound: `artist with id=${payload.id} not found` });
      }
      const artist = artistOpt.Some;
      const updatedArtist = {
        ...artist,
        ...payload,
      };
      artistsStorage.insert(artist.id, updatedArtist);
      return Ok(updatedArtist);
    }
  ),

  // getClient by principal
  getClient: query([], Result(Client, ErrorType), () => {
    const principal = ic.caller();
    const clientOpt = clientsStorage.values().filter((client) => {
      return client.principal.toText() === principal.toText();
    });
    if (clientOpt.length === 0) {
      return Err({ NotFound: `client with principal=${principal} not found` });
    }
    return Ok(clientOpt[0]);
  }),

  // follow a artist
  followArtist: update([text], Result(Artist, ErrorType), (artistId) => {
    const artistOpt = artistsStorage.get(artistId);
    if ("None" in artistOpt) {
      return Err({ NotFound: `artist with id=${artistId} not found` });
    }
    const artist = artistOpt.Some;
    const clientOpt = clientsStorage.values().filter((client) => {
      return client.principal.toText() === ic.caller().toText();
    });
    if (clientOpt.length === 0) {
      return Err({
        NotFound: `client with principal=${ic.caller()} not found`,
      });
    }
    const client = clientOpt[0];
    const updatedClient = {
      ...client,
      following: [...client.following, artist.id],
    };

    artist.followers += 1n;

    artistsStorage.insert(artist.id, artist);
    clientsStorage.insert(client.id, updatedClient);
    return Ok(artist);
  }),

  // get user artists
  getFollowingArtists: query([], Vec(Artist), () => {
    const clientOpt = clientsStorage.values().filter((client) => {
      return client.principal.toText() === ic.caller().toText();
    });
    if (clientOpt.length === 0) {
      return [];
    }
    const client = clientOpt[0];
    return artistsStorage.values().filter((artist) => {
      return client.following.includes(artist.id);
    });
  }),

  // get user contents
  getFollowingContents: query([], Vec(Content), () => {
    const clientOpt = clientsStorage.values().filter((client) => {
      return client.principal.toText() === ic.caller().toText();
    });
    if (clientOpt.length === 0) {
      return [];
    }
    const client = clientOpt[0];
    return contentsStorage.values().filter((content) => {
      return client.contents.includes(content.id);
    });
  }),

  createReservePay: update(
    [text],
    Result(ReserveSubscription, ErrorType),
    (contentId) => {
      const contentOpt = contentsStorage.get(contentId);
      if ("None" in contentOpt) {
        return Err({
          NotFound: `cannot reserve Subscription: Content  with id=${contentId} not available`,
        });
      }
      const content = contentOpt.Some;

      const cost = content.subscriptionFee;

      const sellerOwner = content.owner;

      const reserveSubscription = {
        price: cost,
        status: "pending",
        seller: sellerOwner,
        paid_at_block: None,
        memo: generateCorrelationId(contentId),
      };

      // reduce the available units
      const updatedContent = {
        ...content,
        subscriptions: content.subscriptions + 1n,
      };

      // add content to the client
      // get client with the same principal
      const clientOpt = clientsStorage.values().filter((client) => {
        return client.principal.toText() === ic.caller().toText();
      });

      content.updatedAt = Some(new Date().toISOString());

      const clientContent = {
        ...content,
        id: uuidv4(),
        principal: ic.caller(),
      };

      if (clientOpt.length === 0) {
        // create default client
        const client = {
          id: uuidv4(),
          principal: ic.caller(),
          contents: [clientContent.id],
        };
        clientsStorage.insert(client.id, client);
      } else {
        // add content to the client

        const client = clientOpt[0];
        const updatedClient = {
          ...client,
          contents: [...client.contents, clientContent.id],
        };
        clientsStorage.insert(client.id, updatedClient);
      }

      contentsStorage.insert(clientContent.id, clientContent);

      contentsStorage.insert(content.id, updatedContent);

      pendingSubscriptions.insert(
        reserveSubscription.memo,
        reserveSubscription
      );
      discardByTimeout(
        reserveSubscription.memo,
        SUBSCRIPTION_RESERVATION_PERIOD
      );
      return Ok(reserveSubscription);
    }
  ),

  completeSubscription: update(
    [Principal, text, nat64, nat64, nat64],
    Result(ReserveSubscription, ErrorType),
    async (reservor, contentId, reservePrice, block, memo) => {
      const subscriptionVerified = await verifySubscriptionInternal(
        reservor,
        reservePrice,
        block,
        memo
      );
      if (!subscriptionVerified) {
        return Err({
          NotFound: `cannot complete the reserve: cannot verify the subscription, memo=${memo}`,
        });
      }
      const pendingReservePayOpt = pendingSubscriptions.remove(memo);
      if ("None" in pendingReservePayOpt) {
        return Err({
          NotFound: `cannot complete the reserve: there is no pending reserve with id=${contentId}`,
        });
      }
      const reservedPay = pendingReservePayOpt.Some;
      const updatedReserveSubscription = {
        ...reservedPay,
        status: "completed",
        paid_at_block: Some(block),
      };
      const contentOpt = contentsStorage.get(contentId);
      if ("None" in contentOpt) {
        throw Error(`Book with id=${contentId} not found`);
      }
      const content = contentOpt.Some;
      contentsStorage.insert(content.id, content);
      persistedSubscriptions.insert(ic.caller(), updatedReserveSubscription);
      return Ok(updatedReserveSubscription);
    }
  ),

  verifySubscription: query(
    [Principal, nat64, nat64, nat64],
    bool,
    async (receiver, amount, block, memo) => {
      return await verifySubscriptionInternal(receiver, amount, block, memo);
    }
  ),

  /*
        a helper function to get address from the principal
        the address is later used in the transfer method
    */
  getAddressFromPrincipal: query([Principal], text, (principal) => {
    return hexAddressFromPrincipal(principal, 0);
  }),
});

/*
    a hash function that is used to generate correlation ids for contents.
    also, we use that in the verifySubscription function where we check if the used has actually paid the content
*/
function hash(input: any): nat64 {
  return BigInt(Math.abs(hashCode().value(input)));
}

// A workaround to make the uuid package work with Azle
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  },
};

// HELPER FUNCTIONS
function generateCorrelationId(contentId: text): nat64 {
  const correlationId = `${contentId}_${ic.caller().toText()}_${ic.time()}`;
  return hash(correlationId);
}

function discardByTimeout(memo: nat64, delay: Duration) {
  ic.setTimer(delay, () => {
    const content = pendingSubscriptions.remove(memo);
    console.log(`Reserve discarded ${content}`);
  });
}
async function verifySubscriptionInternal(
  receiver: Principal,
  amount: nat64,
  block: nat64,
  memo: nat64
): Promise<bool> {
  const blockData = await ic.call(icpCanister.query_blocks, {
    args: [{ start: block, length: 1n }],
  });
  const tx = blockData.blocks.find((block) => {
    if ("None" in block.transaction.operation) {
      return false;
    }
    const operation = block.transaction.operation.Some;
    const senderAddress = binaryAddressFromPrincipal(ic.caller(), 0);
    const receiverAddress = binaryAddressFromPrincipal(receiver, 0);
    return (
      block.transaction.memo === memo &&
      hash(senderAddress) === hash(operation.Transfer?.from) &&
      hash(receiverAddress) === hash(operation.Transfer?.to) &&
      amount === operation.Transfer?.amount.e8s
    );
  });
  return tx ? true : false;
}
