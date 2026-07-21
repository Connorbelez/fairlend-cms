export type GardenSuiteFaqItem = {
  id: string
  question: string
  answer: string
  sourceFile: string
}

export type GardenSuiteFaqGroup = {
  id: string
  title: string
  summary: string
  items: readonly GardenSuiteFaqItem[]
}

export const gardenSuiteFaqGroups = [
  {
    id: 'start-here',
    title: 'Start here',
    summary:
      'The questions most homeowners need answered before they commit to a design, lender, or construction contract.',
    items: [
      {
        id: 'planning-01-what-is-garden-suite-financing',
        question: 'What is Garden Suite financing?',
        answer:
          'Garden Suite financing is the capital plan used to move a detached secondary dwelling from early feasibility through design, permits, construction, completion, and longer-term financing. It may combine homeowner funds, existing equity, a mortgage refinance, a secured line of credit, a construction facility, or another lender-approved route.\n\nThe right structure depends on the property, the borrower, the project budget, when each cost must be paid, and the financing you expect to hold after construction.',
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'planning-03-can-i-speak-with-fairlend-before-i-have-drawings-or-permits',
        question: 'Can I speak with FairLend before I have drawings or permits?',
        answer:
          'Yes. An early conversation can identify which property, borrower, budget, and permit facts will matter before you commit to a design or construction contract.\n\nYou do not need a complete file to start. FairLend can help identify the missing items and the order in which to investigate them. A lender will still require appropriate plans, documents, and approvals before final funding.',
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'planning-05-how-do-i-know-whether-my-toronto-property-can-support-a-garden-suite',
        question: 'How do I know whether my Toronto property can support a Garden Suite?',
        answer:
          "The City of Toronto permits Garden Suites in many residential zones, but permission is not the same as site approval. Your property still needs to satisfy the applicable zoning, Ontario Building Code, emergency access, tree, servicing, and other legal requirements.\n\nUse the City's zoning map and Garden Suites guidance for initial orientation, then have the property reviewed by qualified planning and design professionals. A financing review should use the site-specific findings, not a general assumption that every residential lot works.",
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'toronto-rules-04-do-i-need-a-building-permit-for-a-garden-suite',
        question: 'Do I need a building permit for a Garden Suite?',
        answer:
          'Yes. The City of Toronto requires a building permit. The proposal must comply with applicable zoning, the Ontario Building Code, tree regulations, and other applicable law.\n\nThe permit application requires appropriate drawings, forms, and project information prepared by qualified people where required. Separate plumbing, mechanical, drain, or other permits may also apply.',
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'toronto-rules-09-do-toronto-s-pre-approved-plans-guarantee-permit-approval',
        question: "Do Toronto's pre-approved plans guarantee permit approval?",
        answer:
          'No. The pre-approved building designs have been reviewed for parts of zoning and Ontario Building Code compliance, but the homeowner still needs a building permit and a site-specific review.\n\nPlacement, access, servicing, trees, grading, local zoning conditions, and other applicable law still matter. A pre-approved plan reduces repeated review of the approved design. It does not pre-approve the property.',
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'budget-01-how-much-does-it-cost-to-build-a-garden-suite-in-toronto',
        question: 'How much does it cost to build a Garden Suite in Toronto?',
        answer:
          'There is no reliable single price. Cost changes with suite size, design, site access, foundation, soil, servicing, trees, utilities, finishes, construction method, professional fees, permit requirements, schedule, and financing.\n\nUse a line-item budget built around the actual property. A broad online range can help with orientation, but it should not be used as the amount to borrow or the basis for signing a construction contract.',
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'financing-09-how-much-equity-do-i-need',
        question: 'How much equity do I need?',
        answer:
          'There is no universal equity number. The lender considers the current property value, existing mortgages and secured debts, requested financing, project cost, any as-improved value it accepts, and the maximum loan-to-value allowed by the product.\n\nEquity alone does not guarantee approval. Income, credit, liquidity, project quality, permits, construction risk, and the exit also matter.',
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'financing-02-can-i-use-a-heloc-to-build-a-garden-suite',
        question: 'Can I use a HELOC to build a Garden Suite?',
        answer:
          'Potentially. A HELOC can provide flexible access to existing home equity and generally charges interest on the balance used. Its available limit, rate, payment terms, and lender conditions may not fit the full project.\n\nCheck whether the HELOC can cover early costs, deposits, contingency, and construction timing. Also model how its payment affects qualification for any later mortgage.',
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'financing-13-what-documents-will-a-lender-ask-for',
        question: 'What documents will a lender ask for?',
        answer:
          'Expect property and mortgage documents, identification, income and liability evidence, bank or investment statements, plans, permit information, budget, builder contract or quotes, schedule, insurance, appraisal material, and the proposed exit.\n\nThe exact list changes by lender and project stage. Start with what you have, then build a tracked checklist around the selected financing route.',
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'draws-01-what-is-a-construction-draw',
        question: 'What is a construction draw?',
        answer:
          'A construction draw is an advance from an approved financing facility during the build. The request is usually tied to completed work, eligible costs, supporting evidence, and the conditions in the loan agreement.\n\nA draw is not extra credit added to the facility. It is the release of part of the approved amount.',
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'draws-06-why-should-the-draw-schedule-match-the-construction-schedule',
        question: 'Why should the draw schedule match the construction schedule?',
        answer:
          'The builder needs funds when deposits, labour, trades, and materials become payable. The lender releases funds when its milestone and evidence conditions are met.\n\nIf those timelines do not match, the project can face a cash gap even when the total approved credit appears sufficient. Align payment dates, milestones, document preparation, review time, and working capital before construction begins.',
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'completion-01-can-projected-garden-suite-rent-help-me-qualify',
        question: 'Can projected Garden Suite rent help me qualify?',
        answer:
          'Sometimes. Lender treatment varies by program, property, borrower, suite status, appraisal method, market-rent support, and lease evidence.\n\nProjected rent is evidence, not guaranteed qualifying income. Ask how much the selected lender may recognize, what expenses or vacancy assumptions it uses, and what documentation it needs.',
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
      {
        id: 'completion-05-what-is-a-takeout-mortgage',
        question: 'What is a takeout mortgage?',
        answer:
          'A takeout mortgage is the longer-term financing intended to replace construction or bridge financing after the project reaches the required completion stage.\n\nIt may have a different lender, rate, term, amortization, qualification test, appraisal requirement, and document package. The takeout should be modelled before construction begins.',
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
      {
        id: 'completion-14-can-fairlend-help-if-my-project-has-stalled',
        question: 'Can FairLend help if my project has stalled?',
        answer:
          'FairLend can review the current debt, title, permits, work completed, remaining budget, builder status, liens, appraisal, available capital, and intended exit to determine whether a financing route may be available.\n\nThat review does not guarantee a rescue. Some projects can be restructured, while others need more equity, a reduced scope, a negotiated settlement, or another professional response.',
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
    ],
  },
  {
    id: 'planning',
    title: 'Planning your project',
    summary: 'Property fit, goals, team, and the decisions to make before design.',
    items: [
      {
        id: 'planning-02-who-is-garden-suite-financing-for',
        question: 'Who is Garden Suite financing for?',
        answer:
          'It is for homeowners, families, and property investors who want to add a legal, self-contained dwelling on an existing residential property. Some are creating a long-term rental. Others are planning space for parents, adult children, caregivers, or their own future use.\n\nThe financing assessment should reflect the real goal because occupancy, projected rent, property use, and the intended exit can affect which lenders and products are relevant.',
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'planning-04-what-should-i-review-before-paying-for-a-full-design',
        question: 'What should I review before paying for a full design?',
        answer:
          "Start with the property's zoning context, emergency access, lot geometry, trees, servicing, existing mortgage, available equity, intended use, rough project budget, and likely construction access.\n\nThese facts are connected. A design that fits the rear yard may still create an access, tree, servicing, budget, or financing problem. Early feasibility work should surface those dependencies before the project becomes expensive to change.",
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'planning-06-what-is-the-difference-between-a-garden-suite-and-a-laneway-suite',
        question: 'What is the difference between a Garden Suite and a Laneway Suite?',
        answer:
          "A Garden Suite is a detached, self-contained dwelling in an ancillary building on the same lot as the main home and is not defined by access from a public lane. A Laneway Suite is tied to the property's relationship with a public lane.\n\nThe financing routes may overlap, but access, servicing, staging, design, permit evidence, and appraisal context can differ. The project should be classified correctly before the budget and draw plan are finalized.",
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'planning-07-do-i-need-to-choose-a-builder-before-discussing-financing',
        question: 'Do I need to choose a builder before discussing financing?',
        answer:
          'No. You can begin with property facts, goals, rough costs, and your current financial position. A builder becomes increasingly important as the budget, schedule, contracts, deposits, and draw milestones are developed.\n\nA lender may require a qualified builder, a detailed contract, line-item costs, proof of insurance, and other project documents before approving or advancing construction funds.',
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'planning-08-can-i-bring-my-own-designer-builder-or-lawyer',
        question: 'Can I bring my own designer, builder, or lawyer?',
        answer:
          'Yes. Your existing professionals can remain part of the project. The important question is whether roles, documents, budget responsibilities, and timing are clear enough to support the financing plan.\n\nIf a required role is missing, FairLend may help identify relevant professionals from its network. Any introduction should remain optional, and commercial or referral relationships should be disclosed where applicable.',
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'planning-09-how-early-should-i-plan-the-financing',
        question: 'How early should I plan the financing?',
        answer:
          'Start before the design, permit, construction contract, and deposit schedule become fixed. Early planning gives you time to compare financing routes, identify evidence gaps, model the full capital requirement, and check whether the expected completion mortgage is realistic.\n\nFinancing planned after contracts are signed may need to work around payment dates, deposits, or assumptions that a lender will not accept.',
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'planning-10-what-decisions-have-the-biggest-effect-on-the-financing-plan',
        question: 'What decisions have the biggest effect on the financing plan?',
        answer:
          'The project scope, suite size, intended use, design path, permit status, construction method, builder contract, contingency, existing mortgage, available equity, borrower income, liquidity, projected rent, and expected completion value can all matter.\n\nThe timing matters too. A project that needs large deposits before lender advances may require more working capital than the same project with a different contract and milestone schedule.',
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'planning-11-does-the-intended-use-of-the-suite-matter',
        question: 'Does the intended use of the suite matter?',
        answer:
          "Yes. A suite intended for a family member, a long-term tenant, or the homeowner's future use may be evaluated differently. Some lending programs have owner-occupancy, related-person occupancy, rental-use, or short-term-rental restrictions.\n\nState the intended use early. The financing plan should not rely on rental income, insurance treatment, or program eligibility that conflicts with how the suite will actually be occupied.",
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'planning-12-can-i-build-a-garden-suite-for-a-parent-or-adult-child',
        question: 'Can I build a Garden Suite for a parent or adult child?',
        answer:
          'Potentially. A Garden Suite can support multigenerational living when the property and design meet municipal requirements and the financing is supportable.\n\nThe lender will still assess the borrower, property, project, and repayment plan. If a specific insured-refinance program is being considered, confirm its owner or close-relative occupancy rules and all current eligibility criteria before relying on it.',
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'planning-13-can-i-build-a-garden-suite-as-a-rental',
        question: 'Can I build a Garden Suite as a rental?',
        answer:
          "Potentially. A legal long-term rental may support the project's household or investment goal, but projected rent is not automatically treated as qualifying income.\n\nThe lender may ask for an appraisal, market-rent opinion, lease evidence, operating-cost assumptions, or proof that the unit will be legal and self-contained. Short-term rental use can also conflict with municipal rules or specific financing programs.",
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'planning-14-what-if-i-am-still-deciding-between-renovating-adding-a-suite-or-moving',
        question: 'What if I am still deciding between renovating, adding a suite, or moving?',
        answer:
          "Compare the full cost, timing, financing, disruption, and long-term use of each option. A Garden Suite may create a separate dwelling without changing the main home's interior, but it also introduces site work, servicing, permits, construction risk, and a second financing phase.\n\nAn early assessment should help you understand the capital and evidence each option requires. It should not force the property into a Garden Suite strategy before the alternatives are understood.",
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
      {
        id: 'planning-15-what-does-a-useful-first-garden-suite-conversation-produce',
        question: 'What does a useful first Garden Suite conversation produce?',
        answer:
          "A useful first conversation identifies the project's current facts, the key unknowns, and the next evidence to gather. That may include a property review, mortgage statements, rough budget, permit status, builder information, equity estimate, income documents, or an appraisal strategy.\n\nThe result is not an approval. It is a clearer route from idea to a lender-ready project file.",
        sourceFile: 'docs/context/garden-suite-faqs/01-feasibility-and-planning.md',
      },
    ],
  },
  {
    id: 'toronto-rules',
    title: 'Toronto rules and permits',
    summary: 'Zoning, permits, access, trees, pre-approved plans, and current incentives.',
    items: [
      {
        id: 'toronto-rules-01-what-does-the-city-of-toronto-mean-by-a-garden-suite',
        question: 'What does the City of Toronto mean by a Garden Suite?',
        answer:
          'The City defines a Garden Suite as self-contained living accommodation in an ancillary building, usually in the rear yard, that is detached from the main dwelling and is not on a public lane.\n\nThat definition separates Garden Suites from Laneway Suites and from secondary suites inside the main house. The applicable zoning and building requirements depend on the actual property and proposal.',
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'toronto-rules-02-which-toronto-zones-can-permit-a-garden-suite',
        question: 'Which Toronto zones can permit a Garden Suite?',
        answer:
          "Toronto's city-wide zoning by-law permits Garden Suites, subject to requirements, in several residential zone categories, including R, RD, RS, RT, and RM.\n\nConfirm the property's zoning through the City's interactive zoning map. Some properties remain subject to a former municipal zoning by-law or a site-specific exception, so a general zone label is not a final approval.",
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'toronto-rules-03-what-if-my-property-is-governed-by-a-former-zoning-by-law',
        question: 'What if my property is governed by a former zoning by-law?',
        answer:
          "The City's Garden Suites guidance says the city-wide amendment does not automatically apply to former zoning by-laws. Contact Toronto Building for direction on a property still governed by a former by-law.\n\nDo not assume a neighbouring property establishes permission for your lot. Former by-laws, exceptions, lot conditions, and later amendments can produce a different result.",
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'toronto-rules-05-what-is-a-zoning-applicable-law-certificate',
        question: 'What is a Zoning Applicable Law Certificate?',
        answer:
          'It is a City zoning review that can confirm zoning and applicable-law compliance before the building permit application is treated as complete. The City recommends considering this review for a Garden Suite.\n\nIt does not replace the building permit or every other approval. It helps identify zoning issues earlier, when the design may still be adjusted.',
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'toronto-rules-06-why-is-emergency-access-so-important',
        question: 'Why is emergency access so important?',
        answer:
          'Toronto Building and Toronto Fire and Emergency Services review whether the suite has compliant firefighter and emergency access. These requirements come through Ontario Building Code compliance rather than the Garden Suite zoning rules alone.\n\nThe City states that emergency access requirements cannot be varied through a minor variance application. A rear-yard design can therefore fail even when its size and setbacks appear workable.',
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'toronto-rules-07-can-a-minor-variance-solve-every-site-constraint',
        question: 'Can a minor variance solve every site constraint?',
        answer:
          'No. A minor variance may address certain zoning matters, but it cannot waive Ontario Building Code or emergency access requirements. Tree, servicing, conservation, and other applicable-law issues may also require separate review.\n\nTreat a variance as a planning process, not as a universal fix. Confirm the actual constraint and the authority responsible for it before budgeting around a variance.',
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'toronto-rules-08-how-can-trees-affect-a-garden-suite-application',
        question: 'How can trees affect a Garden Suite application?',
        answer:
          'Protected private trees and City-owned trees can affect the building location, access, excavation, and construction method. The City requires a Tree Declaration Form with relevant building permit and Committee of Adjustment applications.\n\nUrban Forestry may refuse a permit to injure or remove a protected tree. Review trees early because redesigning the suite, foundation, access route, or servicing after permit work begins can be expensive.',
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'toronto-rules-10-can-i-modify-a-pre-approved-garden-suite-plan',
        question: 'Can I modify a pre-approved Garden Suite plan?',
        answer:
          'You can choose a different design path, but the City states that modifications to a pre-approved plan, including HVAC or plumbing changes, mean it will no longer use the pre-approved process.\n\nConfirm what counts as a modification before relying on expected time or cost savings. The design should fit the property and project goal, not merely preserve a faster review label.',
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'toronto-rules-11-can-a-garden-suite-be-two-storeys',
        question: 'Can a Garden Suite be two storeys?',
        answer:
          'Potentially. The City says a two-storey Garden Suite may be possible when the proposal satisfies the applicable height, setback, separation, and other zoning requirements.\n\nThe answer is site-specific. Do not publish or rely on a universal maximum height without checking the current by-law, property location, lot depth, and any applicable exceptions.',
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'toronto-rules-12-can-one-property-have-both-a-garden-suite-and-a-laneway-suite',
        question: 'Can one property have both a Garden Suite and a Laneway Suite?',
        answer:
          'Under the current city-wide zoning rule, a lot may contain a maximum of one ancillary building with either a Garden Suite or a Laneway Suite. It may not contain both.\n\nConfirm the current rule and any property-specific exception before design. This answer does not determine whether additional units inside the main building are allowed.',
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'toronto-rules-13-does-a-garden-suite-require-a-parking-space',
        question: 'Does a Garden Suite require a parking space?',
        answer:
          'The current city-wide Garden Suite rules do not require a parking space for the Garden Suite. The by-law includes separate bicycle-parking requirements.\n\nParking and access conditions can still affect the rest of the property. Confirm the current by-law, any former-by-law status, and existing lawful vehicle access before changing parking or site circulation.',
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'toronto-rules-14-are-development-charges-automatically-payable',
        question: 'Are development charges automatically payable?',
        answer:
          "Not always. Toronto's current Garden Suite information describes exemptions and a separate development-charge deferral program for eligible projects. The result depends on the number of units, the property, program conditions, and whether a new lot is created or transferred without the required agreement.\n\nAsk the City for a current calculation and program determination. Do not carry an exemption or deferral into the budget without written confirmation.",
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
      {
        id: 'toronto-rules-15-is-there-currently-a-grant-or-government-loan-for-a-toronto-garden-suite',
        question: 'Is there currently a grant or government loan for a Toronto Garden Suite?',
        answer:
          "Do not assume one is available. Toronto states that the Affordable Laneway Suites Program has been discontinued. The federal Canada Secondary Suite Loan Program was announced but CMHC's 2025 Annual Report says it was not implemented.\n\nOther current options, including CMHC-insured refinancing for eligible secondary-suite projects and Toronto's development-charge deferral, have their own conditions. Verify live program status before including any government support in the capital plan.",
        sourceFile: 'docs/context/garden-suite-faqs/02-toronto-zoning-permits-and-incentives.md',
      },
    ],
  },
  {
    id: 'budget',
    title: 'Budget and readiness',
    summary:
      'Full project cost, contingency, deposits, working capital, and lender-ready evidence.',
    items: [
      {
        id: 'budget-02-why-can-the-declared-permit-value-differ-from-the-final-project-cost',
        question: 'Why can the declared permit value differ from the final project cost?',
        answer:
          'A permit value may not include every cost the homeowner must fund. Design, consultants, site investigation, utility work, landscaping, financing, insurance, appraisal, legal work, contingency, and post-permit changes can sit outside a basic construction figure.\n\nCompare like with like. A useful financing budget covers the full path to a completed, usable, and financeable suite.',
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'budget-03-what-should-a-complete-garden-suite-budget-include',
        question: 'What should a complete Garden Suite budget include?',
        answer:
          'Include design and consultants, permit and municipal costs, site preparation, demolition, excavation, foundation, structure, building systems, utilities, finishes, exterior work, builder overhead, taxes, deposits, contingency, insurance, appraisal, legal costs, financing fees, construction-period interest, and completion costs.\n\nAlso identify costs that must be paid before the first lender advance. Those early obligations can create a working-capital requirement even when the overall project is financeable.',
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'budget-04-how-much-contingency-should-i-carry',
        question: 'How much contingency should I carry?',
        answer:
          'The appropriate contingency depends on the design stage, site uncertainty, contract structure, and project complexity. An early concept budget generally carries more uncertainty than a coordinated permit and construction package.\n\nAsk the project professionals and lender how contingency must be documented and controlled. A contingency is not spare money. It protects the completion plan when an eligible, documented cost changes.',
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'budget-05-what-are-soft-costs',
        question: 'What are soft costs?',
        answer:
          'Soft costs are project expenses outside the physical construction work. They can include design, engineering, surveying, planning, arborist work, energy or code consulting, permits, development-related charges, appraisal, insurance, legal work, and financing costs.\n\nThey may be due earlier than construction draws and may not all be eligible for reimbursement under a particular facility. Confirm both timing and eligibility.',
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'budget-06-why-can-servicing-change-the-budget-so-much',
        question: 'Why can servicing change the budget so much?',
        answer:
          'A detached suite needs working water, drainage, electrical, heating, ventilation, and other building systems. The route, capacity, excavation, connection method, and coordination with the main house can materially affect cost and schedule.\n\nDo not use a generic servicing allowance when the property has not been investigated. Ask what must be confirmed before the design and financing budget are treated as reliable.',
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'budget-07-how-do-access-and-trees-affect-construction-cost',
        question: 'How do access and trees affect construction cost?',
        answer:
          "Limited access can change equipment, excavation, material handling, labour, staging, and schedule. Protected trees can change the building location, foundation, servicing route, and construction method.\n\nThese are not only permit questions. They can affect the builder's price, the draw schedule, required deposits, and the amount of contingency a lender expects.",
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'budget-08-should-i-rely-on-one-builder-quote',
        question: 'Should I rely on one builder quote?',
        answer:
          'One quote can be a useful starting point, but it should be checked for scope, exclusions, allowances, taxes, escalation, deposits, schedule, change-order rules, and alignment with the drawings.\n\nA low number is not useful if major work is excluded. The financing plan should use a budget that the builder, designer, borrower, and lender understand the same way.',
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'budget-09-how-should-allowances-be-handled',
        question: 'How should allowances be handled?',
        answer:
          'An allowance is a placeholder for a cost that has not been fully selected or priced. Record what it includes, whether it covers tax, labour, delivery, installation, and the consequence if the final selection costs more.\n\nLarge or numerous allowances increase budget uncertainty. Resolve the items most likely to affect financing, schedule, or lender approval before construction begins.',
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'budget-10-how-do-builder-deposits-affect-financing',
        question: 'How do builder deposits affect financing?',
        answer:
          'Builders and suppliers may require deposits before ordering materials or starting work. A lender may advance funds only after specified conditions or milestones are met.\n\nMap deposits against available cash and expected advances. A project can have enough total credit but still stall because the timing of deposits and draws does not match.',
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'budget-11-what-is-working-capital-in-a-garden-suite-project',
        question: 'What is working capital in a Garden Suite project?',
        answer:
          "Working capital is the accessible cash or credit needed to keep obligations paid between lender advances. It can cover deposits, payroll, materials, taxes, or approved work while evidence is being assembled and a draw is reviewed.\n\nThe required amount depends on the contract and advance process. It should be planned, not treated as whatever remains in the homeowner's account.",
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'budget-12-do-i-need-to-budget-for-financing-fees-and-interest',
        question: 'Do I need to budget for financing fees and interest?',
        answer:
          'Yes. The project budget should include lender, brokerage, legal, appraisal, inspection, administration, and registration costs where applicable, plus interest based on when capital is advanced.\n\nAsk for a written cost-of-borrowing disclosure and model more than one timing scenario. The lowest stated rate is not always the lowest total project cost.',
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'budget-13-why-should-the-budget-include-completion-and-takeout-costs',
        question: 'Why should the budget include completion and takeout costs?',
        answer:
          'The project is not financially complete when the builder finishes the main work. There may still be deficiencies, final inspections, occupancy requirements, appraisal costs, legal work, lease-up costs, interest, and fees for the longer-term mortgage.\n\nReserve enough capital and time to move from construction financing into the intended end-state financing.',
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'budget-14-what-documents-make-a-budget-lender-ready',
        question: 'What documents make a budget lender-ready?',
        answer:
          'A lender-ready budget is usually supported by drawings, permits or permit status, line-item costs, contracts or quotes, builder information, deposit requirements, schedule, contingency, source-of-funds evidence, and the proposed draw plan.\n\nRequirements vary by lender and project. The goal is to show what will be built, what it will cost, who will deliver it, when money is needed, and how completion will be funded.',
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
      {
        id: 'budget-15-how-often-should-the-budget-be-updated',
        question: 'How often should the budget be updated?',
        answer:
          'Update it whenever the design, permit conditions, builder scope, schedule, material pricing, financing terms, or site facts change. During construction, approved changes and actual costs should be reflected in the remaining-cost forecast.\n\nA static original budget can hide a completion shortfall. The current budget should always answer how much has been spent, what remains, and whether available capital can finish the project.',
        sourceFile: 'docs/context/garden-suite-faqs/03-costs-budget-and-readiness.md',
      },
    ],
  },
  {
    id: 'financing',
    title: 'Financing and underwriting',
    summary: 'Equity, HELOCs, refinancing, construction credit, and what lenders assess.',
    items: [
      {
        id: 'financing-01-what-are-the-main-ways-to-finance-a-garden-suite',
        question: 'What are the main ways to finance a Garden Suite?',
        answer:
          'Common routes include cash, a home equity line of credit, a mortgage refinance, a second mortgage, a construction facility, insured refinancing for an eligible secondary-suite project, or a combination of sources.\n\nThe right route depends on available equity, income, credit, liquidity, existing mortgage terms, project size, payment timing, lender requirements, and the intended mortgage after completion.',
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'financing-03-can-i-refinance-my-mortgage-to-pay-for-construction',
        question: 'Can I refinance my mortgage to pay for construction?',
        answer:
          'Potentially. A refinance can release equity and may simplify the capital plan, but it can also replace an existing mortgage, trigger prepayment costs, and advance more money earlier than the project needs.\n\nCompare the total cost of replacing the current mortgage with alternatives that preserve it. Include penalties, legal costs, appraisal, insurance premiums where applicable, interest timing, and the expected term of the new loan.',
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'financing-04-when-might-a-second-mortgage-be-considered',
        question: 'When might a second mortgage be considered?',
        answer:
          'A second mortgage may be considered when the borrower wants to retain the first mortgage or needs gap, bridge, or time-sensitive capital. It is secured behind the existing first mortgage and may carry higher rates, fees, and a shorter exit requirement.\n\nThe assessment usually focuses on equity, property value, repayment capacity, project facts, and a credible exit. Compare total cost and risk, not only speed.',
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'financing-05-what-is-construction-financing',
        question: 'What is construction financing?',
        answer:
          "Construction financing provides capital for an approved build, often through progress advances rather than one unrestricted payment. The lender reviews the borrower, property, plans, permits, budget, builder, schedule, contingency, and completion strategy.\n\nFunds are advanced under the lender's conditions. The borrower must still manage costs that arise before an advance and any expenses the facility does not cover.",
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'financing-06-can-i-combine-cash-and-financing',
        question: 'Can I combine cash and financing?',
        answer:
          "Yes. Many projects use homeowner funds for design, permits, deposits, contingency, or costs that fall outside the lender's advance rules, then use secured financing for eligible construction costs.\n\nDocument the source and timing of each contribution. The lender may require the borrower's equity contribution to be invested before or alongside its advances.",
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'financing-07-should-i-wait-for-a-government-program-before-starting',
        question: 'Should I wait for a government program before starting?',
        answer:
          'Do not build the project plan around an announced or expired program. Confirm whether applications are open, whether the project and borrower are eligible, how funds are advanced, and whether the program can be combined with other financing.\n\nAs of this review, CMHC states that the announced Canada Secondary Suite Loan Program was not implemented. Current insured-refinance options are separate products with lender and insurer qualification.',
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'financing-08-what-is-cmhc-refinance-for-secondary-suites',
        question: 'What is CMHC Refinance for secondary suites?',
        answer:
          "CMHC Refinance is mortgage loan insurance that can support eligible homeowners refinancing to construct a self-contained secondary suite. The current product includes borrower, occupancy, property, value, loan-to-value, credit, debt-service, project-cost, and progress-advance requirements.\n\nIt is not a direct loan or automatic approval from CMHC. A lender submits the application, assesses the borrower, and applies its own requirements alongside CMHC's criteria.",
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'financing-10-what-is-the-difference-between-as-is-and-as-improved-value',
        question: 'What is the difference between as-is and as-improved value?',
        answer:
          "As-is value is the property's current market value. As-improved value is an appraiser's supported opinion of what the property may be worth after the proposed legal work is completed.\n\nA lender may use one or both values depending on the product and project stage. The as-improved value is not the construction budget and is not guaranteed to equal cost.",
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'financing-11-what-does-a-lender-assess-on-a-garden-suite-file',
        question: 'What does a lender assess on a Garden Suite file?',
        answer:
          'A lender typically reviews five connected areas: the property, the borrower, the project, the construction plan, and the exit.\n\nThat can include title, existing debt, value, income, credit, liquidity, plans, permits, budget, contingency, builder, contracts, schedule, draw evidence, projected rent, completed value, and the mortgage intended after construction.',
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'financing-12-do-income-and-credit-still-matter-if-i-have-substantial-equity',
        question: 'Do income and credit still matter if I have substantial equity?',
        answer:
          'Usually, yes. Different lenders weigh equity, income, credit, liquidity, and exit strength differently, but substantial equity does not remove every repayment or risk requirement.\n\nA complete assessment should identify which part of the file is strong, which part limits the route, and what evidence could improve the application.',
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'financing-14-is-the-lowest-mortgage-rate-always-the-best-option',
        question: 'Is the lowest mortgage rate always the best option?',
        answer:
          'No. Compare the total cost and the way the product fits the project. Relevant items can include interest, lender and brokerage fees, legal costs, appraisal, insurance premiums, draw or inspection fees, penalties, minimum interest, unused-facility costs, and the timing of each advance.\n\nA lower rate can still produce a higher cost if the full amount is borrowed long before it is needed.',
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
      {
        id: 'financing-15-how-long-does-garden-suite-financing-approval-take',
        question: 'How long does Garden Suite financing approval take?',
        answer:
          "There is no honest universal timeline. Timing depends on document readiness, appraisal, permits, builder and budget review, lender capacity, legal work, insurance, and whether the file changes during assessment.\n\nAsk for the conditions and dependencies, not only a target date. Do not commit to construction payments until the lender's requirements and funding sequence are understood.",
        sourceFile: 'docs/context/garden-suite-faqs/04-financing-options-and-underwriting.md',
      },
    ],
  },
  {
    id: 'draws',
    title: 'Construction draws',
    summary: 'Milestones, evidence, working capital, DrawFlow, and keeping the build funded.',
    items: [
      {
        id: 'draws-02-why-do-construction-lenders-use-progress-draws',
        question: 'Why do construction lenders use progress draws?',
        answer:
          'Progress draws connect financing to the value and work created during construction. They help the lender verify that the project is advancing and that enough capital remains to complete it.\n\nFor the homeowner, staged advances can reduce the amount borrowed before it is needed, but they also require disciplined evidence, timing, and working capital.',
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'draws-03-what-is-a-construction-milestone',
        question: 'What is a construction milestone?',
        answer:
          'A milestone is a defined stage or deliverable in the build, such as an approved scope of completed work supported by invoices, photos, reports, or an inspection.\n\nUseful milestones match the actual construction sequence and payment obligations. Vague milestones make it difficult to know when a draw can be requested or what evidence is required.',
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'draws-04-who-requests-a-draw',
        question: 'Who requests a draw?',
        answer:
          "The borrower remains responsible for the loan and generally authorizes or submits the request through the process established by the lender and administrator. A builder may prepare progress information, invoices, and a proposed payment request.\n\nThe exact authority and workflow must be stated in the executed agreement. No page copy should imply that a builder can borrow against the homeowner's facility without the required authorization.",
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'draws-05-what-evidence-can-be-required-for-a-draw',
        question: 'What evidence can be required for a draw?',
        answer:
          'Evidence may include a draw request, invoices, proof of payment, statutory declarations, progress photos, site reports, inspection or quantity-surveyor material, permit information, insurance, lien-related documents, and an updated cost-to-complete budget.\n\nRequirements vary by facility and milestone. The evidence list should be known before the related work is scheduled.',
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'draws-07-do-i-pay-interest-on-the-full-approved-construction-facility',
        question: 'Do I pay interest on the full approved construction facility?',
        answer:
          'Not always. Some staged facilities charge interest on amounts after they are advanced, while fees, minimum interest, standby costs, or other charges may apply to the approved or unused amount.\n\nThe executed agreement controls. Ask for a dated advance schedule and cost model instead of relying on a general statement that interest applies only to money used.',
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'draws-08-can-drawflow-provide-up-to-15-draws',
        question: 'Can DrawFlow provide up to 15 draws?',
        answer:
          "FairLend's current product copy describes access to up to 15 milestone-based draws. The actual number, size, timing, conditions, and availability must be confirmed in the approved facility and lender agreement.\n\nUse this claim publicly only after product and legal review confirm the wording in the source ledger.",
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'draws-09-what-is-drawflow',
        question: 'What is DrawFlow?',
        answer:
          "DrawFlow is FairLend's name for a coordinated construction-financing and project-control process. The intended model connects the approved credit facility, milestones, evidence, draw requests, schedule, budget, and project participants in one workflow.\n\nThe software does not replace the builder, municipal inspection, legal advice, appraisal, or lender approval. It organizes the information those roles need.",
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'draws-10-who-can-see-a-drawflow-project',
        question: 'Who can see a DrawFlow project?',
        answer:
          'The current product design uses role-based access for homeowners, builders, contractors, suppliers, lenders, and FairLend. Each participant should see only the project information and actions appropriate to that role.\n\nAccess, privacy, document retention, and permissions must follow the live product configuration and agreement. Do not expose borrower, lender, or project-sensitive information in marketing screenshots.',
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'draws-11-are-fairlend-progress-reviews-the-same-as-city-inspections',
        question: 'Are FairLend progress reviews the same as City inspections?',
        answer:
          'No. Municipal officials perform the inspections and approvals required under the permit and building-code process.\n\nFairLend or its project professionals may review progress and evidence for financing, schedule, budget, or milestone purposes. That review does not replace a City inspection or certify code compliance unless a qualified person is separately engaged and authorized to provide that service.',
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'draws-12-what-happens-when-the-scope-or-cost-changes',
        question: 'What happens when the scope or cost changes?',
        answer:
          'Record the proposed change, price, schedule effect, reason, approval, and impact on remaining contingency before the work proceeds where possible. Update the cost-to-complete forecast and draw plan.\n\nThe lender or administrator may need to approve material changes. A change that is affordable in isolation can still create a completion shortfall when combined with other changes.',
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'draws-13-how-does-the-builder-get-paid-between-draws',
        question: 'How does the builder get paid between draws?',
        answer:
          'Payment depends on the construction contract, homeowner funds, supplier terms, and lender advance process. Some costs may be paid from working capital and reimbursed after evidence review. Others may be paid directly after a draw.\n\nThe contract and financing plan should describe deposits, progress billings, holdbacks, taxes, evidence, review periods, and what happens if a draw is delayed or reduced.',
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'draws-14-what-can-cause-a-construction-draw-to-be-delayed',
        question: 'What can cause a construction draw to be delayed?',
        answer:
          'Common causes include incomplete evidence, work that does not match the milestone, unresolved permit or insurance conditions, budget changes, liens or title issues, appraisal or inspection delays, an expired document, or concern that the remaining funds cannot complete the project.\n\nThe fastest response is a complete issue list with owners and next actions. Repeatedly submitting the same incomplete request usually adds delay.',
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
      {
        id: 'draws-15-can-a-project-switch-financing-after-construction-has-started',
        question: 'Can a project switch financing after construction has started?',
        answer:
          'Sometimes, but it can be harder. A new lender may need to review title, existing debt, completed work, permits, budget, remaining cost, builder, liens, appraisal, insurance, and a credible completion and exit plan.\n\nSome files can be restructured and some cannot. The earlier the shortfall is identified, the more options may remain.',
        sourceFile: 'docs/context/garden-suite-faqs/05-construction-draws-and-project-control.md',
      },
    ],
  },
  {
    id: 'completion',
    title: 'Completion and long-term financing',
    summary: 'Appraisal, rent, takeout mortgages, CMHC refinancing, and project recovery.',
    items: [
      {
        id: 'completion-02-why-might-a-lender-require-an-appraisal',
        question: 'Why might a lender require an appraisal?',
        answer:
          'An appraisal provides an independent opinion of value and may also address the proposed improvements or supported market rent. The lender uses it with other information to assess collateral, loan-to-value, project feasibility, and the exit.\n\nThe appraiser does not approve the mortgage, and the construction cost does not determine the appraised value.',
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
      {
        id: 'completion-03-what-is-an-as-complete-appraisal',
        question: 'What is an as-complete appraisal?',
        answer:
          "An as-complete appraisal estimates the property's market value after the proposed legal work is finished, based on the plans, specifications, market evidence, and appraisal assumptions.\n\nThe lender may require updates or final confirmation during or after construction. A projected value can change if the scope, market, legality, quality, or completion status changes.",
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
      {
        id: 'completion-04-will-a-garden-suite-increase-my-property-value',
        question: 'Will a Garden Suite increase my property value?',
        answer:
          "It may affect value, but no responsible adviser can guarantee the amount. The result depends on legality, design, size, utility, rent potential, operating costs, buyer demand, property context, market conditions, and the appraiser's evidence.\n\nPlan the project using a conservative range and a financing route that does not depend on an unsupported value increase.",
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
      {
        id: 'completion-06-why-plan-the-takeout-before-the-build',
        question: 'Why plan the takeout before the build?',
        answer:
          'The construction facility may be short-term and may require repayment by a specific date. If the borrower cannot qualify for the expected takeout, the project may face extension fees, a forced refinance, additional equity requirements, or sale pressure.\n\nPlanning early tests whether the projected debt, income, rent, value, and completion date support a realistic exit.',
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
      {
        id: 'completion-07-what-evidence-can-be-required-at-completion',
        question: 'What evidence can be required at completion?',
        answer:
          'The lender may require final or progress inspections, permit and occupancy evidence, proof of completed work, updated appraisal, invoices, statutory declarations, insurance, title or lien material, deficiency information, leases or rent support, and confirmation of the final debt.\n\nThe exact list depends on the construction facility and takeout lender. Track it before the last draw.',
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
      {
        id: 'completion-08-can-cmhc-insured-refinancing-help-fund-a-garden-suite',
        question: 'Can CMHC-insured refinancing help fund a Garden Suite?',
        answer:
          'Potentially. CMHC currently offers a refinance product for eligible homeowners creating a self-contained secondary suite. Current criteria include owner or close-relative occupancy of a unit, limits on property value and loan-to-value, credit and debt-service requirements, eligible project costs, and progress advances.\n\nThe suite cannot be used as a short-term rental under the product. A lender must still approve the mortgage and submit it for insurance.',
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
      {
        id: 'completion-09-does-cmhc-refinance-require-owner-occupancy',
        question: 'Does CMHC Refinance require owner occupancy?',
        answer:
          "Yes. CMHC's current product says the borrower must own the home and the borrower or a qualifying close relative must occupy at least one unit on a rent-free basis.\n\nConfirm the live criteria and relationship definitions before relying on the product. Other lenders and insurers may have different programs and requirements.",
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
      {
        id: 'completion-10-can-the-suite-be-used-as-a-short-term-rental',
        question: 'Can the suite be used as a short-term rental?',
        answer:
          "Toronto's zoning rules and the selected financing product both matter. CMHC Refinance states that the secondary suite cannot be used as a short-term rental and defines that restriction using rental periods shorter than 90 consecutive days.\n\nDo not use projected short-term-rental income in a financing plan unless the use is legal and expressly accepted by the lender and insurer.",
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
      {
        id: 'completion-11-what-happens-if-the-appraisal-is-lower-than-expected',
        question: 'What happens if the appraisal is lower than expected?',
        answer:
          'A lower value can reduce available credit, increase the required homeowner contribution, weaken the planned takeout, or require a different financing route.\n\nReview the appraisal, scope, completion assumptions, comparable evidence, and lender policy. Do not assume the result can be changed. Rebuild the capital plan around the value the lender will accept.',
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
      {
        id: 'completion-12-what-happens-if-construction-costs-exceed-the-budget',
        question: 'What happens if construction costs exceed the budget?',
        answer:
          'Update the remaining-cost forecast immediately. Identify approved changes, committed costs, unpaid work, available contingency, undrawn credit, homeowner funds, and the minimum amount needed to reach a financeable completion stage.\n\nDo not use future rent or value as if it were cash available today. The project may need a scope decision, additional equity, lender approval, new financing, or a formal restructuring.',
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
      {
        id: 'completion-13-what-if-i-cannot-qualify-for-the-planned-takeout-mortgage',
        question: 'What if I cannot qualify for the planned takeout mortgage?',
        answer:
          'Start with the reason. The constraint may be income, debt service, credit, value, rent treatment, incomplete work, permit status, documentation, or product eligibility.\n\nPossible responses can include reducing debt, adding verified income or liquidity, resolving deficiencies, changing lenders or products, extending construction financing, or selling. Every option has cost and approval risk, so act before the construction facility matures.',
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
      {
        id: 'completion-15-what-reduces-garden-suite-financing-risk',
        question: 'What reduces Garden Suite financing risk?',
        answer:
          'The strongest controls are early site review, a complete and current budget, realistic contingency, clear contracts, qualified professionals, aligned draw milestones, verified evidence, adequate working capital, conservative value and rent assumptions, and a takeout plan tested before construction.\n\nRisk cannot be removed, but it can be made visible early enough to manage.',
        sourceFile: 'docs/context/garden-suite-faqs/06-appraisal-rent-takeout-and-risk.md',
      },
    ],
  },
] as const satisfies readonly GardenSuiteFaqGroup[]

export const gardenSuiteFaqItems: readonly GardenSuiteFaqItem[] =
  gardenSuiteFaqGroups.flatMap<GardenSuiteFaqItem>((group) => group.items)
