## Intro

A few years ago (maybe many years now) there was an invention called "counterfactual state channels". The basic idea was, build offchain applications using statements about things that have _not_ happened onchain.

The concept is good, but the application space was limited.

### ZK

Then we got zero knowledge proofs, and everyone thought the world was saved.

Then we researched zero knowledge proofs for years and found... very little.

L2 scaling worked, but the application space is still _very_ limited. For example, we don't have meaningful irl transactions (e.g. without internet availability). Tooling is still _bad_, and proving is centralized in data centers and emerging ASIC networks.

### Factual State Channels

I spent years obsessed with symmetric encryption (hi, i'm one of those people that spent years [finding nothing](https://www.youtube.com/watch?v=cSBCDnpMEMk&t=28s)). It just seemed like there was something there with zk.

The concept of decrypting, mutating, and then re-encrypting some output data, all in zk, seemed _immensely_ powerful. But it's inherently limited by the nature of symmetric encryption: one person knows the key.

However, recently I combined two things:
1. enforcing zk encryption operations on Ethereum
2. shared secrets as keys for symmetric encryption

Using these two things we can build what look like serverless financial functions on top of Ethereum.

### A transaction system

As is tradition, let's make a simple transaction system. We'll model this as a single smart contract with some functions, each requiring 1 or more zk proofs.

The contract state is a simple `map(u256 => bytes)`. We'll map each Ethereum address to a byte vector of encrypted state. This state will hold a first byte indicating the account type, with the following bytes holding account data. We'll map all other keys to deterministically calculated accounts.

For this post we'll model two kinds of accounts

#### Single user account

- 1 byte: account type
- 16 bytes: account balance (yes i'm representing ether using a `u128` and not a `u256`)

#### Payment account between two individuals

- 1 byte: account type
- 16 bytes: account balance
- 32 bytes: hash of owner key (can withdraw from account)
- 32 bytes: hash of sender key (can deposit to account)

#### Deposit

The deposit function is simple. A user sends some Ether to the contract, along with a zk proof incrementing the balance in the encrypted data. The input is the encrypted state, and the output is the modified encrypted state. If the user does not have state, the zk function initializes the balance to 0.

We'll disallow deposits to payment accounts for simplicity, though it is trivially doable.

#### Transfer

Transfer functions are tricky. Each user state is encrypted using a secret key known only to the user, so how can we safely modify someone elses balance?

The key is making a separate account with a **shared secret**. We assume the two parties are capable of communicating to do a 1 time setup. We'll call the private keys for sender and owner `sender_key` and `owner_key` respectively.

Sender and owner agree on a shared secret `H(H(sender_key), H(owner_key))` [^1]. This is accomplished by having both parties produce a zk proof of knowledge for preimage of either `H(sender_key)` or `H(owner_key)` (or they can just claim knowledge, lying here gains neither anything).

The sender and receiver pull the latest account state from the contract (if it exists) or initialize it locally.

The `Transfer` zk program accepts **two** different accounts, and outputs modified versions of both. The first account is the sending account, the second the receiving account.

Recall that the structure of a payment account includes the hash of the sender and owner keys. The `Transfer` program asserts knowledge of the preimage of `H(owner_key)` for the sending account (if it's a payment account) and preimage knowledge of `H(sender_key)` for the receiving account.

Assuming these assertions pass the sending account balance is decremented, and the receiving account is incremented. The new encrypted state for both accounts is output as public data.

Using a shared secret means either party can decrypt the account state, but using zk proofs and Ethereum we can assert statements about _who_ can change the data, and _how_ they can change it.

There's still a problem though. Say that Alice transfers me 1 Ether. She gives me a zk proof modifying both accounts, but before I broadcast it to the blockchain Alice sends another transaction. I can easily argue that I am owed money because I hold a signed piece of data indicating:
- both account owners
- transfer amount
- start and end encrypted states

Offline transaction systems become _much_ more doable given periodic synchronization (e.g. every few days).

#### Withdraw

Assert account owner, decrement, `msg.sender.transfer`, etc.

### Heteromorphic encryption

I'm calling this "heteromorphic encryption" because I see it as a client side alternative to homomorphic encyption.

Using modern recursion techniques should allow rolling a system like this into an `O(1)` sized blockchain + smart contract system. Indeed it should be possible to take Ethereum and transplant the entire state onto a completely different structure in a way that avoids downtime. Alternatively the L2 approach could work as well.

### Why aren't people doing this?

It's simple, working with zk is **difficult**. The tooling is bad and the concepts are hard. This is changing with zkvm's, and there are some emerging abstractions that should make zk easy to use in all applications ([shameless plug](https://docs.rs/zkpo/latest/zkpo/)).

There's an obvious future where all data is owned by users, we just have to build it.

If you'd like to read more about [heteromorphic encryption](https://github.com/chancehudson/heteromorphic/?tab=readme-ov-file#heteromorphic-encryption).

[^1]: The shared secret should be `H(H(sender_key, H(owner_key)), H(owner_key, H(sender_key)))` or similar, but is simplified in this writing.
