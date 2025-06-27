hey guys, so i'm thinking of how to build this. I need a package to develop and maintain in the package registry. I was toying with lattice crypto implementations but i think a db handle would be better.

I'm using [sled](https://github.com/spacejam/sled) as a database in another project. It keys `[u8]` to records using arbitrary logic. If I standardize the key generation mechanism using a zk friendly hash function it should be possible to access using a db handle in noir.

This would be exposed as a cli utility that reads a sled database directory and outputs a merkle tree.

So ideally, in noir i would invoke an external program, passing arguments and receiving a standardized representation of data (noir types).

Essentially this would be an FFI for noir. This could initially be implemented as

--

Hey guys, is there any file system access or ffi for generating witness data? Say i have a sled database, can i export a merkle tree representation to file(s) and then read that in noir? It would be cool to have readonly database handles in noir as a package

e.g. i have an sqlite database. I run a rust program "ZKIFY" on the database to generate an in place merkle snapshot of the database. I commit to the root publicly then can begin making public statements about the db on request. I take a new snapshot and publicly commit to a new root every hour

At the noir level there can be proofs of individuals having specific records, but also sanity checks about the state transition for the whole db. This state transition proof would be a nice form of legislation. e.g. the state transition proof can very specifically define operating parameters and be easily changed with votes/discussion in a pr
