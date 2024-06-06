import { of, forkJoin, Observable } from 'rxjs';
import { map, startWith, tap, catchError } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BoxPlotComponent } from '../../box-plot/box-plot.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../service/user.service';
import { PayEquityService } from '../../service/pay-equity.service';
import { EmployeesService } from '../../service/employees.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-pay-equity',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    BoxPlotComponent,
    CommonModule,
  ],
  templateUrl: './pay-equity.component.html',
  styleUrls: ['./pay-equity.component.scss']
})
export class PayEquityComponent implements OnInit {
  currentUser!: User;
  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions!: Observable<string[]>;

  minPerformanceByPost: number = 0;
  maxPerformanceByPost: number = 0;
  medianPerformanceByPost: number = 0;
  firstQuartilePerformanceByPost: number = 0;
  thirdQuartilePerformanceByPost: number = 0;
  performance: number = 0;

  minSalaryByPost: number = 0;
  maxSalaryByPost: number = 0;
  medianSalaryByPost: number = 0;
  firstQuartileSalaryByPost: number = 0;
  thirdQuartileSalaryByPost: number = 0;
  salary: number = 0;

  minAttendanceByPost: number = 0;
  maxAttendanceByPost: number = 0;
  medianAttendanceByPost: number = 0;
  firstQuartileAttendanceByPost: number = 0;
  thirdQuartileAttendanceByPost: number = 0;
  attendance: number = 0;

  minExperienceByPost: number = 0;
  maxExperienceByPost: number = 0;
  medianExperienceByPost: number = 0;
  firstQuartileExperienceByPost: number = 0;
  thirdQuartileExperienceByPost: number = 0;
  experience: number = 0;

  minAbsenteeismByPost: number = 0;
  maxAbsenteeismByPost: number = 0;
  medianAbsenteeismByPost: number = 0;
  firstQuartileAbsenteeismByPost: number = 0;
  thirdQuartileAbsenteeismByPost: number = 0;
  absenteeism: number = 0;

  poste: string = '';
  countByPost: number = 0;

  minPerformanceByBusinessUnit: number = 0;
  maxPerformanceByBusinessUnit: number = 0;
  medianPerformanceByBusinessUnit: number = 0;
  firstQuartilePerformanceByBusinessUnit: number = 0;
  thirdQuartilePerformanceByBusinessUnit: number = 0;

  minSalaryByBusinessUnit: number = 0;
  maxSalaryByBusinessUnit: number = 0;
  medianSalaryByBusinessUnit: number = 0;
  firstQuartileSalaryByBusinessUnit: number = 0;
  thirdQuartileSalaryByBusinessUnit: number = 0;

  minAttendanceByBusinessUnit: number = 0;
  maxAttendanceByBusinessUnit: number = 0;
  medianAttendanceByBusinessUnit: number = 0;
  firstQuartileAttendanceByBusinessUnit: number = 0;
  thirdQuartileAttendanceByBusinessUnit: number = 0;

  minExperienceByBusinessUnit: number = 0;
  maxExperienceByBusinessUnit: number = 0;
  medianExperienceByBusinessUnit: number = 0;
  firstQuartileExperienceByBusinessUnit: number = 0;
  thirdQuartileExperienceByBusinessUnit: number = 0;

  minAbsenteeismByBusinessUnit: number = 0;
  maxAbsenteeismByBusinessUnit: number = 0;
  medianAbsenteeismByBusinessUnit: number = 0;
  firstQuartileAbsenteeismByBusinessUnit: number = 0;
  thirdQuartileAbsenteeismByBusinessUnit: number = 0;

  businessUnit: string = '';
  countByBusinessUnit: number = 0;

  minPerformanceByClassification: number = 0;
  maxPerformanceByClassification: number = 0;
  medianPerformanceByClassification: number = 0;
  firstQuartilePerformanceByClassification: number = 0;
  thirdQuartilePerformanceByClassification: number = 0;

  minSalaryByClassification: number = 0;
  maxSalaryByClassification: number = 0;
  medianSalaryByClassification: number = 0;
  firstQuartileSalaryByClassification: number = 0;
  thirdQuartileSalaryByClassification: number = 0;

  minAttendanceByClassification: number = 0;
  maxAttendanceByClassification: number = 0;
  medianAttendanceByClassification: number = 0;
  firstQuartileAttendanceByClassification: number = 0;
  thirdQuartileAttendanceByClassification: number = 0;

