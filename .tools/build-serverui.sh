#!/bin/bash
#
P_MOD_FOLDER="${PWD}";
P_DEV_FOLDER="${P_MOD_FOLDER}/commands/ui-ng";
P_PUBLIC_FOLDER="${P_MOD_FOLDER}/commands/ui/.drtools";
#
P_NG="ng";
#
echo -e "\e[32mAccessing angular folder:\e[0m";
cd "${P_DEV_FOLDER}";
#
echo -e "\e[32mBuilding UI:\e[0m";
if [ "$1" == 'live' ]; then
    "${P_NG}" serve --host 0.0.0.0 -aot | awk '{print "\t" $0}';
else
    "${P_NG}" build --prod --output-path "${P_PUBLIC_FOLDER}" --delete-output-path --base-href '/.drtools/' | awk '{print "\t" $0}';
fi;
#
