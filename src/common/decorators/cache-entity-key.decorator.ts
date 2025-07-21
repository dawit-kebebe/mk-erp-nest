import { SetMetadata } from "@nestjs/common";

export let CACHE_ENTITY_KEY = '';

export const CacheEntityKey = (key: string) => SetMetadata(CACHE_ENTITY_KEY, key);