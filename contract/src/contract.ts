// Find all our documentation at https://docs.near.org
import {
  NearBindgen,
  near,
  call,
  view,
  initialize,
  LookupMap,
} from "near-sdk-js";

// @NearBindgen({})
// class HelloNear {
//   message: string = "Hello";

//   @view({}) // This method is read-only and can be called for free
//   get_greeting(): string {
//     return this.message;
//   }

//   @call({}) // This method changes the state, for which it cost gas
//   set_greeting({ message }: { message: string }): void {
//     near.log(`Saving greeting ${message}`);
//     this.message = message;
//   }
// }

// Token Metadata
// media_hash: string;
// copies: number;
// issued_at: number;
// expires_at: number;
// starts_at: number;
// updated_at: number;
// extra: string;
// reference: string;
// reference_hash: string;

// class Owner {
//   id: string;
//   name: string;
//   dob: string;
//   constructor(id: string, name: string, dob: string) {
//     (this.id = id), (this.name = name), (this.dob = dob);
//   }
// }

// const genID = () => {
//   const id = Date.now().toString();
//   return id;
// };

let genID = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
};

class Token {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  media: string;

  constructor(
    id: string,
    owner_id: string,
    title: string,
    description: string,
    media: string
  ) {
    (this.id = id),
      (this.owner_id = owner_id),
      (this.title = title),
      (this.description = description),
      (this.media = media);
  }
}

@NearBindgen({})
class Contract {
  token_id: string;
  owner_id: string;
  token_by_id: LookupMap<Token>;
  tokenList: Array<Token>;

  // owner_by_id: UnorderedMap<string>;

  constructor() {
    this.token_id = "";
    this.owner_id = "";
    this.token_by_id = new LookupMap("T");
    this.tokenList = [];

    // this.owner_by_id = new UnorderedMap("O");
  }

  @initialize({})
  init({ owner_id }: { owner_id: string }) {
    this.token_id = "";
    this.owner_id = owner_id;
    this.token_by_id = new LookupMap("T");
    this.tokenList = [];
  }

  @call({})
  mint_nft({ owner_id, title, description, media }) {
    const token_id = genID();

    let token = new Token(token_id, owner_id, title, description, media);
    this.token_by_id.set(token_id, token);
    this.tokenList.push(token);

    // this.owner_by_id.set(token_id, owner_id);

    return token;
  }

  @view({})
  get_token_by_id({ token_id }: { token_id: string }) {
    let token = this.token_by_id.get(token_id);

    if (token === null) {
      return null;
    }

    return token;
  }

  @view({})
  get_supply_tokens() {
    const token_id = genID();
    near.log(`genID -> ${token_id}`);
    return this.tokenList.length;
  }

  @view({})
  get_all_tokens({ start, max }: { start?: number; max?: number }) {
    return this.tokenList;
  }
}
