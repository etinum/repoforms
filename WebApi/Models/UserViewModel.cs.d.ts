declare module server {
	interface UserViewModel {
		id: number;
		winAuthName: string;
		departmentId: number;
		departmentName: string;
		departmentOptionSelected: server.DepartmentOption;
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
		departmentOptions: server.DepartmentOption[];
		userOptions: server.UserOption[];
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
