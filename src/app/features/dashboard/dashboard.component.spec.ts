import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { DashboardService, DashboardSummary } from '../../services/dashboard.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: jasmine.SpyObj<DashboardService>;

  const summary: DashboardSummary = {
    total_products: 128,
    total_stock_value: '250000.00',
    low_stock_count: 12,
    out_of_stock_count: 4
  };

  beforeEach(async () => {
    dashboardService = jasmine.createSpyObj('DashboardService', ['getSummary']);
    dashboardService.getSummary.and.returnValue(of(summary));

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [DashboardComponent],
      providers: [{ provide: DashboardService, useValue: dashboardService }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the summary returned by the service', () => {
    expect(fixture.nativeElement.textContent).toContain('128');
    expect(fixture.nativeElement.textContent).toContain('250,000.00');
    expect(fixture.nativeElement.textContent).toContain('12');
    expect(fixture.nativeElement.textContent).toContain('4');
    expect(component.isLoading).toBeFalse();
  });

  it('shows an error when the summary request fails', () => {
    dashboardService.getSummary.and.returnValue(
      throwError(() => new Error('Request failed'))
    );

    const failedFixture = TestBed.createComponent(DashboardComponent);
    failedFixture.detectChanges();

    expect(failedFixture.nativeElement.textContent).toContain(
      'Unable to load inventory summary.'
    );
    expect(failedFixture.componentInstance.isLoading).toBeFalse();
  });
});