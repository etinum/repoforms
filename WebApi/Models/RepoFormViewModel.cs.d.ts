declare module server {
	interface RepoFormViewModel {
		id: number;
		createdDate: Date;
		modifiedDate: Date;
		repoDate: Date;
		accountNumber: string;
		investigator: string;
		client: string;
		clientId: number;
		closeType: string;
		closeTypeId: number;
		customerName: string;
		points: number;
		recoveryAgent: string;
		notes: string;
		recoveryAddress: string;
		recoveryCity: string;
		recoveryState: string;
		recoveryZip: string;
		storageAddress: string;
		storageCity: string;
		storageState: string;
		storageZip: string;
		storageAdditionalFees: string;
		storageFeeReason: string;
		policeDept: string;
		policeNumber: string;
		policeBadgeNumber: string;
		keysChecked: boolean;
		drivableChecked: boolean;
		personals: string;
		iPRUpdated: string;
		repoProcessing: string;
		billing: string;
		initializedDate: Date;
		originalUserId: number;
		adminUserId: number;
		verified: boolean;
	}
}
