import { IsObject, IsNumber } from 'class-validator';
import { SkillDto } from './create-skill.dto';

export class ExtractedInformationDto {
  @IsObject()
  filtered_skills: {
    'Hard Skill': SkillDto[];
    'Soft Skill': SkillDto[];
  };

  @IsNumber()
  global_score_percentage: number;
}
