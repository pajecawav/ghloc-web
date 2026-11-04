#!/usr/bin/env sh

load () {
    today=$(date +%F)
    curl https://raw.githubusercontent.com/EvanLi/Github-Ranking/master/Data/github-ranking-$today.csv
}

query () {
    sqlite3 :memory: -cmd ".mode csv" -cmd ".import /dev/stdin repos" "select username || '/' || repo_name from (select username, repo_name, min(cast(rank as integer)) as r from repos group by username, repo_name) order by r;"
}

# the source CSV has CRLF line endings — strip them or every sitemap URL
# ends up with a trailing carriage return
load | query | tr -d '\r' > scripts/repos.txt
