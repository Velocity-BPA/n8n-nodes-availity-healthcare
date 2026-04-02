/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { AvailityHealthcare } from '../nodes/Availity Healthcare/Availity Healthcare.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('AvailityHealthcare Node', () => {
  let node: AvailityHealthcare;

  beforeAll(() => {
    node = new AvailityHealthcare();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Availity Healthcare');
      expect(node.description.name).toBe('availityhealthcare');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 8 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(8);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(8);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('EligibilityVerification Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.availity.com/availity/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('verifyEligibility operation', () => {
		it('should successfully verify eligibility', async () => {
			const mockResponse = {
				requestId: 'req_123456789',
				status: 'completed',
				eligibilityResponse: {
					eligible: true,
					benefits: ['Medical', 'Dental'],
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('verifyEligibility')
				.mockReturnValueOnce('MEMBER123')
				.mockReturnValueOnce('PAYER001')
				.mockReturnValueOnce('1234567890')
				.mockReturnValueOnce('2023-12-01');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeEligibilityVerificationOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.availity.com/availity/v1/eligibility',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					memberId: 'MEMBER123',
					payerId: 'PAYER001',
					providerId: '1234567890',
					serviceDate: '2023-12-01',
				},
				json: true,
			});
		});

		it('should handle errors when verifying eligibility', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('verifyEligibility')
				.mockReturnValueOnce('MEMBER123')
				.mockReturnValueOnce('PAYER001')
				.mockReturnValueOnce('1234567890')
				.mockReturnValueOnce('2023-12-01');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const items = [{ json: {} }];
			const result = await executeEligibilityVerificationOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getEligibilityStatus operation', () => {
		it('should successfully get eligibility status', async () => {
			const mockResponse = {
				requestId: 'req_123456789',
				status: 'completed',
				eligibilityResponse: {
					eligible: true,
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEligibilityStatus')
				.mockReturnValueOnce('req_123456789');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeEligibilityVerificationOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.availity.com/availity/v1/eligibility/req_123456789',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('getEligibilityHistory operation', () => {
		it('should successfully get eligibility history', async () => {
			const mockResponse = {
				requests: [
					{
						requestId: 'req_123456789',
						status: 'completed',
						submittedDate: '2023-12-01T10:00:00Z',
					},
				],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEligibilityHistory')
				.mockReturnValueOnce('2023-12-01')
				.mockReturnValueOnce('2023-12-31')
				.mockReturnValueOnce('completed');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeEligibilityVerificationOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.availity.com/availity/v1/eligibility/history?startDate=2023-12-01&endDate=2023-12-31&status=completed',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('submitBatchEligibility operation', () => {
		it('should successfully submit batch eligibility', async () => {
			const mockResponse = {
				batchId: 'batch_123456789',
				status: 'processing',
				requestCount: 2,
			};

			const batchRequests = JSON.stringify([
				{ memberId: 'MEMBER123', payerId: 'PAYER001', providerId: '1234567890', serviceDate: '2023-12-01' },
				{ memberId: 'MEMBER456', payerId: 'PAYER002', providerId: '0987654321', serviceDate: '2023-12-02' },
			]);

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('submitBatchEligibility')
				.mockReturnValueOnce(batchRequests);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeEligibilityVerificationOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.availity.com/availity/v1/eligibility/batch',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					requests: JSON.parse(batchRequests),
				},
				json: true,
			});
		});

		it('should handle invalid JSON in batch requests', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('submitBatchEligibility')
				.mockReturnValueOnce('invalid json');

			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const items = [{ json: {} }];
			const result = await executeEligibilityVerificationOperations.call(mockExecuteFunctions, items);

			expect(result[0].json.error).toContain('Invalid JSON in requests parameter');
		});
	});
});

describe('ClaimsSubmission Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-access-token',
				baseUrl: 'https://api.availity.com/availity/v1'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should submit a claim successfully', async () => {
		const mockClaimData = { patientId: '12345', services: [] };
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('submitClaim')
			.mockReturnValueOnce(mockClaimData)
			.mockReturnValueOnce('1234567890')
			.mockReturnValueOnce('PAYER123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			claimId: 'CLAIM123',
			status: 'submitted'
		});

		const result = await executeClaimsSubmissionOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.availity.com/availity/v1/claims',
			headers: {
				'Authorization': 'Bearer test-access-token',
				'Content-Type': 'application/json',
			},
			body: {
				claimData: mockClaimData,
				providerId: '1234567890',
				payerId: 'PAYER123',
			},
			json: true,
		});

		expect(result).toEqual([{
			json: { claimId: 'CLAIM123', status: 'submitted' },
			pairedItem: { item: 0 },
		}]);
	});

	it('should get a specific claim successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getClaim')
			.mockReturnValueOnce('CLAIM123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			claimId: 'CLAIM123',
			status: 'processing',
			details: {}
		});

		const result = await executeClaimsSubmissionOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.availity.com/availity/v1/claims/CLAIM123',
			headers: {
				'Authorization': 'Bearer test-access-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});

		expect(result[0].json).toEqual({
			claimId: 'CLAIM123',
			status: 'processing',
			details: {}
		});
	});

	it('should handle errors when submitting claim fails', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('submitClaim')
			.mockReturnValueOnce({})
			.mockReturnValueOnce('1234567890')
			.mockReturnValueOnce('PAYER123');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeClaimsSubmissionOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([{
			json: { error: 'API Error' },
			pairedItem: { item: 0 },
		}]);
	});

	it('should get claims with filters successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getClaims')
			.mockReturnValueOnce('approved')
			.mockReturnValueOnce('2024-01-01/2024-01-31')
			.mockReturnValueOnce('1234567890');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			claims: [{ claimId: 'CLAIM123' }],
			total: 1
		});

		const result = await executeClaimsSubmissionOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.availity.com/availity/v1/claims?status=approved&dateRange=2024-01-01%2F2024-01-31&providerId=1234567890',
			headers: {
				'Authorization': 'Bearer test-access-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});

		expect(result[0].json).toEqual({
			claims: [{ claimId: 'CLAIM123' }],
			total: 1
		});
	});

	it('should void a claim successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('voidClaim')
			.mockReturnValueOnce('CLAIM123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			claimId: 'CLAIM123',
			status: 'voided'
		});

		const result = await executeClaimsSubmissionOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'DELETE',
			url: 'https://api.availity.com/availity/v1/claims/CLAIM123',
			headers: {
				'Authorization': 'Bearer test-access-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});

		expect(result[0].json).toEqual({
			claimId: 'CLAIM123',
			status: 'voided'
		});
	});
});

