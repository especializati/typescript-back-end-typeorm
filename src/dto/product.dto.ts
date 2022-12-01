import { IsNotEmpty, Length } from "class-validator";

export class CreateProductDTO {
  @IsNotEmpty()
  @Length(3, 255)
  name: string

  @IsNotEmpty()
  @Length(3, 255)
  description: string

  @IsNotEmpty()
  weight: number
}

export class UpdateProductDTO extends CreateProductDTO {
  id: string
}
