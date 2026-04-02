# n8n-nodes-availity-healthcare

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Availity's healthcare platform, providing access to 8 core healthcare administration resources. Enables healthcare organizations to streamline eligibility verification, claims processing, remittance handling, and provider directory management through automated workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Healthcare](https://img.shields.io/badge/Industry-Healthcare-green)
![HIPAA](https://img.shields.io/badge/HIPAA-Compliant-green)
![HL7 FHIR](https://img.shields.io/badge/HL7-FHIR-orange)

## Features

- **Eligibility Verification** - Real-time patient insurance eligibility and benefits verification
- **Claims Processing** - Submit, track, and manage healthcare claims submissions
- **Remittance Advice** - Retrieve and process electronic remittance advice (ERA) documents
- **Provider Directory** - Access and search comprehensive healthcare provider directories
- **Payer Directory** - Lookup insurance payer information and network details
- **FHIR Resources** - Full HL7 FHIR R4 resource support for interoperability
- **Authorization Management** - Submit and track prior authorization requests
- **Transaction Monitoring** - Real-time status tracking for all healthcare transactions

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-availity-healthcare`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-availity-healthcare
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-availity-healthcare.git
cd n8n-nodes-availity-healthcare
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-availity-healthcare
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Availity API authentication key | Yes |
| Environment | API environment (sandbox/production) | Yes |
| Client ID | Your registered Availity application client ID | Yes |
| Timeout | Request timeout in milliseconds (default: 30000) | No |

## Resources & Operations

### 1. Eligibility Verification

| Operation | Description |
|-----------|-------------|
| Check Eligibility | Verify patient insurance eligibility and coverage |
| Get Benefits | Retrieve detailed benefit information for a patient |
| Batch Verification | Process multiple eligibility checks simultaneously |
| History | Get eligibility check history and results |

### 2. Claims Submission

| Operation | Description |
|-----------|-------------|
| Submit Claim | Submit new healthcare claims for processing |
| Get Claim Status | Check the processing status of submitted claims |
| Update Claim | Modify existing claim information |
| Cancel Claim | Cancel a previously submitted claim |
| Batch Submit | Submit multiple claims in a single request |
| Get Claim Details | Retrieve comprehensive claim information |

### 3. Remittance Advice

| Operation | Description |
|-----------|-------------|
| Get ERA | Retrieve Electronic Remittance Advice documents |
| List ERAs | Get list of available remittance advice documents |
| Download ERA | Download ERA document in specified format |
| Search ERAs | Search remittance advice by various criteria |
| Get ERA Status | Check processing status of remittance advice |

### 4. Provider Directory

| Operation | Description |
|-----------|-------------|
| Search Providers | Search for healthcare providers by various criteria |
| Get Provider | Retrieve detailed provider information |
| Verify Provider | Verify provider credentials and network status |
| List Specialties | Get list of available provider specialties |
| Get Network Status | Check provider network participation status |

### 5. Payer Directory

| Operation | Description |
|-----------|-------------|
| Search Payers | Search for insurance payers and plans |
| Get Payer | Retrieve detailed payer information |
| List Plans | Get available insurance plans for a payer |
| Get Coverage | Retrieve coverage details for specific plans |
| Verify Payer | Validate payer information and status |

### 6. FHIR Resources

| Operation | Description |
|-----------|-------------|
| Create Resource | Create new FHIR resources (Patient, Encounter, etc.) |
| Read Resource | Retrieve FHIR resources by ID |
| Update Resource | Modify existing FHIR resources |
| Delete Resource | Remove FHIR resources |
| Search Resources | Search FHIR resources with complex queries |
| Get Capability | Retrieve FHIR server capability statement |

### 7. Transaction Status

| Operation | Description |
|-----------|-------------|
| Get Status | Check status of any healthcare transaction |
| List Transactions | Get list of recent transactions |
| Get Transaction Details | Retrieve comprehensive transaction information |
| Update Status | Modify transaction status or notes |
| Get History | Retrieve transaction processing history |

### 8. Authorization Requests

| Operation | Description |
|-----------|-------------|
| Submit Authorization | Submit new prior authorization requests |
| Get Authorization Status | Check status of authorization requests |
| Update Authorization | Modify existing authorization information |
| Cancel Authorization | Cancel pending authorization requests |
| List Authorizations | Get list of authorization requests |
| Get Authorization Details | Retrieve detailed authorization information |

## Usage Examples

```javascript
// Check patient eligibility
{
  "memberId": "123456789",
  "payerId": "AETNA",
  "serviceDate": "2024-01-15",
  "serviceTypeCode": "30",
  "providerId": "1234567890"
}
```

```javascript
// Submit a healthcare claim
{
  "claimType": "professional",
  "patientId": "P123456",
  "providerId": "1234567890",
  "serviceDate": "2024-01-15",
  "diagnosisCodes": ["Z00.00"],
  "procedureCodes": ["99213"],
  "chargeAmount": 150.00
}
```

```javascript
// Search for providers
{
  "specialty": "cardiology",
  "location": {
    "city": "Atlanta",
    "state": "GA",
    "zipCode": "30309"
  },
  "networkId": "BCBS_GA",
  "radius": 25
}
```

```javascript
// Create FHIR Patient resource
{
  "resourceType": "Patient",
  "identifier": [
    {
      "system": "http://hospital.smarthealthit.org",
      "value": "12345"
    }
  ],
  "name": [
    {
      "family": "Smith",
      "given": ["John", "David"]
    }
  ],
  "birthDate": "1990-05-15"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Authentication Failed | Invalid API key or credentials | Verify API key and client ID in node credentials |
| Rate Limit Exceeded | Too many requests in time window | Implement delays between requests or use batch operations |
| Invalid Member ID | Member not found in payer system | Verify member ID format and payer combination |
| Service Unavailable | Availity API temporarily unavailable | Implement retry logic with exponential backoff |
| Invalid Request Format | Malformed request data | Check request schema against Availity API documentation |
| Network Timeout | Request exceeded timeout limit | Increase timeout setting or check network connectivity |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-availity-healthcare/issues)
- **Availity Developer Portal**: [developer.availity.com](https://developer.availity.com)
- **HL7 FHIR Documentation**: [hl7.org/fhir](https://hl7.org/fhir)