import mongoose from 'mongoose';
import express from "express"
import bodyParser from 'body-parser';
import cors from "cors"
const app = express();

// 1. Connect to MongoDB
// This connects the backend to the MongoDB database. Ensure MongoDB is running locally or replace the connection URL with your MongoDB Atlas URL if using the cloud.
mongoose.connect('mongodb://127.0.0.1:27017/passwordManager')
  .then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// 2. Middleware setup
// CORS allows cross-origin requests (i.e., between your React app and the Express backend).
app.use(cors());

// bodyParser middleware is used to parse incoming JSON requests.
app.use(bodyParser.json());

// 3. Mongoose Schema for Password
// This defines the structure of the password data that will be stored in MongoDB.
const passwordSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  username: String,
  password: String,
});

// 4. Mongoose Model
// The model connects the schema with the actual collection in the MongoDB database.
const Password = mongoose.model('Password', passwordSchema);

// 5. POST route to handle incoming data from the frontend
// When the frontend makes a POST request to /api/savePassword, this route will handle the data, create a new document, and save it in MongoDB.
app.post('/api/savePassword', async (req, res) => {
  const { url, username, password } = req.body; // Extract the data sent from the frontend.
  try {
    // Create a new password entry and save it to the database.
    const newPassword = new Password({ url, username, password });
    await newPassword.save()
    console.log(newPassword)
    // Send a success response back to the frontend.
    res.status(200).json({ message: 'Password saved successfully!' });
  } catch (error) {
    // Handle any errors and send an error response.
    res.status(500).json({ error: 'Error saving password' });
  }
});

// Add this route in your `app.js` (Express backend)
app.get('/api/getPasswords', async (req, res) => {
    try {
      // Fetch all passwords from the MongoDB collection.
      const passwords = await Password.find(); // `Password` is the Mongoose model.
      // Send the passwords back as a JSON response.
      res.status(200).json(passwords);
    } catch (error) {
      // Handle any errors.
      res.status(500).json({ error: 'Error fetching passwords' });
    }
  });
  app.delete('/api/deletePassword/:id', async (req, res) => {
    const { id } = req.params; // Extract the password ID from the request parameters
    try {
      await Password.findByIdAndDelete(id); // Find the password by ID and delete it
      res.status(200).json({ message: 'Password deleted successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting password' });
    }
  });

  app.get(("/") , (req,res)=>{
    res.send("Hello World!")
  } )

// 6. Start the Express server
// This starts the backend server on port 5000.
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
