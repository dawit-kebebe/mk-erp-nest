import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Entity } from "typeorm";

@Entity()
export class Audit {
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt: Date;
}
