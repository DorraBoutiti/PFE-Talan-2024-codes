import { IsString, IsNumber } from 'class-validator';

export class SkillDto {
  @IsString()
  doc_node_value: string;

  @IsNumber()
  score: number;

  @IsString()
  skill_name: string;

  @IsString()
  skill_type: string;
}
