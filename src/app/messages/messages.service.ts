import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, tap } from "rxjs/operators";

@Injectable()
export class MessagesService {

  private errorsSubject = new BehaviorSubject<string[]>([]);
  errors$: Observable<string[]> = this.errorsSubject.asObservable()
    .pipe(
      tap((test1) => console.log(`test1: ${test1}`)),
      filter(messages => messages && messages.length > 0),
      tap((test2) => console.log(`test2: ${test2}`))
    );

  showErrors(...errors: string[]) {
    this.errorsSubject.next(errors);
  }
}