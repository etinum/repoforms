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
		modifiedByUserId: string;
		adminUserId: number;
		adminOtherUserId: number;
		closeTypeOptions: any[];
		clientOptions: any[];
	}
}
