/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-availityhealthcare/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class AvailityHealthcare implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Availity Healthcare',
    name: 'availityhealthcare',
    icon: 'file:availityhealthcare.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Availity Healthcare API',
    defaults: {
      name: 'Availity Healthcare',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'availityhealthcareApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'EligibilityVerification',
            value: 'eligibilityVerification',
          },
          {
            name: 'ClaimsSubmission',
            value: 'claimsSubmission',
          },
          {
            name: 'RemittanceAdvice',
            value: 'remittanceAdvice',
          },
          {
            name: 'Provider Directory',
            value: 'providerDirectory',
          },
          {
            name: 'PayerDirectory',
            value: 'payerDirectory',
          },
          {
            name: 'FhirResources',
            value: 'fhirResources',
          },
          {
            name: 'Transaction Status',
            value: 'transactionStatus',
          },
          {
            name: 'Authorization Requests',
            value: 'authorizationRequests',
          }
        ],
        default: 'eligibilityVerification',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
		},
	},
	options: [
		{
			name: 'Verify Eligibility',
			value: 'verifyEligibility',
			description: 'Submit eligibility verification request',
			action: 'Verify eligibility',
		},
		{
			name: 'Get Eligibility Status',
			value: 'getEligibilityStatus',
			description: 'Get status of eligibility verification request',
			action: 'Get eligibility status',
		},
		{
			name: 'Get Eligibility History',
			value: 'getEligibilityHistory',
			description: 'Retrieve eligibility verification history',
			action: 'Get eligibility history',
		},
		{
			name: 'Submit Batch Eligibility',
			value: 'submitBatchEligibility',
			description: 'Submit multiple eligibility requests',
			action: 'Submit batch eligibility',
		},
	],
	default: 'verifyEligibility',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['claimsSubmission'] } },
	options: [
		{ name: 'Submit Claim', value: 'submitClaim', description: 'Submit healthcare claim for processing', action: 'Submit a claim' },
		{ name: 'Get Claim', value: 'getClaim', description: 'Retrieve specific claim details', action: 'Get a claim' },
		{ name: 'Get Claims', value: 'getClaims', description: 'List claims with filtering options', action: 'Get all claims' },
		{ name: 'Update Claim', value: 'updateClaim', description: 'Update claim information', action: 'Update a claim' },
		{ name: 'Void Claim', value: 'voidClaim', description: 'Void a submitted claim', action: 'Void a claim' },
		{ name: 'Get Claim Status', value: 'getClaimStatus', description: 'Get claim processing status', action: 'Get claim status' },
	],
	default: 'submitClaim',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['remittanceAdvice'],
		},
	},
	options: [
		{
			name: 'Get Remittances',
			value: 'getRemittances',
			description: 'List available remittance advice documents',
			action: 'Get remittances',
		},
		{
			name: 'Get Remittance',
			value: 'getRemittance',
			description: 'Retrieve specific ERA document',
			action: 'Get remittance',
		},
		{
			name: 'Get Remittance Details',
			value: 'getRemittanceDetails',
			description: 'Get detailed remittance line items',
			action: 'Get remittance details',
		},
		{
			name: 'Search Remittances',
			value: 'searchRemittances',
			description: 'Search remittances by criteria',
			action: 'Search remittances',
		},
	],
	default: 'getRemittances',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['providerDirectory'],
		},
	},
	options: [
		{
			name: 'Get Providers',
			value: 'getProviders',
			description: 'Search provider directory',
			action: 'Get providers',
		},
		{
			name: 'Get Provider',
			value: 'getProvider',
			description: 'Get provider details by NPI',
			action: 'Get provider',
		},
		{
			name: 'Update Provider',
			value: 'updateProvider',
			description: 'Update provider information',
			action: 'Update provider',
		},
		{
			name: 'Validate Provider',
			value: 'validateProvider',
			description: 'Validate provider credentials',
			action: 'Validate provider',
		},
	],
	default: 'getProviders',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['payerDirectory'],
		},
	},
	options: [
		{
			name: 'Get Payers',
			value: 'getPayers',
			description: 'List available payers',
			action: 'Get payers',
		},
		{
			name: 'Get Payer',
			value: 'getPayer',
			description: 'Get specific payer details',
			action: 'Get a payer',
		},
		{
			name: 'Get Payer Services',
			value: 'getPayerServices',
			description: 'Get available services for payer',
			action: 'Get payer services',
		},
		{
			name: 'Search Payers',
			value: 'searchPayers',
			description: 'Search payers by name or identifier',
			action: 'Search payers',
		},
	],
	default: 'getPayers',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['fhirResources'] } },
  options: [
    { name: 'Get Patients', value: 'getPatients', description: 'Retrieve patient resources', action: 'Get patients' },
    { name: 'Get Patient', value: 'getPatient', description: 'Get specific patient resource', action: 'Get patient' },
    { name: 'Create Patient', value: 'createPatient', description: 'Create new patient resource', action: 'Create patient' },
    { name: 'Update Patient', value: 'updatePatient', description: 'Update patient resource', action: 'Update patient' },
    { name: 'Get Coverage', value: 'getCoverage', description: 'Retrieve coverage resources', action: 'Get coverage' },
    { name: 'Get Coverage by ID', value: 'getCoverageById', description: 'Get specific coverage resource', action: 'Get coverage by ID' }
  ],
  default: 'getPatients',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['transactionStatus'],
		},
	},
	options: [
		{
			name: 'Get Transactions',
			value: 'getTransactions',
			description: 'List transaction history',
			action: 'Get transactions',
		},
		{
			name: 'Get Transaction',
			value: 'getTransaction',
			description: 'Get specific transaction details',
			action: 'Get a transaction',
		},
		{
			name: 'Get Acknowledgments',
			value: 'getAcknowledgments',
			description: 'Get transaction acknowledgments',
			action: 'Get acknowledgments',
		},
		{
			name: 'Resubmit Transaction',
			value: 'resubmitTransaction',
			description: 'Resubmit failed transaction',
			action: 'Resubmit transaction',
		},
	],
	default: 'getTransactions',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['authorizationRequests'],
		},
	},
	options: [
		{
			name: 'Submit Prior Authorization Request',
			value: 'submitAuthRequest',
			description: 'Submit a prior authorization request using X12 278 transaction',
			action: 'Submit prior authorization request',
		},
		{
			name: 'Get Authorization Details',
			value: 'getAuthorization',
			description: 'Get details of a specific authorization request',
			action: 'Get authorization details',
		},
		{
			name: 'List Authorization Requests',
			value: 'getAuthorizations',
			description: 'List authorization requests with optional filters',
			action: 'List authorization requests',
		},
		{
			name: 'Update Authorization Request',
			value: 'updateAuthorization',
			description: 'Update an existing authorization request',
			action: 'Update authorization request',
		},
	],
	default: 'submitAuthRequest',
},
{
	displayName: 'Member ID',
	name: 'memberId',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'Member123456',
	description: 'The member identifier for eligibility verification',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['verifyEligibility'],
		},
	},
},
{
	displayName: 'Payer ID',
	name: 'payerId',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'PAYER001',
	description: 'The payer identifier for the insurance company',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['verifyEligibility'],
		},
	},
},
{
	displayName: 'Provider ID',
	name: 'providerId',
	type: 'string',
	required: true,
	default: '',
	placeholder: '1234567890',
	description: 'The National Provider Identifier (NPI) of the healthcare provider',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['verifyEligibility'],
		},
	},
},
{
	displayName: 'Service Date',
	name: 'serviceDate',
	type: 'dateTime',
	required: true,
	default: '',
	description: 'The date of service for eligibility verification',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['verifyEligibility'],
		},
	},
},
{
	displayName: 'Request ID',
	name: 'requestId',
	type: 'string',
	required: true,
	default: '',
	placeholder: 'req_123456789',
	description: 'The unique identifier of the eligibility verification request',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['getEligibilityStatus'],
		},
	},
},
{
	displayName: 'Start Date',
	name: 'startDate',
	type: 'dateTime',
	required: true,
	default: '',
	description: 'The start date for eligibility history search',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['getEligibilityHistory'],
		},
	},
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	required: true,
	default: '',
	description: 'The end date for eligibility history search',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['getEligibilityHistory'],
		},
	},
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{
			name: 'All',
			value: 'all',
		},
		{
			name: 'Pending',
			value: 'pending',
		},
		{
			name: 'Completed',
			value: 'completed',
		},
		{
			name: 'Failed',
			value: 'failed',
		},
	],
	default: 'all',
	description: 'Filter eligibility history by status',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['getEligibilityHistory'],
		},
	},
},
{
	displayName: 'Eligibility Requests',
	name: 'requests',
	type: 'json',
	required: true,
	default: '[]',
	placeholder: '[{"memberId": "123", "payerId": "PAYER001", "providerId": "1234567890", "serviceDate": "2023-12-01"}]',
	description: 'Array of eligibility verification requests',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['submitBatchEligibility'],
		},
	},
},
{
	displayName: 'Claim Data',
	name: 'claimData',
	type: 'json',
	required: true,
	displayOptions: { show: { resource: ['claimsSubmission'], operation: ['submitClaim'] } },
	default: '{}',
	description: 'Healthcare claim data in X12 837 format or FHIR R4 compliant structure',
},
{
	displayName: 'Provider ID',
	name: 'providerId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['claimsSubmission'], operation: ['submitClaim'] } },
	default: '',
	description: 'National Provider Identifier (NPI) for the healthcare provider',
},
{
	displayName: 'Payer ID',
	name: 'payerId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['claimsSubmission'], operation: ['submitClaim'] } },
	default: '',
	description: 'Identifier for the insurance payer organization',
},
{
	displayName: 'Claim ID',
	name: 'claimId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['claimsSubmission'], operation: ['getClaim', 'updateClaim', 'voidClaim', 'getClaimStatus'] } },
	default: '',
	description: 'Unique identifier for the claim',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{ name: 'Submitted', value: 'submitted' },
		{ name: 'Processing', value: 'processing' },
		{ name: 'Approved', value: 'approved' },
		{ name: 'Denied', value: 'denied' },
		{ name: 'Voided', value: 'voided' },
	],
	displayOptions: { show: { resource: ['claimsSubmission'], operation: ['getClaims'] } },
	default: 'submitted',
	description: 'Filter claims by processing status',
},
{
	displayName: 'Date Range',
	name: 'dateRange',
	type: 'string',
	displayOptions: { show: { resource: ['claimsSubmission'], operation: ['getClaims'] } },
	default: '',
	description: 'Date range for filtering claims (ISO 8601 format)',
},
{
	displayName: 'Provider ID (Filter)',
	name: 'providerIdFilter',
	type: 'string',
	displayOptions: { show: { resource: ['claimsSubmission'], operation: ['getClaims'] } },
	default: '',
	description: 'Filter claims by provider NPI',
},
{
	displayName: 'Updated Claim Data',
	name: 'updatedClaimData',
	type: 'json',
	required: true,
	displayOptions: { show: { resource: ['claimsSubmission'], operation: ['updateClaim'] } },
	default: '{}',
	description: 'Updated claim information in X12 837 format or FHIR R4 compliant structure',
},
{
	displayName: 'Start Date',
	name: 'startDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['remittanceAdvice'],
			operation: ['getRemittances'],
		},
	},
	default: '',
	description: 'Start date for remittance search (YYYY-MM-DD format)',
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['remittanceAdvice'],
			operation: ['getRemittances'],
		},
	},
	default: '',
	description: 'End date for remittance search (YYYY-MM-DD format)',
},
{
	displayName: 'Payer ID',
	name: 'payerId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['remittanceAdvice'],
			operation: ['getRemittances'],
		},
	},
	default: '',
	description: 'Specific payer identifier to filter remittances',
},
{
	displayName: 'ERA ID',
	name: 'eraId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['remittanceAdvice'],
			operation: ['getRemittance', 'getRemittanceDetails'],
		},
	},
	default: '',
	description: 'Electronic Remittance Advice identifier',
},
{
	displayName: 'Check Number',
	name: 'checkNumber',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['remittanceAdvice'],
			operation: ['searchRemittances'],
		},
	},
	default: '',
	description: 'Check number to search for',
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['remittanceAdvice'],
			operation: ['searchRemittances'],
		},
	},
	default: 0,
	description: 'Payment amount to search for',
},
{
	displayName: 'Claim ID',
	name: 'claimId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['remittanceAdvice'],
			operation: ['searchRemittances'],
		},
	},
	default: '',
	description: 'Claim identifier to search for',
},
{
	displayName: 'NPI',
	name: 'npi',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['providerDirectory'],
			operation: ['getProviders'],
		},
	},
	default: '',
	description: 'National Provider Identifier to search for',
},
{
	displayName: 'Provider Name',
	name: 'name',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['providerDirectory'],
			operation: ['getProviders'],
		},
	},
	default: '',
	description: 'Provider name to search for',
},
{
	displayName: 'Specialty',
	name: 'specialty',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['providerDirectory'],
			operation: ['getProviders'],
		},
	},
	default: '',
	description: 'Provider specialty to filter by',
},
{
	displayName: 'Location',
	name: 'location',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['providerDirectory'],
			operation: ['getProviders'],
		},
	},
	default: '',
	description: 'Location to search providers in',
},
{
	displayName: 'NPI',
	name: 'npi',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['providerDirectory'],
			operation: ['getProvider'],
		},
	},
	default: '',
	description: 'National Provider Identifier of the provider to retrieve',
},
{
	displayName: 'NPI',
	name: 'npi',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['providerDirectory'],
			operation: ['updateProvider'],
		},
	},
	default: '',
	description: 'National Provider Identifier of the provider to update',
},
{
	displayName: 'Provider Data',
	name: 'providerData',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['providerDirectory'],
			operation: ['updateProvider'],
		},
	},
	default: '{}',
	description: 'Provider information to update in JSON format',
},
{
	displayName: 'NPI',
	name: 'npi',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['providerDirectory'],
			operation: ['validateProvider'],
		},
	},
	default: '',
	description: 'National Provider Identifier to validate',
},
{
	displayName: 'Taxonomy',
	name: 'taxonomy',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['providerDirectory'],
			operation: ['validateProvider'],
		},
	},
	default: '',
	description: 'Provider taxonomy code for validation',
},
{
	displayName: 'State',
	name: 'state',
	type: 'string',
	default: '',
	description: 'Filter payers by state',
	displayOptions: {
		show: {
			resource: ['payerDirectory'],
			operation: ['getPayers'],
		},
	},
},
{
	displayName: 'Plan Type',
	name: 'planType',
	type: 'string',
	default: '',
	description: 'Filter payers by plan type',
	displayOptions: {
		show: {
			resource: ['payerDirectory'],
			operation: ['getPayers'],
		},
	},
},
{
	displayName: 'Status',
	name: 'status',
	type: 'string',
	default: '',
	description: 'Filter payers by status',
	displayOptions: {
		show: {
			resource: ['payerDirectory'],
			operation: ['getPayers'],
		},
	},
},
{
	displayName: 'Payer ID',
	name: 'payerId',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID of the payer',
	displayOptions: {
		show: {
			resource: ['payerDirectory'],
			operation: ['getPayer', 'getPayerServices'],
		},
	},
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	default: '',
	description: 'Search by payer name',
	displayOptions: {
		show: {
			resource: ['payerDirectory'],
			operation: ['searchPayers'],
		},
	},
},
{
	displayName: 'Identifier',
	name: 'identifier',
	type: 'string',
	default: '',
	description: 'Search by payer identifier',
	displayOptions: {
		show: {
			resource: ['payerDirectory'],
			operation: ['searchPayers'],
		},
	},
},
{
  displayName: 'Identifier',
  name: 'identifier',
  type: 'string',
  default: '',
  description: 'Patient identifier',
  displayOptions: {
    show: {
      resource: ['fhirResources'],
      operation: ['getPatients'],
    },
  },
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  default: '',
  description: 'Patient name',
  displayOptions: {
    show: {
      resource: ['fhirResources'],
      operation: ['getPatients'],
    },
  },
},
{
  displayName: 'Birth Date',
  name: 'birthdate',
  type: 'string',
  default: '',
  description: 'Patient birth date (YYYY-MM-DD format)',
  displayOptions: {
    show: {
      resource: ['fhirResources'],
      operation: ['getPatients'],
    },
  },
},
{
  displayName: 'Patient ID',
  name: 'id',
  type: 'string',
  required: true,
  default: '',
  description: 'The patient resource ID',
  displayOptions: {
    show: {
      resource: ['fhirResources'],
      operation: ['getPatient', 'updatePatient'],
    },
  },
},
{
  displayName: 'Patient Data',
  name: 'patientData',
  type: 'json',
  required: true,
  default: '{}',
  description: 'FHIR R4 Patient resource data in JSON format',
  displayOptions: {
    show: {
      resource: ['fhirResources'],
      operation: ['createPatient', 'updatePatient'],
    },
  },
},
{
  displayName: 'Beneficiary',
  name: 'beneficiary',
  type: 'string',
  default: '',
  description: 'Patient reference for coverage',
  displayOptions: {
    show: {
      resource: ['fhirResources'],
      operation: ['getCoverage'],
    },
  },
},
{
  displayName: 'Payor',
  name: 'payor',
  type: 'string',
  default: '',
  description: 'The payor organization',
  displayOptions: {
    show: {
      resource: ['fhirResources'],
      operation: ['getCoverage'],
    },
  },
},
{
  displayName: 'Coverage ID',
  name: 'id',
  type: 'string',
  required: true,
  default: '',
  description: 'The coverage resource ID',
  displayOptions: {
    show: {
      resource: ['fhirResources'],
      operation: ['getCoverageById'],
    },
  },
},
{
	displayName: 'Start Date',
	name: 'startDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['transactionStatus'],
			operation: ['getTransactions'],
		},
	},
	default: '',
	description: 'Start date for transaction history filter',
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['transactionStatus'],
			operation: ['getTransactions'],
		},
	},
	default: '',
	description: 'End date for transaction history filter',
},
{
	displayName: 'Transaction Type',
	name: 'type',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['transactionStatus'],
			operation: ['getTransactions'],
		},
	},
	default: '',
	description: 'Filter by transaction type',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['transactionStatus'],
			operation: ['getTransactions'],
		},
	},
	options: [
		{
			name: 'All',
			value: '',
		},
		{
			name: 'Pending',
			value: 'pending',
		},
		{
			name: 'Completed',
			value: 'completed',
		},
		{
			name: 'Failed',
			value: 'failed',
		},
		{
			name: 'Rejected',
			value: 'rejected',
		},
	],
	default: '',
	description: 'Filter by transaction status',
},
{
	displayName: 'Transaction ID',
	name: 'transactionId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transactionStatus'],
			operation: ['getTransaction', 'getAcknowledgments', 'resubmitTransaction'],
		},
	},
	default: '',
	description: 'The ID of the transaction',
},
{
	displayName: 'Member ID',
	name: 'memberId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['authorizationRequests'],
			operation: ['submitAuthRequest'],
		},
	},
	default: '',
	description: 'The member ID for the authorization request',
},
{
	displayName: 'Service Code',
	name: 'serviceCode',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['authorizationRequests'],
			operation: ['submitAuthRequest'],
		},
	},
	default: '',
	description: 'The CPT or HCPCS service code for the requested service',
},
{
	displayName: 'Provider ID (NPI)',
	name: 'providerId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['authorizationRequests'],
			operation: ['submitAuthRequest'],
		},
	},
	default: '',
	description: 'The National Provider Identifier (NPI) of the requesting provider',
},
{
	displayName: 'Authorization ID',
	name: 'authId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['authorizationRequests'],
			operation: ['getAuthorization', 'updateAuthorization'],
		},
	},
	default: '',
	description: 'The unique identifier of the authorization request',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['authorizationRequests'],
			operation: ['getAuthorizations'],
		},
	},
	options: [
		{
			name: 'All',
			value: '',
		},
		{
			name: 'Pending',
			value: 'pending',
		},
		{
			name: 'Approved',
			value: 'approved',
		},
		{
			name: 'Denied',
			value: 'denied',
		},
		{
			name: 'Cancelled',
			value: 'cancelled',
		},
	],
	default: '',
	description: 'Filter by authorization status',
},
{
	displayName: 'Date Range Start',
	name: 'dateRangeStart',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['authorizationRequests'],
			operation: ['getAuthorizations'],
		},
	},
	default: '',
	description: 'Start date for filtering authorization requests',
},
{
	displayName: 'Date Range End',
	name: 'dateRangeEnd',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['authorizationRequests'],
			operation: ['getAuthorizations'],
		},
	},
	default: '',
	description: 'End date for filtering authorization requests',
},
{
	displayName: 'Authorization Data',
	name: 'authData',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['authorizationRequests'],
			operation: ['updateAuthorization'],
		},
	},
	default: '{}',
	description: 'The authorization data to update (FHIR R4 compliant JSON)',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'eligibilityVerification':
        return [await executeEligibilityVerificationOperations.call(this, items)];
      case 'claimsSubmission':
        return [await executeClaimsSubmissionOperations.call(this, items)];
      case 'remittanceAdvice':
        return [await executeRemittanceAdviceOperations.call(this, items)];
      case 'providerDirectory':
        return [await executeProviderDirectoryOperations.call(this, items)];
      case 'payerDirectory':
        return [await executePayerDirectoryOperations.call(this, items)];
      case 'fhirResources':
        return [await executeFhirResourcesOperations.call(this, items)];
      case 'transactionStatus':
        return [await executeTransactionStatusOperations.call(this, items)];
      case 'authorizationRequests':
        return [await executeAuthorizationRequestsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeEligibilityVerificationOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('availityhealthcareApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const baseUrl = credentials.baseUrl || 'https://api.availity.com/availity/v1';

			switch (operation) {
				case 'verifyEligibility': {
					const memberId = this.getNodeParameter('memberId', i) as string;
					const payerId = this.getNodeParameter('payerId', i) as string;
					const providerId = this.getNodeParameter('providerId', i) as string;
					const serviceDate = this.getNodeParameter('serviceDate', i) as string;

					const requestBody = {
						memberId,
						payerId,
						providerId,
						serviceDate,
					};

					const options: any = {
						method: 'POST',
						url: `${baseUrl}/eligibility`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getEligibilityStatus': {
					const requestId = this.getNodeParameter('requestId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/eligibility/${requestId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getEligibilityHistory': {
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const status = this.getNodeParameter('status', i) as string;

					const queryParams = new URLSearchParams({
						startDate,
						endDate,
						...(status !== 'all' && { status }),
					});

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/eligibility/history?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'submitBatchEligibility': {
					const requests = this.getNodeParameter('requests', i) as string;
					let requestsArray: any[];

					try {
						requestsArray = JSON.parse(requests);
					} catch (parseError: any) {
						throw new NodeOperationError(this.getNode(), `Invalid JSON in requests parameter: ${parseError.message}`, { itemIndex: i });
					}

					const requestBody = {
						requests: requestsArray,
					};

					const options: any = {
						method: 'POST',
						url: `${baseUrl}/eligibility/batch`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeClaimsSubmissionOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('availityhealthcareApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			
			switch (operation) {
				case 'submitClaim': {
					const claimData = this.getNodeParameter('claimData', i) as object;
					const providerId = this.getNodeParameter('providerId', i) as string;
					const payerId = this.getNodeParameter('payerId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/claims`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body: {
							claimData,
							providerId,
							payerId,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getClaim': {
					const claimId = this.getNodeParameter('claimId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/claims/${claimId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getClaims': {
					const status = this.getNodeParameter('status', i) as string;
					const dateRange = this.getNodeParameter('dateRange', i) as string;
					const providerIdFilter = this.getNodeParameter('providerIdFilter', i) as string;

					const queryParams = new URLSearchParams();
					if (status) queryParams.append('status', status);
					if (dateRange) queryParams.append('dateRange', dateRange);
					if (providerIdFilter) queryParams.append('providerId', providerIdFilter);

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/claims?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateClaim': {
					const claimId = this.getNodeParameter('claimId', i) as string;
					const updatedClaimData = this.getNodeParameter('updatedClaimData', i) as object;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/claims/${claimId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body: {
							claimData: updatedClaimData,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'voidClaim': {
					const claimId = this.getNodeParameter('claimId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/claims/${claimId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getClaimStatus': {
					const claimId = this.getNodeParameter('claimId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/claims/${claimId}/status`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeRemittanceAdviceOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('availityhealthcareApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getRemittances': {
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const payerId = this.getNodeParameter('payerId', i) as string;

					const queryParams = new URLSearchParams();
					if (startDate) queryParams.append('startDate', startDate.split('T')[0]);
					if (endDate) queryParams.append('endDate', endDate.split('T')[0]);
					if (payerId) queryParams.append('payerId', payerId);

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl || 'https://api.availity.com/availity/v1'}/remittance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getRemittance': {
					const eraId = this.getNodeParameter('eraId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl || 'https://api.availity.com/availity/v1'}/remittance/${eraId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getRemittanceDetails': {
					const eraId = this.getNodeParameter('eraId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl || 'https://api.availity.com/availity/v1'}/remittance/${eraId}/details`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'searchRemittances': {
					const checkNumber = this.getNodeParameter('checkNumber', i) as string;
					const amount = this.getNodeParameter('amount', i) as number;
					const claimId = this.getNodeParameter('claimId', i) as string;

					const body: any = {};
					if (checkNumber) body.checkNumber = checkNumber;
					if (amount) body.amount = amount;
					if (claimId) body.claimId = claimId;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl || 'https://api.availity.com/availity/v1'}/remittance/search`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeProviderDirectoryOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('availityhealthcareApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getProviders': {
					const npi = this.getNodeParameter('npi', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const specialty = this.getNodeParameter('specialty', i) as string;
					const location = this.getNodeParameter('location', i) as string;

					const queryParams: any = {};
					if (npi) queryParams.npi = npi;
					if (name) queryParams.name = name;
					if (specialty) queryParams.specialty = specialty;
					if (location) queryParams.location = location;

					const queryString = new URLSearchParams(queryParams).toString();
					const url = `${credentials.baseUrl}/providers${queryString ? '?' + queryString : ''}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getProvider': {
					const npi = this.getNodeParameter('npi', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/providers/${npi}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateProvider': {
					const npi = this.getNodeParameter('npi', i) as string;
					const providerData = this.getNodeParameter('providerData', i) as string;

					let parsedData: any;
					try {
						parsedData = JSON.parse(providerData);
					} catch (error: any) {
						throw new NodeOperationError(this.getNode(), `Invalid JSON in provider data: ${error.message}`, { itemIndex: i });
					}

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/providers/${npi}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body: parsedData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'validateProvider': {
					const npi = this.getNodeParameter('npi', i) as string;
					const taxonomy = this.getNodeParameter('taxonomy', i) as string;

					const body = {
						npi,
						taxonomy,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/providers/validate`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executePayerDirectoryOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('availityhealthcareApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			
			switch (operation) {
				case 'getPayers': {
					const state = this.getNodeParameter('state', i) as string;
					const planType = this.getNodeParameter('planType', i) as string;
					const status = this.getNodeParameter('status', i) as string;

					const queryParams = new URLSearchParams();
					if (state) queryParams.append('state', state);
					if (planType) queryParams.append('planType', planType);
					if (status) queryParams.append('status', status);

					const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/payers${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getPayer': {
					const payerId = this.getNodeParameter('payerId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/payers/${payerId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getPayerServices': {
					const payerId = this.getNodeParameter('payerId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/payers/${payerId}/services`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'searchPayers': {
					const name = this.getNodeParameter('name', i) as string;
					const identifier = this.getNodeParameter('identifier', i) as string;

					const queryParams = new URLSearchParams();
					if (name) queryParams.append('name', name);
					if (identifier) queryParams.append('identifier', identifier);

					const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/payers/search${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeFhirResourcesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('availityhealthcareApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getPatients': {
          const params: any = {};
          const identifier = this.getNodeParameter('identifier', i, '') as string;
          const name = this.getNodeParameter('name', i, '') as string;
          const birthdate = this.getNodeParameter('birthdate', i, '') as string;

          if (identifier) params.identifier = identifier;
          if (name) params.name = name;
          if (birthdate) params.birthdate = birthdate;

          const queryString = new URLSearchParams(params).toString();
          const url = `${credentials.baseUrl}/fhir/Patient${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/fhir+json',
              'Accept': 'application/fhir+json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPatient': {
          const patientId = this.getNodeParameter('id', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/fhir/Patient/${patientId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/fhir+json',
              'Accept': 'application/fhir+json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createPatient': {
          const patientData = this.getNodeParameter('patientData', i) as any;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/fhir/Patient`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/fhir+json',
              'Accept': 'application/fhir+json',
            },
            body: patientData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updatePatient': {
          const patientId = this.getNodeParameter('id', i) as string;
          const patientData = this.getNodeParameter('patientData', i) as any;
          
          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/fhir/Patient/${patientId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/fhir+json',
              'Accept': 'application/fhir+json',
            },
            body: patientData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCoverage': {
          const params: any = {};
          const beneficiary = this.getNodeParameter('beneficiary', i, '') as string;
          const payor = this.getNodeParameter('payor', i, '') as string;

          if (beneficiary) params.beneficiary = beneficiary;
          if (payor) params.payor = payor;

          const queryString = new URLSearchParams(params).toString();
          const url = `${credentials.baseUrl}/fhir/Coverage${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/fhir+json',
              'Accept': 'application/fhir+json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCoverageById': {
          const coverageId = this.getNodeParameter('id', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/fhir/Coverage/${coverageId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/fhir+json',
              'Accept': 'application/fhir+json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransactionStatusOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('availityhealthcareApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getTransactions': {
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const type = this.getNodeParameter('type', i) as string;
					const status = this.getNodeParameter('status', i) as string;

					const qs: any = {};
					if (startDate) qs.startDate = startDate;
					if (endDate) qs.endDate = endDate;
					if (type) qs.type = type;
					if (status) qs.status = status;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/transactions`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						qs,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTransaction': {
					const transactionId = this.getNodeParameter('transactionId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/transactions/${transactionId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAcknowledgments': {
					const transactionId = this.getNodeParameter('transactionId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/transactions/${transactionId}/acknowledgments`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'resubmitTransaction': {
					const transactionId = this.getNodeParameter('transactionId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/transactions/resubmit`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body: {
							transactionId,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAuthorizationRequestsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('availityhealthcareApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			const baseUrl = credentials.baseUrl || 'https://api.availity.com/availity/v1';
			const headers = {
				'Authorization': `Bearer ${credentials.accessToken}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			};

			switch (operation) {
				case 'submitAuthRequest': {
					const memberId = this.getNodeParameter('memberId', i) as string;
					const serviceCode = this.getNodeParameter('serviceCode', i) as string;
					const providerId = this.getNodeParameter('providerId', i) as string;

					const requestBody = {
						memberId,
						serviceCode,
						providerId,
						submissionDate: new Date().toISOString(),
						transactionType: 'X12-278',
					};

					const options: any = {
						method: 'POST',
						url: `${baseUrl}/authorizations`,
						headers,
						body: requestBody,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAuthorization': {
					const authId = this.getNodeParameter('authId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/authorizations/${authId}`,
						headers,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAuthorizations': {
					const status = this.getNodeParameter('status', i) as string;
					const dateRangeStart = this.getNodeParameter('dateRangeStart', i) as string;
					const dateRangeEnd = this.getNodeParameter('dateRangeEnd', i) as string;

					const queryParams = new URLSearchParams();
					if (status) queryParams.append('status', status);
					if (dateRangeStart) queryParams.append('startDate', dateRangeStart);
					if (dateRangeEnd) queryParams.append('endDate', dateRangeEnd);

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/authorizations?${queryParams.toString()}`,
						headers,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateAuthorization': {
					const authId = this.getNodeParameter('authId', i) as string;
					const authData = this.getNodeParameter('authData', i) as any;

					const options: any = {
						method: 'PUT',
						url: `${baseUrl}/authorizations/${authId}`,
						headers,
						body: authData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
