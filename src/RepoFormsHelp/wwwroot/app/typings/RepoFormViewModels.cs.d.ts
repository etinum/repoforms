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

    interface UserViewModel {
        id: number;
        winAuthName: string;
        departmentId: number;
        departmentName: number;
        position: string;
        jobFunction: string;
        picture: any[];
        first: string;
        last: string;
        email: string;
        extension: string;
        cellPhone: string;
        otherPhone: string;
        lastLoggedIn: Date;
        firstLoggedIn: Date;
        active: boolean;
        roles: string[];
        createdDate: Date;
        modifiedDate: Date;
        directReportUserId: number;
        dottedLineReportUserId: number;
        departmentOptions: DepartmentOption[];
        userOptions: UserOption[];
    }
    interface DepartmentOption {
        id: number;
        name: string;
    }
    interface UserOption {
        id: number;
        winAuthName: string;
        first: string;
        last: string;
        label: string;

    }

}
