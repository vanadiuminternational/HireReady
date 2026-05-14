/**
 * sampleJobDescriptions.js
 * Rule-based sample job descriptions keyed by job title keywords and industry.
 * Used to auto-populate the job description field when users don't have one.
 */

export const SAMPLE_JD_MAP = {
  // ─── Admin / Office ──────────────────────────────────────────────────────────
  admin: `We are seeking a reliable and organised Office Administrator to join our team. The successful candidate will provide comprehensive administrative support across the organisation.

Key Responsibilities:
- Manage diaries, schedules, and meeting room bookings for senior staff
- Handle incoming correspondence, phone calls, and emails professionally
- Maintain accurate filing systems and databases (physical and digital)
- Process purchase orders, invoices, and expense claims
- Prepare reports, presentations, and meeting agendas
- Coordinate with internal departments and external suppliers
- Support onboarding and HR administration tasks

Requirements:
- 2+ years of office administration or executive assistant experience
- Proficiency in Microsoft Office Suite (Word, Excel, Outlook, PowerPoint)
- Excellent organisational and time management skills
- Strong written and verbal communication skills
- Ability to work independently and manage competing priorities
- Experience with diary management and stakeholder coordination
- Knowledge of data protection regulations (GDPR) is an advantage

Desirable: FETAC/QQI Level 5 or equivalent qualification in office administration.`,

  // ─── Customer Service ────────────────────────────────────────────────────────
  'customer service': `We are recruiting a Customer Service Advisor to join our busy contact centre team. You will be the first point of contact for customers across phone, email, and live chat.

Key Responsibilities:
- Handle inbound customer queries, complaints, and escalations professionally
- Resolve issues at first contact where possible, following company procedures
- Update and maintain customer records accurately using our CRM system
- Process orders, returns, and account changes in a timely manner
- Meet or exceed individual and team KPIs including satisfaction scores and handle times
- Identify opportunities to upsell or cross-sell relevant products and services
- Collaborate with team leaders and back-office departments

Requirements:
- Previous customer service or call centre experience preferred
- Excellent communication skills, both written and verbal
- Proficiency in CRM or ticketing systems (e.g. Salesforce, Zendesk)
- Ability to remain calm and professional under pressure
- Strong problem-solving skills and attention to detail
- Flexible approach to shift work and rota patterns

We offer: Full training, performance bonuses, and career progression opportunities.`,

  // ─── IT Support ──────────────────────────────────────────────────────────────
  'it support': `We are looking for an IT Support Analyst to provide 1st and 2nd line technical support across our organisation. You will be responsible for resolving incidents, managing service requests, and supporting the IT infrastructure.

Key Responsibilities:
- Provide remote and on-site technical support for hardware and software issues
- Log, prioritise, and resolve incidents within agreed SLA timeframes using ServiceNow
- Support Microsoft 365 administration including user provisioning and mailbox management
- Manage Active Directory accounts, group policies, and access permissions
- Build, configure, and deploy Windows workstations and laptops
- Troubleshoot network connectivity issues (LAN/WAN/Wi-Fi/VPN)
- Maintain asset register and IT documentation

Requirements:
- 1–3 years of IT support experience in a corporate environment
- Hands-on experience with Windows 10/11, Microsoft 365, and Active Directory
- Solid understanding of networking fundamentals (TCP/IP, DNS, DHCP)
- Experience with ITSM tools such as ServiceNow, Remedy, or Jira Service Management
- CompTIA A+ or equivalent certification preferred
- Strong communication skills and ability to explain technical issues clearly

Desirable: ITIL Foundation certification, Azure or Intune experience.`,

  // ─── Healthcare ──────────────────────────────────────────────────────────────
  healthcare: `We are seeking a compassionate and dedicated Healthcare Assistant to join our team in an acute hospital setting. You will work as part of a multidisciplinary team to deliver high-quality patient care.

Key Responsibilities:
- Assist nursing staff in providing personal care including washing, dressing, and mobility support
- Monitor and record patient observations (temperature, blood pressure, pulse, oxygen levels)
- Maintain accurate patient records in line with HIQA standards and data protection requirements
- Ensure a safe, clean, and comfortable environment for patients at all times
- Support meal preparation and feeding assistance for patients requiring help
- Adhere to infection control and manual handling protocols at all times
- Participate in ward handover meetings and report changes in patient condition

Requirements:
- QQI Level 5 Certificate in Healthcare Support or equivalent (essential)
- Experience in a healthcare or residential care setting preferred
- Manual Handling certification
- Knowledge of HIQA standards and patient safety regulations
- Ability to work effectively in a team under pressure
- Genuine commitment to patient-centred care

Desirable: Venepuncture, ECG, or wound care training.`,

  // ─── Retail ──────────────────────────────────────────────────────────────────
  retail: `We are looking for a friendly and motivated Retail Sales Assistant to join our store team. You will deliver excellent customer service and support daily retail operations.

Key Responsibilities:
- Welcome customers, identify their needs, and provide product advice
- Process sales transactions accurately using our POS system
- Maintain store presentation, visual merchandising, and cleanliness standards
- Manage stock replenishment, delivery intake, and stockroom organisation
- Assist with promotional setups, seasonal changeovers, and stock counts
- Handle customer returns, exchanges, and complaints in line with company policy
- Meet individual and store sales targets

Requirements:
- Previous retail or customer-facing experience preferred
- Strong interpersonal and communication skills
- Reliable, punctual, and flexible with shift and weekend availability
- Ability to work as part of a team in a fast-paced environment
- Basic numeracy skills and cash handling experience
- Knowledge of visual merchandising is an advantage`,

  // ─── Hospitality ─────────────────────────────────────────────────────────────
  hospitality: `We are recruiting a Front of House team member to join our busy restaurant and hotel operations team. You will deliver consistently high standards of guest service and support efficient operations.

Key Responsibilities:
- Welcome and seat guests in a warm, professional manner
- Take food and beverage orders accurately and liaise with kitchen and bar teams
- Deliver food and drinks promptly and present menus and specials confidently
- Handle guest enquiries, reservations, and complaints with professionalism
- Process payments and maintain accurate till records
- Uphold hygiene, food safety (HACCP), and allergen awareness standards
- Contribute to team briefings and service debriefs

Requirements:
- Previous hospitality, restaurant, or hotel experience preferred
- Excellent communication and customer service skills
- Knowledge of allergens and food safety legislation
- Ability to work effectively under pressure during busy service periods
- Flexible availability including evenings and weekends
- Smart professional appearance and positive attitude`,

  // ─── Graduate ────────────────────────────────────────────────────────────────
  graduate: `We are offering a Graduate Development Programme for ambitious graduates who want to build a career in a fast-paced professional environment.

Key Responsibilities:
- Support senior team members on live projects and client deliverables
- Conduct research, data collection, and analysis as required
- Prepare reports, presentations, and written communications
- Attend client meetings and internal team briefings
- Contribute ideas and insights as part of a collaborative team
- Participate in structured graduate training and mentoring sessions

Requirements:
- A bachelor's degree (2.1 or above) in a relevant discipline
- Strong analytical, communication, and problem-solving skills
- Proficiency in Microsoft Office Suite
- Enthusiastic, proactive, and eager to learn
- Strong attention to detail and ability to manage deadlines
- Team player with the ability to work independently

Desirable: Relevant internship or placement experience; knowledge of industry-specific tools.`,

  // ─── Project / Research ───────────────────────────────────────────────────────
  project: `We are seeking an experienced Project Officer to support the delivery of funded programmes and organisational initiatives.

Key Responsibilities:
- Coordinate project activities, timelines, and deliverables across multiple workstreams
- Liaise with internal teams, partner organisations, and funding bodies
- Prepare and submit financial and progress reports to funders on schedule
- Maintain project documentation, risk registers, and action logs
- Organise and facilitate stakeholder meetings and workshops
- Monitor project budgets and flag variances to senior management
- Ensure compliance with funder guidelines and data protection requirements

Requirements:
- 3+ years of project coordination or project management experience
- Strong knowledge of project management methodologies (PRINCE2 or equivalent)
- Experience of EU-funded or government-funded project administration is desirable
- Excellent report writing and stakeholder communication skills
- Proficiency in MS Project, Excel, and document management systems
- Ability to manage multiple priorities and meet strict deadlines
- Experience with financial reporting and grant management is an advantage`,

  // ─── Default / General Professional ──────────────────────────────────────────
  default: `We are seeking a motivated and experienced professional to join our growing team. The successful candidate will contribute to the delivery of high-quality outcomes across the organisation.

Key Responsibilities:
- Manage day-to-day operational tasks and priorities efficiently
- Collaborate with cross-functional teams to deliver projects on time
- Prepare reports, documentation, and presentations for internal and external stakeholders
- Build and maintain positive relationships with clients, partners, and suppliers
- Identify process improvements and contribute to continuous improvement initiatives
- Support team leadership in planning and resource allocation

Requirements:
- Relevant professional experience in a similar role
- Strong communication skills, both written and verbal
- Excellent organisational skills and ability to manage competing priorities
- Proficiency in Microsoft Office or equivalent productivity tools
- Team player with a proactive and solutions-focused attitude
- Relevant qualification or equivalent professional experience

We offer a competitive salary, flexible working arrangements, and opportunities for career development.`,
};

