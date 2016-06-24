declare module server {
	interface UserViewModel {
		id: number;
		winAuthName: string;
		departmentId: number;
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
	}
}
