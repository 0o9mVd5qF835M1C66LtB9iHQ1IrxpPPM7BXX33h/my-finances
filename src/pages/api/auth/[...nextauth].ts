
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { userService } from "../_modules/users/services/userService"
import { IUserRequestPost } from "models/users"

export default NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async session({ session }) {
      try {
        const userEmail = session.user?.email

        if (typeof userEmail !== "string") throw new Error("User email not found")

        const { user } = await userService.get(userEmail)

        if (user) {
          const idUser = user.id

          return {
            ...session,
            user: {
              ...session.user,
              idUser,
            },
          }
        }

        return session
      } catch (error) {
        return session
      }
    },
    async signIn({ user }) {
      try {
        const { name, email } = user

        if (typeof name !== "string" || typeof email !== "string") {
          throw new Error("invalid data")
        }

        const userObj: IUserRequestPost = {
          name,
          email,
        }

        await userService.upsert(userObj)

        return true
      } catch (error) {
        return false
      }
    },
  },
})
