/**
 * Script to run the spell library audit and output results
 */

import { generateAuditReport, auditSpellLibrary } from './spellLibraryAudit.js';

// Run the audit
try {
  const results = auditSpellLibrary();
  const report = generateAuditReport();

  // Audit completed

} catch (error) {
  // Error running spell audit
}
