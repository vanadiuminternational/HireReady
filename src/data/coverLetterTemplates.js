export const COVER_LETTER_TYPES = [
  { id: 'general', label: 'General Application' },
  { id: 'graduate', label: 'Graduate Role' },
  { id: 'partTime', label: 'Part-Time Job' },
  { id: 'careerChange', label: 'Career Change' },
  { id: 'admin', label: 'Admin Role' },
  { id: 'customerService', label: 'Customer Service' },
  { id: 'research', label: 'Research Role' },
  { id: 'itSupport', label: 'IT Support' },
];

export const generateCoverLetterByType = (type, userInput, jobAnalysis) => {
  const { fullName, targetJobTitle, currentRole, yearsExperience, topSkills, mainAchievement, email, phone } = userInput;
  const today = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  const contact = [email, phone].filter(Boolean).join(' | ');
  const skillList = topSkills ? topSkills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3) : [];

  const header = `${fullName || 'Your Name'}\n${contact}\n${today}\n\nHiring Manager\n\nDear Hiring Manager,\n\n`;
  const closing = `\nI would welcome the opportunity to discuss my application further. Thank you for your time and consideration.\n\nYours sincerely,\n${fullName || 'Your Name'}`;

  let body = '';

  if (type === 'graduate') {
    body = `I am writing to apply for the ${targetJobTitle || 'Graduate position'} advertised by your organisation. I recently completed my degree and am eager to begin my professional career in a role where I can apply the skills and knowledge I have developed through my studies and internship experience.\n\n`;
    if (skillList.length > 0) body += `Throughout my academic career, I developed strong competencies in ${skillList.join(', ')}, which I am confident are directly relevant to this role.\n\n`;
    if (mainAchievement) body += `${mainAchievement}\n\n`;
    body += `I am a motivated, detail-oriented graduate who is eager to learn and contribute from day one.`;

  } else if (type === 'partTime') {
    body = `I am writing to express my interest in the ${targetJobTitle || 'part-time position'} with your organisation. I am looking for a flexible part-time opportunity where I can contribute my skills while ${currentRole ? `managing my current commitments as ${currentRole}` : 'managing my other commitments'}.\n\n`;
    if (skillList.length > 0) body += `I bring relevant skills in ${skillList.join(', ')} and have a reliable, punctual work ethic.\n\n`;
    body += `I am available to work flexibly within your required hours and would welcome the chance to discuss the role further.`;

  } else if (type === 'careerChange') {
    body = `I am writing to apply for the ${targetJobTitle || 'position'} role. While my background is in ${currentRole || 'a different field'}, I have developed a strong set of transferable skills that I am confident make me a compelling candidate for this transition.\n\n`;
    if (skillList.length > 0) body += `My key transferable strengths include ${skillList.join(', ')}. These have been developed and applied throughout ${yearsExperience ? `${yearsExperience} years of` : 'my'} professional experience.\n\n`;
    if (mainAchievement) body += `${mainAchievement}\n\n`;
    body += `I am committed to this career change and have taken active steps to build the relevant knowledge and skills for this new direction.`;

  } else if (type === 'admin') {
    body = `I am writing to apply for the ${targetJobTitle || 'Administrative'} position. I have ${yearsExperience ? `${yearsExperience} years of` : 'substantial'} experience providing efficient administrative support in professional environments.\n\n`;
    body += `I am highly organised, proficient in Microsoft Office, and experienced in diary management, correspondence handling, data entry, and stakeholder coordination.\n\n`;
    if (mainAchievement) body += `${mainAchievement}\n\n`;
    body += `I thrive in fast-paced environments and take pride in ensuring smooth day-to-day operations.`;

  } else if (type === 'customerService') {
    body = `I am writing to apply for the ${targetJobTitle || 'Customer Service'} role. I have a strong background in customer-facing environments and am passionate about delivering excellent service.\n\n`;
    if (skillList.length > 0) body += `My key skills include ${skillList.join(', ')}, and I have a consistent track record of high customer satisfaction scores.\n\n`;
    if (mainAchievement) body += `${mainAchievement}\n\n`;
    body += `I am patient, professional, and committed to resolving issues efficiently while maintaining a positive customer experience.`;

  } else if (type === 'research') {
    body = `I am writing to apply for the ${targetJobTitle || 'Research'} position. I have a strong academic and professional background in research methodology, data collection, and analytical reporting.\n\n`;
    if (skillList.length > 0) body += `My research competencies include ${skillList.join(', ')}, and I am experienced in producing high-quality written outputs for both academic and non-specialist audiences.\n\n`;
    if (mainAchievement) body += `${mainAchievement}\n\n`;
    body += `I am detail-oriented, methodical, and committed to producing rigorous, evidence-based work.`;

  } else if (type === 'itSupport') {
    body = `I am writing to apply for the ${targetJobTitle || 'IT Support'} position. I have ${yearsExperience ? `${yearsExperience} years of` : 'solid'} experience providing technical support in corporate environments, with a strong focus on first and second line incident resolution.\n\n`;
    if (skillList.length > 0) body += `I am proficient in ${skillList.join(', ')} and have a proven track record of resolving incidents within SLA.\n\n`;
    if (mainAchievement) body += `${mainAchievement}\n\n`;
    body += `I am a calm, methodical problem-solver who communicates technical issues clearly to non-technical stakeholders.`;

  } else {
    // General
    body = `I am writing to express my interest in the ${targetJobTitle || 'position'} role at your organisation. `;
    if (currentRole && yearsExperience) body += `With ${yearsExperience} year${yearsExperience === '1' ? '' : 's'} of experience as a ${currentRole}, `;
    body += skillList.length > 0 ? `I bring strong expertise in ${skillList.join(', ')}.\n\n` : `I am confident I can contribute effectively to your team.\n\n`;
    if (mainAchievement) body += `${mainAchievement}\n\n`;
    if (jobAnalysis?.hardSkills?.length > 0) body += `I was particularly drawn to this role given the emphasis on ${jobAnalysis.hardSkills.slice(0, 3).join(', ')}, areas where I have built strong capability.\n\n`;
  }

  return header + body + closing;
};