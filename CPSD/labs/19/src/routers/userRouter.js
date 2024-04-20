import { Router } from "express";
import { getUserPermissions, permissionsMiddleware } from "../middlewares/permissionsMiddleware.js";
import { prismaClient } from "../../prisma/client.js";


export const usersRouter = Router();

// usersRouter.get("/me", async (req, res, next) => {
//     try {
//         // Предположим, что req.user уже содержит данные пользователя после аутентификации
//         if (!req.user || !req.user.id) {
//             throw new Error("Authentication required"); // Пользователь не аутентифицирован
//         }

//         // Здесь мы создаем инстанс разрешений для конкретного пользователя
//         // В зависимости от роли пользователя, можно выбирать разные наборы разрешений
//         console.log(req.user);
//         const userAbilities = getUserPermissions(req.user.role, req.user.id);

//         // Проверяем, есть ли у пользователя права на чтение информации о себе
//         if (userAbilities.can("read", "user", `${req.user.id}`)) {
//             const user = await prismaClient.user.findUnique({
//                 where: { id: req.user.id },
//                 select: {
//                     id: true,
//                     username: true,
//                     email: true,
//                     role: true,
//                     password: false, // Убедитесь, что пароль не возвращается
//                 },
//             });

//             if (!user) throw new Error("User does not exist");
//             res.json(user);
//         } else {
//             // Если нет прав на чтение, возвращаем ошибку
//             throw new Error("Access Forbidden");
//         }
//     } catch (error) {
//         next(error);
//     }
// });


usersRouter.get(
    "/:id",
    async (req, res, next) => {

        const id = req.params.id;
        if (!id) throw new Error("ID should be provided");

        return permissionsMiddleware([["read", "user", id]])(req, res, next);
    },
    async (req, res, next) => {

        try {
            const id = parseInt(req.params.id);
            if (!id) throw new Error("ID should be provided");

            const user = await prismaClient.user.findMany({
                where: {id},
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    password: false
                }
            });
            if (!user)
                throw new Error("User with ID provided is not exists");


            res.json(user);

        } catch (error) {
            next(error);
        }
    }
);

usersRouter.get(
    "/",
    permissionsMiddleware([["manage", "all"]]),
    async (req, res, next) => {
        try {
            const users = await prismaClient.user.findMany(
                {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                        password: false
                    }
                }
            );
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
);