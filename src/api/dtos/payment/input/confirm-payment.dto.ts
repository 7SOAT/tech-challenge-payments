import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

export default class ConfirmPaymentDto {
  @ApiProperty({ type: 'number', description: 'Payment id', required: true })
  @IsNotEmpty({message: "The id is required"})
  @IsNumberString({no_symbols: true},{ message: "The id need to be a number" })
  id: number;

  @ApiProperty({ type: 'string', description: 'Topic name', required: true })
  @IsString({ message: "The topic need to be a string" })
  @IsNotEmpty({message: "The topic is required"})
  topic: string;
}
