import { Rule, RuleType } from '@midwayjs/validate';
/**
 * 登录参数校验
 */
export class LoginDTO {
  // 用户名
  @Rule(RuleType.string().required())
  username: string;

  // 密码
  @Rule(RuleType.string().required())
  password: string;

  // 验证码ID（测试阶段可选）
  captchaId: string;

  // 验证码（测试阶段可选）
  verifyCode: number;
}
