export const TEMPLATE_RULES = {
  student: {
    id: 'student',
    name: 'Student CV',
    bestFor: 'Students with limited work experience',
    sectionOrder: ['summary', 'education', 'projects', 'skills', 'experience', 'certifications'],
    atsLabel: 'ATS-Safe',
    description: 'Emphasises education, projects, and skills over work experience.',
    color: 'blue',
    exampleSummary: 'Motivated Business Studies student at University College Dublin with experience in event coordination and customer service. Seeking a graduate marketing role to apply analytical and communication skills developed through academic projects and part-time work.',
    exampleSkills: ['Microsoft Office', 'Data Analysis', 'Communication', 'Teamwork', 'Event Planning', 'Social Media'],
    exampleBullets: [
      'Coordinated a 3-day student conference for 200 attendees, managing logistics, vendors, and volunteers.',
      'Achieved a 2.1 Honours degree with distinctions in Marketing and Business Statistics.',
      'Supported campus fundraising events, raising €4,000 over two academic years.',
    ],
  },
  graduate: {
    id: 'graduate',
    name: 'Graduate CV',
    bestFor: 'Recent graduates entering the job market',
    sectionOrder: ['summary', 'education', 'projects', 'skills', 'experience', 'certifications'],
    atsLabel: 'ATS-Safe',
    description: 'Clean structure highlighting academic achievement and early career steps.',
    color: 'emerald',
    exampleSummary: 'Recent Psychology graduate with first-class honours from Trinity College Dublin. Experienced in research design, data collection, and report writing through academic and internship placements. Eager to contribute to a graduate HR or research role.',
    exampleSkills: ['Research Design', 'SPSS', 'Report Writing', 'Data Collection', 'Presentation Skills', 'Critical Thinking'],
    exampleBullets: [
      'Conducted a 6-month dissertation study on workplace wellbeing, analysing 150 survey responses.',
      'Completed a 3-month HR internship, supporting recruitment, onboarding, and employee engagement.',
      'Presented research findings to a panel of 5 academic staff, receiving distinction-level feedback.',
    ],
  },
  professional: {
    id: 'professional',
    name: 'Professional CV',
    bestFor: 'Professionals with 3+ years of experience',
    sectionOrder: ['summary', 'coreSkills', 'experience', 'achievements', 'education', 'certifications'],
    atsLabel: 'ATS-Safe',
    description: 'Achievement-driven format for experienced professionals.',
    color: 'navy',
    exampleSummary: 'Results-driven Marketing Manager with 7 years of experience in B2B and B2C campaigns across the technology and retail sectors. Track record of delivering measurable ROI and building high-performing teams. Seeking a senior marketing role in a growth-stage company.',
    exampleSkills: ['Campaign Strategy', 'Team Leadership', 'CRM Systems', 'Budget Management', 'SEO/SEM', 'Stakeholder Management'],
    exampleBullets: [
      'Led a cross-functional campaign team of 8, delivering a 35% increase in qualified leads.',
      'Managed a €500k annual marketing budget, achieving 28% cost reduction without impacting output.',
      'Introduced a CRM segmentation strategy that improved email open rates by 22%.',
    ],
  },
  careerChanger: {
    id: 'careerChanger',
    name: 'Career Changer CV',
    bestFor: 'Professionals changing industries or roles',
    sectionOrder: ['summary', 'transferableSkills', 'projects', 'experience', 'education', 'certifications'],
    atsLabel: 'ATS-Safe',
    description: 'Emphasises transferable skills and relevant projects over direct experience.',
    color: 'purple',
    exampleSummary: 'Former secondary school teacher transitioning into Learning & Development with 8 years of experience designing curriculum, delivering group training, and measuring learner outcomes. Certified in CIPD Level 5 L&D. Seeking a Training Coordinator or L&D Advisor role.',
    exampleSkills: ['Instructional Design', 'Training Delivery', 'Needs Analysis', 'Curriculum Development', 'Facilitation', 'LMS Platforms'],
    exampleBullets: [
      'Designed and delivered a 12-week literacy programme for 90 students, improving test scores by 18%.',
      'Facilitated staff professional development workshops for groups of up to 30 educators.',
      'Completed CIPD Level 5 Certificate in Learning and Development Practice.',
    ],
  },
  admin: {
    id: 'admin',
    name: 'Admin CV',
    bestFor: 'Office administrators, executive assistants, coordinators',
    sectionOrder: ['summary', 'coreSkills', 'experience', 'education', 'certifications'],
    atsLabel: 'ATS-Safe',
    description: 'Structured for detail-oriented admin roles emphasising organisation and systems.',
    color: 'blue',
    exampleSummary: 'Organised and proactive Office Administrator with 5 years of experience supporting senior management teams in fast-paced environments. Skilled in diary management, correspondence, data entry, and supplier coordination. Seeking an EA or senior admin position.',
    exampleSkills: ['Microsoft Office Suite', 'Diary Management', 'Data Entry', 'Filing & Records', 'Minute Taking', 'Customer Service'],
    exampleBullets: [
      'Managed complex travel and meeting schedules for 3 senior directors across multiple time zones.',
      'Maintained filing and document management systems, reducing retrieval time by 30%.',
      'Processed purchase orders and supplier invoices totalling €200k annually.',
    ],
  },
  customerService: {
    id: 'customerService',
    name: 'Customer Service CV',
    bestFor: 'Customer service agents, advisors, front-line support',
    sectionOrder: ['summary', 'coreSkills', 'experience', 'education'],
    atsLabel: 'ATS-Safe',
    description: 'Highlights service skills, communication, and resolution track record.',
    color: 'emerald',
    exampleSummary: 'Customer-focused service professional with 4 years of experience in inbound call centre and retail environments. Skilled in query resolution, complaint handling, and upselling. Consistently rated above 95% on customer satisfaction surveys.',
    exampleSkills: ['Customer Queries', 'Complaint Handling', 'CRM Systems', 'Upselling', 'Phone Etiquette', 'Team Collaboration'],
    exampleBullets: [
      'Resolved an average of 80 customer queries daily across phone, email, and live chat.',
      'Maintained a 97% customer satisfaction score across 18 months in the role.',
      'Trained 3 new team members on CRM system and complaint escalation procedures.',
    ],
  },
  retail: {
    id: 'retail',
    name: 'Retail CV',
    bestFor: 'Retail assistants, supervisors, floor managers',
    sectionOrder: ['summary', 'coreSkills', 'experience', 'education'],
    atsLabel: 'ATS-Safe',
    description: 'Focused on sales, customer interaction, and store operations.',
    color: 'blue',
    exampleSummary: 'Reliable and target-driven Retail Supervisor with 3 years of experience in fashion and grocery retail. Experienced in stock management, team supervision, and delivering excellent customer experiences. Looking to progress into a store management role.',
    exampleSkills: ['Sales', 'Stock Management', 'Team Supervision', 'Visual Merchandising', 'Cash Handling', 'POS Systems'],
    exampleBullets: [
      'Supervised a team of 6 sales associates, achieving department sales targets for 8 consecutive months.',
      'Managed weekly stocktakes, reducing shrinkage by 12% over a 6-month period.',
      'Delivered new product training sessions to 10 staff members during seasonal changeovers.',
    ],
  },
  hospitality: {
    id: 'hospitality',
    name: 'Hospitality CV',
    bestFor: 'Hotel, restaurant, bar, and events staff',
    sectionOrder: ['summary', 'coreSkills', 'experience', 'education'],
    atsLabel: 'ATS-Safe',
    description: 'Tailored for service-sector roles in hotels, restaurants, and events.',
    color: 'purple',
    exampleSummary: 'Experienced Hospitality Professional with 5 years in 4-star hotel and fine dining environments. Skilled in front-of-house operations, guest relations, and team coordination. Committed to delivering consistent, high-quality guest experiences.',
    exampleSkills: ['Guest Relations', 'Food & Beverage Service', 'Reservations Systems', 'Team Coordination', 'HACCP', 'Upselling'],
    exampleBullets: [
      'Delivered front-of-house service for events of up to 300 guests, coordinating with kitchen and bar teams.',
      'Maintained a TripAdvisor property rating of 4.6/5 through consistent service delivery.',
      'Trained and onboarded 4 seasonal staff members in service standards and safety procedures.',
    ],
  },
  itSupport: {
    id: 'itSupport',
    name: 'IT Support CV',
    bestFor: 'IT support analysts, helpdesk, systems administrators',
    sectionOrder: ['summary', 'technicalSkills', 'experience', 'projects', 'education', 'certifications'],
    atsLabel: 'ATS-Safe',
    description: 'Highlights technical stack, tools, and support track record.',
    color: 'emerald',
    exampleSummary: 'IT Support Analyst with 3 years of experience providing 1st and 2nd line technical support in corporate and public sector environments. Proficient in Windows, Active Directory, and Microsoft 365. CompTIA A+ certified.',
    exampleSkills: ['Windows Server', 'Active Directory', 'Microsoft 365', 'ServiceNow', 'Network Troubleshooting', 'CompTIA A+'],
    exampleBullets: [
      'Resolved 95% of 1st line tickets within SLA across a 500-user organisation.',
      'Supported Office 365 migration for 200 users with zero critical data loss incidents.',
      'Built and deployed 30 workstations during an office relocation project, completed on schedule.',
    ],
  },
  researchAssistant: {
    id: 'researchAssistant',
    name: 'Research Assistant CV',
    bestFor: 'Academic researchers, research officers, lab assistants',
    sectionOrder: ['summary', 'coreSkills', 'experience', 'projects', 'education', 'certifications'],
    atsLabel: 'ATS-Safe',
    description: 'Structured for research roles with publications, methods, and analysis.',
    color: 'navy',
    exampleSummary: 'Diligent Research Assistant with 2 years of experience in quantitative and qualitative social research. Skilled in literature review, data collection, SPSS analysis, and academic writing. Currently supporting an EU-funded project on digital inclusion.',
    exampleSkills: ['Literature Review', 'SPSS', 'Qualitative Analysis', 'Academic Writing', 'Survey Design', 'Ethics Compliance'],
    exampleBullets: [
      'Conducted 45 semi-structured interviews as part of a national digital inclusion study.',
      'Analysed survey data from 300 respondents using SPSS, producing summary reports for project leads.',
      'Co-authored 2 conference papers submitted to peer-reviewed journals.',
    ],
  },
  projectOfficer: {
    id: 'projectOfficer',
    name: 'Project Officer CV',
    bestFor: 'Project officers, coordinators, programme managers',
    sectionOrder: ['summary', 'coreSkills', 'experience', 'education', 'certifications'],
    atsLabel: 'ATS-Safe',
    description: 'Focused on project delivery, stakeholder coordination, and reporting.',
    color: 'blue',
    exampleSummary: 'Organised Project Officer with 4 years of experience managing EU and national government-funded projects. Skilled in project planning, stakeholder engagement, financial reporting, and risk management. PRINCE2 Foundation certified.',
    exampleSkills: ['Project Planning', 'Stakeholder Engagement', 'Budget Monitoring', 'Risk Management', 'MS Project', 'PRINCE2'],
    exampleBullets: [
      'Managed delivery of a €1.2m EU-funded digital skills project across 6 partner organisations.',
      'Prepared quarterly financial and progress reports submitted to the funding body on time.',
      'Coordinated 12 stakeholder workshops, facilitating consensus on project milestones.',
    ],
  },
  healthcareAssistant: {
    id: 'healthcareAssistant',
    name: 'Healthcare Assistant CV',
    bestFor: 'Healthcare assistants, care workers, support workers',
    sectionOrder: ['summary', 'coreSkills', 'experience', 'education', 'certifications'],
    atsLabel: 'ATS-Safe',
    description: 'Focused on patient care, compliance, and team-based healthcare delivery.',
    color: 'emerald',
    exampleSummary: 'Compassionate and reliable Healthcare Assistant with 3 years of experience in acute hospital and residential care settings. Skilled in personal care, patient monitoring, and multidisciplinary team support. QQI Level 5 Care Skills certified.',
    exampleSkills: ['Personal Care', 'Patient Monitoring', 'Record Keeping', 'Infection Control', 'Moving & Handling', 'HIQA Compliance'],
    exampleBullets: [
      'Provided personal care and daily living support for up to 8 patients per shift in an acute ward.',
      'Maintained accurate patient records in line with HIQA standards and data protection guidelines.',
      'Supported nursing staff during emergency situations, following established protocols.',
    ],
  },
};

