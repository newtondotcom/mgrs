declare interface IUser {
  user_id: string;
  access_token: string;
}

declare interface IRepo {
  user_id: string;
  repository_id: number;
  repository_name: string;
}

declare interface ISecret {
  value: string;
  repository_id: number;
}

export const TSecret : string = 'secrets';
export const TUser : string = 'users';
export const TRepo : string = 'repositories';