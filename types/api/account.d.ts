declare namespace API {
  export enum AuthMethod {
    MixinToken = "mixin_token",
    MVM = "mvm",
  }

  export interface AuthParams {
    method: AuthMethod;
    mixin_oauth_code?: string;
    mixin_token?: string;
    mvm_signed_message?: string;
    mvm_signature?: string;
    lang?: string;
    broker_id?: string;
    label?: string;
  }

  export interface AuthResult {
    mvm_address: string;
    pando_token: string;
    id: string;
    scope: string;
    token: string;
    avatar: string;
    name: string;
  }

  export interface Profile {
    accept_conversation_source: string;
    accept_search_source: string;
    avatar_url: string;
    biography: string;
    code_id: string;
    code_url: string;
    created_at: string;
    device_status: string;
    fiat_currency: string;
    full_name: string;
    has_emergency_contact: boolean;
    has_pin: boolean;
    identity_number: string;
    is_scam: boolean;
    is_verified: boolean;
    mute_until: string;
    phone: string;
    pin_token: string;
    pin_token_base64: string;
    receive_message_source: string;
    relationship: string;
    session_id: string;
    transfer_confirmation_threshold: number;
    transfer_notification_threshold: number;
    type: string;
    user_id: string;
  }
}
