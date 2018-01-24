'use strict';

const eggMock = require('egg-mock');

global.mm = global.mock = eggMock;
global.request = require('supertest');
global.assert = require('assert');

let app;
before(() => {
    app = global.app = mm.app({
        coverage: true,
    });
    return app.ready();
});

after(() => app.close());
