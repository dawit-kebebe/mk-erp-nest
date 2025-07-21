import { Exclude } from "class-transformer";
import { CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()
export class Audit {
    @Exclude()
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({ type: "timestamp", nullable: true })
    updatedAt: Date;

    @Exclude()
    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt: Date;
}
