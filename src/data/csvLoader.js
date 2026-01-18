import Papa from 'papaparse';

const cache = new Map();

export async function fetchCsv(path, mapRow) {
  if (cache.has(path)) {
    return cache.get(path);
  }
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Archivo faltante en INFORMACION: ${path}`);
  }
  const text = await res.text();
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });
  if (parsed.errors.length) {
    throw new Error(parsed.errors[0].message);
  }
  const rows = parsed.data.map((row) => (mapRow ? mapRow(row) : row));
  cache.set(path, rows);
  return rows;
}

export async function fetchJson(path) {
  if (cache.has(path)) {
    return cache.get(path);
  }
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Archivo faltante en INFORMACION: ${path}`);
  }
  const data = await res.json();
  cache.set(path, data);
  return data;
}

export async function fetchText(path) {
  if (cache.has(path)) {
    return cache.get(path);
  }
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Archivo faltante en INFORMACION: ${path}`);
  }
  const data = await res.text();
  cache.set(path, data);
  return data;
}
