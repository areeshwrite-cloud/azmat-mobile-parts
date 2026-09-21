export const CATEGORIES = [
  'All',
  'HEATGUNS (HOT AIR GUNS)',
  'DC POWER SUPPLY',
  'SOLDERING STATIONS',
  'MICROSCOPES AND RELATED TOOLS',
  'SEPARATOR (GLASS MACHINE)',
  'CAMERAS',
  'IC RELATED TOOLS',
  'BATTERY ACTIVATOR AND BOOT CABLES',
  'SCREWDRIVER AND RELATED TOOLS',
  'BOARD AND IC FIXTURE',
  'CHARGERS',
  'PASTE',
  'MULTIMETER',
  'TOOLS',
  'OCA REMOVER MACHINE',
];

// Merges the default category set with any custom categories admins have added to products,
// so newly created categories show up across the store without code changes.
export function getUniqueCategories(products = []) {
  const defaults = CATEGORIES.filter((c) => c !== 'All');
  const fromProducts = products.map((p) => p.category).filter(Boolean);
  return Array.from(new Set([...defaults, ...fromProducts]));
}
