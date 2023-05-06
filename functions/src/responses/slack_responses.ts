interface SlackConversationsMembersResponse {
    ok: boolean;
    members: string[];
    error?: string;
}
  
interface SlackUsersInfoResponse {
    ok: boolean;
    user: {
      id: string;
      real_name: string;
      tz: string;
      profile: {
        status_text: string;
        status_emoji: string;
        status_expiration: number;
      };
      is_bot: boolean;
    };
    error?: string;
}