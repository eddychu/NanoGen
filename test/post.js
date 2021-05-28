const moment = require("moment");

const a = {
    value: 1,
    date: Date.parse("2021-05-28T02:37:19.241Z")
}

const b = {
    value: 2,
    date: Date.parse("2021-04-27T02:37:19.241Z")
}

const posts = [b, a]
posts.sort((a, b) => {
    return b.date - a.date;
})

console.log(posts)