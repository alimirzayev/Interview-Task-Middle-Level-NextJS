import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: 'IpVddsseJm9tuLIQe8ronv5Ae',
      clientSecret: 'lBOwFakCCulCg8ky8Co7nYmWlHoSUhcwxPc7G3wuffyxdRLTV5',
    }),
  ],
  debug: true
})
