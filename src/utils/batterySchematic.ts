interface BatteryDimensions {
  // Cylindrical dimensions
  diameter?: number;
  diameter_min?: number;
  diameter_max?: number;
  height?: number;
  height_min?: number;
  height_max?: number;
  
  // Rectangular dimensions
  width?: number;
  depth?: number;
  shape?: string;
  
  unit: string;
}

interface BatteryTerminals {
  type?: string;
  spacing?: string;
  positive?: string;
  negative?: string;
}

interface BatterySpec {
  type: string;
  dimensions: BatteryDimensions;
  terminals?: BatteryTerminals;
}

interface SchematicConfig {
  width: number;
  height: number;
  padding: number;
  strokeWidth: number;
  fontSize: number;
}

/**
 * Generate SVG path for dimension line with arrows
 */
function createDimensionLine(
  x1: number, y1: number, x2: number, y2: number, 
  offset: number, label: string, isHorizontal: boolean = true
): string {
  const arrowSize = 3;
  
  if (isHorizontal) {
    const lineY = y1 + offset;
    const midX = (x1 + x2) / 2;
    
    return `
      <!-- Extension lines -->
      <line x1="${x1}" y1="${y1}" x2="${x1}" y2="${lineY + 5}" stroke="#6B7280" stroke-width="0.5"/>
      <line x1="${x2}" y1="${y1}" x2="${x2}" y2="${lineY + 5}" stroke="#6B7280" stroke-width="0.5"/>
      
      <!-- Dimension line -->
      <line x1="${x1}" y1="${lineY}" x2="${x2}" y2="${lineY}" stroke="#374151" stroke-width="0.8"/>
      
      <!-- Arrows -->
      <polygon points="${x1},${lineY} ${x1 + arrowSize},${lineY - arrowSize/2} ${x1 + arrowSize},${lineY + arrowSize/2}" fill="#374151"/>
      <polygon points="${x2},${lineY} ${x2 - arrowSize},${lineY - arrowSize/2} ${x2 - arrowSize},${lineY + arrowSize/2}" fill="#374151"/>
      
      <!-- Label -->
      <text x="${midX}" y="${lineY - 8}" text-anchor="middle" class="dimension-text">${label}</text>
    `;
  } else {
    // Vertical dimension line
    const lineX = x1 + offset;
    const midY = (y1 + y2) / 2;
    
    return `
      <!-- Extension lines -->
      <line x1="${x1}" y1="${y1}" x2="${lineX + 5}" y2="${y1}" stroke="#6B7280" stroke-width="0.5"/>
      <line x1="${x1}" y1="${y2}" x2="${lineX + 5}" y2="${y2}" stroke="#6B7280" stroke-width="0.5"/>
      
      <!-- Dimension line -->
      <line x1="${lineX}" y1="${y1}" x2="${lineX}" y2="${y2}" stroke="#374151" stroke-width="0.8"/>
      
      <!-- Arrows -->
      <polygon points="${lineX},${y1} ${lineX - arrowSize/2},${y1 + arrowSize} ${lineX + arrowSize/2},${y1 + arrowSize}" fill="#374151"/>
      <polygon points="${lineX},${y2} ${lineX - arrowSize/2},${y2 - arrowSize} ${lineX + arrowSize/2},${y2 - arrowSize}" fill="#374151"/>
      
      <!-- Label -->
      <text x="${lineX + 12}" y="${midY + 3}" text-anchor="start" class="dimension-text">${label}</text>
    `;
  }
}

/**
 * Generate SVG for cylindrical battery schematic
 */
