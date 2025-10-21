@echo off
echo 正在复制音乐文件...

cd /d "%~dp0"

echo 复制白天主题音乐...
copy "public\music\狐の工作室 - おいでませ地獄街道.mp3" "public\music\day-theme.mp3"

echo 复制夜晚主题音乐...
copy "public\music\上海アリス幻樂団,黄昏フロンティア - 旧地獄街道を行く.mp3" "public\music\night-theme.mp3"

echo 复制完成！
pause

