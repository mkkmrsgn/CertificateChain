// backend/routes/webauthn.js
const express = require("express");
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require("@simplewebauthn/server");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// Temporary in-memory store (replace with DB later)
const userDatabase = new Map();

/**
 * Register a new WebAuthn credential
 */
router.post("/register", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Missing username" });

  const userId = uuidv4();

  const options = generateRegistrationOptions({
    rpName: "CertificateChain",
    rpID: "localhost",
    userID: userId,
    userName: username,
    timeout: 60000,
    attestationType: "none",
    authenticatorSelection: {
      authenticatorAttachment: "platform", // built-in fingerprint / face sensor
      userVerification: "required",
    },
  });

  userDatabase.set(username, {
    ...userDatabase.get(username),
    challenge: options.challenge,
  });

  res.json(options);
});

/**
 * Verify the registration response
 */
router.post("/verify-registration", async (req, res) => {
  const { username, attResp } = req.body;
  const user = userDatabase.get(username);

  if (!user) return res.status(400).json({ error: "User not found" });

  try {
    const verification = await verifyRegistrationResponse({
      response: attResp,
      expectedChallenge: user.challenge,
      expectedOrigin: "http://localhost:3000",
      expectedRPID: "localhost",
    });

    if (verification.verified) {
      const { registrationInfo } = verification;
      userDatabase.set(username, {
        credentialID: registrationInfo.credentialID,
        credentialPublicKey: registrationInfo.credentialPublicKey,
        counter: registrationInfo.counter,
      });
    }

    res.json({ verified: verification.verified });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Verification failed" });
  }
});

/**
 * Start authentication (login)
 */
router.post("/login", async (req, res) => {
  const { username } = req.body;
  const user = userDatabase.get(username);

  if (!user || !user.credentialID)
    return res.status(400).json({ error: "User not registered with biometrics" });

  const options = generateAuthenticationOptions({
    allowCredentials: [
      {
        id: user.credentialID,
        type: "public-key",
      },
    ],
    userVerification: "required",
  });

  user.challenge = options.challenge;

  res.json(options);
});

/**
 * Verify authentication (login)
 */
router.post("/verify-login", async (req, res) => {
  const { username, authResp } = req.body;
  const user = userDatabase.get(username);

  if (!user) return res.status(400).json({ error: "User not found" });

  try {
    const verification = await verifyAuthenticationResponse({
      response: authResp,
      expectedChallenge: user.challenge,
      expectedOrigin: "http://localhost:3000",
      expectedRPID: "localhost",
      authenticator: {
        credentialPublicKey: user.credentialPublicKey,
        credentialID: user.credentialID,
        counter: user.counter,
      },
    });

    if (verification.verified) {
      user.counter = verification.authenticationInfo.newCounter;
    }

    res.json({ verified: verification.verified });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Authentication failed" });
  }
});

module.exports = router;
