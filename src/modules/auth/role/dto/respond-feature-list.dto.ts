import { FEATURES } from "@mk/common/enum/feature.enum";
import { ApiProperty } from "@nestjs/swagger";

export class RespondFeatureListDto {
    @ApiProperty({ description: 'The name of the feature', type: Array<FEATURES>, example: [FEATURES.USER] })
    featureTags: FEATURES[];
}