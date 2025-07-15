import { ACCESS_LEVEL } from "@mk/common/enum/access-level.enum";
import { ApiProperty } from "@nestjs/swagger";

export class RespondAccessLevelListDto {
    @ApiProperty({ description: 'The name of the access level', type: Array<ACCESS_LEVEL>, example: [ACCESS_LEVEL.CHILDREN] })
    accessLevelTags: ACCESS_LEVEL[];
}