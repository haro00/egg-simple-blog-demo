'use strict';

const Controller = require('egg').Controller;

/**
 * graphQL
 */
class GraphQLController extends Controller {
    async index() {
        const ctx = this.ctx;
        try {
            let result = await ctx.graphql.query(JSON.stringify(ctx.request.body));
            if (result.errors && result.errors.length > 0) {
                throw result.errors;
            }
            ctx.body = {
                ...result,
                status: this.app.config.status.success,
                message: 'success'
            };
        } catch (err) {
            ctx.helper.handleError(ctx, err);
        }
    }
}

module.exports = GraphQLController;