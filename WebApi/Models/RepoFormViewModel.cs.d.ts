declare module server {
	interface RepoFormViewModel {
		createdDate: Date;
		repoDate: Date;
		accountNumber: string;
		investigator: string;
		closeType: string;
		customerName: string;
		points: string;
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
		policeDept: string;
		policeNumber: string;
		policeBadgeNumber: string;
		keysChecked: boolean;
		drivableChecked: boolean;
		personals: string;
		iPRUpdaterd: string;
		repoProcessing: string;
		billing: string;
		initializedDate: Date;
		originalUserId: number;
	}
}