describe('RemittanceAdvice Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.availity.com/availity/v1'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getRemittances operation', () => {
		it('should successfully get remittances', async () => {
			const mockResponse = { remittances: [{ eraId: '123', amount: 100.00 }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getRemittances')
				.mockReturnValueOnce('2023-01-01')
				.mockReturnValueOnce('2023-01-31')
				.mockReturnValueOnce('PAYER123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeRemittanceAdviceOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.availity.com/availity/v1/remittance?startDate=2023-01-01&endDate=2023-01-31&payerId=PAYER123',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle getRemittances errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getRemittances');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeRemittanceAdviceOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getRemittance operation', () => {
		it('should successfully get a specific remittance', async () => {
			const mockResponse = { eraId: '123', amount: 100.00, details: 'ERA details' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getRemittance')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeRemittanceAdviceOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.availity.com/availity/v1/remittance/123',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('getRemittanceDetails operation', () => {
		it('should successfully get remittance details', async () => {
			const mockResponse = { eraId: '123', lineItems: [{ claimId: 'CLAIM123', amount: 50.00 }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getRemittanceDetails')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeRemittanceAdviceOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.availity.com/availity/v1/remittance/123/details',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('searchRemittances operation', () => {
		it('should successfully search remittances', async () => {
			const mockResponse = { results: [{ eraId: '123', checkNumber: 'CHK456' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('searchRemittances')
				.mockReturnValueOnce('CHK456')
				.mockReturnValueOnce(100.00)
				.mockReturnValueOnce('CLAIM123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeRemittanceAdviceOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.availity.com/availity/v1/remittance/search',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					checkNumber: 'CHK456',
					amount: 100.00,
					claimId: 'CLAIM123'
				},
				json: true,
			});
		});

		it('should handle searchRemittances errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('searchRemittances');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Search failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeRemittanceAdviceOperations.call(
				mockExecuteFunctions,
				[{ json: {} }]
			);

			expect(result[0].json.error).toBe('Search failed');
		});
	});
});

describe('Provider Directory Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.availity.com/availity/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getProviders operation', () => {
		it('should search providers successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getProviders')
				.mockReturnValueOnce('1234567890')
				.mockReturnValueOnce('John Doe')
				.mockReturnValueOnce('Cardiology')
				.mockReturnValueOnce('New York');

			const mockResponse = { providers: [{ npi: '1234567890', name: 'John Doe' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProviderDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle getProviders error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getProviders')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeProviderDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getProvider operation', () => {
		it('should get provider by NPI successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getProvider')
				.mockReturnValueOnce('1234567890');

			const mockResponse = { npi: '1234567890', name: 'John Doe', specialty: 'Cardiology' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProviderDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('updateProvider operation', () => {
		it('should update provider successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateProvider')
				.mockReturnValueOnce('1234567890')
				.mockReturnValueOnce('{"name": "Jane Doe", "specialty": "Neurology"}');

			const mockResponse = { success: true, npi: '1234567890' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProviderDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle invalid JSON in provider data', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateProvider')
				.mockReturnValueOnce('1234567890')
				.mockReturnValueOnce('invalid json');

			await expect(
				executeProviderDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }])
			).rejects.toThrow();
		});
	});

	describe('validateProvider operation', () => {
		it('should validate provider successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('validateProvider')
				.mockReturnValueOnce('1234567890')
				.mockReturnValueOnce('207Q00000X');

			const mockResponse = { valid: true, npi: '1234567890', taxonomy: '207Q00000X' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProviderDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});
});

describe('PayerDirectory Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.availity.com/availity/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getPayers operation', () => {
		it('should get payers successfully', async () => {
			const mockResponse = { payers: [{ id: '1', name: 'Test Payer' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getPayers')
				.mockReturnValueOnce('CA')
				.mockReturnValueOnce('HMO')
				.mockReturnValueOnce('active');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executePayerDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle getPayers error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPayers');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executePayerDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getPayer operation', () => {
		it('should get payer successfully', async () => {
			const mockResponse = { id: '123', name: 'Test Payer', status: 'active' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getPayer')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executePayerDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle getPayer error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPayer');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Payer not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executePayerDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Payer not found' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getPayerServices operation', () => {
		it('should get payer services successfully', async () => {
			const mockResponse = { services: [{ id: 'svc1', name: 'Eligibility Check' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getPayerServices')
				.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executePayerDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle getPayerServices error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPayerServices');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Services not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executePayerDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Services not found' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('searchPayers operation', () => {
		it('should search payers successfully', async () => {
			const mockResponse = { results: [{ id: '456', name: 'Searched Payer' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('searchPayers')
				.mockReturnValueOnce('Test Payer')
				.mockReturnValueOnce('NPI123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executePayerDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle searchPayers error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('searchPayers');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Search failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executePayerDirectoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Search failed' }, pairedItem: { item: 0 } }]);
		});
	});
});

describe('FhirResources Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token', 
        baseUrl: 'https://api.availity.com/availity/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  test('should get patients successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPatients')
      .mockReturnValueOnce('123456789')
      .mockReturnValueOnce('John Doe')
      .mockReturnValueOnce('1990-01-01');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      resourceType: 'Bundle',
      entry: [{ resource: { resourceType: 'Patient', id: '123' } }]
    });

    const result = await executeFhirResourcesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.resourceType).toBe('Bundle');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.availity.com/availity/v1/fhir/Patient?identifier=123456789&name=John+Doe&birthdate=1990-01-01',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json',
      },
      json: true,
    });
  });

  test('should get specific patient successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPatient')
      .mockReturnValueOnce('patient123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      resourceType: 'Patient',
      id: 'patient123'
    });

    const result = await executeFhirResourcesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.resourceType).toBe('Patient');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.availity.com/availity/v1/fhir/Patient/patient123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json',
      },
      json: true,
    });
  });

  test('should create patient successfully', async () => {
    const patientData = { resourceType: 'Patient', name: [{ given: ['John'], family: 'Doe' }] };
    
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createPatient')
      .mockReturnValueOnce(patientData);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      resourceType: 'Patient',
      id: 'new-patient-123'
    });

    const result = await executeFhirResourcesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('new-patient-123');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.availity.com/availity/v1/fhir/Patient',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json',
      },
      body: patientData,
      json: true,
    });
  });

  test('should get coverage successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCoverage')
      .mockReturnValueOnce('Patient/123')
      .mockReturnValueOnce('Organization/insurance1');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      resourceType: 'Bundle',
      entry: [{ resource: { resourceType: 'Coverage', id: 'coverage123' } }]
    });

    const result = await executeFhirResourcesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.resourceType).toBe('Bundle');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.availity.com/availity/v1/fhir/Coverage?beneficiary=Patient%2F123&payor=Organization%2Finsurance1',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json',
      },
      json: true,
    });
  });

  test('should handle errors when continue on fail is enabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPatient');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Patient not found'));

    const result = await executeFhirResourcesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Patient not found');
  });

  test('should throw error when continue on fail is disabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPatient');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Patient not found'));

    await expect(executeFhirResourcesOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('Patient not found');
  });
});

