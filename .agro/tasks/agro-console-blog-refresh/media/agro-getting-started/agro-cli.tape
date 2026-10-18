Output agro-cli.mp4
Set Shell "bash"
Set FontSize 20
Set Width 1200
Set Height 440
Set Padding 24
Set Theme "Dracula"
Set TypingSpeed 60ms
Hide
Type `agro() { node /home/sandbox/harness/.agro/cli/dist/agro.js "$@" 2>/dev/null; }; PS1='$ '; cd /home/sandbox/harness; clear`
Enter
Show
Type "agro --version"
Sleep 400ms
Enter
Sleep 1.5s
Type "agro harness list"
Sleep 400ms
Enter
Wait+Screen@20s /t3code/
Sleep 4s
