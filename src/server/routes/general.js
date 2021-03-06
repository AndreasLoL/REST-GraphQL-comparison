'use strict';
const db = require('../schemas/queries');
const router = require('express').Router();
const graphql = require("graphql");
const schema = require('../schemas/schema');
const names = require("../sample_data/names.json");
const r = require('rethinkdb');

router.get('/products',( request, response ) => {
    response.send("Hello world!!!")
});

router.get('/graphql', function* () {
    let query = this.query.query;
    let params = this.query.params;

    let resp = yield graphql(schema, query, '', params);

    if (resp.errors) {
        this.status = 400;
        this.body = {
            errors: resp.errors
        };
        return;
    }

    this.body = resp;
});

router.post('/generate-users',( request, response ) => {
    let colors = ["red","orange","yellow","olive","green","teal","blue","violet","purple","pink","brown","grey","black"];
    let imageUrls = ["https://semantic-ui.com/images/avatar/large/elliot.jpg", "https://semantic-ui.com/images/avatar/large/jenny.jpg",
    "https://semantic-ui.com/images/avatar/large/chris.jpg", "https://semantic-ui.com/images/avatar/large/joe.jpg", "https://semantic-ui.com/images/avatar/large/stevie.jpg",
    "https://semantic-ui.com/images/avatar/large/christian.jpg", "https://semantic-ui.com/images/avatar/large/steve.jpg", "http://semantic-ui.com/images/avatar/large/ade.jpg",
    "https://semantic-ui.com/examples/assets/images/avatar/tom.jpg", "https://semantic-ui.com/images/avatar/large/daniel.jpg", "https://semantic-ui.com/images/avatar/large/justen.jpg"];

    r.db("sample_data").table("users")
        .delete()
        .run( request._rdb )
        .then( result => {
            r.db("sample_data").table("users").insert(generateUsers(names.first_names, names.last_names, colors, imageUrls)).run(request._rdb).then(result => response.send("Done"))
        } );
});

router.get('/generate-gibberish',( request, response ) => {

    r.db("sample_data").table("gibberish")
        .delete()
        .run( request._rdb )
        .then( result => {
            r.db("sample_data").table("gibberish").insert(generateGibberish()).run(request._rdb).then(result => response.send("Done"))
        } );
});

router.get("/getAllUsers", (request, response) => {
   db.getAllUsers().then(result => response.send(result));
});

router.get("/gibberish", (request, response) => {
    db.getGibberish().then(result => response.send(result));
});

router.get("/gibberish/one", (request, response) => {
    db.getGibberish().then(result => {

        const mapped = result.map(function (item) {
            return {field1: item.field1}
        });
        response.send(mapped);
    });
});

function generateUsers(firstNames, lastNames, colors, profileImages) {
    var users = [];
    var index = 0;
    for (var i = 0; i < firstNames.length; i++) {
        for (var j = 0; j < lastNames.length; j++) {
            index++;
            var user = {
                first_name: firstNames[i],
                last_name: lastNames[j],
                email: (firstNames[i] + "." + lastNames[j] + "@gmail.com").toLowerCase(),
                user_index: index,
                password: ("asd" + firstNames[i] + "asd" + lastNames[j]).toLowerCase(),
                color: colors[Math.floor(Math.random()*colors.length)],
                profileImage: profileImages[Math.floor(Math.random()*profileImages.length)],
            };
            if (index > 5) {
                user["friends"] = [index - 1, index - 2, index - 3, index - 4, index - 5]
            }
            users.push(user);
        }
    }

    return users;
}


function generateGibberish() {
    var data = [];
    for (var i = 0; i < 40000; i++) {
        data.push({
            "field1": "randomtext_randomtext_randomtext",
            "field2": "randomtext_randomtext_randomtext",
            "field3": "randomtext_randomtext_randomtext",
            "field4": "randomtext_randomtext_randomtext",
            "field5": "randomtext_randomtext_randomtext",
            "field6": "randomtext_randomtext_randomtext",
            "field7": "randomtext_randomtext_randomtext",
            "field8": "randomtext_randomtext_randomtext",
            "field9": "randomtext_randomtext_randomtext",
            "field10": "randomtext_randomtext_randomtext",
            "field11": "randomtext_randomtext_randomtext",
            "field12": "randomtext_randomtext_randomtext",
            "field13": "randomtext_randomtext_randomtext",
            "field14": "randomtext_randomtext_randomtext",
            "field15": "randomtext_randomtext_randomtext",
            "field16": "randomtext_randomtext_randomtext"
        });
    }

    return data;
}

module.exports = {router};