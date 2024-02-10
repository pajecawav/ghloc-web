#!/usr/bin/env sh

load () {
    today=$(date +%F)
    curl https://raw.githubusercontent.com/EvanLi/Github-Ranking/master/Data/github-ranking-$today.csv
}

query () {
    sqlite3 :memory: -cmd ".mode csv" -cmd ".import /dev/stdin repos" "select username || '/' || repo_name from repos;"
}

load | query | sort -u > scripts/repos.txt
