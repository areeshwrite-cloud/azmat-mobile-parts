import {
  BatteryCharging,
  Camera,
  Cpu,
  Droplet,
  Fan,
  Flame,
  Gauge,
  Hammer,
  LayoutGrid,
  Layers,
  Microscope,
  Plug,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react';

export const CATEGORY_ICONS = {
  'HEATGUNS (HOT AIR GUNS)': Wind,
  'DC POWER SUPPLY': Zap,
  'SOLDERING STATIONS': Flame,
  'MICROSCOPES AND RELATED TOOLS': Microscope,
  'SEPARATOR (GLASS MACHINE)': Layers,
  CAMERAS: Camera,
  'IC RELATED TOOLS': Cpu,
  'BATTERY ACTIVATOR AND BOOT CABLES': BatteryCharging,
  'SCREWDRIVER AND RELATED TOOLS': Wrench,
  'BOARD AND IC FIXTURE': LayoutGrid,
  CHARGERS: Plug,
  PASTE: Droplet,
  MULTIMETER: Gauge,
  TOOLS: Hammer,
  'OCA REMOVER MACHINE': Fan,
};

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || Wrench;
}
