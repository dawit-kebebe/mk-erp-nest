import { Body, Delete, Get, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { ObjectLiteral } from "typeorm";
import { TEntityCrudService } from "./shared-crud.service";

export type TEntityCrudOptions = {
    createDto: { new(): NonNullable<unknown> };
    updateDto: { new(): NonNullable<unknown> };
    responseDto: { new(): NonNullable<unknown> };
    entityName: string
};


export function TEntityCrudController<T extends ObjectLiteral>(
    options: TEntityCrudOptions,
) {
    // @Controller()
    @UseInterceptors(/* your interceptors if any */)
    @ApiBearerAuth()
    class SchemaCrudControllerHost {
        constructor(public readonly schemaCrudService: TEntityCrudService<T>) { }

        @Get()
        @ApiOperation({
            summary: `Get all ${options?.entityName}.`
        })
        @ApiResponse({
            status: 200,
            description: `List of ${options?.entityName}s`,
            type: options?.responseDto,
            isArray: true
        })
        async findAll() {
            const data = await this.schemaCrudService.findAll()
            return plainToInstance(options.responseDto, data, { excludeExtraneousValues: true })
        }

        @Get('/:id')
        @ApiOperation({
            summary: `Create ${options?.entityName}.`
        })
        @ApiParam({
            name: 'id',
            description: `UUID of the ${options?.entityName}`
        })
        @ApiResponse({
            status: 200,
            description: `${options?.entityName} found`,
            type: options?.responseDto,
        })
        async findOne(
            @Param('id') id: string
        ) {
            const data = await this.schemaCrudService.findOne(id)
            return plainToInstance(options.responseDto, data, { excludeExtraneousValues: true })
        }

        @Post()
        @ApiOperation({
            summary: `Create ${options?.entityName}.`
        })
        @ApiBody({
            type: options?.createDto,
            description: `Data to create ${options?.entityName}`,
            required: true,
        })
        @ApiResponse({
            status: 201,
            description: `${options?.entityName} created`,
            type: options?.responseDto,
        })
        async create(
            @Body() itemData: any
        ) {
            const data = await this.schemaCrudService.create(itemData)
            return plainToInstance(options.responseDto, data, { excludeExtraneousValues: true })
        }

        @Put('/:id')
        @ApiOperation({
            summary: `Update ${options?.entityName}.`
        })
        @ApiParam({
            name: 'id',
            description: `UUID of the ${options?.entityName}`
        })
        @ApiBody({
            type: options?.createDto,
            description: `Data to update ${options?.entityName}`,
            required: true,
        })
        @ApiResponse({
            status: 200,
            description: `${options?.entityName} updated`,
            type: options?.responseDto,
        })
        async update(
            @Param('id') id: string,
            @Body() itemData: any
        ) {
            const data = await this.schemaCrudService.update(id, itemData)
            return plainToInstance(options.responseDto, data, { excludeExtraneousValues: true })
        }

        @Delete('/:id')
        @ApiParam({
            name: 'id',
            description: `UUID of the ${options?.entityName}`
        })
        @ApiOperation({
            summary: `Delete ${options?.entityName}.`
        })
        @ApiResponse({
            status: 204,
            description: `${options?.entityName} deleted`,
            type: undefined,
        })
        async delete(
            @Param('id') id: string
        ) {
            return await this.schemaCrudService.delete(id)
        }
    }
    return SchemaCrudControllerHost
}
