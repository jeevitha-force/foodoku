export class User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    token?: string;

    constructor(values: Object = {}) {
      Object.assign(this, values);
    }

  
}