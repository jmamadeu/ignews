import NextAuth, { Session } from 'next-auth';

import Providers from 'next-auth/providers';
import { fauna } from '../../../services/fauna';
import { query as q } from 'faunadb';

type UserSessionType = Session & {
  userActiveSubscription: {
    data: {
      id: string;

      status: string;
      priceId: string;
    };
  } | null;
};

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    })
  ],

  callbacks: {
    session: async (session) => {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  ['ref'],
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user?.email as string)
                    )
                  )
                )
              ),
              q.Match(q.Index('subscription_by_status'), 'active')
            ])
          )
        );

        return { ...session, activeSubscription: userActiveSubscription };
      } catch (err) {
        console.log(err);
        return { ...session, activeSubscription: null };
      }
    },
    signIn: async (user, account, profile) => {
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email as string)
                )
              )
            ),
            q.Create(q.Collection('users'), { data: { email: user.email } }),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email as string)
              )
            )
          )
        );

        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  }
});
