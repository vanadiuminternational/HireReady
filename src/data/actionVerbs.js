export const ACTION_VERBS = {
  leadership: ['Led','Managed','Directed','Supervised','Oversaw','Guided','Coordinated','Established','Launched','Spearheaded'],
  achievement: ['Achieved','Delivered','Exceeded','Improved','Increased','Reduced','Generated','Saved','Grew','Boosted'],
  communication: ['Presented','Communicated','Collaborated','Liaised','Negotiated','Advised','Consulted','Facilitated','Trained','Mentored'],
  analysis: ['Analysed','Evaluated','Assessed','Researched','Investigated','Identified','Monitored','Reviewed','Audited','Examined'],
  technical: ['Developed','Designed','Built','Implemented','Deployed','Configured','Programmed','Engineered','Integrated','Automated'],
  operations: ['Managed','Administered','Processed','Organised','Streamlined','Maintained','Scheduled','Coordinated','Handled','Executed'],
  support: ['Supported','Assisted','Helped','Resolved','Responded','Addressed','Provided','Ensured','Maintained','Followed'],
};

export const getAllVerbs = () => Object.values(ACTION_VERBS).flat();