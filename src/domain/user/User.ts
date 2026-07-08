import { Entity, EntityProps } from '../shared/Entity';

export interface PartialUserProps {
  email: string;
  password: string;
}

type UserProps = PartialUserProps & EntityProps;

export class User extends Entity {
  email: string;
  password: string;

  constructor(props: UserProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
    });

    this.email = props.email;
    this.password = props.password;
  }
}
