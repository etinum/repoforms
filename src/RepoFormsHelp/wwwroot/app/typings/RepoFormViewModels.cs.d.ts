declare module modeltypings {

    interface RepoFormViewModel {
        id: number;
        createdDate: Date;
        modifiedDate: Date;
        accountNumber: string;
        investigator: string;
        clientId: number;
        client: string;
        closeTypeId: number;
        closeType: any;
        customerName: string;
        points: number;
        notes: string;
        creatorUserId: number;
        modifiedByUserId: number;
        adminUserId: number;
        adminOtherUserId: number;
        closeTypeOptions: CloseTypeViewModel[];
        clientOptions: ClientViewModel[];
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
        departmentName: string;
        departmentOptionSelected: DepartmentOption;
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
        directReportUser: string;
        dottedLineReportUserId: number;
        dottedLineReportUser: string;
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
    interface AccountVinClientViewModel {
        vehVin: string;
        accountClientAccountNum: string;
        roName: string;
        financeClientName: string;
        accountLastActivity: Date;
        accountStatus: string;
        accountType: string;
    }
    interface ClientViewModel {
        id: number;
        name: string;
        isTieredPoints: boolean;
        active: boolean;

        isEditMode: boolean;
    }
    interface CloseTypeViewModel {
        id: number;
        name: string;
        tiered: boolean;
        defaultPointValue: number;
    }

}