/**
 * Returns the best matching sample job description based on job title and industry.
 * Matching is keyword-based — no AI required.
 */
export const getSampleJobDescription = (targetJobTitle = '', industry = '') => {
  const combined = `${targetJobTitle} ${industry}`.toLowerCase();

  if (['admin', 'administrator', 'coordinator', 'secretary', 'office', 'executive assistant'].some(k => combined.includes(k))) return SAMPLE_JD_MAP.admin;
  if (['customer service', 'customer support', 'call centre', 'contact centre', 'advisor', 'agent'].some(k => combined.includes(k))) return SAMPLE_JD_MAP['customer service'];
  if (['it support', 'helpdesk', 'service desk', 'technical support', 'systems', 'network', 'infrastructure'].some(k => combined.includes(k))) return SAMPLE_JD_MAP['it support'];
  if (['care', 'healthcare', 'hca', 'nursing', 'hospital', 'ward', 'carer'].some(k => combined.includes(k))) return SAMPLE_JD_MAP.healthcare;
  if (['retail', 'shop', 'store', 'sales assistant', 'merchandis'].some(k => combined.includes(k))) return SAMPLE_JD_MAP.retail;
  if (['hotel', 'hospitality', 'restaurant', 'bar', 'catering', 'front of house', 'waiter', 'barista'].some(k => combined.includes(k))) return SAMPLE_JD_MAP.hospitality;
  if (['graduate', 'intern', 'trainee', 'entry level', 'junior'].some(k => combined.includes(k))) return SAMPLE_JD_MAP.graduate;
  if (['project', 'programme', 'research', 'analyst', 'officer', 'eu funded', 'grants'].some(k => combined.includes(k))) return SAMPLE_JD_MAP.project;

  return SAMPLE_JD_MAP.default;
};