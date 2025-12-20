const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/database');
const { sequelize } = require('./models'); // Import models to trigger sync
const aiRoutes = require('./routes/aiRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const adminRoutes = require('./routes/adminRoutes');
const secretaryRoutes = require('./routes/secretaryRoutes');
const aiService = require('./services/aiService');
const seedData = require('./utils/seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database and Sync Models
const startServer = async () => {
  await connectDB();
  // Sync all models with the database
  // { alter: true } updates tables to match models without dropping data
  await sequelize.sync({ alter: true });
  console.log('All models were synchronized successfully.');

  // Seed Initial Data (Topics/Personas)
  await seedData();

  // Trigger model pull (async, doesn't block server start)
  aiService.ensureModelExists();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/secretary', secretaryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Cyber Law Project Backend is running' });
});

startServer();
