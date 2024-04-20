import { adminPermissions, guestPermissions, userPermissions } from "../casl/index.js";

export const permissionsMiddleware = (requiredPermissions) => {

    return (req, res, next) => {
        try {

            const {user} = req;

            const role = user?.role || 'Guest';

            const currentUserPermissions = getUserPermissions(role, user?.id);
            console.log("requiredPermissions", requiredPermissions);

            const isAllowed = requiredPermissions
                .some(([action, entity, condition]) => {
                        if (condition) {
                            return currentUserPermissions.can(action, entity, condition);
                        }
                        else {
                            return currentUserPermissions.can(action, entity);
                        }
                    }
                );

            if (!isAllowed)
                throw new Error("Forbidden access");

            return next();

        } catch (error) {
            next(error);
        }
    };

};

export function getUserPermissions(role, id) {
    console.log("getUserPermissions", role, id);
    switch (role) {
        case 'Admin':
            return adminPermissions;
        case 'User':
            return userPermissions(id);
        case 'Guest':
            return guestPermissions;
        default:
            throw new Error("Unknown role");
    }
}