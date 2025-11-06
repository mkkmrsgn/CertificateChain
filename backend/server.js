const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
const webauthnRoutes = require('./routes/webauthn'); // 👈 ADD THIS LINE

app.use("/api/auth", authRoutes);
app.use("/api/webauthn", webauthnRoutes); // 👈 ADD THIS TOO

app.listen(3001, () => {
  console.log("✅ Backend running on http://localhost:3001");
});
