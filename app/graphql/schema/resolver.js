'use strict';

const user = require('../user/schema');
const article = require('../article/schema');
const type = require('../type/schema');

module.exports = {
    Query: {
        ...user.Query,
        ...article.Query,
        ...type.Query,
    },
    Mutation: {
        ...user.Mutation,
        ...article.Mutation,
        ...type.Mutation,
    },
};
