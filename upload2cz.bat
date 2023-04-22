@echo off

echo "#####update start#####"

scp  -v -r ./dist/* root@150.158.139.18:/opt/jianguan/front/

echo "#####update end#####"