function generateCylindricalSchematic(battery: BatterySpec, config: SchematicConfig): string {
  const { dimensions } = battery;
  const { width: svgWidth, height: svgHeight, padding } = config;
  
  // Get diameter and height values
  const diameter = dimensions.diameter || 
    (dimensions.diameter_min && dimensions.diameter_max ? 
      (dimensions.diameter_min + dimensions.diameter_max) / 2 : 0);
  
  const height = dimensions.height || 
    (dimensions.height_min && dimensions.height_max ? 
      (dimensions.height_min + dimensions.height_max) / 2 : 0);
  
  if (!diameter || !height) {
    return `<text x="50%" y="50%" text-anchor="middle">Insufficient dimension data</text>`;
  }
  
  // Scale calculation - fit battery to available space with some margin
  const availableWidth = svgWidth - (padding * 3); // Extra padding for dimensions
  const availableHeight = svgHeight - (padding * 3);
  const scale = Math.min(availableWidth / height, availableHeight / diameter) * 0.7;
  
  // Calculate scaled dimensions
  const scaledHeight = height * scale;
  const scaledDiameter = diameter * scale;
  
  // Center the battery
  const batteryX = (svgWidth - scaledHeight) / 2;
  const batteryY = (svgHeight - scaledDiameter) / 2;
  const batteryRadius = scaledDiameter / 2;
  
  // Terminal dimensions (if available)
  let terminalElements = '';
  const hasTerminalData = dimensions.positive_terminal_max_diameter || 
                         dimensions.negative_terminal_min_diameter;
  
  if (hasTerminalData) {
    const posTerminalRadius = (dimensions.positive_terminal_max_diameter || 5.5) * scale / 2;
    const negTerminalRadius = (dimensions.negative_terminal_min_diameter || 7) * scale / 2;
    
    // Positive terminal (right side, smaller)
    terminalElements += `
      <circle cx="${batteryX + scaledHeight}" cy="${batteryY + batteryRadius}" 
              r="${posTerminalRadius}" fill="none" stroke="#374151" stroke-width="1"/>
      <text x="${batteryX + scaledHeight}" y="${batteryY + batteryRadius - posTerminalRadius - 8}" 
            text-anchor="middle" class="terminal-label">+</text>
    `;
    
    // Negative terminal (left side, larger - represented as flat end)
    terminalElements += `
      <line x1="${batteryX}" y1="${batteryY + batteryRadius - negTerminalRadius}" 
            x2="${batteryX}" y2="${batteryY + batteryRadius + negTerminalRadius}" 
            stroke="#374151" stroke-width="3"/>
      <text x="${batteryX - 15}" y="${batteryY + batteryRadius + 3}" 
            text-anchor="middle" class="terminal-label">-</text>
    `;
  }
  
  // Format dimension values
  const diameterLabel = dimensions.diameter ? 
    `Ø${dimensions.diameter}${dimensions.unit}` :
    `Ø${dimensions.diameter_min}-${dimensions.diameter_max}${dimensions.unit}`;
  
  const heightLabel = dimensions.height ? 
    `${dimensions.height}${dimensions.unit}` :
    `${dimensions.height_min}-${dimensions.height_max}${dimensions.unit}`;
  
  // Create dimension lines
  const diameterDimension = createDimensionLine(
    batteryX, batteryY, 
    batteryX, batteryY + scaledDiameter,
    -40, diameterLabel, false
  );
  
  const heightDimension = createDimensionLine(
    batteryX, batteryY + scaledDiameter + 10,
    batteryX + scaledHeight, batteryY + scaledDiameter + 10,
    25, heightLabel, true
  );
  
  return `
    <!-- Battery body -->
    <rect x="${batteryX}" y="${batteryY}" 
          width="${scaledHeight}" height="${scaledDiameter}" 
          rx="2" ry="2" fill="none" stroke="#374151" stroke-width="2"/>
    
    <!-- Side view indication lines -->
    <line x1="${batteryX + 2}" y1="${batteryY}" 
          x2="${batteryX + 2}" y2="${batteryY + scaledDiameter}" 
          stroke="#6B7280" stroke-width="0.5" stroke-dasharray="2,2"/>
    <line x1="${batteryX + scaledHeight - 2}" y1="${batteryY}" 
          x2="${batteryX + scaledHeight - 2}" y2="${batteryY + scaledDiameter}" 
          stroke="#6B7280" stroke-width="0.5" stroke-dasharray="2,2"/>
    
    ${terminalElements}
    
    <!-- Dimensions -->
    ${diameterDimension}
    ${heightDimension}
    
    <!-- Battery type label -->
    <text x="${batteryX + scaledHeight/2}" y="${batteryY + scaledDiameter/2}" 
          text-anchor="middle" class="battery-label">${battery.type}</text>
  `;
}

/**
 * Generate SVG for rectangular battery schematic
 */
