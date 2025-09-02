# Claude Instructions for Batteries.Guide

## Project Overview

This is **batteries.guide** - a comprehensive, open-source database of objective battery specifications. The goal is to create the definitive reference for consumer battery data without opinions or recommendations, just facts.

**Key Principles:**
- **Objective data only** - No recommendations, just specs
- **Comprehensive coverage** - Traditional, Li-ion, button cells, everything  
- **Reliable sources** - IEC standards, manufacturer datasheets, industry references
- **Open source** - All data version-controlled and freely available
- **Open source** - Free for everyone to use and contribute

## Current Status (January 2025)

### ✅ What's Built
- **Foundation:** Astro + Tailwind 4 + TypeScript + Netlify deployment
- **Database:** **52 comprehensive battery types across 5 categories** (expanded from 17)
- **Individual Pages:** Detailed specs for every battery type
- **Search System:** Full-text search with optimized performance (bundle size optimized)
- **SEO Foundation:** Structured data, sitemap, social meta tags
- **Accessibility:** WCAG compliant with full keyboard navigation
- **Clean Code:** Well-structured TypeScript with proper types
- **Professional UI:** Consistent styling, error handling, 404 page, selective header casing
- **Data Quality:** **All battery specs updated with proper source attribution and trusted domain filtering**

### 🎯 Current State
- **Site is live** at batteries.guide
- **All core functionality** complete and polished
- **Technical debt eliminated** - proper TypeScript, accessibility, SEO
- **Ready for growth** - content expansion and community contributions

### 📋 Next Phase Priorities
1. **Add interactive tools** (size comparison, calculators, selection wizard)
2. **Create content** (selection guides, comparisons)
3. **Community contributions** (additional battery types, corrections)
4. **Enhanced search features** (filters, advanced functionality)

## Technical Architecture

### Data Structure
```
/data/
├── traditional/            # AA, AAA, AAAA, A, C, D, N, F, Sub-C, 9V, 6V, 12V-23A, A23, AA-Lithium, AAA-Lithium (15 types)
├── lithium-ion/            # 10440, 14430, 14500, 16340, 18350, 18500, 18650, 20700, 21700, 26650, 32650 (11 types)
├── button-cells/           # CR1220, CR1616, CR1632, CR2016, CR2025, CR2032, CR2430, CR2450, CR927, CR123A, CR2, LR41, LR44, LR1154, SR44, SR626SW, AG1, AG3 (18 types)
├── camera/                 # 2CR5, 4LR44, CR-P2, CR-V3 (4 types)
└── hearing-aid/            # 10, 13, 312, 675 (4 types)
```

Each JSON file contains:
- **Core specs:** voltage, capacity, dimensions, weight
- **Chemistry variants:** alkaline, lithium, NiMH, Li-ion, silver oxide
- **Operating specs:** temperature ranges, discharge rates
- **Usage info:** common devices, compatibility notes
- **Safety info:** handling notes, regulatory data
- **Source attribution:** manufacturer datasheets, IEC standards, access dates

### Tech Stack
- **Astro:** Static site generation with modern DX
- **Tailwind 4:** Utility-first CSS, blue/gray professional theme
- **TypeScript:** Type safety for data handling
- **JSON Database:** Simple, version-controlled, easily maintainable
- **Netlify:** Static hosting with build automation

## Data Standards & Sources

### Reference Hierarchy
1. **IEC Standards** (60086 series for primary batteries)
2. **ANSI Standards** (C18 series)
3. **Manufacturer Datasheets** (Energizer, Duracell, Panasonic, Samsung, LG, Sony)
4. **Industry References** (Battery University, technical catalogs)

### Data Quality Rules
- Always cite source and date of retrieval for battery specs in the JSON
- Cross-reference multiple sources when possible
- Include uncertainty ranges for variable specs
- Document any assumptions or calculations
- Flag deprecated or discontinued types (probably a "status" entry in the JSON or something similar)
- **Trusted domains only**: Sources must be from approved domains (manufacturers, standards orgs, established technical references, Wikipedia) - random blogs/docs are automatically filtered out

## Development Guidelines

### Adding New Batteries
1. Research specs from primary sources (manufacturer datasheets)
2. Follow existing JSON schema patterns
3. Include all relevant chemistry variants
4. Add common device usage examples
5. Include safety notes for hazardous types (Li-ion, button cells)

### Code Style
- Follow existing Astro/TypeScript patterns
- Use Tailwind utility classes, avoid custom CSS
- Keep components focused and reusable
- Maintain consistent data loading patterns

