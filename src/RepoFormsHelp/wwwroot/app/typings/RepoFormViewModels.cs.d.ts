declare module modeltypings {
    interface RepoFormViewModel {
        id: number;
        createdDate: Date;
        repoDate: Date;
        accountNumber: string;
        investigator: string;
        client: string;
        closeType: string;
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

    interface RepoFormTypeAheadModel {
        investigator: string[];
        clientList: string[];
        customerList: string[];
        recoveryAgentList: string[];
    }


}
