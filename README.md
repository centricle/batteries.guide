# batteries.fyi

A comprehensive, open-source database of battery specifications for all consumer battery types.

https://batteries.fyi

## Features

- **Complete Specs**: Voltage, capacity, dimensions, weight, temperature ranges
- **Multiple Chemistries**: Alkaline, lithium, NiMH, lithium-ion, and more
- **All Form Factors**: From AA/AAA to 18650 to button cells
- **Device Compatibility**: Lists common devices that use each battery type
- **Search & Browse**: Find batteries by type, chemistry, or use case
- **Individual Battery Pages**: Detailed specifications for each battery type
- **SEO Optimized**: Structured data and sitemap for search engines
- **Accessibility**: WCAG compliant with screen reader support
- **Mobile Responsive**: Built with Tailwind CSS for all screen sizes

## Tech Stack

- **Astro** - Static site generator with modern tooling
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript** - Type safety and better DX
- **Netlify** - Static hosting and deployment
- **JSON Data** - Simple, version-controlled battery database

## Project Structure

```
/
├── data/                               # Battery specification JSON files
│   ├── traditional/                    # AA, AAA, AAAA, A, C, D, N, F, Sub-C, 9V, 6V, 12V-23A, A23, AA-Lithium, AAA-Lithium (15 types)
│   ├── lithium-ion/                    # 10440, 14430, 14500, 16340, 18350, 18500, 18650, 20700, 21700, 26650, 32650 (11 types)
│   ├── button-cells/                   # CR1220, CR1616, CR1632, CR2016, CR2025, CR2032, CR2430, CR2450, CR927, CR123A, CR2, LR41, LR44, LR1154, SR44, SR626SW, AG1, AG3 (18 types)
│   ├── camera/                         # 2CR5, 4LR44, CR-P2, CR-V3 (4 types)
│   └── hearing-aid/                    # 10, 13, 312, 675 (4 types)
├── src/
│   ├── components/                     # Reusable Astro components
│   │   ├── BatteryCard.astro
│   │   └── BatterySchema.astro         # SEO structured data
│   ├── layouts/                        # Page layouts
│   ├── pages/                          # Static pages and routing
│   │   ├── [category]/[battery].astro  # Dynamic battery pages
│   │   ├── sitemap.xml.js              # Auto-generated sitemap
│   │   └── 404.astro                   # Error page
│   ├── styles/                         # Global CSS
│   └── utils/                          # Helper functions & TypeScript types
└── public/                             # Static assets
```

## Development

```bash
npm install
npm run dev
```

Server runs on http://localhost:4321/ by default. If port 4321 is in use:

```bash
npm run dev -- --port 5000
```

## Deployment

Automatically deploys to Netlify when pushed to main branch.

```bash
npm run build
```

## Current Database

**52 battery types documented** across 5 categories:
- **Traditional (15)**: AA, AAA, AAAA, A, C, D, N, F, Sub-C, 9V, 6V, 12V-23A, A23, AA-Lithium, AAA-Lithium (alkaline, lithium, NiMH, NiCd variants)
- **Lithium-ion (11)**: 10440, 14430, 14500, 16340, 18350, 18500, 18650, 20700, 21700, 26650, 32650 (various manufacturers)
- **Button Cells (18)**: CR1220, CR1616, CR1632, CR2016, CR2025, CR2032, CR2430, CR2450, CR927, CR123A, CR2, LR41, LR44, LR1154, SR44, SR626SW, AG1, AG3 (lithium, alkaline, silver oxide)
- **Camera (4)**: 2CR5, 4LR44, CR-P2, CR-V3 (lithium and alkaline camera batteries)
- **Hearing Aid (4)**: 10, 13, 312, 675 (zinc-air chemistry with color-coding)

## Contributing

This project aims to be a comprehensive, objective database of battery specifications. Contributions welcome for:

- Additional battery types and specifications
- Corrections to existing data (with proper source citations)
- New features and improvements
- Documentation updates

All data must be sourced from manufacturer datasheets or industry standards.

## Data Sources & Quality

All data is sourced from manufacturer specifications and industry standards including:
- IEC 60086 series (primary batteries)
- ANSI C18 series
- Manufacturer datasheets (Energizer, Duracell, Panasonic, Samsung, LG, Sony)
- Industry reference materials

**Trusted Sources Policy**: Only sources from verified domains are displayed on battery pages to maintain data quality and credibility. This includes manufacturer websites, standards organizations, established technical references (Battery University), trusted retailers (Digikey, Mouser), and Wikipedia. Random blogs, Google Docs, and unverified sources are automatically filtered out.

## License

MIT License - feel free to use this data for any purpose.
