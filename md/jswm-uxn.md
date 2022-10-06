# 🐰 06.10.2022 - Jswm + Uxn

> The Uxn ecosystem is a clean-slate personal computing stack, created to host small tools and games, programmable in its own unique assembly language, made of 32 instructions.

> It was designed with an implementation-first mindset with a focus on creating portable graphical applications, the distribution of Uxn projects is akin to sharing game roms for any classic console emulator. To learn more, read about the uxn design, or see the technical documentation.

[> uxn](https://100r.co/site/uxn.html)

I very much like the philosophy of uxn and the applications that were created so far with it. Sharing small apps as ROMs remind me of cartridges for Game Boy.

[> List of some of the apps written for uxn](https://github.com/hundredrabbits/awesome-uxn#applications)

That being said, I also have a project of my own, jswm. While it does not introduce a new language or stack machine emulators it allows me to have a contained workstation.
There I can run a terminal, calendar, video player, VS Code, etc, and many things that I can bring myself with JS and WASM.

[~ jswm](jswm-javascript-window-manager.html)

But what I would love to achieve is to run uxn ROMs within jswm. This can be done generally, either with WASM or with uxn emulator written in JS. In the image at the top you can see Noodle and Piano running with webuxn in jswm.

[> uxn5 - uxn emulator in js](https://git.sr.ht/~rabbits/uxn5)

[> webuxn - web runtime for the uxn (wasm)](https://github.com/aduros/webuxn)

Both uxn5 and webuxn have their limitations. Uxn5 has only partial implementation and while webuxn can compile and run uxn programs it only works with an old version of uxn [1] and migration to a newer one is not trivial. An extra thing to consider is that uxn5 is written fully in JS while webuxn uses wasm and is partially written in C.

[> [1] roms built with latest uxn aren't working](https://github.com/aduros/webuxn/issues/2)

But I am not discouraged. I am learning now uxntal (uxn assembler language) and I plan to either help with implementation of uxn5 or update webuxn. Not sure yet which one although I am more leaning towards uxn5 since it's written in one language and Devine has kick-started it.
