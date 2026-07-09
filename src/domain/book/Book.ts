import { Entity, EntityProps } from '../shared/Entity';

export type BookStatus = 'PUBLISHED' | 'SOLD';

export interface PartialBookProps {
  title: string;
  description: string;
  price: number;
  author: string;
  status: BookStatus;
  ownerId: number;
  soldAt: Date | null;
}

type BookProps = PartialBookProps & EntityProps;

export class Book extends Entity {
  title: string;
  description: string;
  price: number;
  author: string;
  status: BookStatus;
  ownerId: number;
  soldAt: Date | null;

  constructor(props: BookProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
    });

    this.title = props.title;
    this.description = props.description;
    this.price = props.price;
    this.author = props.author;
    this.status = props.status;
    this.ownerId = props.ownerId;
    this.soldAt = props.soldAt;
  }
}
