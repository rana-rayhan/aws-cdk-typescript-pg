import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: "varchar", nullable: true })
  name: string;

  @Column({ type: "varchar", nullable: true })
  email: string;
}