function generateRectangularSchematic(battery: BatterySpec, config: SchematicConfig): string {
  const { dimensions, terminals } = battery;
  const { width: svgWidth, height: svgHeight, padding } = config;
  
  const width = dimensions.width!;
  const height = dimensions.height!;
  const depth = dimensions.depth!;
  
  // Scale calculation
  const availableWidth = svgWidth - (padding * 3);
  const availableHeight = svgHeight - (padding * 3);
  const scale = Math.min(availableWidth / width, availableHeight / height) * 0.6;
  
  // Calculate scaled dimensions
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const scaledDepth = depth * scale;
  
  // Center the battery
  const batteryX = (svgWidth - scaledWidth) / 2;
  const batteryY = (svgHeight - scaledHeight) / 2;
  
  // Isometric depth offset for 3D effect
  const depthOffsetX = scaledDepth * 0.3;
  const depthOffsetY = scaledDepth * 0.2;
  
  // Terminal elements for 9V snap connectors
  let terminalElements = '';
  if (terminals?.type === 'snap connector') {
    // Terminal spacing from data
    const spacing = parseFloat(terminals.spacing?.replace('mm', '') || '12.7') * scale;
    const terminalY = batteryY - 8;
    
    // Center terminals on battery
    const centerX = batteryX + scaledWidth / 2;
    const pos1X = centerX - spacing / 2;
    const pos2X = centerX + spacing / 2;
    
    // Positive terminal (smaller)
    terminalElements += `
      <rect x="${pos1X - 3}" y="${terminalY}" width="6" height="8" 
            fill="none" stroke="#374151" stroke-width="1.5"/>
      <text x="${pos1X}" y="${terminalY - 8}" text-anchor="middle" class="terminal-label">+</text>
    `;
    
    // Negative terminal (larger)
    terminalElements += `
      <rect x="${pos2X - 4}" y="${terminalY}" width="8" height="8" 
            fill="none" stroke="#374151" stroke-width="1.5"/>
      <text x="${pos2X}" y="${terminalY - 8}" text-anchor="middle" class="terminal-label">-</text>
    `;
    
    // Terminal spacing dimension
    terminalElements += createDimensionLine(
      pos1X, terminalY - 25, pos2X, terminalY - 25, 0, 
      terminals.spacing || '12.7mm', true
    );
  }
  
  // Dimension labels
  const widthLabel = `${width}${dimensions.unit}`;
  const heightLabel = `${height}${dimensions.unit}`;
  const depthLabel = `${depth}${dimensions.unit}`;
  
  // Create dimension lines
  const widthDimension = createDimensionLine(
    batteryX, batteryY + scaledHeight + 10,
    batteryX + scaledWidth, batteryY + scaledHeight + 10,
    25, widthLabel, true
  );
  
  const heightDimension = createDimensionLine(
    batteryX, batteryY,
    batteryX, batteryY + scaledHeight,
    -40, heightLabel, false
  );
  
  const depthDimension = createDimensionLine(
    batteryX + scaledWidth + 10, batteryY + scaledHeight,
    batteryX + scaledWidth + 10, batteryY + scaledHeight - depthOffsetY,
    30, depthLabel, false
  );
  
  return `
    <!-- Battery 3D body -->
    <!-- Front face -->
    <rect x="${batteryX}" y="${batteryY}" 
          width="${scaledWidth}" height="${scaledHeight}" 
          fill="none" stroke="#374151" stroke-width="2"/>
    
    <!-- Top face (depth) -->
    <polygon points="${batteryX},${batteryY} ${batteryX + depthOffsetX},${batteryY - depthOffsetY} 
                     ${batteryX + scaledWidth + depthOffsetX},${batteryY - depthOffsetY} 
                     ${batteryX + scaledWidth},${batteryY}" 
             fill="none" stroke="#374151" stroke-width="1.5"/>
    
    <!-- Right face (depth) -->
    <polygon points="${batteryX + scaledWidth},${batteryY} 
                     ${batteryX + scaledWidth + depthOffsetX},${batteryY - depthOffsetY} 
                     ${batteryX + scaledWidth + depthOffsetX},${batteryY + scaledHeight - depthOffsetY} 
                     ${batteryX + scaledWidth},${batteryY + scaledHeight}" 
             fill="none" stroke="#374151" stroke-width="1.5"/>
    
    <!-- Hidden edges (dashed) -->
    <line x1="${batteryX}" y1="${batteryY + scaledHeight}" 
          x2="${batteryX + depthOffsetX}" y2="${batteryY + scaledHeight - depthOffsetY}" 
          stroke="#6B7280" stroke-width="1" stroke-dasharray="3,2"/>
    <line x1="${batteryX + depthOffsetX}" y1="${batteryY - depthOffsetY}" 
          x2="${batteryX + depthOffsetX}" y2="${batteryY + scaledHeight - depthOffsetY}" 
          stroke="#6B7280" stroke-width="1" stroke-dasharray="3,2"/>
    
    ${terminalElements}
    
    <!-- Dimensions -->
    ${widthDimension}
    ${heightDimension}
    ${depthDimension}
    
    <!-- Battery type label -->
    <text x="${batteryX + scaledWidth/2}" y="${batteryY + scaledHeight/2}" 
          text-anchor="middle" class="battery-label">${battery.type}</text>
  `;
}

interface DrawingBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Calculate the bounding box for cylindrical battery schematic
 */