describe('Transaction Status Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.availity.com/availity/v1'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getTransactions', () => {
		it('should successfully get transactions', async () => {
			const mockResponse = {
				transactions: [
					{ id: '1', type: 'claim', status: 'completed' },
					{ id: '2', type: 'eligibility', status: 'pending' }
				]
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransactions')
				.mockReturnValueOnce('2024-01-01')
				.mockReturnValueOnce('2024-01-31')
				.mockReturnValueOnce('claim')
				.mockReturnValueOnce('completed');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTransactionStatusOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.availity.com/availity/v1/transactions',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				qs: {
					startDate: '2024-01-01',
					endDate: '2024-01-31',
					type: 'claim',
					status: 'completed'
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle errors when getting transactions', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getTransactions');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTransactionStatusOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'API Error' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getTransaction', () => {
		it('should successfully get transaction details', async () => {
			const mockResponse = {
				id: 'txn-123',
				type: 'claim',
				status: 'completed',
				details: {}
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransaction')
				.mockReturnValueOnce('txn-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTransactionStatusOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.availity.com/availity/v1/transactions/txn-123',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getAcknowledgments', () => {
		it('should successfully get transaction acknowledgments', async () => {
			const mockResponse = {
				acknowledgments: [
					{ id: 'ack-1', status: 'accepted' },
					{ id: 'ack-2', status: 'rejected' }
				]
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAcknowledgments')
				.mockReturnValueOnce('txn-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTransactionStatusOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.availity.com/availity/v1/transactions/txn-123/acknowledgments',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('resubmitTransaction', () => {
		it('should successfully resubmit transaction', async () => {
			const mockResponse = {
				transactionId: 'txn-123',
				status: 'resubmitted',
				newTransactionId: 'txn-456'
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('resubmitTransaction')
				.mockReturnValueOnce('txn-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTransactionStatusOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.availity.com/availity/v1/transactions/resubmit',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					transactionId: 'txn-123'
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle errors when resubmitting transaction', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('resubmitTransaction');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Resubmit failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(false);

			await expect(executeTransactionStatusOperations.call(mockExecuteFunctions, [{ json: {} }]))
				.rejects.toThrow('Resubmit failed');
		});
	});
});

describe('Authorization Requests Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-access-token',
				baseUrl: 'https://api.availity.com/availity/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should submit a prior authorization request', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('submitAuthRequest')
			.mockReturnValueOnce('12345')
			.mockReturnValueOnce('99213')
			.mockReturnValueOnce('1234567890');

		const mockResponse = {
			authorizationId: 'auth-123',
			status: 'submitted',
			submissionDate: '2024-01-01T00:00:00Z',
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeAuthorizationRequestsOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.availity.com/availity/v1/authorizations',
			headers: expect.objectContaining({
				'Authorization': 'Bearer test-access-token',
			}),
			body: expect.objectContaining({
				memberId: '12345',
				serviceCode: '99213',
				providerId: '1234567890',
			}),
			json: true,
		});
	});

	it('should get authorization details', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAuthorization')
			.mockReturnValueOnce('auth-123');

		const mockResponse = {
			authorizationId: 'auth-123',
			status: 'approved',
			approvalDate: '2024-01-02T00:00:00Z',
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeAuthorizationRequestsOperations.call(mockExecuteFunctions, items);

		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.availity.com/availity/v1/authorizations/auth-123',
			headers: expect.objectContaining({
				'Authorization': 'Bearer test-access-token',
			}),
			json: true,
		});
	});

	it('should list authorization requests with filters', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAuthorizations')
			.mockReturnValueOnce('pending')
			.mockReturnValueOnce('2024-01-01')
			.mockReturnValueOnce('2024-01-31');

		const mockResponse = {
			authorizations: [
				{ authorizationId: 'auth-1', status: 'pending' },
				{ authorizationId: 'auth-2', status: 'pending' },
			],
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeAuthorizationRequestsOperations.call(mockExecuteFunctions, items);

		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: expect.stringContaining('/authorizations?status=pending'),
			})
		);
	});

	it('should update authorization request', async () => {
		const authData = { status: 'approved', notes: 'Approved for treatment' };
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateAuthorization')
			.mockReturnValueOnce('auth-123')
			.mockReturnValueOnce(authData);

		const mockResponse = {
			authorizationId: 'auth-123',
			status: 'approved',
			updatedDate: '2024-01-03T00:00:00Z',
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeAuthorizationRequestsOperations.call(mockExecuteFunctions, items);

		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'PUT',
			url: 'https://api.availity.com/availity/v1/authorizations/auth-123',
			headers: expect.objectContaining({
				'Authorization': 'Bearer test-access-token',
			}),
			body: authData,
			json: true,
		});
	});

	it('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAuthorization')
			.mockReturnValueOnce('invalid-auth-id');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Authorization not found'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const items = [{ json: {} }];
		const result = await executeAuthorizationRequestsOperations.call(mockExecuteFunctions, items);

		expect(result[0].json.error).toBe('Authorization not found');
	});
});
});
