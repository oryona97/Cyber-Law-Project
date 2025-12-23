const { Topic, ExpertConfig, Lawyer } = require('../models');

const seedData = async () => {
  try {
    // 1. Create Topics
    const [cyberTopic, createdCyber] = await Topic.findOrCreate({
      where: { name: 'CyberLaw' },
      defaults: { 
        description: 'Legal issues related to internet, data privacy, and hacking.',
        is_active: true
      }
    });

    const [familyTopic, createdFamily] = await Topic.findOrCreate({
      where: { name: 'Family Law' },
      defaults: {
        description: 'Divorce, custody, and inheritance issues.',
        is_active: true
      }
    });

    // 2. Create Expert Configs (Personas)
    if (createdCyber) {
      await ExpertConfig.create({
        topic_id: cyberTopic.id,
        title: 'Cyber Security Intake Specialist',
        system_prompt: `You are a Cyber Law Intake Specialist. Your job is NOT to give generic advice, but to gather specific facts to prepare a case file for a senior attorney.
        
        YOUR GOAL: You must guide the user to provide the following details, one by one:
        1. The nature of the incident (Hacking, Defamation, Data Breach).
        2. When did it happen?
        3. Do they have digital evidence (screenshots, logs)?
        4. Have they filed a police report?

        STRATEGY:
        - Ask ONE question at a time.
        - Keep responses VERY SHORT (1-2 sentences max).
        - If the user is vague, ask for clarification immediately.
        - Be professional but direct. 
        - Do not provide long legal explanations; focus on fact-finding.
        `,
        max_depth: 6
      });
      console.log('Seeded CyberLaw Expert');
    }

    if (createdFamily) {
      await ExpertConfig.create({
        topic_id: familyTopic.id,
        title: 'Family Law Intake Specialist',
        system_prompt: `You are a Family Law Intake Specialist. Your goal is to gather the necessary context for a divorce or custody case consultation.

        YOUR GOAL: Collect these facts:
        1. Current status (Married, Separated, Divorced).
        2. Are there children involved?
        3. Is there an urgent conflict or domestic violence issue?

        STRATEGY:
        - Be empathetic but efficient.
        - Keep responses VERY SHORT (1-2 sentences max).
        - Ask one question at a time.
        - Prioritize safety: If violence is mentioned, urge them to contact police immediately, but continue the intake if safe.
        `,
        max_depth: 6
      });
      console.log('Seeded Family Law Expert');
    }

    // 3. Create Default Lawyer
    const [lawyer, createdLawyer] = await Lawyer.findOrCreate({
      where: { email: 'harvey@specter.com' },
      defaults: {
        name: 'Harvey Specter',
        is_active: true
      }
    });
    if (createdLawyer) console.log('Seeded Default Lawyer: Harvey Specter');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;
