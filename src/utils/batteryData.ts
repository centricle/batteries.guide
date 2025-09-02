import fs from 'fs';
import path from 'path';

export interface ChemistrySpec {
  voltage_nominal: number;
  voltage_end?: number;
  voltage_fresh?: number;
  voltage_charged?: number;
  voltage_min?: number;
  capacity_typical?: string;
  capacity_range?: string;
  capacity_at_25ma?: string;
  capacity_at_500ma?: string;
  capacity_eneloop_standard?: string;
  capacity_eneloop_pro?: string;
  capacity_unit: string;
  max_discharge_continuous?: string;
  max_discharge_pulse?: string;
  discharge_rate?: string;
  discharge_unit?: string;
  cycle_life?: string;
  self_discharge?: string;
}

export interface TemperatureRange {
  min: number;
  max: number;
  lithium_min?: number;
  lithium_max?: number;
  unit: string;
}

export interface WeightSpec {
  unit: string;
  typical?: string;
  [chemistryOrType: string]: string | undefined;
}

export interface BatterySpec {
  type: string;
  designation?: string;
  iec_code?: string;
  ansi_code?: string;
  common_names: string[];
  chemistry: Record<string, ChemistrySpec>;
  dimensions: {
    diameter?: number;
    diameter_min?: number;
    diameter_max?: number;
    width?: number;
    height?: number;
    height_min?: number;
    height_max?: number;
    depth?: number;
    positive_terminal_min_height?: number;
    positive_terminal_max_diameter?: number;
    negative_terminal_min_diameter?: number;
    unit: string;
    shape?: string;
    notes?: string;
  };
  weight: WeightSpec;
  temperature_range: {
    operating?: TemperatureRange;
    operating_charge?: TemperatureRange;
    operating_discharge?: TemperatureRange;
    storage?: TemperatureRange;
  };
  common_devices: string[];
  notes: string;
  // Optional fields that may exist in specific battery types
  protection?: Record<string, string>;
  terminals?: Record<string, string>;
  shelf_life?: {
    years: number;
    notes: string;
  };
  storage_retention?: Record<string, string>;
  variants?: Record<string, string>;
  safety_notes?: string[];
  manufacturers?: string[];
  sources?: Array<{
    name: string;
    url?: string;
    access_date?: string;
    notes?: string;
  }>;
}

export interface BatteryCategory {
  name: string;
  slug: string;
  description: string;
  batteries: BatterySpec[];
}

const DATA_DIR = path.join(process.cwd(), 'data');

// Utility functions to handle dimension ranges
export function getDimension(battery: BatterySpec, type: 'diameter' | 'height' | 'width' | 'depth'): string {
  const dims = battery.dimensions;
  
  if (type === 'diameter') {
    if (dims.diameter) return dims.diameter.toString();
    if (dims.diameter_min && dims.diameter_max) {
      return dims.diameter_min === dims.diameter_max ? 
        dims.diameter_min.toString() : 
        `${dims.diameter_min}-${dims.diameter_max}`;
    }
  }
  
  if (type === 'height') {
    if (dims.height) return dims.height.toString();
    if (dims.height_min && dims.height_max) {
      return dims.height_min === dims.height_max ? 
        dims.height_min.toString() : 
        `${dims.height_min}-${dims.height_max}`;
    }
  }
  
  if (type === 'width' && dims.width) return dims.width.toString();
  if (type === 'depth' && dims.depth) return dims.depth.toString();
  
  return '';
}

export function hasDimension(battery: BatterySpec, type: 'diameter' | 'height' | 'width' | 'depth'): boolean {
  const dims = battery.dimensions;
  
  switch (type) {
    case 'diameter':
      return !!(dims.diameter || (dims.diameter_min && dims.diameter_max));
    case 'height':
      return !!(dims.height || (dims.height_min && dims.height_max));
    case 'width':
      return !!dims.width;
    case 'depth':
      return !!dims.depth;
    default:
      return false;
  }
}

export function loadBatteryData(category: string, type: string): BatterySpec | null {
  try {
    const filePath = path.join(DATA_DIR, category, `${type}.json`);
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(`Error loading battery data for ${category}/${type}:`, error);
    return null;
  }
}

export function loadCategoryData(category: string): BatterySpec[] {
  try {
    const categoryDir = path.join(DATA_DIR, category);
    const files = fs.readdirSync(categoryDir).filter(file => file.endsWith('.json'));
    
    return files.map(file => {
      const filePath = path.join(categoryDir, file);
      const jsonData = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(jsonData);
    }).sort((a, b) => a.type.localeCompare(b.type));
  } catch (error) {
    console.error(`Error loading category data for ${category}:`, error);
    return [];
  }
}

export function getAllCategories(): BatteryCategory[] {
  const categories = [
    {
      name: 'Traditional Batteries',
      slug: 'traditional',
      description: 'Standard alkaline, carbon-zinc, and NiMH batteries in common sizes like AA, AAA, C, D, and 9V.'
    },
    {
      name: 'Lithium-ion Batteries', 
      slug: 'lithium-ion',
      description: 'Rechargeable lithium-ion cells in various cylindrical formats like 18650, 21700, and others.'
    },
    {
      name: 'Button Cells',
      slug: 'button-cells', 
      description: 'Coin-shaped batteries including CR2032, AG13, LR44 and other watch/electronics batteries.'
    },
    {
      name: 'Camera Batteries',
      slug: 'camera',
      description: 'Specialized lithium batteries for film and digital cameras, including vintage and professional formats.'
    },
    {
      name: 'Hearing Aid Batteries',
      slug: 'hearing-aid',
      description: 'Zinc-air batteries for hearing aids and medical devices, featuring air-activated chemistry and color-coding.'
    }
  ];

  return categories.map(category => ({
    ...category,
    batteries: loadCategoryData(category.slug)
  }));
}

export function searchBatteries(query: string): BatterySpec[] {
  const allCategories = getAllCategories();
  const allBatteries = allCategories.flatMap(cat => cat.batteries);
  
  const searchTerm = query.toLowerCase();
  
  // Check for voltage pattern (e.g., "3.7V", "1.5v", "9 V")
  const voltageMatch = query.match(/(\d+\.?\d*)\s*v/i);
  const targetVoltage = voltageMatch ? parseFloat(voltageMatch[1]) : null;
  
  return allBatteries.filter(battery => {
    // Standard text matching
    const textMatch = (
      battery.type.toLowerCase().includes(searchTerm) ||
      battery.designation?.toLowerCase().includes(searchTerm) ||
      battery.iec_code?.toLowerCase().includes(searchTerm) ||
      battery.ansi_code?.toLowerCase().includes(searchTerm) ||
      battery.common_names.some(name => name.toLowerCase().includes(searchTerm)) ||
      battery.common_devices.some(device => device.toLowerCase().includes(searchTerm))
    );
    
    // Voltage matching - check all chemistry variants
    const voltageMatch = targetVoltage ? Object.values(battery.chemistry).some(chem => 
      chem.voltage_nominal === targetVoltage
    ) : false;
    
    return textMatch || voltageMatch;
  });
}