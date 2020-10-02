export class Food {
    id: number
    description: string
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    producerId?: number
    consumerId?: number
    expiresBy? : Date
    collected? : Boolean

    constructor(values: Object = {}) {
      Object.assign(this, values);
    }

  
}