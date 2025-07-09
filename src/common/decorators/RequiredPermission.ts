import { SetMetadata } from '@nestjs/common';
import { FEATURES } from '../enum/feature.enum';

export const REQUIRED_PERMISSIONS_KEY = 'required-permission'; //aka featureTag in our permission Entity

export const RequiredPermissions = (...permissions: FEATURES[]) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, permissions);