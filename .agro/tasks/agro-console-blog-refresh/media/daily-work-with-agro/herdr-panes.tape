Output herdr-panes.mp4
Set Shell zsh
Set FontSize 16
Set Width 1440
Set Height 810
Set Padding 16
Set TypingSpeed 45ms
Hide
Type "cd /home/sandbox/harness && clear"
Enter
Show
Type "herdr --session agro-blog-demo"
Enter
Hide
Sleep 3s
Type "cd projects/mifunedev/website && PS1='%1~ $ ' RPROMPT='' && clear"
Enter
Sleep 500ms
Show
Sleep 1s
Type "ls -1 .worktrees/feat/"
Enter
Sleep 1500ms
Type "git branch --list 'feat/88-*'"
Enter
Sleep 2s
Ctrl+b
Type "v"
Hide
Sleep 2s
Type "cd projects/mifunedev/website/.worktrees/feat/88-us-004 && PS1='%1~ $ ' RPROMPT='' && clear"
Enter
Sleep 500ms
Show
Sleep 1s
Type "grep '^### US' .agro/tasks/agro-console-blog-refresh/prd.md"
Enter
Sleep 2s
Screenshot herdr-two-panes.png
Ctrl+b
Type "-"
Hide
Sleep 2s
Type "cd /home/sandbox/harness && PS1='%1~ $ ' RPROMPT='' && clear"
Enter
Sleep 500ms
Show
Sleep 1s
Type "node .agro/cli/dist/agro.js --version"
Enter
Sleep 2s
Type "ls -C .agro/skills"
Enter
Sleep 3s
Screenshot herdr-three-panes.png
Sleep 1s
