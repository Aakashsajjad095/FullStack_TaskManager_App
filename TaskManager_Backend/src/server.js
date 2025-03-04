// import express from 'express';
// import bodyParser from 'body-parser';
// import taskRoutes from './routes/taskRoutes.js';

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(bodyParser.json());
// app.use('/api', taskRoutes);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


import express from 'express';
import cors from 'cors';  // Import CORS package
import taskRoutes from './routes/taskRoutes.js';

const app = express();

// Enable CORS for all origins (you can be more specific later if needed)
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Use taskRoutes for task-related APIs
app.use('/api', taskRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
