export const INTERVIEW_QUESTIONS = [
  { id: 1, category: 'About You', question: 'Tell me about yourself.', tip: 'Use the Present–Past–Future structure. Keep it to 2 minutes.' },
  { id: 2, category: 'About You', question: 'What are your greatest strengths?', tip: 'Pick 2–3 strengths relevant to the role and give a brief example for each.' },
  { id: 3, category: 'About You', question: 'What is your biggest weakness?', tip: 'Choose a real but improvable weakness. Show what you are doing to address it.' },
  { id: 4, category: 'About You', question: 'Where do you see yourself in 5 years?', tip: 'Align your goals with growth in the company. Show ambition but also commitment.' },
  { id: 5, category: 'Motivation', question: 'Why do you want this job?', tip: 'Research the company. Mention the role, the team, and the company\u2019s values.' },
  { id: 6, category: 'Motivation', question: 'Why are you leaving your current role?', tip: 'Be honest but positive. Never criticise your current employer.' },
  { id: 7, category: 'Motivation', question: 'Why should we hire you?', tip: 'Summarise your top 3 strengths and link them directly to what the job needs.' },
  { id: 8, category: 'Behavioural', question: 'Tell me about a time you dealt with a difficult colleague or customer.', tip: 'Use STAR. Focus on your actions and the positive outcome.' },
  { id: 9, category: 'Behavioural', question: 'Describe a situation where you had to meet a tight deadline.', tip: 'Show planning, prioritisation, and delivery. Mention the result.' },
  { id: 10, category: 'Behavioural', question: 'Give an example of a time you showed initiative.', tip: 'Choose something you did without being asked that had a clear positive impact.' },
  { id: 11, category: 'Behavioural', question: 'Tell me about a time you made a mistake and how you handled it.', tip: 'Be honest. Show accountability, problem-solving, and what you learned.' },
  { id: 12, category: 'Behavioural', question: 'Describe a time you worked effectively as part of a team.', tip: 'Highlight your specific contribution and the team outcome.' },
  { id: 13, category: 'Behavioural', question: 'Tell me about a time you had to adapt to a major change at work.', tip: 'Show flexibility and a positive attitude. Describe the impact of your response.' },
  { id: 14, category: 'Behavioural', question: 'Give an example of when you went above and beyond in a role.', tip: 'Quantify the result if possible. Show the extra effort was meaningful.' },
  { id: 15, category: 'Role-Specific', question: 'How do you prioritise your workload when you have multiple deadlines?', tip: 'Mention tools (lists, calendar, project board) and your decision logic.' },
  { id: 16, category: 'Role-Specific', question: 'How do you handle working under pressure?', tip: 'Give a real example. Focus on your calm, structured approach.' },
  { id: 17, category: 'Role-Specific', question: 'What tools and software are you experienced with?', tip: 'Be specific and honest. Match tools to those mentioned in the job description.' },
  { id: 18, category: 'Role-Specific', question: 'How do you keep up to date with developments in your industry?', tip: 'Mention podcasts, newsletters, LinkedIn, professional bodies, or courses.' },
  { id: 19, category: 'Closing', question: 'Do you have any questions for us?', tip: 'Always prepare 2–3 thoughtful questions. Never say "no".' },
  { id: 20, category: 'Closing', question: 'What are your salary expectations?', tip: 'Research market rates first. Give a range and explain why.' },
];

export const STAR_GUIDE = {
  title: 'The STAR Method',
  description: 'Use STAR to answer any behavioural interview question clearly and confidently.',
  steps: [
    { label: 'S — Situation', desc: 'Set the scene. Where were you? What was the context? Keep it brief.' },
    { label: 'T — Task', desc: 'What was your responsibility? What were you asked to do?' },
    { label: 'A — Action', desc: 'What did YOU specifically do? Use "I" not "we". Be specific about your actions.' },
    { label: 'R — Result', desc: 'What happened as a result? Quantify if possible (%, time saved, cost reduced).' },
  ],
  tip: 'Spend 20% on Situation and Task, 50% on Action, and 30% on Result.',
};

