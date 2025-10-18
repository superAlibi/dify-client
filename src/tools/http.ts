import ky from "ky";
import { apibase } from "../constans";

export const service = ky.create({
  prefixUrl: apibase,
  timeout: 60000,
  hooks: {
    // TODO: 等待完善
    beforeRequest: [],  // 写Authorization
    beforeError: [], // 401 重新请求 access token 

  }
})
