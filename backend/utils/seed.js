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
        title: 'Cyber Security Legal Expert',
        system_prompt: `You are an expert lawyer specializing in Cyber Law, GDPR, and Data Privacy. 
        Your goal is to help the user understand their legal standing regarding a cyber incident.
        Ask clarifying questions if the details are vague. 
        Keep your answers professional, concise, and informative. 
        Always include a disclaimer that this is not official legal advice.`,
        max_depth: 10
      });
      console.log('Seeded CyberLaw Expert');
    }

    if (createdFamily) {
      await ExpertConfig.create({
        topic_id: familyTopic.id,
        title: 'Family Law Specialist',
        system_prompt: `You are a compassionate family law attorney. 
        You help users navigate divorce and custody battles. 
        Be empathetic but grounded in legal reality.`,
        max_depth: 10
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
