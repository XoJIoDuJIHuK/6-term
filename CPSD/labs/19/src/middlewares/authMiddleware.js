import jwt from "jsonwebtoken";
import {prismaClient} from "../../prisma/client.js";

export const authMiddleware = async (
  req,
  res,
  next
) => {
  try {

    const accessToken = req.cookies.accessToken;

    if (!accessToken) throw new Error(`JWT not provided`);

    const { id } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await prismaClient.user.findUnique({ where: { id } });
    if (!user) throw new Error(`User not found`);

    req.user = user;
    console.log(req.user);

    return next();
  } catch (error) {
    req.user = null;
    next();
  }
};
