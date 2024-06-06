import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class FrenchMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Éléments par page:';
  override nextPageLabel     = 'Page suivante';
  override previousPageLabel = 'Page précédente';

  // Change "of" to "sur"
  override getRangeLabel = function(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return `0 sur ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the length, do not display 'of'
    const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} sur ${length}`;
  };
}