export const EXAMPLE_ANSWERS = [
  {
    question: 'Tell me about yourself.',
    answer: 'I am a project coordinator with 4 years of experience in the public sector, most recently managing an EU-funded digital skills programme. I have a strong background in stakeholder engagement and financial reporting, and I recently completed my PRINCE2 Foundation certification. I am now looking for a senior project role where I can take on greater ownership of delivery.',
  },
  {
    question: 'Tell me about a time you dealt with a difficult customer.',
    answer: 'In my previous customer service role, a client called in extremely frustrated after receiving incorrect billing for three months. I listened without interrupting, apologised sincerely, and immediately escalated the case to our finance team while staying on the call. I followed up with the client daily until the issue was resolved within 48 hours. The client later submitted a positive review specifically mentioning my handling of the situation.',
  },
  {
    question: 'Describe a situation where you had to meet a tight deadline.',
    answer: 'My manager was off sick the week our quarterly report was due to the board. I had never produced it independently before, but I reviewed the previous reports, gathered data from three departments, and completed a draft 24 hours ahead of the deadline. The board approved it without amendments. My manager later used my version as a template for future reports.',
  },
  {
    question: 'Why do you want this job?',
    answer: 'I have followed your organisation for the past two years and I am genuinely impressed by your commitment to community-based programmes. The Project Officer role aligns directly with my experience in multi-stakeholder coordination and EU reporting. I am particularly motivated by the opportunity to contribute to the digital inclusion project, which is an area I care about professionally and personally.',
  },
  {
    question: 'What is your biggest weakness?',
    answer: 'I used to struggle with delegating tasks because I wanted to ensure quality. Over the past year, I have actively worked on this by using a shared task board with my team and setting clearer handover briefs. It has made our output faster and improved team confidence, and I have learned to trust my colleagues more.',
  },
  {
    question: 'Tell me about a time you showed initiative.',
    answer: 'I noticed our onboarding documentation had not been updated in two years and was causing confusion for new starters. Without being asked, I rewrote the entire staff handbook over two weeks, worked with HR to get it approved, and shared it with the team. New starters now consistently say onboarding feels much clearer.',
  },
  {
    question: 'How do you handle working under pressure?',
    answer: 'I use a combination of a priority matrix and a daily task list to stay focused. During a recent system migration, I had to support 50 users across three sites simultaneously. I triaged issues by severity, communicated realistic timelines to users, and kept my manager updated on blockers. We completed the migration on time with no data loss.',
  },
  {
    question: 'Where do you see yourself in 5 years?',
    answer: 'I would like to grow into a senior or management role in project delivery. I am currently building my skills in stakeholder management and financial governance, and I am working toward a full PRINCE2 Practitioner certification. I see this role as the ideal environment to develop those capabilities while contributing to meaningful projects.',
  },
  {
    question: 'Why should we hire you?',
    answer: 'I bring three things that I believe are directly relevant to this role: proven experience managing multi-funder projects, strong attention to reporting and compliance requirements, and a collaborative working style that keeps stakeholders informed and on-side. I also have a track record of delivering in fast-paced environments, which I understand is important here.',
  },
  {
    question: 'Do you have any questions for us?',
    answer: 'Yes, I have three. First, how does the team currently measure success on this project? Second, what does the onboarding process look like for this role? And third, are there opportunities for professional development or training for the successful candidate?',
  },
];

export const QUESTIONS_TO_ASK = [
  'What does success look like in this role after 6 months?',
  'Can you describe the team I would be working with?',
  'What are the biggest challenges facing the team right now?',
  'How does the company support professional development?',
  'What is the typical career path for someone in this role?',
  'How would you describe the culture here?',
  'What are the next steps in the process?',
  'Is there anything in my background that gives you pause — I am happy to address it now.',
];

export const INTERVIEW_CHECKLIST = [
  { category: 'Before the Interview', items: [
    'Research the company — website, LinkedIn, recent news',
    'Re-read the job description and note the key requirements',
    'Prepare 3–5 STAR examples relevant to the role',
    'Prepare 3 questions to ask the interviewer',
    'Confirm the time, location (or video link), and interviewer name',
    'Plan your route and allow extra travel time',
    'Prepare your outfit the night before',
    'Print 2 copies of your CV (or have it on your phone)',
  ]},
  { category: 'On the Day', items: [
    'Arrive 10 minutes early (for in-person), or log in 5 minutes early (for video)',
    'Switch your phone to silent before entering',
    'Greet the interviewer with a firm handshake and eye contact',
    'Bring a notepad and pen',
    'Bring your ID if required',
  ]},
  { category: 'During the Interview', items: [
    'Listen carefully before answering — it is fine to pause and think',
    'Use the STAR method for behavioural questions',
    'Ask for clarification if you do not understand a question',
    'Be honest — do not overstate your experience',
    'Ask your prepared questions at the end',
  ]},
  { category: 'After the Interview', items: [
    'Send a brief thank-you email within 24 hours',
    'Note what went well and what you would improve',
    'Follow up if you have not heard back after the stated timeframe',
  ]},
];