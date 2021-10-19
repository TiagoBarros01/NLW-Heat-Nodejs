import axios from 'axios';
import { IUser } from '../@types/User';

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

    return responseUser;
  }
}
