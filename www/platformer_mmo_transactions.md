### A 2d platformer MMORPG

Right, then instead of a map "going dark" when there are no players it just exists less accurately. This allows things like random events or mob interactions to continue to occur.

This could be used to shape the structure of maps over significant timescales of the games existence. e.g. a game world that has existed for decades and changed structure not because of developer choices, but world events.

The world can be persisted as a canonical state that is the map structure keyed to a signed hash (signed by the operator) and persisted in the reality (e.g. on eth or btc mainnet). Then the world is served on public endpoints and can be publicly verified and mutated by the developers (analogous to unilateral hard forks).

This would require extensive forethought, but not near as much as something like ethereum mainnet because forks are less expensive.

Because it's just a game lol

--

Types of global events that may occur:

- meteor strike that makes platforms on a map impassible. Odds: 1% each day for 1 impact to any position on any map. Can be fixed for $$1B ($$ is game currency)

- boss mob invading a map and taking control. Killing it should require X concurrent players of median level Y, Z minutes to defeat with technical difficulty of Tau. Odds: 1% each day for 1 boss mob to spawn on any platform any map

These types of probabilities can themselves be introduced to the map hash. The players participate in an evolving world 

The game world can be bound into reality by putting a $$ balance for each user in the world hash in a ZK compatible format.

Players can create ZK bonds of payment that execute on the ethereum mainnet and resolve in the game world as operated by operator O. A player Alice might create a transaction to trade $$100 for 0.1 eth. The transaction contains the following:

```
{
  to: u64,
  from: u64,
  amount_sent: u256,
  asset_sent: $$,
  amount_received: u256,
  asset_received: ETH,
  sig_sender: bytes,
  sig_receiver: bytes,

}
```

Alice sends the trade offer to Bob, if Bob agrees then both fill in the appropriate fields of the trade offer. Either may then submit the signed offer to the game operator O.

O generates a zk proof that the map state root was changed in such a way that the sender account is decremented $$100 (burning the value).

O also generates two signed statements:
- statement for sender: allows creating $$100 if transfer condition is not met in 1 hour
- statement for receiver: allows creating $$100 if transfer condition is met in less than 1 hour

Game operator updates the onchain map root and then watches for ETH deposits to sender (the ETH payment for $$). Once this occurs receiver can use their statement to create $$100 and complete the transaction. If the ETH transaction is not made then sender can use their statement to reclaim their payment.

Using this pattern external markets can exist with little friction. If game operator O begins censoring or rejecting transactions the tooling and game state can be reused by another game operator (forked). O can also design new types of transactions to facilitate new types of external markets.

That is, game transactions can occur in and out of the game. e.g. any kind of trade between any number of users can be created and executed outside of O's infrastructure. $$ could thus be traded for any asset on the ethereum network. e.g. ETH, [DAI](https://coinmarketcap.com/currencies/multi-collateral-dai/), WBTC, etc.

WBTC being an exposure mechanism for BTC, which is an exposure mechanism for the value of searching `0..2**256` (looking for a random number between `0` and `115792089237316195423570985008687907853269984665640564039457584007913129639936`).

DAI being an exposure mechanism for USD using ETH

USDC being an exposure mechanism for USD using ETH and COIN
