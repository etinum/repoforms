declare module server {
	interface UserRolesViewModel {
		id: number;
		winAuthName: string;
		first: string;
		middle: string;
		last: string;
		fullName: string;
		roles: string[];
	}
}
