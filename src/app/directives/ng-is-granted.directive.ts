// ng-is-granted.directive.ts
import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from "@angular/core";
import { BehaviorSubject, Observable, Subject, takeUntil } from "rxjs";
import { UserService } from "../services/user.service";
import { intersection as _intersection } from 'lodash';

@Directive({ selector: '[ngIsGranted]' })
export class NgIsGrantedDirective implements OnDestroy {
    private readonly destroy$ = new Subject<void>();
    private hasView = false;

    constructor(
        private readonly templateRef: TemplateRef<any>,
        private readonly viewContainer: ViewContainerRef,
        private readonly userService: UserService,
    ) { }

    isGrantedRole(role: string[]): Observable<boolean> {
        const accessChecker = new BehaviorSubject(false);
        const accessChecker$ = accessChecker.asObservable();
        this.userService.getUserRoles().then((roleSystem) => {
            const intersection = _intersection(role, roleSystem);
            if (intersection.length > 0) {
                accessChecker.next(true);
            } else {
                accessChecker.next(false);
            }
        }).catch(() => {
            accessChecker.next(false);
        });
        return accessChecker$;
    }

    @Input() set ngIsGranted(roles: string[]) {
        this.isGrantedRole(roles)
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe((can: boolean) => 
                this.handlePermissionChange(can)
                /*{if (can && !this.hasView) {
                    this.viewContainer.createEmbeddedView(this.templateRef);
                    this.hasView = true;
                } else if (!can && this.hasView) {
                    this.viewContainer.clear();
                    this.hasView = false;
                }}*/
            );
    }

    private handlePermissionChange(can: boolean) {
        if (can && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        }
      
        if (!can && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
