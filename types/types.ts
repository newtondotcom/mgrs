declare interface IUser {
}

declare interface IRepository {
  name: string;
  owner: IUser;
}

declare interface ISecret {
  name: string;
  repository: IRepository;
  value: string;
}