
type UserObj = {
    id: number | null
    age: number | null
    email: string
    phone: string
    image?: string
    username: string
    lastName: string
    firstName: string
    maidenName?: string
    gender: "male" | "female" | null
    company?: {
        address: {
            city: string
            state: string
            address: string
            postalCode: string
        }
        name: string
        title: string
        department: string
    }
    address?: {
        city: string
        state: string
        address: string
        postalCode: string
    }
}

interface User{
  userObj: UserObj
  userArr: UserObj[]
  totalUsers: number
}
export type {
    User,
    UserObj
}