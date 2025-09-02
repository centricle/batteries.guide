// Trusted domains for battery data sources
export const TRUSTED_DOMAINS = [
  // Manufacturer datasheets and official sites
  'data.energizer.com',
  'www.energizer.com',
  'energizer.com',
  'www.duracell.com',
  'duracell.com',
  'panasonic.com',
  'www.panasonic.com',
  'samsung.com',
  'www.samsung.com',
  'lg.com',
  'www.lg.com',
  'sony.com',
  'www.sony.com',
  'maxell.com',
  'www.maxell.com',
  'varta-consumer.com',
  'www.varta-consumer.com',
  'rayovac.com',
  'www.rayovac.com',
  
  // Standards organizations
  'iec.ch',
  'www.iec.ch',
  'ansi.org',
  'www.ansi.org',
  
  // Established technical references
  'batteryuniversity.com',
  'www.batteryuniversity.com',
  'batteryequivalents.com',
  'www.batteryequivalents.com',
  
  // Wikipedia (crowd-sourced but established)
  'en.wikipedia.org',
  'wikipedia.org',
  
  // Established retailers with technical info
  '18650batterystore.com',
  'www.18650batterystore.com',
  'batteryjunction.com',
  'www.batteryjunction.com',
  'digikey.com',
  'www.digikey.com',
  'mouser.com',
  'www.mouser.com',
  'farnell.com',
  'www.farnell.com',
];

/**
 * Check if a URL is from a trusted domain
 */
export function isTrustedSource(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    return TRUSTED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

/**
 * Filter sources to only include trusted domains
 */
export function filterTrustedSources(sources: Array<{ url?: string; [key: string]: any }>): Array<{ url?: string; [key: string]: any }> {
  return sources.filter(source => 
    source.url && isTrustedSource(source.url)
  );
}