import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../models/user.model';
import { Comment } from '../../models/comment.model';
import { Employee } from '../../models/employee.model';
import { UserService } from '../../service/user.service';
import { CommentService } from '../../service/comment.service';
import { EmployeesService } from '../../service/employees.service';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    FormsModule,
    MatCardModule
  ],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.scss'
})
export class EmployeesListComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  currentUser !: User;
  displayedColumns: string[] = ['registrationNumber', 'Genre', 'poste', 'note globale', 'expérience en année', 'Montant du salaire', 'recommanded increase (amount)', 'recommanded increase (%)', 'new base salary', 'benchmarking'];
  employees !: any[];
  dataSource!: MatTableDataSource<any>;

  loadingElement!: string;
  action: string = '';

  pgIndex = 0;
  comments: Comment[] = [];

  benchmarking!: string;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private userService: UserService, private router: Router, private employeesService: EmployeesService, private commentService: CommentService, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.getEmployees();
    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
    }, () => {
      console.error();
      this.router.navigateByUrl('/auth');
    });
  }

  getComments(registrationNumber: string) {
    this.commentService.getCommentsByEmployee(registrationNumber).subscribe((comments) => {
      this.comments = comments;
    });
  }

  get_employees_need_augmentation() {
    this.employeesService.getEmployeesNeedAugmentation().subscribe((employees) => {
      this.employees = employees;
      //console.log(this.employees);

      this.dataSource = new MatTableDataSource(this.employees);

      //console.log(this.paginator._intl);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (error) => {
      console.error();
      this.router.navigateByUrl('/auth');
    });
  }

  addComment(content: string, registrationNumber: string) {
    let comment: Comment = new Comment();
    this.employeesService.getEmployeeByRegistrationNumber(registrationNumber).subscribe((employee: Employee) => {
      comment.employeeTo = employee;
      comment.comment = content;
      comment.userFrom = this.currentUser;
      comment.date = new Date();
      this.commentService.addFeedback(comment).subscribe((response) => {
        console.log(response);

        this.commentService.getCommentsCountByEmployee(registrationNumber).subscribe(
          (count) => {
            if (this.commentsCount$[registrationNumber]) {
              this.commentsCount$[registrationNumber].next(count);
            }
          },
          (error) => {
            if (this.commentsCount$[registrationNumber]) {
              this.commentsCount$[registrationNumber].next(0);
            }
          }
        );

        this.getComments(employee.registrationNumber);
      });
    });
  }

  commentsCount$: { [key: string]: BehaviorSubject<number> } = {};

  getCommentsCountByEmployee(registrationNumber: string): Observable<number> {
    if (!this.commentsCount$[registrationNumber]) {
      const subject = new BehaviorSubject<number>(0);
      this.commentsCount$[registrationNumber] = subject;

      this.commentService.getCommentsCountByEmployee(registrationNumber).subscribe(
        (count) => subject.next(count),
        (error) => subject.next(0)  // Handle the error by setting the count to 0
      );
    }
    return this.commentsCount$[registrationNumber].asObservable();
  }

  ngAfterViewInit() {
    this.getEmployees();
    /*if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }*/
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortData(event: any) {
    this.dataSource.sort = this.sort;
  }

  onPaginateChange(event: any) {
    this.dataSource.paginator = this.paginator;
  }

  getEmployees() {
    this.employeesService.getSalaryReview().subscribe((employees) => {
      this.employees = employees;
      //console.log(this.employees);

      this.dataSource = new MatTableDataSource(this.employees);

      //console.log(this.paginator._intl);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, () => {
      console.error();
      this.router.navigateByUrl('/auth');
    });
  }

  analyzeBenchmarking(registrationNumber: string) {
    this.action = "analyze";
    this.loadingElement = registrationNumber;

    this.employeesService.getEmployeeByRegistrationNumber(registrationNumber).subscribe((employee) => {
      this.employeesService.getBenchmarkingAnalysis(employee.poste, employee.experience).subscribe(
        (response) => {
          this.action = "";
          this.benchmarking = response.benchmarking;
        },
        () => {
          console.error();
          this.showErrorSnackBar("Opération erronée", "Fermer");
        }
      );
    }, () => {
      console.error();
      this.showErrorSnackBar("Opération erronée", "Fermer");
    });
  }

  openRiskPage() {
    this.router.navigateByUrl('/risk-exit')
  }

  // Formatting

  formatTimeDifference(data: Date): string {
    const now = new Date();
    const diffInMs = Math.abs(now.getTime() - new Date(data).getTime());

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `à l'instant`;
    } else if (minutes < 60) {
      return `${minutes} m`;
    } else if (hours < 24) {
      return `${hours} h`;
    } else {
      return `${days} j`;
    }
  }

  formatNumber(input: string | number): string {
    const num: number = typeof input === 'string' ? parseFloat(input) : input;
    if (isNaN(num)) {
      throw new Error('Input is not a valid number.');
    }
    let formattedNumber: string = num.toFixed(2);
    formattedNumber = formattedNumber.replace(/\.?0+$/, '');
    return formattedNumber;
  }

  // Snack Bar

  showErrorSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
      panelClass: ['custom-snackbar-error']
    });
  }
}
