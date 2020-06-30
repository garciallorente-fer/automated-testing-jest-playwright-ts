export enum UserRole {
    ROLE = 'ROLE'
}

export interface UserCredentials {
    username: string
    password: string
    role: UserRole
    forename: string
    surname: string
}

export const exampleCredentials: UserCredentials = Object.freeze({
    role: UserRole.ROLE,
    username: 'example@username.com',
    password: 'examplePassword1!',
    forename: 'ExampleForename',
    surname: 'ExampleSurname'
})
