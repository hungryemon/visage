export const Roles = {
    OPTIONAL: -1,
    CUSTOMER: 0,
    JUNIOR_CRM: 5,
    SENIOR_CRM: 6,
    ADMIN: 10
}

export const RolesIntegerMap = {
    0: Roles.CUSTOMER,
    5: Roles.JUNIOR_CRM,
    6: Roles.SENIOR_CRM,
    10: Roles.ADMIN,
}

export const ValidRoles = [
    Roles.CUSTOMER,
    Roles.JUNIOR_CRM,
    Roles.SENIOR_CRM,
    Roles.ADMIN
]