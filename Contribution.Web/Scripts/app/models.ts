interface Operation<T> {
    Message: string;
    Succeeded: boolean;
    Result: T;
}

interface Token {
    access_token: string;
    token_type: string;
    expires_in: number;

    UserId: number;
    Email: string;
    FirstName: string;
    LastName: string;
    ImageUrl: string;
    Profile: string;

    ".issued": string;
    ".expires": string;
}

interface UserModel {

    UserId: number;
    Email: string;
    Password?: string;
    Title: string;

    FirstName: string;
    LastName: string;

    ImageUrl: string;
    FullName: string;

    Roles: RoleModel[]
}

interface RoleModel {
    RoleId: number;
    RoleName: string;
    Title: string;
    Url: string;
}

interface MonthModel {
    MonthId: number;
    MonthName: string;
}

interface YearModel {
    YearId: number;
}

interface GroupModel {
    GroupId: number;
    GroupName: string;
    Users: UserModel[];
}

interface ContributionModel {
    Users: UserModel[];
    ContributionId: number;
    GroupId: number;
    UserId: number;
    Month: MonthModel;
    Year: YearModel;
    MonthId: number;

}

interface CollectorModel {
    Users: UserModel[];
    Month: MonthModel;
    CollectorId: number;
    UserId: number;
    GroupId: number;
    MonthId: number;
    User: UserModel;
    Year: YearModel;
    YearId: number;
    FirstName: string;
    LastName: string;
    MonthName: string;
    GroupName: string;
    Email: string;
}