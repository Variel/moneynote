import { Provider, Dependant, ServiceDescription, HttpContext, badRequest, unauthorized, ok } from "@moneynote/backend-base";
import { createHmac } from "crypto";
import isNullishOrWhiteSpace from "@backend/utils/isNullishOrWhiteSpace";
import { QueryBuilder } from "knex";

export class SampleController extends Dependant {
  static service: ServiceDescription<SampleController> = {
    resolution: "scoped",
    instantiate: () => new SampleController(),
  };

  build(provider: Provider): void {
    this.httpContext = provider.require(HttpContext.service);
    this.hmac = createHmac("sha256", this.secret);
  }

  private httpContext!: HttpContext;
  private hmac!: ReturnType<typeof createHmac>;

  private readonly secret = "lfFmJa2D4V5gDm77HY5M";
  private readonly authCodeDigestFact = "8f8f2a97234f21bd6f0fe5db47cbd84fbd7b6f2863724cb807d91abe6c975d90";

  async postGetData() {
    const { authCode } = this.httpContext.request.body as {
      authCode: string;
    };

    if (isNullishOrWhiteSpace(authCode)) {
      return badRequest("인증코드를 입력해주세요.");
    }

    const digest = this.hmac.update(authCode).digest("hex");
    if (digest !== this.authCodeDigestFact) {
      return unauthorized("인증코드가 올바르지 않습니다.");
    }


    return ok({});
  }
}
