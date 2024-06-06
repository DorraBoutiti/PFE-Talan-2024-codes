import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { EmployeesService } from '../../service/employees.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-risk-exit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltip,
    MatChipsModule
  ],
  templateUrl: './risk-exit.component.html',
  styleUrl: './risk-exit.component.scss'
})
export class RiskExitComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator1!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatSort) sort1!: MatSort;
  @ViewChild(MatSort) sort2!: MatSort;

  @ViewChild('input1', { static: false }) input1!: ElementRef;
  @ViewChild('input2', { static: false }) input2!: ElementRef;

  dataSource1!: MatTableDataSource<User>;
  dataSource2!: MatTableDataSource<User>;
  pgIndex = 0;

  displayedColumnsByEmployee: string[] = ['registration-number', 'business-unit', 'performance', 'risk', 'risk-group'];
  displayedColumnsByBusinessUnit: string[] = ['business-unit', 'employees', 'risk-distribution', 'number-high-risk-employees', 'pourcentage-high-risk-employees'];

  currentUser!: User;
  employees!: any[];
  businessUnits!: any[];

  section1Width!: number;
  section2Width!: number;
  section3Width!: number;

  section1Text!: string;
  section2Text!: string;
  section3Text!: string;

  section1Title: string = "Faible Risque";
  section2Title: string = "Risque Modéré";
  section3Title: string = "Risque Élévé";

  section1SubTitle: string = "Risque de départ de 0 à 49%";
  section2SubTitle: string = "Risque de départ de 50 à 74%";
  section3SubTitle: string = "Risque de départ de 75%";

  highRiskLevel!: number;
  filtredBy: string = '';

  selectFilter: string[] = [
    'Employé',
    'Unité Organisationnelle'
  ];
  selectPanel = new FormControl('Employé');

  constructor(private userService: UserService, private employeesService: EmployeesService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((currentUser: User) => {
      this.currentUser = currentUser;
      this.getLeaveRiskPredictionListByBusinessUnit();
      this.getLeaveRiskPredictionList();
    }, () => {
      console.error();
      this.router.navigateByUrl('/auth');
    });
  }

  ngAfterViewInit() {
    this.getLeaveRiskPredictionListByBusinessUnit();
    this.getLeaveRiskPredictionList();
  }

  mapRiskToCategory = (risk: number): string => {
    if (risk < 0.5) {
      return 'low';
    } else if (risk >= 0.5 && risk < 0.75) {
      return 'medium';
    } else {
      return 'high';
    }
  };

  getLeaveRiskPredictionList() {
    this.employeesService.getChurnRisk().subscribe((employees) => {
      this.employees = employees;
      this.dataSource1 = new MatTableDataSource(this.employees);

      this.dataSource1.paginator = this.paginator1;
      this.dataSource1.sort = this.sort1;

      let lowRiskCount = 0;
      let mediumRiskCount = 0;
      let highRiskCount = 0;
      this.employees.forEach((emp: { Risque_de_depart: any }) => {
        const riskCategory = this.mapRiskToCategory(emp.Risque_de_depart);
        switch (riskCategory) {
          case 'low':
            lowRiskCount++;
            break;
          case 'medium':
            mediumRiskCount++;
            break;
          case 'high':
            highRiskCount++;
            break;
          default:
            break;
        }
      });

      const totalCount = lowRiskCount + mediumRiskCount + highRiskCount;
      this.section1Width = (lowRiskCount / totalCount) * 100;
      this.section2Width = (mediumRiskCount / totalCount) * 100;
      this.section3Width = (highRiskCount / totalCount) * 100;

      this.section1Text = `${lowRiskCount} employés`;
      this.section2Text = `${mediumRiskCount} employés`;
      this.section3Text = `${highRiskCount} employés`;

      this.highRiskLevel = highRiskCount;
    }, () => {
      console.error();
    });
  }

  getLeaveRiskPredictionListByBusinessUnit(): any {
    this.employeesService.getChurnRiskByBusinessUnit().subscribe((businessUnits: any[]) => {
      this.businessUnits = businessUnits;

      this.dataSource2 = new MatTableDataSource(this.businessUnits);

      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
    }, (error) => {
      console.error('Error fetching risk prediction:', error);
    });
  }

  updateDataSourceByRiskType(riskType: string) {
    const filteredUsers = this.employees.filter((emp: any) => {
      const riskCategory = this.mapRiskToCategory(emp.Risque_de_depart);
      return riskCategory === riskType;
    });

    this.dataSource1 = new MatTableDataSource(filteredUsers);

    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort1;
    this.filtredBy = riskType;
  }

  reset() {
    this.getLeaveRiskPredictionList();
    this.filtredBy = '';
  }

  onSelectionChange(event: any) {
    if (event.value === 'Employé') {
      this.dataSource1 = new MatTableDataSource(this.employees);
      this.dataSource1.paginator = this.paginator1;
      this.dataSource1.sort = this.sort1;
    } else if (event.value === 'Unité Organisationnelle') {
      this.dataSource2 = new MatTableDataSource(this.businessUnits);
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
    }
  }

  applyFilter(dataSource: MatTableDataSource<any>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  sortData(event: any, dataSourceName: string) {
    if (dataSourceName === 'dataSource1') {
      this.dataSource1.sort = this.sort1;
    } else if (dataSourceName === 'dataSource2') {
      this.dataSource2.sort = this.sort2;
    }
  }

  onPaginateChange(dataSource: MatTableDataSource<any>, event: any) {
    if (this.selectPanel.value === 'Employé') {
      dataSource.paginator = this.paginator1;
    } else if (this.selectPanel.value === 'Unité Organisationnelle') {
      dataSource.paginator = this.paginator2;
    }
  }

  // Formatting

  toPercentage(value: number): string {
    const percentage = (value * 100).toFixed(2);
    return `${percentage}%`;
  }

  determineRiskLevel(risk: number): string {
    if (risk >= 0 && risk < 0.5) {
      return "Faible risque";
    } else if (risk >= 0.5 && risk < 0.75) {
      return "Risque modéré";
    } else if (risk >= 0.75 && risk <= 1) {
      return "Risque élevé";
    } else {
      throw new Error("Le niveau de risque doit être compris entre 0 et 1.");
    }
  }

  determineRiskType(riskType: string): string {
    switch (riskType) {
      case 'low':
        return "Faible Risque";
      case 'medium':
        return "Risque Modéré";
      case 'high':
        return "Risque Élevé";
      default:
        return "Niveau de risque inconnu";
    }
  }

  getRiskColor(risk: number): any {
    let color: string;
    switch (this.determineRiskLevel(risk)) {
      case "Faible risque":
        color = '#a8dadc';
        break;
      case "Risque modéré":
        color = '#fca311';
        break;
      case "Risque élevé":
        color = '#e63946';
        break;
      default:
        color = 'black';
        break;
    }
    return { 'color': color };
  }
}
