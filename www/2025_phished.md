I'm an Ethereum user and I'm lazy.

I still used Metamask in 2025 like a fool. I have a smart contract wallet, but it's single signer with Metamask. I thought this would be irrelevant, but it ended up being _quite_ relevant.

A while ago I was using firefox on my computer (m2 air) as usual. Firefox showed a brief message indicating that it needed to do a factory reset. I ignored this and pressed enter to initiate. Firefox sucks so much lately that I was not surprised...

A few days ago i re-installed Metamask from the firefox extension store. I was going through an auth flow and did not properly check the extension that was installed. The top result was an extension "MetaMask" with the same logo.

I installed the extension and entered my seed phrase, pressed enter, and nothing happened. I tried again, with the same result. I clicked around and felt a sinking feeling realizing I'd been phished.

I checked etherscan and saw funds being moved out of my account. ~$800 was gone in 1 minute.

The smart contract wallet held ~$40,000. I was _panicked_. 

Then i calmed down, loaded the metamask key in a different wallet, and slipped a transaction in draining the contract into a different account.

Big ups to the safe.global people, multisig on smart contract wallets is _extremely_ safe.

Ima build a walletconnect desktop daemon in not javascript

// todo: add that rust walletconnect impl
