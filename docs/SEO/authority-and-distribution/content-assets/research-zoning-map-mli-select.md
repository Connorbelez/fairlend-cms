# Research: interactive zoning/development map and CMHC MLI Select calculator

Research date: **July 14, 2026**. Primary/official sources only.

## Executive recommendation

Build both products, but give them deliberately different trust models:

1. **Toronto Development Potential & Planning Context Explorer** — an address-first parcel map that assembles zoning, overlays, Official Plan context, development activity, and gentle-density screening signals into a dated research report. It must never claim that a project is "permitted," "zoning-compliant," or "feasible." Its job is to identify evidence, constraints, and the next questions worth paying a planner, architect, engineer, surveyor, or City reviewer to answer.
2. **CMHC MLI Select Scenario Calculator** — a rules-versioned calculator that produces category subtotals, total points, the applicable incentive tier, the gap to the next tier, and the evidence a lender/CMHC will require. It should say "estimated score under the rules reviewed on [date]," not "approved" or "eligible."

These should not be thin lead-generation widgets. The link-worthy version exposes sources, assumptions, calculation details, permanent scenario URLs, printable reports, normalized datasets, a methodology page, and a visible change log.

---

## Product 1: Toronto/GTA zoning and development-feasibility map

### The user need

A borrower, developer, broker, realtor, architect, or homeowner should be able to enter an address and answer:

- What zoning and overlays are mapped here?
- Is the parcel governed by Toronto Zoning By-law 569-2013 or a former municipal by-law?
- Which linked by-law chapters, exceptions, holding symbols, policies, or unconsolidated amendments require attention?
- What is the preliminary case for investigating a multiplex, garden suite, laneway suite, secondary suite/additional residential unit, or small rental project?
- What physical, planning, heritage, environmental, code, access, or servicing issues could defeat the concept?
- What comparable projects or permits exist nearby?
- What should the user verify next, and with whom?

The useful product name is closer to **"Development Potential & Planning Context Explorer"** than "Zoning Feasibility Calculator." The former describes an evidence-gathering product; the latter implies a legal or professional conclusion that the available data cannot support.

### Official Toronto data stack

#### 1. Zoning geometry and linked regulations

- Toronto's [Zoning By-law open dataset](https://open.toronto.ca/dataset/zoning-by-law/) supplies zoning-area geometry and policy, road, height, lot-coverage, parking, rooming-house/multi-tenant, building-setback, priority-retail and other overlays in GeoJSON, GeoPackage, CSV, and shapefile formats. Its own limitation is crucial: the spatial file must be read with the by-law text, and mapped data without the text is meaningless.
- The City's queryable [City Planning ArcGIS MapServer](https://gis.toronto.ca/arcgis/rest/services/cot_geospatial11/MapServer) supports JSON, GeoJSON, and PBF. Relevant layers currently include Zoning Area/Label, former-municipality by-laws, height and lot-coverage overlays, areas not governed by 569-2013, property summary, Secondary Plans, Site and Area Specific Policies, heritage, parking, multi-tenant house, Major Transit Station Areas, and other planning layers.
- Toronto's [official 569-2013 page and interactive-map disclaimer](https://www.toronto.ca/city-government/planning-development/zoning-by-law-preliminary-zoning-reviews/zoning-by-law-569-2013-2/) says the interactive map and office consolidation are for convenience, may not reflect all Council or Ontario Land Tribunal amendments, and must not replace the certified originals held by the City Clerk. It also identifies significant amendments not yet in the office consolidation. Grey properties are subject to former municipal zoning by-laws.
- The by-law itself explains that zone labels may include site-specific exceptions, holding symbols, and multiple zones; overlay maps may alter, add, or remove regulations. See the City's ["How to Read this By-law" provisions](https://www.toronto.ca/zoning/bylaw_amendments/ZBL_NewProvision_Chapter1_20.htm).

**Implementation implication:** ingest the downloadable open dataset for stable spatial queries and snapshots, but link every result back to the live City page/ArcGIS layer and exact applicable by-law text. Store both `source_effective_date` and `retrieved_at`. A nightly check should flag changed resource IDs, schemas, map-service layers, and amendments.

#### 2. Address lookup, parcels, and building geometry

