// Negative control: remove only the reviewed import in Jest memory, never on disk.
const base = require('D:/VTT/vtt-react/node_modules/react-scripts/config/jest/babelTransform.js');
module.exports = {
  process(source, file, options) {
    if (file.replace(/\\/g, '/').endsWith('/src/components/ui/ActionBar.jsx')) {
      const line = "import { migrateBlockId } from '../../utils/arcanoneerMigration';";
      if (!source.includes(line)) throw Error('Negative control import missing');
      source = source.replace(line, '');
    }
    return base.process(source, file, options);
  }
};
