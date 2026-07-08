export interface EntityProps {
  id: number;
  createdAt: Date;
}

export class Entity {
  readonly id: number;
  readonly createdAt: Date;

  constructor(props: EntityProps) {
    this.id = props.id;
    this.createdAt = props.createdAt;
  }
}
