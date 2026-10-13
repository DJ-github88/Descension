# External review setup observations

The dedicated filesystem directory-creation tool denied access outside its D:/VTT allowlist. The developer-approved D:/AppData/Temp/opencode directory was verified with Test-Path and the review directory created with PowerShell. All authored review files use the approved external directory.

The first external identity validation used the later remaining-review after.json to compare the earlier historical snapshot. It correctly failed at characterPersistenceService.js (snapshot b33440de… versus later ledger 47b26ec5…). The historical snapshot belongs to the earlier independent-rereview ledger; that comparison path was corrected externally. Both full 269-file snapshots then matched their respective independent source records and embedded hashes. This was an external evidence-indexing correction, not production drift or a scenario/assertion change.

No freeze, evidence finalizer, source correction or repository write was executed. Fresh runner writeFileSync artifacts are redirected externally by output.cjs; new repository directories and other synchronous repository writes are refused by that shim. Existing evidence directories are reused only for reads.

The external output summarizer initially counted P5's per-scenario records and repeated final-summary records as six distinct scenarios. Its uniqueness count was corrected to three; every printed record's PASS status and empty failures remains asserted. Original runner output and acceptance assertions were unchanged.
