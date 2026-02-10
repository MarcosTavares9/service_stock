import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    photo?: string;
  };
}
