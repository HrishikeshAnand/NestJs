import { User } from 'src/users/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bio: string;

  @OneToOne(() => User,(user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}