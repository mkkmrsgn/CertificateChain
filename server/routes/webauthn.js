// server/routes/webauthn.js
const express = require("express");
const router = express.Router();
const { generateRegistrationOptions, verifyRegistrationResponse } = require("@simplewebauthn/server");
const User = require("../models/User");

const rpName = "CertificateChain App";
const rpID = "localhost"; // Change later when deployed online
const origin = `http://${rpID}:3001`;

const userChallengeMap = new Map(); // temporary storage

// 1️⃣ Generate registration challenge
router.post("/register", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Missing username" });

    const options = generateRegistrationOptions({
      rpName,
      rpID,
      userID: username,
      userName: username,
      attestationType: "none",
      authenticatorSelection: {
        authenticatorAttachment: "platform", // built-in fingerprint or Windows Hello
        userVerification: "required",
      },
    });

    userChallengeMap.set(username, options.challenge);
    res.json(options);
  } catch (err) {
    console.error("WebAuthn registration error:", err);
    res.status(500).json({ error: "Failed to create registration options" });
  }
});

// 2️⃣ Verify registration
router.post("/verify-registration", async (req, res) => {
  try {
    const { username, attResp } = req.body;
    const expectedChallenge = userChallengeMap.get(username);

    if (!expectedChallenge)
      return res.status(400).json({ error: "No challenge found for this user" });

    const verification = await verifyRegistrationResponse({
      response: attResp,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (verification.verified) {
      userChallengeMap.delete(username);
      await User.updateOne({ email: username }, { fingerprintRegistered: true });
      res.json({ verified: true });
    } else {
      res.status(400).json({ verified: false });
    }
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;
