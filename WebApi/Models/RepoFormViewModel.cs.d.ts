/// <reference path="CloseTypeViewModel.cs.d.ts" />
/// <reference path="ClientViewModel.cs.d.ts" />

declare module server {
	interface RepoFormViewModel {
		id: number;
		createdDate: Date;
		modifiedDate: Date;
		accountNumber: string;
		investigator: string;
		clientId: number;
		closeTypeId: number;
		customerName: string;
		points: number;
		notes: string;
		creatorUserId: number;
		modifiedByUserId: number;
		adminUserId: number;
		adminOtherUserId: number;
		closeTypeOptions: server.CloseTypeViewModel[];
		clientOptions: server.ClientViewModel[];
	}
}
