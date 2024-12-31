/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function jsonToCsv(json: any) {
  const keys = Object.keys(json[0]);
  const csv = json.map((row: any) => {
    return keys.map(key => {
      return JSON.stringify(row[key] || 'undefined');
    }).join(',');
  });

  return [keys.map(i => `"${i}"`).join(',')].concat(csv).join('\n');
}
