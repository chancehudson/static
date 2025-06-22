i did this thing where i made a seeded rng for all the entities in my game engine. It's seeded based on the entity id (`u128`) and the step index (`u64`)

each step every entity gets a new deterministic rng for behavior logic

and the entity id is a `u128` from a seeded rng as well

so if you know the engine seed the whole thing is verifiably replayable

--

"but what about cheaters"

right if you deterministically render the world you can predict where everything will be in the future

but you can do that using a modern ai pretty easily anyway so who cares

and as for secret values: the server has a final secret seed `u128`. It gets revealed once the world has despawned, as a backup

--

if you have the engine public and secret seed + all user inputs the whole thing is relatively simple to replay. e.g. there could be browser history viewers for the entire history of the game world

the previous points in the game world can also be forked into a playable instance - e.g. going back in time to practice a bossfight. similar to forking an instance of a blockchain for development. Forking a point in time for training

even more interesting, before the first bossfight is publicly attempted there will be no way to practice

ideally stats+items get fully encoded into a zk proof, but this will take a bit more doing (without an overly authoritative structure)