- The [Toronto One Address Repository](https://open.toronto.ca/dataset/address-points-municipal-toronto-one-address-repository/) provides point geometry for more than 500,000 municipal addresses and is refreshed daily. It includes street components, address type, feature class, and coordinates. It can power a local, authoritative autocomplete and address-to-point lookup without dependence on a commercial geocoder.
- [Property Boundaries](https://open.toronto.ca/dataset/property-boundaries/) are refreshed daily and can associate an address/point with a mapped parcel. The City explicitly says the boundaries were assembled from records of varying age and reliability, are suitable only for general planning, and are **not a substitute for a plan of survey**. Object identifiers are not guaranteed to remain stable between updates.
- [Topographic Mapping — Building Outlines](https://open.toronto.ca/dataset/topographic-mapping-building-outlines/) provides roof/building polygons derived from aerial imagery. The City states approximately ±30 cm ground accuracy, incomplete capture around shadows/tall buildings, delayed changes, and no use as a legal survey. It is suitable for visualization and preliminary geometry analysis only.

**Implementation implication:** generate an internal durable parcel key from geometry/address matching rather than relying solely on a City `OBJECTID`. Display mapped lot width/depth/area and building footprint only as estimates. A user-supplied survey should override map-derived dimensions in any advanced analysis.

#### 3. Official Plan, policy, transit, heritage, and environmental context

- The [Toronto Official Plan maps](https://www.toronto.ca/city-government/planning-development/official-plan-guidelines/official-plan/official-plan-maps-copy/) and planning MapServer support designation and policy-context layers. A zone label alone does not describe every land-use control.
- The ArcGIS service exposes [Major Transit Station Area and Protected MTSA geometry](https://gis.toronto.ca/arcgis/rest/services/cot_geospatial11/FeatureServer/65), while the City publishes the governing [MTSA/PMTSA Official Plan context](https://www.toronto.ca/city-government/planning-development/official-plan-guidelines/official-plan/official-plan-chapter-8-major-transit-station-areas-protected-major-transit-station-areas/).
- The [Heritage Register open dataset](https://open.toronto.ca/dataset/heritage-register/) can flag listed/designated properties and districts. The City says it is not intended for legal purposes without the Council decisions and by-laws, and offers a formal status-confirmation letter.
- The [Ravine and Natural Feature Protection dataset](https://open.toronto.ca/dataset/ravine-natural-feature-protection-area/) can flag possible Chapter 658 constraints, but its stated currency is May 2018 and its expected refresh cycle is 10–20 years. A map match must therefore be labelled a dated screening signal, not clearance.
- Building review also considers "applicable law" beyond zoning. Toronto's [plan review process](https://www.toronto.ca/services-payments/building-construction/building-permit/after-you-apply-for-a-building-permit/plan-review-process/) identifies the Conservation Authorities Act, Planning Act, Environmental Protection Act, and Ontario Heritage Act among the controls a zoning examiner may review.

**Additional layers worth adding:** conservation-authority regulated areas, flood/valley hazards, tree-protection/ravine areas, heritage districts and properties, airport/rail/pipeline constraints, Official Plan designations, Secondary Plans, SASPs, MTSAs/PMTSAs, major streets, parking areas, and active amendment/appeal flags. Each layer needs a source date and its own caveat.

#### 4. Development applications, permits, and comparables

- Toronto's [Application Information Centre](https://www.toronto.ca/city-government/planning-development/application-information-centre/) is the official address/radius search for planning applications, Committee of Adjustment matters, and supporting material. This should be deep-linked rather than scraped into an implied approval database unless the City's terms and fields are verified.
- [Active building permits](https://open.toronto.ca/dataset/building-permits-active-permits/) and [cleared building permits](https://open.toronto.ca/dataset/building-permits-cleared-permits/) are refreshed daily. Both can join through address/GeoID, but pre-October 1999 records may be incomplete.
- The [Development Pipeline](https://open.toronto.ca/dataset/development-pipeline/) is refreshed quarterly on a best-effort basis and supports market/neighbourhood trend analysis. The source currently notes that coordinates are still being added and that records may need address geocoding.

Permits are evidence of activity, not proof that another parcel qualifies. Comparable records should be called **"nearby examples"** and should show application status, date, source, and relevant differences.

### Typology-specific screening

#### Multiplexes

Toronto's current [Multiplex Housing page](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/multiplex-housing/) says amendments enabling up to six units in Toronto & East York and Ward 23 are in force. The City's [569-2013 update page](https://www.toronto.ca/city-government/planning-development/zoning-by-law-preliminary-zoning-reviews/zoning-by-law-569-2013-2/) warns that important multiplex amendments are not yet in the office consolidation. A rules engine therefore cannot safely infer unit count from the stale consolidated zone layer alone.

Useful screen output:

- governing zoning regime and zone category;
- mapped residential building-type context;
- whether four-, five-, or six-unit amendments potentially apply by geography/building type;
- zone label, exception and holding-symbol links;
- mapped height, coverage, policy-road and parking overlays;
- estimated lot/building dimensions with survey caveat;
- possible Official Plan, heritage, ravine, MTSA, Secondary Plan, or SASP context;
- nearby multiplex permits/applications; and
- explicit "verify current amendments and full performance standards" tasks.

#### Garden suites

Toronto says garden suites are permitted on properties in most residential zones, not all, and notes that Ontario Regulation 462/24 changed several zoning interactions. See the City's [Garden Suites page](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/garden-suites/) and [EHON/ARU implementation guidance](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/expanding-housing-options/). The latter says O. Reg. 462/24 and the zoning by-law must be read together, explains that the regulation generally applies only where the result is no more than three units on the lot, and identifies interactions involving separation, angular planes, and lot coverage.

Useful screen output:

- residential-zone/garden-suite regulatory path;
- number of existing/proposed units because the provincial rule changes above three units;
- estimated rear-yard depth/area, existing accessory structures, and building footprint;
- estimated principal-building separation and access route;
- tree/ravine/heritage flags;
- pre-approved-plan candidates; and
- a required professional/City verification checklist.

The map cannot see title restrictions, easements, exact trees/root zones, grading, services, accurate building dimensions, interior unit count, or all applicable law.

#### Laneway suites

Toronto's [Changing Lanes history](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/changing-lanes-laneway-suites-in-toronto/) records city-wide permissions in R, RD, RS, RT and RM zones, subject to the by-law. [Section 150.8](https://www.toronto.ca/zoning/bylaw_amendments/ZBL_NewProvision_Chapter150_8.htm) contains the actual use-specific rules. Toronto's [permit guide](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-permit-application-guides/renovation-and-new-house-guides/new-laneway-suite/) also makes clear that tree protection, principal access, fire access, drawings, and Building Code requirements matter.

Useful screen output:

- mapped lane adjacency and rear/side-lot-line relationship;
- estimated lane frontage and emergency-access travel route;
- existing rear structure/garage footprint;
- estimated separation, coverage, height-overlay and lot geometry;
- trees, ravine, heritage, and other constraint flags;
- nearby laneway-suite permits; and
- direct links to Section 150.8 and the permit/fire-access guidance.

Lane geometry and network routing are screening proxies only. The actual fire-access path, clearance, construction, property rights, and code compliance require plan/survey review.

#### Secondary suites and other ARUs

Toronto states that a secondary suite is generally permitted in a detached house, semi-detached house, or townhouse in residential zones, subject to Section 150.10; see the City's [secondary-suite overview](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/secondary-suites/overview-secondary-suites/). The [EHON/ARU page](https://www.toronto.ca/city-government/planning-development/planning-studies-initiatives/expanding-housing-options/) explains the provincial scenarios and the three-unit ceiling for O. Reg. 462/24.

The public map cannot observe a building's lawful interior use, fire separations, exits, ceiling heights, servicing, or prior unclosed work. Treat "potential ARU path" as a checklist generator, not a result.

### What the product must never represent

Do **not** output any of the following as a definitive statement:

- "You can build a fourplex/sixplex/garden suite/laneway suite here."
- "This property is zoning compliant."
- "No variance, rezoning, heritage approval, conservation approval, or other permit is required."
- "The lot is X metres wide/deep" unless explicitly labelled a map-derived estimate; only a legal survey can establish it.
- "The parcel is not subject to an appeal, site-specific amendment, former by-law, easement, covenant, title issue, applicable law, or pending change."
- "This concept meets fire access, Building Code, tree, grading, servicing, stormwater, parking, or structural requirements."
- "The project is financially feasible" without a complete cost, revenue, timing, tax, financing, and professional review.
- "This nearby permit is a precedent" or guarantees equivalent approval.

Use a three-state vocabulary instead:

- **Potential signal found** — official mapped data indicates a criterion worth investigating.
- **Constraint/exception found** — an official source identifies an issue that needs interpretation.
- **Not determinable from available data** — professional documents or City confirmation are required.

Every result should carry: retrieval timestamp, source effective date where available, data/licence attribution, direct official links, assumptions, unresolved items, and a persistent banner that it is general information rather than planning, legal, architectural, engineering, surveying, appraisal, or lending advice.

For formal review, direct Toronto users to the City's [Zoning Applicable Law Certificate](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/preliminary-zoning-reviews-information/apply-for-a-zoning-review/zoning-applicable-law-certificate/), which is the preliminary review of dimensioned plans for zoning and applicable-law compliance. A [Property Information Report](https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/preliminary-zoning-reviews-information/property-information-reports/) can report permits, inspections, outstanding orders, and a zoning designation, but does not outline permitted use.

### Licence and attribution

The [Open Government Licence — Toronto](https://open.toronto.ca/open-data-licence/) permits worldwide, royalty-free, commercial copying, modification, publication, adaptation, and distribution. FairLend must acknowledge the source and, absent a dataset-specific statement, use: **"Contains information licensed under the Open Government Licence – Toronto."**

The licence also:

- excludes personal information, third-party rights, and official crests/logos;
- prohibits implying official status or City endorsement;
- supplies information "as is" with no warranty; and
- says the licence version in force when the information was accessed governs that use.

Keep an access log/snapshot of the applicable licence and dataset metadata. Review terms separately for municipal map services and any third-party basemap, parcel, conservation-authority, MPAC/Teranet, postal-code, or aerial-imagery products. Public ArcGIS visibility does not by itself establish an open-data licence.

### MVP scope

**Toronto-only is the correct MVP.** It has the strongest official queryable stack and already presents enough freshness complexity to require disciplined provenance.

1. Address autocomplete from Toronto One Address Repository.
2. Address-to-parcel lookup with parcel and building-outline visualization.
3. Zone label/category and exact by-law links.
4. Essential zoning layers: 569-2013 inclusion/former-by-law flag, exceptions/holding signals, height, lot coverage, policy area/road, parking, and multi-tenant overlay where relevant.
5. Essential policy/constraint layers: Official Plan designation, Secondary Plan/SASP, heritage, ravine, and MTSA/PMTSA.
6. Typology tabs for multiplex, garden suite, laneway suite, and secondary suite/ARU. Each is a deterministic checklist of mapped facts, unknowns, and official sources—not a binary eligibility result.
7. Nearby active/cleared permits classified conservatively from permit type and work description, with links and status/date.
8. Shareable canonical parcel URL and downloadable one-page "Planning Context Snapshot" carrying source versions and assumptions.
9. Public methodology, data dictionary, update-status dashboard, corrections form, and source change log.
10. Analytics/events to learn which addresses, typologies, unknowns, and financing questions users most often explore.

### Advanced scope

- Municipality adapters for Mississauga, Brampton, Vaughan, Markham, Richmond Hill, then the rest of the GTA; each adapter owns its rules, source licence, appeal status, effective dates, and disclaimer.
- A versioned rule graph that links zone components and overlays to exact by-law sections and exceptions.
- User-uploaded survey parsing; use verified dimensions in place of estimated parcel geometry.
- Configurable concept inputs: unit count, existing/proposed building type, storeys, footprint, setbacks, gross floor area, parking, and use.
- 2D/3D preliminary development envelope, with every calculated plane/dimension traceable to a specific versioned rule.
- Garden/laneway pre-approved-plan fit screen using user-confirmed survey and access dimensions.
- Network-based emergency-access pre-screen and lane adjacency, clearly marked as unverified.
- "Why this is unknown" explanations and a document request list for survey, title/easements, arborist, servicing, zoning examiner, and code consultant.
- Permit/application comparable explorer with filters, timelines, status, typology, and distance.
- Scenario comparison and sensitivity analysis: current condition vs. concept A/B; unit yield; planning path; high-level cost/revenue/financing assumptions.
- Save/share collaboration for owner, broker, planner, architect, lender, and estimator.
- Public aggregate API and embeddable map cards for journalists, planners, housing researchers, realtors, and neighbourhood publications.
- Automated source monitoring with a visible "rules changed since this report" warning.

### GTA expansion architecture and official starting points

Do not market a uniform "GTA zoning engine." Zoning is municipal, rule structures differ, consolidation and appeal status differ, and data licences differ. Build a common result schema over municipality-specific adapters.

- **Mississauga:** the official [Zoning By-law page](https://www.mississauga.ca/services-and-programs/building-and-renovating/zoning-information/zoning-by-law/) provides interactive lookup, text/maps, update dates, and an explicit warning that the interactive/PDF consolidation may omit Council or OLT amendments. Start from the City's [data and maps hub](https://www.mississauga.ca/our-organization/data-and-maps/) and verify the licence on each consumed resource.
- **Brampton:** the official [zoning MapServer](https://mapsdev.brampton.ca/arcgis/rest/services/COB/Zoning_New/MapServer) exposes zoning, split zones, interim-control by-laws, temporary-use by-laws, parcel fabric, and address lookup in queryable formats. Use the City's [current/draft zoning page](https://www1.brampton.ca/EN/City-Hall/Zoning-By-law-Review/Pages/zoning-by-laws.aspx) to distinguish law in force from proposed schedules.
- **Vaughan:** use the City's [Comprehensive Zoning By-law 001-2021 page](https://www.vaughan.ca/residential/building-and-construction/vaughans-planning-process/citys-comprehensive-zoning-by-law-001-2021) for in-force/appeal context and the official [Vaughan Zoning MapServer](https://maps.vaughan.ca/arcgis/rest/services/VaughanZoning/VaughanZoning/MapServer) only after verifying applicable terms. Vaughan warns that certain lands, areas, and sections remain under appeal.
- **Markham:** the City's [Comprehensive Zoning By-law 2024-19 page](https://www.markham.ca/about-city-markham/city-hall/city-projects-initiatives/completed-projects-major-city-projects/comprehensive-zoning-law-2024-19) and [Committee of Adjustment page](https://www.markham.ca/economic-development-business/planning-development-services/committee-adjustment) identify remaining site-specific appeals/grey areas. Some properties therefore remain outside the new by-law.
- **Richmond Hill:** begin with the City's [Zone Richmond Hill](https://www.richmondhill.ca/en/zone-richmond-hill.aspx) project and interactive by-law/overlay material, validating source terms and in-force status before integration.

Minimum adapter contract: municipality; source URLs; licence; retrieved/effective dates; governing by-law(s); current-consolidation date; unconsolidated amendments; appeals/grey-area semantics; zoning geometry; zone label components; exceptions; Official Plan/policy layers; heritage/environmental layers; parcel/address source; formal-verification path; and municipality-specific disclaimer.

### Companion assets that make the map citeable and link-worthy

#### Public datasets and recurring reports

- **Toronto Gentle Density Permit Dataset:** normalized, reproducible monthly extract of multiplex, laneway-suite, garden-suite, and secondary-suite permits from active/cleared datasets; include classification rules, confidence, raw source keys, and revisions.
- **State of Gentle Density in Toronto:** annual report with applications/permits, completion trends, neighbourhood distribution, unit counts where available, median processing intervals, and mapped concentration.
- **Garden vs. Laneway Suite Uptake Tracker:** monthly charts and map by neighbourhood/ward.
- **Multiplex Monitoring Dashboard:** two- through six-unit permit/application trends, geography, lot characteristics, outcomes, and amendment dates.
- **Planning Context Coverage Matrix:** percentage/count of parcels in 569-2013, former by-laws, heritage, ravine, MTSAs, Secondary Plans, SASPs, and major overlays.
- **Development Activity Index:** transparent neighbourhood-level index using permits, planning applications, pipeline, and unit changes—not a parcel-value or approval prediction.
- **Zoning Change Log Dataset:** machine-readable list of Toronto city-wide amendments, effective/adoption/appeal/consolidation status, affected typologies, and official links.
- **GTA Zoning Data Availability Index:** municipality-by-municipality table of interactive map, downloadable GIS, query API, parcel/address availability, licence, last update, appeal/consolidation caveats, and formal verification service.

#### Original charts and analysis

- Permits by typology and month/year.
- Applications-to-issued-to-closed funnel by typology.
- Median/percentile time from application to issue and issue to close, with data-quality notes.
- Ward/neighbourhood permit rates per 1,000 low-rise parcels.
- Distribution of mapped lot sizes/building footprints for completed garden/laneway/multiplex examples.
- Permit activity before/after key by-law amendments, with a clear non-causal methodology.
- Distance-to-transit distribution for gentle-density permits.
- Share of permits inside MTSAs, heritage areas, former-by-law areas, and ravine-protection areas.
- Common permit work-description terms and unit-change patterns.
- "Mapped potential vs. actual uptake" at aggregate geography, using a published rules version and avoiding parcel-level certainty.

#### Evergreen guides and reference pages

- How to read a Toronto zoning label, exception, holding symbol, and overlay.
- Why the interactive zoning map is not a legal zoning opinion.
- 569-2013 vs. former municipal zoning by-laws and what a grey parcel means.
- Multiplex rules timeline: fourplex, Ward 23/sixplex, Toronto & East York, monitoring amendments, and consolidation lag.
- Garden suite vs. laneway suite vs. secondary suite vs. multiplex: definitions, decision tree, and official links.
- Ontario Regulation 462/24 explained for Toronto ARUs, with dated examples and non-application above three units.
- Survey vs. mapped parcel boundary: why geometry differs and when a survey is indispensable.
- Zoning Applicable Law Certificate, Committee of Adjustment, building permit, and planning application: which process answers which question.
- Fire access, trees, heritage, ravines, servicing, parking, and applicable law: the constraints a zone map cannot resolve.
- How to research comparable permits without treating them as precedent.
- Data dictionary and reproducible methodology for every derived field and classification.

#### Utility extensions

- Address-based lot-coverage/setback worksheet accepting survey dimensions.
- Garden/laneway access-distance pre-screen.
- Preliminary building-envelope and unit-yield scenario tool.
- Development-charge/permit-fee estimator with dated municipal schedules.
- Small-project financing readiness checklist that hands a saved scenario into FairLend's financing workflow.
- Permanent, embeddable parcel-summary cards and chart images with citation text.

---

## Product 2: CMHC MLI Select points calculator

### Current official scoring rules

The authoritative live source is CMHC's [MLI Select product page](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect). The current [MLI Select fact sheet](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select.pdf) is marked ©2025/document `66792 20251029-008A` and expressly says the information can change at any time and should be verified with CMHC before a loan is processed.

A minimum **50 total points** is required for MLI Select. A project may combine affordability, energy-efficiency, and accessibility commitments.

#### Affordability points

Affordability uses rent at or below **30% of the applicable market's median renter income** and a minimum ten-year commitment. CMHC supplies the official [median renter income workbook](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/median-income-before-tax-renter-total-en.xlsx?rev=fb624798-337e-42c6-8acd-aeb06f31f206). If data is unavailable for a market, CMHC says it may accept a comparable centre, provincial data, or comparable rural centre; that is a judgment for CMHC/lender review, not an automatic calculator fallback.

| Project | 50 points | 70 points | 100 points |
|---|---:|---:|---:|
| New construction | At least 10% of units | At least 15% | At least 25% |
| Existing property | At least 40% of units | At least 60% | At least 80% |

All qualifying units must be at the maximum affordable rent threshold. A commitment of **20 years or more adds 30 points**. The product page says affordability is maintained for at least ten years, with annual base-rent increases constrained by applicable legislation/regulation or CMHC's applicable CPI approach where none applies.

Calculator treatment:

- use the CMHC workbook as versioned source data;
- show the selected market, annual median renter income, derived/displayed monthly threshold, source vintage, and workbook link;
- ask total residential units and qualifying affordable units, then show both count and percentage;
- require a user confirmation that proposed rents do not exceed the displayed threshold;
- allow "market not listed" but return **manual CMHC determination required**, not a guessed score; and
- add 30 points only when the affordability category earns points and the commitment is 20+ years.

#### Energy-efficiency points

| Project | 20 points | 35 points | 50 points |
|---|---:|---:|---:|
| New construction — 2020 NECB Tier 1 reference | ≥25% better | ≥50% better | ≥60% better |
| New construction — 2020 NBC Tier 1 reference | ≥20% better | ≥40% better | ≥70% better |
| Existing property — reduction over current baseline | ≥15% | ≥25% | ≥40% |

For existing properties, CMHC's product and documentation material refers to both energy consumption and greenhouse-gas reductions. The conservative calculator rule should score the tier achieved by **both** metrics (effectively the lower qualifying result), and expose each entered value. For new construction, the user must select the applicable national reference route; CMHC says it does not accept modelling against local codes as a substitute.

The [MLI Select Required Documentation Guide](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select-required-document-en.pdf?rev=9ae87665-d723-4a2e-9d41-878d139d0d99) also lists accepted professional/modelling requirements and recognized certification paths. An advanced calculator can support those official certification alternatives, but must version them because accepted organizations, versions, and equivalencies can change.

#### Accessibility points

Accessibility has a prerequisite at every level: **all units must be 100% visitable and all common areas barrier-free under CSA B651:23**.

**20 points — any one of:**

- at least 15% of units accessible under CSA B651:23;
- at least 15% of units using universal design; or
- Rick Hansen Foundation Accessibility Certification v4.0 score of 60%–79%.

**30 points — any one of:**

- at least 15% CSA-accessible units **and** at least 85% universal-design units;
- 100% universal-design units;
- 100% CSA B651:23 accessible units; or
- RHFAC v4.0 Gold, score of at least 80%.

If the visitability/common-area prerequisite is not confirmed, the calculator must award zero accessibility points even when a percentage/certification option is selected. The output should say professional attestation is required; it should not interpret the CSA standard or declare a design compliant.

### Base project eligibility inputs

Before calculating points, ask:

- new construction or existing property;
- shelter type: standard rental, SRO, supportive housing, retirement home, or student housing;
- number of residential units/beds;
- non-residential share of gross floor area and total lending value;
- whether any statutory prohibition applicable to the borrower/property has been identified; and
- market/centre for median renter income.

CMHC's [product page](https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect) states:

- new and existing standard rental, SRO, supportive-housing, and retirement-home projects can use the product;
- student housing can qualify only through energy efficiency and accessibility;
- minimum project size is 5 units, except retirement homes require 50 units/beds; and
- non-residential space must not exceed 30% of gross floor area or 30% of total lending value.

Failing a basic screen should produce "does not pass this preliminary product screen" plus the exact source—not a conclusion that CMHC must decline the application.

### Incentive outputs

| Score tier | New construction | Existing property | Maximum amortization | Recourse | Premium discount |
|---|---|---|---:|---|---:|
| 50–69 | Up to 95% LTC | Up to 85% LTV | Up to 40 years | Full | 10% |
| 70–99 | Up to 95% LTC | Up to 95% LTV | Up to 45 years | Full | 20% |
| 100+ | Up to 95% LTC | Up to 95% LTV | Up to 50 years | Limited | 30% |

The maximum amortization is also limited by remaining economic life. Replacement-reserve requirements are discretionary. The fact sheet lists minimum DCR of 1.10 for standard rental, 1.20 for other shelter models, and 1.40 for non-residential space.

The official [Multi-unit Fees and Premiums sheet](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select-multi-unit-fees-and-premiums-at-a-glance-en.pdf?rev=477fd129-abf9-4027-a71a-52bf53e2ee32) says the 10%/20%/30% MLI Select discount applies to the base premium plus applicable surcharges. Do not present the discount as a percentage-point premium rate reduction.

The result page should show:

- affordability, energy, accessibility, and commitment-bonus subtotals;
- total raw score and achieved incentive tier;
- points needed for the 50/70/100 thresholds;
- maximum LTC/LTV, amortization, recourse category, DCR reference, replacement-reserve treatment, and premium discount;
- all assumptions and disqualifying/manual-review flags;
- an evidence checklist by selected pathway;
- "What would change the result?" sensitivity cards; and
- rules/data version plus official links.

### Required documentation surfaced by the calculator

The [required-documentation guide](https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select-required-document-en.pdf?rev=9ae87665-d723-4a2e-9d41-878d139d0d99) supports a valuable pathway-specific checklist.

#### Affordability

- At application: pro forma rent roll for new construction or current rent roll for an existing property, demonstrating the selected affordability level in a CMHC-acceptable form.
- Before first advance: signed loan documentation with required schedule/covenants retained by the approved lender.
- Annually: certificate of compliance/annual attestation plus supporting rent roll for the commitment period.

#### Energy efficiency

- Borrower commitment/achievement attestation.
- Qualified-professional energy analysis and report.
- Appropriate ASHRAE Standard 140-compliant whole-building hourly simulation software.
- Base/reference and assessed-building consumption, GHG calculations where applicable, end-use breakdown, assumptions, improvement description, model input/output files, and supplemental renewable calculations.
- Invoices or utility bills alone are not sufficient evidence.
- Professional routes include a P.Eng., architect, CET, or CEM for Part 3 work; an NRCan-accredited residential energy advisor or equivalent may model qualifying low-rise Part 9/small multi-unit buildings.

#### Accessibility

- Signed attestation/confirmation by an architect or designated accessibility consultant.
- Confirmation of visitability and barrier-free common areas.
- Accessible/universal-design unit counts and compliance with the selected pathway.
- RHFAC result where used.
- Summary of key accessibility/universal-design features and sample unit design.

The fact sheet also describes achievement timing: evidence may be required at application for already-completed work, within 60 days after final advance for insured-financing work, or within 24 months of last advance for work funded from the borrower's resources/non-insured financing. The calculator should turn this into a dated task list, while warning users to confirm the conditions in their actual approval.

### Freshness and product-risk controls

This calculator is unusually vulnerable to silent staleness because its rules span a live web page, fact sheet, median-income workbook, fee/premium sheet, documentation guide, attestations, building-code editions, CSA/RHFAC versions, annual CPI guidance, and CMHC underwriting judgment.

Required controls:

1. Put `rules_version`, `rules_reviewed_at`, `median_income_source_hash/date`, `premium_sheet_version`, and official URLs on every result.
2. Check source headers/content hashes daily and block or warn if parsing fails or an official source changes unexpectedly.
3. Maintain human-reviewed rule fixtures for every threshold boundary and product tier.
4. Store the exact rules snapshot used for each saved scenario; do not silently recalculate historical scenarios.
5. Show "rules have changed" when a user opens an old scenario.
6. Separate deterministic score math from underwriting judgment and document equivalency; use "manual review required" wherever the official source gives CMHC discretion.
7. Never claim CMHC approval, lender approval, final eligibility, a guaranteed premium, or a guaranteed loan amount.
8. Require confirmation with an Approved Lender/CMHC before reliance, echoing CMHC's own fact-sheet warning.
9. Review English/French source parity and accessibility of the calculator itself.

### MVP scope

1. Project-type and base-eligibility screen.
2. Market selector powered by a versioned import of CMHC's median renter income workbook.
3. Total units, affordable unit count, rent threshold, and affordability commitment term.
4. Energy route and modeled percentage inputs.
5. Accessibility prerequisite and pathway selector.
6. Deterministic point subtotals, total, tier, next-tier gap, and incentive table.
7. Selected-path documentation checklist.
8. Scenario share URL and printable lender/borrower summary.
9. Visible rules/version/source panel and change log.
10. Boundary-value automated tests for every scoring and incentive threshold.

### Advanced scope

- **Point-gap optimizer:** compare feasible ways to reach 50, 70, or 100 points without pretending to know project costs.
- **Three-column scenario planner:** current design vs. lowest-input path to 70 vs. selected path to 100.
- Unit-level rent-roll import that validates counts and thresholds without retaining tenant personal information.
- Median-income market lookup with comparable-market workflow marked for manual CMHC approval.
- Certification-route support based on the current CMHC accepted-standards table.
- Premium estimator using current base rates, LTV/LTC, construction/all-other purpose, shelter type, loan amount, extended-amortization and other official surcharges, then applying the MLI Select discount correctly.
- Mortgage payment/debt-service sensitivity across 40/45/50-year amortizations; distinguish cash-flow effect from total interest.
- DCR and maximum supportable debt scenario model using project NOI and lender assumptions.
- Documentation workspace, responsibility matrix, deadlines, attestation links, and audit trail.
- Lender-facing PDF/export and CRM handoff with the exact user inputs and no unsupported approval language.
- English/French implementation and WCAG-conformant interaction.
- Public read-only API for the current rules, median-income thresholds, and result calculation.

### Companion assets that make the MLI calculator citeable and link-worthy

#### Normalized datasets

- **CMHC Median Renter Income Explorer:** clean HTML table and downloadable CSV derived from the official workbook, with market aliases, source vintage, change history, and direct source link.
- **MLI Select Rules Dataset:** machine-readable affordability, energy, accessibility, incentive, premium-discount, eligibility, DCR, and documentation rules with effective/review dates.
- **Affordable Rent Threshold Dataset:** market-by-market monthly threshold derived reproducibly from CMHC median renter income, with formula and rounding policy.
- **MLI Select Change Log:** field-level diffs whenever CMHC changes a threshold, code version, accepted certification, required document, fee, premium, discount, CPI rule, or incentive.
- **Certification Crosswalk:** CMHC-recognized building standard/version/level to MLI Select energy level, sourced from the current documentation guide.

#### Original charts and interactive analysis

- Median renter income and affordable monthly-rent threshold by market.
- Year-over-year change in income/rent thresholds when historical official workbooks are available.
- New vs. existing affordability unit-count thresholds for projects of 5, 10, 20, 50, 100, and 200 units.
- Score-combination matrix showing every category combination that reaches 50, 70, or 100.
- "Points to next tier" interactive chart.
- Maximum leverage/amortization comparison by tier and project type.
- Payment and DCR sensitivity for 40/45/50-year amortizations across a user-selected rate range.
- Estimated premium before/after MLI Select discount, with all rates and surcharges itemized.
- Affordable-unit commitment sensitivity: 10 years vs. 20+ years and the 30-point bonus.
- Energy target comparison: NECB, NBC, and existing-building pathways.
- Documentation timeline from application through final advance and annual compliance.

#### Evergreen guides and reference pages

- MLI Select points explained with worked examples.
- New construction vs. existing-property scoring differences.
- How CMHC's 30%-of-median-renter-income test works.
- How to find the right CMHC market and what happens when a market is missing.
- 10-year vs. 20-year affordability commitments and ongoing rent compliance.
- NECB vs. NBC energy pathways and why local code modelling is not a substitute.
- Existing-building energy and GHG baseline evidence.
- Visitability, accessibility, universal design, and RHFAC: how the MLI pathways differ.
- 50 vs. 70 vs. 100 points: leverage, amortization, recourse, and premium-discount comparison.
- Premium discount vs. premium rate: an illustrated explanation.
- MLI Select application-document checklist by pathway.
- Common reasons a self-calculated score changes during professional/lender/CMHC review.
- A dated "What changed in MLI Select this year?" page.
- Case-study templates that publish inputs, sources, point calculation, financing implications, and actual outcome with consent.

### Best combined content/product loop

The zoning map identifies a potential project and its unresolved planning constraints. A user can then open a financing scenario pre-populated with typology, municipality, estimated unit count, and new/existing status. For projects with at least five rental units, the MLI Select calculator becomes relevant. The saved project should keep the two evidence models separate:

- **Planning context:** mapped sources, unknowns, verification tasks, typology concept.
- **Financing scenario:** user-entered operating/loan assumptions, MLI score estimate, evidence tasks, lender/CMHC verification.

That separation prevents a weak zoning inference from contaminating a financing result while creating a defensible, high-intent journey from public research utility to FairLend advisory engagement.

## Priority order

1. Ship the **MLI Select calculator** first: bounded rule set, national search demand, immediate borrower/broker value, and simpler correctness envelope.
2. In parallel, build the normalized median-income/rent-threshold dataset, scoring methodology page, and change-monitoring pipeline.
3. Ship the **Toronto planning-context map MVP** next, beginning with zoning/address/parcel/essential overlays and explicit unknowns.
4. Add permits, typology screens, permanent reports, and the gentle-density datasets/reports that generate citations.
5. Expand municipality by municipality only after each adapter passes a source, licence, effective-date, appeal-status, and formal-verification review.

