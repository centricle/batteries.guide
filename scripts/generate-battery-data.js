// Quick battery data generator from Wikipedia specs
// Run with: node scripts/generate-battery-data.js

import fs from 'fs';
import path from 'path';

const batterySpecs = {
  traditional: [
    {
      type: "AAAA",
      designation: "LR61",
      iec_code: "R61", 
      ansi_code: "25A",
      dimensions: { diameter: 8.3, height: 42.5 },
      voltage: 1.5,
      capacity_alkaline: "625",
      weight_alkaline: "6.5",
      devices: ["Stylus pens", "Laser pointers", "Small electronics", "Bluetooth headsets"]
    },
    {
      type: "C",
      designation: "LR14",
      iec_code: "R14",
      ansi_code: "14A", 
      dimensions: { diameter: 26.2, height: 50 },
      voltage: 1.5,
      capacity_alkaline: "7500-8000",
      weight_alkaline: "65",
      devices: ["Flashlights", "Portable radios", "Toys", "Lanterns", "Boomboxes"]
    },
    {
      type: "D",
      designation: "LR20", 
      iec_code: "R20",
      ansi_code: "13A",
      dimensions: { diameter: 34.2, height: 61.5 },
      voltage: 1.5,
      capacity_alkaline: "15000-20000",
      weight_alkaline: "140",
      devices: ["Large flashlights", "Radio receivers", "Portable speakers", "Emergency radios", "Large toys"]
    },
    {
      type: "N",
      designation: "LR1",
      iec_code: "R1", 
      ansi_code: "910A",
      dimensions: { diameter: 12, height: 30.2 },
      voltage: 1.5,
      capacity_alkaline: "1000",
      weight_alkaline: "7",
      devices: ["Car alarms", "Garage door openers", "Medical devices", "Small electronics"]
    }
  ],
  
  lithium_ion: [
    {
      type: "21700",
      dimensions: { diameter: 21, height: 70 },
      voltage_nominal: 3.7,
      voltage_max: 4.2,
      capacity_range: "3000-5000",
      weight: "65-70",
      devices: ["Tesla Model 3/Y", "Power tools", "E-bikes", "High-capacity flashlights", "Power banks"],
      notes: "Newer format with higher capacity than 18650. Increasingly popular in EVs and power tools."
    },
    {
      type: "26650", 
      dimensions: { diameter: 26, height: 65 },
      voltage_nominal: 3.7,
      voltage_max: 4.2, 
      capacity_range: "4000-5500",
      weight: "85-95",
      devices: ["High-power flashlights", "E-bikes", "Power tools", "Energy storage", "Mod vapes"],
      notes: "Large format Li-ion with very high capacity and current capability."
    },
    {
      type: "14500",
      dimensions: { diameter: 14, height: 50 },
      voltage_nominal: 3.7,
      voltage_max: 4.2,
      capacity_range: "800-1000", 
      weight: "20-25",
      devices: ["Small flashlights", "Solar lights", "Electronic devices", "Some AA-compatible devices"],
      notes: "AA-sized lithium-ion. Higher voltage than AA alkaline - check device compatibility."
    },
    {
      type: "10440",
      dimensions: { diameter: 10.5, height: 44 },
      voltage_nominal: 3.7,
      voltage_max: 4.2,
      capacity_range: "300-400",
      weight: "12-15", 
      devices: ["Small LED flashlights", "Laser pointers", "Some AAA-compatible devices"],
      notes: "AAA-sized lithium-ion. Much higher voltage than AAA alkaline - verify compatibility."
    }
  ],

  button_cells: [
    {
      type: "CR2025",
      dimensions: { diameter: 20, height: 2.5 },
      voltage: 3.0,
      capacity: "165",
      weight: "2.6",
      devices: ["Car key fobs", "Watches", "Small electronics", "Medical devices"]
    },
    {
      type: "CR2016", 
      dimensions: { diameter: 20, height: 1.6 },
      voltage: 3.0,
      capacity: "90",
      weight: "1.8",
      devices: ["Watches", "Calculators", "Small electronics", "Key fobs"]
    },
    {
      type: "LR44",
      designation: "AG13",
      dimensions: { diameter: 11.6, height: 5.4 },
      voltage: 1.5,
      capacity: "150",
      weight: "2.0",
      devices: ["Calculators", "Laser pointers", "Small toys", "Digital thermometers", "Watches"]
    },
    {
      type: "CR123A",
      dimensions: { diameter: 17, height: 34.5 },
      voltage: 3.0,
      capacity: "1500-1700",
      weight: "17",
      devices: ["Cameras", "Flashlights", "Security sensors", "Medical devices", "Smoke detectors"]
    }
  ]
};

function generateBatteryJSON(battery, category) {
  const template = {
    type: battery.type,
    designation: battery.designation,
    iec_code: battery.iec_code,
    ansi_code: battery.ansi_code,
    common_names: [battery.type, ...(battery.designation ? [battery.designation] : [])],
    chemistry: {},
    dimensions: {
      ...battery.dimensions,
      unit: "mm"
    },
    weight: {},
    temperature_range: {
      operating: { min: -20, max: 60, unit: "°C" },
      storage: { min: -30, max: 70, unit: "°C" }
    },
    common_devices: battery.devices,
    notes: battery.notes || `Standard ${battery.type} battery specifications.`
  };

  // Add chemistry-specific data
  if (category === 'traditional') {
    template.chemistry.alkaline = {
      voltage_nominal: battery.voltage,
      voltage_end: 0.9,
      capacity_typical: battery.capacity_alkaline,
      capacity_unit: "mAh"
    };
    template.weight.alkaline = battery.weight_alkaline;
    template.weight.unit = "g";
  } else if (category === 'lithium_ion') {
    template.chemistry.lithium_ion = {
      voltage_nominal: battery.voltage_nominal,
      voltage_charged: battery.voltage_max,
      voltage_min: 2.5,
      capacity_range: battery.capacity_range,
      capacity_unit: "mAh"
    };
    template.weight.typical = battery.weight;
    template.weight.unit = "g";
  } else if (category === 'button_cells') {
    template.chemistry.lithium_manganese_dioxide = {
      voltage_nominal: battery.voltage,
      voltage_end: 2.0,
      capacity_typical: battery.capacity,
      capacity_unit: "mAh"
    };
    template.weight.typical = battery.weight;
    template.weight.unit = "g";
  }

  return JSON.stringify(template, null, 2);
}

// Generate all JSON files
Object.entries(batterySpecs).forEach(([category, batteries]) => {
  const categoryDir = category.replace('_', '-');
  
  batteries.forEach(battery => {
    const filename = battery.type.toLowerCase().replace(/[^a-z0-9]/g, '');
    const filepath = path.join(process.cwd(), 'data', categoryDir, `${filename}.json`);
    const jsonContent = generateBatteryJSON(battery, category);
    
    fs.writeFileSync(filepath, jsonContent);
    console.log(`Generated: ${filepath}`);
  });
});

console.log('\n✅ Battery data generation complete!');
console.log('📁 Check the /data directories for new JSON files');
console.log('🚀 Run npm run dev to see the updated site');