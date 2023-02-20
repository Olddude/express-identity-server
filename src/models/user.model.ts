class UserModel {
  constructor(id: string) {
    if (!id) throw new TypeError(`id is missing`);
  }
}

export default UserModel;
