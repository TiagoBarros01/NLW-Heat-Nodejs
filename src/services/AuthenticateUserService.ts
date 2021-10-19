import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { IUser } from '../@types/User';
import { prismaClient } from '../prisma';

interface IAccessTokenResponse {
  access_token: string;
  token_type?: string;
  scope?: string;
}

type IUserResponse = Pick<IUser, 'avatar_url' | 'login' | 'id' | 'name'>;

export class AuthenticateUserService {
  async execute(code: string) {
    const url = 'https://github.com/login/oauth/access_token';

    const { data } = await axios.post<IAccessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },

      headers: {
        Accept: 'application/json',
      },
    });

    const { data: responseUser } = await axios.get<IUserResponse>(
      'https://api.github.com/user',
      {
        headers: {
          authorization: `Bearer ${data.access_token}`,
        },
      }
    );

    const { login, id, avatar_url, name } = responseUser;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          avatar_url,
          github_id: id,
          login,
          name,
        },
      });
    }

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '1d',
      }
    );

    return { token, user };
  }
}