  minExperienceByClassification: number = 0;
  maxExperienceByClassification: number = 0;
  medianExperienceByClassification: number = 0;
  firstQuartileExperienceByClassification: number = 0;
  thirdQuartileExperienceByClassification: number = 0;

  minAbsenteeismByClassification: number = 0;
  maxAbsenteeismByClassification: number = 0;
  medianAbsenteeismByClassification: number = 0;
  firstQuartileAbsenteeismByClassification: number = 0;
  thirdQuartileAbsenteeismByClassification: number = 0;

  classification: string = '';
  countByClassification: number = 0;

  selectedRegisterNumber: string = '';

  constructor(
    private userService: UserService,
    private payEquityService: PayEquityService,
    private employeesService: EmployeesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(
      (currentUser: User) => {
        this.currentUser = currentUser;

        this.employeesService.getEmployees().subscribe((employees: Employee[]) => {
          this.options = employees.map((employee) => employee.registrationNumber);
          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value || ''))
          );
        });
      },
      () => {
        console.error();
        this.router.navigateByUrl('/auth');
      }
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.toLowerCase().includes(filterValue));
  }

  onOptionSelected(selectedOption: string) {
    this.selectedRegisterNumber = selectedOption;
    this.getPostByRegistrationNumber(selectedOption)
      .subscribe(post => {
        if (post) {
          this.loadPerformanceByPostMetrics(post).subscribe(() => {
            this.payEquityService.countByPost(post).subscribe((count: number) => {
              this.countByPost = count;
            })
            /*console.log('min', this.minPerformanceByPost);
            console.log('max', this.maxPerformanceByPost);
            console.log('median', this.medianPerformanceByPost);
            console.log('Q1', this.firstQuartilePerformanceByPost);
            console.log('Q3', this.thirdQuartilePerformanceByPost);*/
          });
          this.loadSalaryByPostMetrics(post).subscribe(() => { });
          this.loadAttendanceByPostMetrics(post).subscribe(() => { });
          this.loadAbsenteeismByPostMetrics(post).subscribe(() => { });
          this.loadExperienceByPostMetrics(post).subscribe(() => { });
        }
      });

    this.getBusinessUnitByRegistrationNumber(selectedOption)
      .subscribe(businessUnit => {
        if (businessUnit) {
          this.loadPerformanceByBusinessUnitMetrics(businessUnit).subscribe(() => {
            this.payEquityService.countByBusinessUnit(businessUnit).subscribe((count) => {
              this.countByBusinessUnit = count;
            });
          });
          this.loadSalaryByBusinessUnitMetrics(businessUnit).subscribe(() => { });
          this.loadAttendanceByBusinessUnitMetrics(businessUnit).subscribe(() => { });
          this.loadAbsenteeismByBusinessUnitMetrics(businessUnit).subscribe(() => { });
          this.loadExperienceByBusinessUnitMetrics(businessUnit).subscribe(() => { });
        }
      });

    this.getClassificationByRegistrationNumber(selectedOption)
      .subscribe(classification => {
        if (classification) {
          this.loadPerformanceByClassificationMetrics(classification).subscribe(() => {
            this.payEquityService.countByClassification(classification).subscribe((count) => {
              this.countByClassification = count;
            });
          });
          this.loadSalaryByClassificationMetrics(classification).subscribe(() => { });
          this.loadAttendanceByClassificationMetrics(classification).subscribe(() => { });
          this.loadAbsenteeismByClassificationMetrics(classification).subscribe(() => { });
          this.loadExperienceByClassificationMetrics(classification).subscribe(() => { });
        }
      });

    this.getAttendanceByRegistrationNumber(selectedOption).subscribe(attendance => this.attendance = attendance);
    this.getAbsenteeismByRegistrationNumber(selectedOption).subscribe(absenteeism => this.absenteeism = absenteeism);
    this.getPerformanceByRegistrationNumber(selectedOption).subscribe(performance => this.performance = performance);
    this.getSalaryByRegistrationNumber(selectedOption).subscribe(salary => this.salary = salary);
    this.getExperienceByRegistrationNumber(selectedOption).subscribe(experience => this.experience = experience);
  }

  onInputChange(event: any) {
    const value = event.target?.value;
    if (value) {
      this.onOptionSelected(value);
    }
  }

  getPostByRegistrationNumber(registrationNumber: string): Observable<string> {
    return this.payEquityService.getPostByRegistrationNumber(registrationNumber).pipe(
      tap((poste) => {
        this.poste = poste;
      }),
      catchError((error) => {
        console.error(error);
        return of('');
      })
    );
  }

  getBusinessUnitByRegistrationNumber(registrationNumber: string): Observable<string> {
    return this.payEquityService.getBusinessUnitByRegistrationNumber(registrationNumber).pipe(
      tap((businessUnit) => {
        this.businessUnit = businessUnit;
      }),
      catchError((error) => {
        console.error(error);
        return of('');
      })
    );
  }

  getClassificationByRegistrationNumber(registrationNumber: string): Observable<string> {
    return this.payEquityService.getClassificationByRegistrationNumber(registrationNumber).pipe(
      tap((classification) => {
        this.classification = classification;
      }),
      catchError((error) => {
        console.error(error);
        return of('');
      })
    );
  }

  getPerformanceByRegistrationNumber(registrationNumber: string): Observable<number> {
    return this.payEquityService.getPerformanceByRegistrationNumber(registrationNumber).pipe(
      tap((performance) => {
        this.performance = performance;
      }),
      catchError((error) => {
        console.error(error);
        return of(0);
      })
    );
  }

  getSalaryByRegistrationNumber(registrationNumber: string): Observable<number> {
    return this.payEquityService.getSalaryByRegistrationNumber(registrationNumber).pipe(
      tap((salary) => {
        this.salary = salary;
      }),
      catchError((error) => {
        console.error(error);
        return of(0);
      })
    );
  }

  getAttendanceByRegistrationNumber(registrationNumber: string): Observable<number> {
    return this.payEquityService.getAttendanceByRegistrationNumber(registrationNumber).pipe(
      tap((attendance) => {
        this.attendance = attendance;
      }),
      catchError((error) => {
        console.error(error);
        return of(0);
      })
    );
  }

  getExperienceByRegistrationNumber(registrationNumber: string): Observable<number> {
    return this.payEquityService.getExperienceByRegistrationNumber(registrationNumber).pipe(
      tap((experience) => {
        this.experience = experience;
      }),
      catchError((error) => {
        console.error(error);
        return of(0);
      })
    );
  }

  getAbsenteeismByRegistrationNumber(registrationNumber: string): Observable<number> {
    return this.payEquityService.getAbsenteeismByRegistrationNumber(registrationNumber).pipe(
      tap((absenteeism) => {
        this.absenteeism = absenteeism;
      }),
      catchError((error) => {
        console.error(error);
        return of(0);
      })
    );
  }

  // loading data : Poste

  loadPerformanceByPostMetrics(post: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinPerformanceByPost(post),
      max: this.payEquityService.getMaxPerformanceByPost(post),
      median: this.payEquityService.getMedianPerformanceByPost(post),
      firstQuartile: this.payEquityService.getFirstQuartilePerformanceByPost(post),
      thirdQuartile: this.payEquityService.getThirdQuartilePerformanceByPost(post),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minPerformanceByPost = min;
        this.maxPerformanceByPost = max;
        this.medianPerformanceByPost = median;
        this.firstQuartilePerformanceByPost = firstQuartile;
        this.thirdQuartilePerformanceByPost = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  loadSalaryByPostMetrics(post: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinSalaryByPost(post),
      max: this.payEquityService.getMaxSalaryByPost(post),
      median: this.payEquityService.getMedianSalaryByPost(post),
      firstQuartile: this.payEquityService.getFirstQuartileSalaryByPost(post),
      thirdQuartile: this.payEquityService.getThirdQuartileSalaryByPost(post),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minSalaryByPost = min;
        this.maxSalaryByPost = max;
        this.medianSalaryByPost = median;
        this.firstQuartileSalaryByPost = firstQuartile;
        this.thirdQuartileSalaryByPost = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  loadExperienceByPostMetrics(post: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinExperienceByPost(post),
      max: this.payEquityService.getMaxExperienceByPost(post),
      median: this.payEquityService.getMedianExperienceByPost(post),
      firstQuartile: this.payEquityService.getFirstQuartileExperienceByPost(post),
      thirdQuartile: this.payEquityService.getThirdQuartileExperienceByPost(post),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minExperienceByPost = min;
        this.maxExperienceByPost = max;
        this.medianExperienceByPost = median;
        this.firstQuartileExperienceByPost = firstQuartile;
        this.thirdQuartileExperienceByPost = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  loadAttendanceByPostMetrics(post: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinAttendanceByPost(post),
      max: this.payEquityService.getMaxAttendanceByPost(post),
      median: this.payEquityService.getMedianAttendanceByPost(post),
      firstQuartile: this.payEquityService.getFirstQuartileAttendanceByPost(post),
      thirdQuartile: this.payEquityService.getThirdQuartileAttendanceByPost(post),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minAttendanceByPost = min;
        this.maxAttendanceByPost = max;
        this.medianAttendanceByPost = median;
        this.firstQuartileAttendanceByPost = firstQuartile;
        this.thirdQuartileAttendanceByPost = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  loadAbsenteeismByPostMetrics(post: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinAbsenteeismByPost(post),
      max: this.payEquityService.getMaxAbsenteeismByPost(post),
      median: this.payEquityService.getMedianAbsenteeismByPost(post),
      firstQuartile: this.payEquityService.getFirstQuartileAbsenteeismByPost(post),
      thirdQuartile: this.payEquityService.getThirdQuartileAbsenteeismByPost(post),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minAbsenteeismByPost = min;
        this.maxAbsenteeismByPost = max;
        this.medianAbsenteeismByPost = median;
        this.firstQuartileAbsenteeismByPost = firstQuartile;
        this.thirdQuartileAbsenteeismByPost = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  // loading data : UO

  loadPerformanceByBusinessUnitMetrics(businessUnit: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinPerformanceByBusinessUnit(businessUnit),
      max: this.payEquityService.getMaxPerformanceByBusinessUnit(businessUnit),
      median: this.payEquityService.getMedianPerformanceByBusinessUnit(businessUnit),
      firstQuartile: this.payEquityService.getFirstQuartilePerformanceByBusinessUnit(businessUnit),
      thirdQuartile: this.payEquityService.getThirdQuartilePerformanceByBusinessUnit(businessUnit),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minPerformanceByBusinessUnit = min;
        this.maxPerformanceByBusinessUnit = max;
        this.medianPerformanceByBusinessUnit = median;
        this.firstQuartilePerformanceByBusinessUnit = firstQuartile;
        this.thirdQuartilePerformanceByBusinessUnit = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  loadSalaryByBusinessUnitMetrics(businessUnit: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinSalaryByBusinessUnit(businessUnit),
      max: this.payEquityService.getMaxSalaryByBusinessUnit(businessUnit),
      median: this.payEquityService.getMedianSalaryByBusinessUnit(businessUnit),
      firstQuartile: this.payEquityService.getFirstQuartileSalaryByBusinessUnit(businessUnit),
      thirdQuartile: this.payEquityService.getThirdQuartileSalaryByBusinessUnit(businessUnit),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minSalaryByBusinessUnit = min;
        this.maxSalaryByBusinessUnit = max;
        this.medianSalaryByBusinessUnit = median;
        this.firstQuartileSalaryByBusinessUnit = firstQuartile;
        this.thirdQuartileSalaryByBusinessUnit = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  loadExperienceByBusinessUnitMetrics(businessUnit: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinExperienceByBusinessUnit(businessUnit),
      max: this.payEquityService.getMaxExperienceByBusinessUnit(businessUnit),
      median: this.payEquityService.getMedianExperienceByBusinessUnit(businessUnit),
      firstQuartile: this.payEquityService.getFirstQuartileExperienceByBusinessUnit(businessUnit),
      thirdQuartile: this.payEquityService.getThirdQuartileExperienceByBusinessUnit(businessUnit),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minExperienceByBusinessUnit = min;
        this.maxExperienceByBusinessUnit = max;
        this.medianExperienceByBusinessUnit = median;
        this.firstQuartileExperienceByBusinessUnit = firstQuartile;
        this.thirdQuartileExperienceByBusinessUnit = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  loadAttendanceByBusinessUnitMetrics(businessUnit: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinAttendanceByBusinessUnit(businessUnit),
      max: this.payEquityService.getMaxAttendanceByBusinessUnit(businessUnit),
      median: this.payEquityService.getMedianAttendanceByBusinessUnit(businessUnit),
      firstQuartile: this.payEquityService.getFirstQuartileAttendanceByBusinessUnit(businessUnit),
      thirdQuartile: this.payEquityService.getThirdQuartileAttendanceByBusinessUnit(businessUnit),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minAttendanceByBusinessUnit = min;
        this.maxAttendanceByBusinessUnit = max;
        this.medianAttendanceByBusinessUnit = median;
        this.firstQuartileAttendanceByBusinessUnit = firstQuartile;
        this.thirdQuartileAttendanceByBusinessUnit = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  loadAbsenteeismByBusinessUnitMetrics(businessUnit: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinAbsenteeismByBusinessUnit(businessUnit),
      max: this.payEquityService.getMaxAbsenteeismByBusinessUnit(businessUnit),
      median: this.payEquityService.getMedianAbsenteeismByBusinessUnit(businessUnit),
      firstQuartile: this.payEquityService.getFirstQuartileAbsenteeismByBusinessUnit(businessUnit),
      thirdQuartile: this.payEquityService.getThirdQuartileAbsenteeismByBusinessUnit(businessUnit),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minAbsenteeismByBusinessUnit = min;
        this.maxAbsenteeismByBusinessUnit = max;
        this.medianAbsenteeismByBusinessUnit = median;
        this.firstQuartileAbsenteeismByBusinessUnit = firstQuartile;
        this.thirdQuartileAbsenteeismByBusinessUnit = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  // loading data : Classification

  loadPerformanceByClassificationMetrics(classification: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinPerformanceByClassification(classification),
      max: this.payEquityService.getMaxPerformanceByClassification(classification),
      median: this.payEquityService.getMedianPerformanceByClassification(classification),
      firstQuartile: this.payEquityService.getFirstQuartilePerformanceByClassification(classification),
      thirdQuartile: this.payEquityService.getThirdQuartilePerformanceByClassification(classification),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minPerformanceByClassification = min;
        this.maxPerformanceByClassification = max;
        this.medianPerformanceByClassification = median;
        this.firstQuartilePerformanceByClassification = firstQuartile;
        this.thirdQuartilePerformanceByClassification = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  loadSalaryByClassificationMetrics(classification: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinSalaryByClassification(classification),
      max: this.payEquityService.getMaxSalaryByClassification(classification),
      median: this.payEquityService.getMedianSalaryByClassification(classification),
      firstQuartile: this.payEquityService.getFirstQuartileSalaryByClassification(classification),
      thirdQuartile: this.payEquityService.getThirdQuartileSalaryByClassification(classification),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minSalaryByClassification = min;
        this.maxSalaryByClassification = max;
        this.medianSalaryByClassification = median;
        this.firstQuartileSalaryByClassification = firstQuartile;
        this.thirdQuartileSalaryByClassification = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  loadExperienceByClassificationMetrics(classification: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinExperienceByClassification(classification),
      max: this.payEquityService.getMaxExperienceByClassification(classification),
      median: this.payEquityService.getMedianExperienceByClassification(classification),
      firstQuartile: this.payEquityService.getFirstQuartileExperienceByClassification(classification),
      thirdQuartile: this.payEquityService.getThirdQuartileExperienceByClassification(classification),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minExperienceByClassification = min;
        this.maxExperienceByClassification = max;
        this.medianExperienceByClassification = median;
        this.firstQuartileExperienceByClassification = firstQuartile;
        this.thirdQuartileExperienceByClassification = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  loadAttendanceByClassificationMetrics(classification: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinAttendanceByClassification(classification),
      max: this.payEquityService.getMaxAttendanceByClassification(classification),
      median: this.payEquityService.getMedianAttendanceByClassification(classification),
      firstQuartile: this.payEquityService.getFirstQuartileAttendanceByClassification(classification),
      thirdQuartile: this.payEquityService.getThirdQuartileAttendanceByClassification(classification),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minAttendanceByClassification = min;
        this.maxAttendanceByClassification = max;
        this.medianAttendanceByClassification = median;
        this.firstQuartileAttendanceByClassification = firstQuartile;
        this.thirdQuartileAttendanceByClassification = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }

  loadAbsenteeismByClassificationMetrics(classification: string): Observable<void> {
    return forkJoin({
      min: this.payEquityService.getMinAbsenteeismByClassification(classification),
      max: this.payEquityService.getMaxAbsenteeismByClassification(classification),
      median: this.payEquityService.getMedianAbsenteeismByClassification(classification),
      firstQuartile: this.payEquityService.getFirstQuartileAbsenteeismByClassification(classification),
      thirdQuartile: this.payEquityService.getThirdQuartileAbsenteeismByClassification(classification),
    }).pipe(
      tap(({ min, max, median, firstQuartile, thirdQuartile }) => {
        this.minAbsenteeismByClassification = min;
        this.maxAbsenteeismByClassification = max;
        this.medianAbsenteeismByClassification = median;
        this.firstQuartileAbsenteeismByClassification = firstQuartile;
        this.thirdQuartileAbsenteeismByClassification = thirdQuartile;
      }),
      map(() => void 0),
      catchError((error) => {
        console.error(error);
        return of(void 0);
      })
    );
  }
}
