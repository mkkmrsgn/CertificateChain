// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateIssuer {
    address public school;

    struct Certificate {
        bytes32 hash;
        bool isValid;
    }

    mapping(address => Certificate) public certificates;
    mapping(address => bool) public registeredUsers;

    constructor() {
        school = msg.sender;
    }

    modifier onlySchool() {
        require(msg.sender == school, "Only the school can perform this action.");
        _;
    }

    function registerUser(address user) public onlySchool {
        registeredUsers[user] = true;
    }

    function issueCertificate(address user, bytes32 certHash) public onlySchool {
        require(registeredUsers[user], "User not registered");
        certificates[user] = Certificate(certHash, true);
    }

    function verifyCertificate(address user, bytes32 uploadedHash) public view returns (bool) {
        Certificate memory cert = certificates[user];
        return cert.isValid && cert.hash == uploadedHash;
    }
}
