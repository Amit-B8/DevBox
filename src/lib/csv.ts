/** Parse comma-separated text, preserving quoted whitespace and embedded newlines. */
export function csvToRecords(input: string): Record<string, string>[] {
  if (input.length > 200000) throw new Error('Please use CSV with 200,000 characters or fewer.');
  const source = input.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let closedQuote = false;
  let fieldWasQuoted = false;
  let rowHasContent = false;

  function finishField() {
    row.push(fieldWasQuoted ? field : field.trim());
    field = ''; closedQuote = false; fieldWasQuoted = false;
  }
  function finishRow() {
    finishField();
    // Ignore empty physical lines, but retain explicit empty quoted/comma-separated records.
    if (rowHasContent) rows.push(row);
    row = []; rowHasContent = false;
  }

  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (char === '"') {
        if (source[i + 1] === '"') { field += '"'; i++; }
        else { quoted = false; closedQuote = true; }
      } else { field += char; }
      continue;
    }
    if (char === ',') { rowHasContent = true; finishField(); }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[i + 1] === '\n') i++;
      finishRow();
    } else if (char === '"') {
      if (closedQuote || field.trim() !== '') throw new Error(`Unexpected quote in record ${rows.length + 1}. Use doubled quotes inside quoted fields.`);
      quoted = true; fieldWasQuoted = true; field = ''; rowHasContent = true;
    } else if (closedQuote) {
      if (char !== ' ' && char !== '\t') throw new Error(`Expected a comma or line break after a closing quote in record ${rows.length + 1}.`);
    } else {
      field += char;
      if (char.trim()) rowHasContent = true;
    }
  }
  if (quoted) throw new Error('A quoted field is not closed. Add the closing double quote.');
  finishRow();
  if (rows.length < 2) throw new Error('CSV must contain a header row and at least one data row.');

  const headers = rows[0].map(header => header.trim());
  if (headers.some(header => !header)) throw new Error('Every column needs a non-empty header.');
  if (new Set(headers).size !== headers.length) throw new Error('Column headers must be unique to avoid losing values.');

  return rows.slice(1).map((values, index) => {
    if (values.length !== headers.length) throw new Error(`Data row ${index + 1} has ${values.length} fields; expected ${headers.length}.`);
    // Object.fromEntries preserves names such as "__proto__" as ordinary JSON keys.
    return Object.fromEntries(headers.map((header, column) => [header, values[column]]));
  });
}
