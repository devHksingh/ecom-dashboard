enum UserRole{
    admin = "Admin",
    manager="Manager",
    user="User"
}

export interface User{
    name:string,
    email:string;
    role:UserRole,
    createdAt: string;
    _id:string
}