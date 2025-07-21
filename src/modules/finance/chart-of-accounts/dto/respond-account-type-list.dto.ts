import { ACCOUNT_TYPES } from "@mk/common/enum/account-types.enum";
import { ApiProperty } from "@nestjs/swagger";

export class RespondAccountTypeListDto {
    @ApiProperty({ description: 'The names of the Account Types', type: Array<ACCOUNT_TYPES>, example: [ACCOUNT_TYPES.INCOME] })
    accountTypes: ACCOUNT_TYPES[];
}