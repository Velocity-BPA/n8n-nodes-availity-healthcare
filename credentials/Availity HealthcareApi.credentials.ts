import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AvailityHealthcareApi implements ICredentialType {
	name = 'availityHealthcareApi';
	displayName = 'Availity Healthcare API';
	documentationUrl = 'https://developer.availity.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.availity.com/availity/v1',
			required: true,
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'Token URL',
			name: 'tokenUrl',
			type: 'string',
			default: 'https://api.availity.com/availity/v1/token',
			required: true,
		},
	];
}