### Content Guidelines
- **Objective facts only** - no "best" or "recommended"
- Include dimensional tolerances when available  
- List multiple chemistry options with trade-offs
- Cross-reference compatibility (LR6 = AA)
- Note regional naming variations

## Content Philosophy

### Data Integrity
- **Manufacturer specs only** - No guesswork or approximations
- **Multiple sources** - Cross-reference when possible
- **Version control** - Track all data changes
- **Community verified** - Open to corrections with proper citations

### Educational Focus  
- Technical specifications without marketing speak
- Clear explanations of chemistry differences
- Dimensional tolerances for engineering use
- Temperature and performance characteristics

## Future Vision

### ✅ Phase 1: MVP Database (COMPLETE)
- **52 battery types documented** with comprehensive specs (expanded from 17)
- All core pages and functionality built
- Database covers all major consumer battery categories

### ✅ Phase 2: Pages + Search (COMPLETE) 
- Individual battery detail pages with rich specs
- Full-text search with performance optimization (bundle size reduced 60%+)
- Professional UI with selective header casing and accessibility
- IEC/ANSI code search support

### 🚧 Phase 3: Interactive Tools & Content (READY TO START)
- Battery size comparison tool
- Voltage/capacity calculators
- "What battery do I need?" wizard
- Selection guides and educational content

### Phase 4: Community & Growth
- Community contributions + data validation
- Enhanced search features
- International expansion

**Success Metrics Progress:**
- ✅ **Technical Foundation:** Complete and professional-grade
- 🎯 **Traffic Goal:** 1k monthly visitors by month 3
- ✅ **Database Goal:** 50+ battery types (**52 achieved!** - exceeded target)
- 🌟 **Community Goal:** Active contributors and data validators

## Development Commands

```bash
npm run dev                      # Local development (port 4321)
npm run build                    # Production build
npm run preview                  # Test production build locally
```

## Full Autonomy for Data Quality & Analysis Tasks

### Approved Commands (No Permission Needed)
When working on data analysis, quality fixes, or technical research tasks, you have full permission to use:

- **File operations**: `find`, `grep`, `cat`, `head`, `tail`, `ls`, `tree`
- **Analysis commands**: `wc`, `sort`, `uniq`, `awk`, `sed`  
- **Data verification**: `jq`, `json_pp`, checking file formats
- **Search operations**: Any read-only search across the codebase
- **Web research**: WebFetch, WebSearch for finding proper sources/references
- **Batch file edits**: MultiEdit for systematic data fixes

### Autonomous Mission Protocol
For data quality missions (like "fix all battery sources"):
1. **Just do it** - scan, analyze, research, and fix systematically
2. **Use TodoWrite** to track progress but don't wait for approval
3. **Batch similar changes** for efficiency 
4. **Web research autonomously** - find proper manufacturer datasheets, Wikipedia, technical references
5. **Verify comprehensively** at the end
6. **Only ask for guidance** if you find something genuinely ambiguous

### Acceptable Sources (Pre-approved)
- Manufacturer sites: Energizer, Duracell, Panasonic, Samsung, LG, Sony
- Standards orgs: IEC, ANSI 
- Technical references: Battery University, Wikipedia
- Distributors: Digikey, Mouser, Farnell, BatteryEquivalents.com
- Specialty retailers: 18650batterystore.com, BatteryJunction

### Still Ask Permission For
- Deleting files or major structural changes
- Installing new dependencies  
- Modifying build configuration
- Making commits (you never commit, I always do that)

## Notes for Future Claude

This project scratches a real itch - battery selection is genuinely painful and there's no good consolidated resource. The user is a battery enthusiast who knows the domain well, so trust their technical guidance on specs and sources.

**The technical foundation is bulletproof** - all core functionality, SEO, and accessibility is complete and professional-grade. The site is ready for community contributions.

**Focus areas for expansion:**
1. **Content growth** - Add more battery types (need proper source citations)
2. **Community engagement** - Encourage contributions and corrections
3. **Interactive features** - Size comparison tools, calculators, guides
4. **SEO content** - Selection guides, "what battery for X device" content

**Key insight:** This isn't trying to be Battery University (educational) or review site (opinions). It's a pure specs database - the Wikipedia of battery data. The JSON-first approach scales well and the structured data makes it discoverable.

**Current state:** Production-ready technical foundation with **52 comprehensive battery types** across 5 categories (expanded from 17). All data updated with proper source attribution. Database goal exceeded - ready for interactive tools and content creation phase.