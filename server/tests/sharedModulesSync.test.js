const fs = require('fs');
const { expect } = require('chai');
const { sync, CLIENT_SRC } = require('../scripts/sync-shared');

// Railway deploys only server/, so runtime code reads rules modules from
// server/shared. This guards against the copy drifting from the client source.
describe('server/shared mirrors client rules modules', function () {
  before(function () { if (!fs.existsSync(CLIENT_SRC)) {this.skip();} });

  it('is byte-identical to vtt-react/src (run `npm run sync:shared` if this fails)', function () {
    expect(sync({ check: true })).to.deep.equal([]);
  });
});
