declare interface IUser {
  user_id: string;
  accessToken: string;
}

declare interface IRepository {
  user_id: string;
  name: string;
}

declare interface ISecret {
  user_id: string;
  repository_id: string;
  repository: IRepository;
  value: string;
}