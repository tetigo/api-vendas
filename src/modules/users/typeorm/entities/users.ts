import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Exclude, Expose } from "class-transformer";

@Entity('users')
class User{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  // faz suprimir o retorno na consulta
  //o restante da configuracao está no controller
  @Exclude() 
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  //vai expor uma URL montada através desse nome: avatar_url
  //o nome getAvatarUrl é padrao montado onde coloca get+ o nome exposto sem _ e letras iniciais maiusculas
  @Expose({name: 'avatar_url'})
  getAvatarUrl(): string | null{
    if(!this.avatar) return null
    return `${process.env.APP_API_URL}/files/${this.avatar}`
  }
}
export default User;
