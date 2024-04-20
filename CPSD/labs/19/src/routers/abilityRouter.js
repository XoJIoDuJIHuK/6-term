import { Router } from "express";
import { getUserPermissions, permissionsMiddleware } from "../middlewares/permissionsMiddleware.js";

export const abilityRouter = Router();

abilityRouter.get(
    "/",
    permissionsMiddleware([["read", "ability"]]),
    (req, res, next) => {
        try {
            const role = req?.user?.role || 'Guest';

            const {rules} = getUserPermissions(role);

            res.json({permissions: rules});

        } catch (error) {
            next(error);
        }
    }
);