export const selectTemplate = (experienceLevel, industry = '') => {
  const ind = (industry || '').toLowerCase();
  if (['it', 'software', 'engineering', 'developer', 'tech', 'data', 'cloud', 'cyber', 'helpdesk', 'support'].some(k => ind.includes(k))) return TEMPLATE_RULES.itSupport;
  if (['research', 'academic', 'lab', 'science'].some(k => ind.includes(k))) return TEMPLATE_RULES.researchAssistant;
  if (['project', 'programme', 'eu', 'ngo', 'grants', 'policy'].some(k => ind.includes(k))) return TEMPLATE_RULES.projectOfficer;
  if (['admin', 'office', 'executive assistant', 'coordinator'].some(k => ind.includes(k))) return TEMPLATE_RULES.admin;
  if (['customer service', 'call centre', 'support agent'].some(k => ind.includes(k))) return TEMPLATE_RULES.customerService;
  if (['retail', 'shop', 'store', 'sales assistant'].some(k => ind.includes(k))) return TEMPLATE_RULES.retail;
  if (['hotel', 'restaurant', 'hospitality', 'bar', 'catering', 'events'].some(k => ind.includes(k))) return TEMPLATE_RULES.hospitality;
  if (['care', 'healthcare', 'nursing', 'hca', 'hospital'].some(k => ind.includes(k))) return TEMPLATE_RULES.healthcareAssistant;
  if (experienceLevel === 'Student') return TEMPLATE_RULES.student;
  if (experienceLevel === 'Graduate') return TEMPLATE_RULES.graduate;
  if (experienceLevel === 'Career Changer') return TEMPLATE_RULES.careerChanger;
  return TEMPLATE_RULES.professional;
};