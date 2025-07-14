import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsSequential(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isSequential',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any[], _args: ValidationArguments) {
                    if (!Array.isArray(value)) return false;

                    const orders = value.map(v => v.stepOrder);
                    const unique = new Set(orders);

                    if (unique.size !== orders.length) return false;

                    const min = Math.min(...orders);
                    const max = Math.max(...orders);

                    return min === 1 && max === value.length;
                },
                defaultMessage() {
                    return 'Order must be sequential starting from 1';
                }
            }
        });
    };
}