function calculateCylindricalBounds(battery: BatterySpec, config: SchematicConfig): DrawingBounds {
  const { dimensions } = battery;
  const { width: svgWidth, height: svgHeight, padding } = config;
  
  const diameter = dimensions.diameter || 
    (dimensions.diameter_min && dimensions.diameter_max ? 
      (dimensions.diameter_min + dimensions.diameter_max) / 2 : 0);
  
  const height = dimensions.height || 
    (dimensions.height_min && dimensions.height_max ? 
      (dimensions.height_min + dimensions.height_max) / 2 : 0);
  
  if (!diameter || !height) {
    return { minX: 0, minY: 0, maxX: svgWidth, maxY: svgHeight };
  }
  
  const availableWidth = svgWidth - (padding * 3);
  const availableHeight = svgHeight - (padding * 3);
  const scale = Math.min(availableWidth / height, availableHeight / diameter) * 0.7;
  
  const scaledHeight = height * scale;
  const scaledDiameter = diameter * scale;
  
  const batteryX = (svgWidth - scaledHeight) / 2;
  const batteryY = (svgHeight - scaledDiameter) / 2;
  
  // Account for dimension lines extending beyond battery
  const minX = batteryX - 60; // Left dimension line
  const maxX = batteryX + scaledHeight + 20; // Right edge + margin
  const minY = batteryY - 20; // Top margin
  const maxY = batteryY + scaledDiameter + 50; // Bottom dimension line
  
  return { minX, minY, maxX, maxY };
}

/**
 * Calculate the bounding box for rectangular battery schematic
 */
function calculateRectangularBounds(battery: BatterySpec, config: SchematicConfig): DrawingBounds {
  const { dimensions, terminals } = battery;
  const { width: svgWidth, height: svgHeight, padding } = config;
  
  const width = dimensions.width!;
  const height = dimensions.height!;
  const depth = dimensions.depth!;
  
  const availableWidth = svgWidth - (padding * 3);
  const availableHeight = svgHeight - (padding * 3);
  const scale = Math.min(availableWidth / width, availableHeight / height) * 0.6;
  
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const scaledDepth = depth * scale;
  
  const batteryX = (svgWidth - scaledWidth) / 2;
  const batteryY = (svgHeight - scaledHeight) / 2;
  
  const depthOffsetX = scaledDepth * 0.3;
  const depthOffsetY = scaledDepth * 0.2;
  
  // Account for terminals, dimension lines, and 3D projection
  const terminalOffset = terminals?.type === 'snap connector' ? 40 : 0;
  
  const minX = batteryX - 60; // Left dimension line
  const maxX = batteryX + scaledWidth + depthOffsetX + 50; // Right dimension + 3D offset
  const minY = batteryY - depthOffsetY - terminalOffset; // Top with terminals/3D
  const maxY = batteryY + scaledHeight + 50; // Bottom dimension line
  
  return { minX, minY, maxX, maxY };
}

/**
 * Generate complete SVG schematic for a battery with dynamic viewBox
 */
export function generateBatterySchematic(battery: BatterySpec): string {
  const config: SchematicConfig = {
    width: 400,
    height: 300,
    padding: 40,
    strokeWidth: 2,
    fontSize: 12
  };
  
  const isRectangular = battery.dimensions.shape === 'rectangular' || 
                       (battery.dimensions.width && battery.dimensions.depth);
  
  // Calculate bounds first
  const bounds = isRectangular 
    ? calculateRectangularBounds(battery, config)
    : calculateCylindricalBounds(battery, config);
  
  // Add some padding to the bounds
  const boundsPadding = 10;
  const viewBoxX = Math.floor(bounds.minX - boundsPadding);
  const viewBoxY = Math.floor(bounds.minY - boundsPadding);
  const viewBoxWidth = Math.ceil(bounds.maxX - bounds.minX + (boundsPadding * 2));
  const viewBoxHeight = Math.ceil(bounds.maxY - bounds.minY + (boundsPadding * 2));
  
  const schematicContent = isRectangular 
    ? generateRectangularSchematic(battery, config)
    : generateCylindricalSchematic(battery, config);
  
  return `
    <svg viewBox="${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}" 
         xmlns="http://www.w3.org/2000/svg"
         class="battery-schematic">
      
      <style>
        .battery-schematic {
          width: 100%;
          height: auto;
          max-width: 400px;
        }
        
        .dimension-text {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          font-size: 10px;
          font-weight: 500;
          fill: #374151;
        }
        
        .battery-label {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 600;
          fill: #1F2937;
        }
        
        .terminal-label {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 600;
          fill: #374151;
        }
      </style>
      
      ${schematicContent}
    </svg>
  `;
}

/**
 * Type guard to check if battery data is sufficient for schematic generation
 */
export function canGenerateSchematic(battery: any): battery is BatterySpec {
  if (!battery.dimensions) return false;
  
  const dims = battery.dimensions;
  
  // Check for rectangular battery data
  if (dims.shape === 'rectangular' || (dims.width && dims.depth && dims.height)) {
    return true;
  }
  
  // Check for cylindrical battery data
  if ((dims.diameter || (dims.diameter_min && dims.diameter_max)) && 
      (dims.height || (dims.height_min && dims.height_max))) {
    return true;
  }
  
  return false;
}