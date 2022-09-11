# 👩‍💻 JSWM - javascript window manager

### Story behind it

In my day to day job I am working as a web developer. In most companies in Berlin that means working on a Mac. Which is not too bad, a lot of the terminal tools are available for macOS as well which is great. What is less great is that it's not so easy to replace window manager on the newer versions of macOS, but I don't want to say good bye to keyboard driven tiling window managers like i3 and bspwm. There are two main options that I have tried:

- To install for example bspwm one needs XQuartz, it's possible to set it up but then it works only with X11 apps, not native mac ones. I also could not get X11 apps to render properly on retina screens.
- An alternative is to use apps that run alongside standard macOS window manager, things like Amethyst and Yabai. They modify the position and size of the windows, but they don't replace the management so it can be clunky and slow sometimes. I can however recommend Yabai as an ok option for daily use.

[how to set up bspwm with XQuartz](https://www.reddit.com/r/unixporn/comments/2jkf9z/osx_bspwm_i_cant_get_over_this_integration/clcjjfv/)

 [](https://www.reddit.com/r/unixporn/comments/2jkf9z/osx_bspwm_i_cant_get_over_this_integration/clcjjfv/)[Amethyst](https://ianyh.com/amethyst/)

[Yabai](https://github.com/koekeishiya/yabai)

### My solution

I have another idea. It's a bit cursed but it's quite pleasant to work with so far. I spent most of my time working with Firefox, terminal and nvim/vscode, sometimes I need to also take a look at images. And i like keyboard driven flows, tiling window management etc. What if I would be able to have terminal, file management, image viewing etc inside Firefox, just as another tab? This is what I called JSWM, Javascript based window manager that is basically a web app with simple implementations of window management, key bindings and apps like terminal (with ttyd) and image viewing. Most of other things like editing and file browsing I can do via the terminal.

[ttyd - Share your terminal over the web](https://tsl0922.github.io/ttyd/)

### Todo

- [x]  Terminal app
- [x]  Moving windows in free float mode
- [x]  Moving windows in stack mode
- [x]  Resizing windows in free float mode
- [x]  Resizing windows in stack mode [wip]
- [ ]  Image app [wip]
- [x]  https
- [ ]  Video app (use case for wasm with vlc)
- [ ]  Dmenu app
- [x]  App / Widget imports
- [x]  cli that communicates with a deamon
- [ ]  skhd connected to cli (example)

### Repository

[https://github.com/mayakarabula/jswm](https://github.com/mayakarabula/jswm)

### Screenshots

![https://raw.githubusercontent.com/mayakarabula/jswm/master/shot.png](https://raw.githubusercontent.com/mayakarabula/jswm/master/shot.png)